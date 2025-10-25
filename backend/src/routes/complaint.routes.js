import { Router } from 'express';
import {
  createComplaintController,
  listComplaintsController,
  getComplaintController,
  updateComplaintController,
  deleteComplaintController,
  transitionStatusController,
  addFeedbackController,
} from '../controllers/complaint.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadFiles, handleUploadErrors } from '../middleware/upload.js';

const router = Router();

// Student
router.post('/', requireAuth(['Student']), uploadFiles, handleUploadErrors, createComplaintController);
router.get('/mine', requireAuth(['Student']), listComplaintsController);
router.patch('/:id', requireAuth(['Student']), updateComplaintController);
router.delete('/:id', requireAuth(['Student', 'Warden']), deleteComplaintController);
router.post('/:id/feedback', requireAuth(['Student']), addFeedbackController);

// Warden
router.get('/block', requireAuth(['Warden']), listComplaintsController);
// Alias for clarity: /warden returns same filtered list for assigned block
router.get('/warden', requireAuth(['Warden']), listComplaintsController);
router.post('/:id/status', requireAuth(['Warden']), transitionStatusController);

// Common
router.get('/:id', requireAuth(['Student', 'Warden', 'Admin']), getComplaintController);

// Serve uploaded files
router.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const path = require('path');
  const filePath = path.join(__dirname, '../../uploads', filename);
  
  // Check if file exists
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

export default router;


