import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';

export async function createComplaintController(req, res) {
  try {
    console.log('Creating complaint with data:', req.body);
    console.log('User:', req.user);
    console.log('Files:', req.files);
    
    // Check database connection
    const mongoose = await import('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected');
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const { title, category, description, priority, room } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ message: 'Missing fields' });
    }

  // Derive hostelBlock from authenticated student to prevent spoofing
  const student = await User.findById(req.user.id);
  console.log('Found student:', student ? { id: student.id, role: student.role, hostelBlock: student.hostelBlock } : 'Not found');
  
  if (!student || student.role !== 'Student') {
    return res.status(403).json({ message: 'Only students can submit complaints' });
  }
  if (!student.hostelBlock) {
    console.log('Student has no hostelBlock, using default');
    // For now, use a default hostel block if not assigned
    student.hostelBlock = 'Block A';
    await student.save();
  }

  const derivedHostelBlock = student.hostelBlock;
  const derivedRoom = room || student.room || '';

  // Process file attachments if any
  const attachments = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      attachments.push({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      });
    });
  }

  console.log('Creating complaint with data:', {
    title,
    category,
    description,
    priority,
    room: derivedRoom,
    hostelBlock: derivedHostelBlock,
    student: req.user.id,
    attachmentsCount: attachments.length
  });

  const complaint = await Complaint.create({
    title,
    category,
    description,
    priority,
    room: derivedRoom,
    hostelBlock: derivedHostelBlock,
    student: req.user.id,
    attachments: attachments
  });
  
  console.log('Complaint created successfully:', complaint.id);

    res.status(201).json({
      message: `Complaint sent to ${derivedHostelBlock} warden successfully`,
      complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
}

export async function listComplaintsController(req, res) {
  const role = req.user.role;
  let filter = {};
  if (role === 'Student') {
    filter.student = req.user.id;
  }
  if (role === 'Warden') {
    filter.hostelBlock = req.user.block; // ensures wardens only see their block's complaints
  }
  const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
  res.json({ complaints });
}

export async function getComplaintController(req, res) {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Not found' });
  res.json({ complaint });
}

export async function updateComplaintController(req, res) {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Not found' });
  if (req.user.role === 'Student' && complaint.student.toString() !== req.user.id)
    return res.status(403).json({ message: 'Forbidden' });
  if (complaint.status === 'Resolved') return res.status(400).json({ message: 'Cannot edit resolved complaint' });
  const allowed = ['title', 'category', 'description', 'priority', 'room'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) complaint[key] = req.body[key];
  }
  await complaint.save();
  res.json({ complaint });
}

export async function deleteComplaintController(req, res) {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Not found' });
  if (req.user.role === 'Student' && complaint.student.toString() !== req.user.id)
    return res.status(403).json({ message: 'Forbidden' });
  await complaint.deleteOne();
  res.json({ ok: true });
}

export async function transitionStatusController(req, res) {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'Warden' || complaint.hostelBlock !== req.user.block)
    return res.status(403).json({ message: 'Forbidden' });
  const allowed = ['Pending', 'In Progress', 'Resolved'];
  let target = req.body?.status;
  if (target) {
    const normalized = String(target).toLowerCase().trim();
    const mapping = {
      pending: 'Pending',
      'in progress': 'In Progress',
      'in_progress': 'In Progress',
      inprogress: 'In Progress',
      resolved: 'Resolved',
    };
    target = mapping[normalized] || target;
    if (!allowed.includes(target)) return res.status(400).json({ message: 'Invalid target status' });
    if (target !== complaint.status) {
      complaint.status = target;
    }
  } else {
    // If no status provided, keep simple next-step advance
    const sequence = ['Pending', 'In Progress', 'Resolved'];
    const currentIndex = sequence.indexOf(complaint.status);
    if (currentIndex === -1 || currentIndex === sequence.length - 1)
      return res.status(400).json({ message: 'Cannot transition' });
    complaint.status = sequence[currentIndex + 1];
  }
  await complaint.save();
  res.json({ complaint });
}

export async function addFeedbackController(req, res) {
  const { rating, comment } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Not found' });
  if (complaint.student.toString() !== req.user.id)
    return res.status(403).json({ message: 'Forbidden' });
  if (complaint.status !== 'Resolved')
    return res.status(400).json({ message: 'Feedback allowed only after resolution' });
  complaint.feedback = { rating, comment, by: req.user.id };
  await complaint.save();
  res.json({ complaint });
}


