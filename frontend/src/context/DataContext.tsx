import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from './AuthContext';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'Cleaning' | 'Food Quality' | 'Electricity' | 'Water' | 'Maintenance' | 'Security' | 'Other';
  status: 'Pending' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  studentId: string;
  studentName: string;
  hostelBlock: string;
  roomNumber: string;
  dateCreated: string;
  dateUpdated: string;
}

interface DataContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'dateCreated' | 'dateUpdated'>) => Promise<string | void>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;
  getComplaintsByStudent: (studentId: string) => Complaint[];
  getComplaintsByBlock: (hostelBlock: string) => Complaint[];
  transitionStatus: (id: string, status: 'Pending' | 'In Progress' | 'Resolved') => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) {
        console.log('No user found, skipping complaint fetch');
        return;
      }
      if (!user.id) {
        console.log('User has no ID, skipping complaint fetch');
        return;
      }
      if (isLoading) {
        console.log('Already loading complaints, skipping');
        return;
      }
      setIsLoading(true);
      console.log('Fetching complaints for user:', user);
      try {
        if (user.role === 'Student') {
          const res = await apiRequest<{ complaints: any[] }>('GET', '/complaints/mine');
          setComplaints(
            res.complaints.map((c) => ({
              id: c._id,
              title: c.title,
              description: c.description,
              category: c.category,
              status: c.status,
              priority: c.priority,
              studentId: c.student,
              studentName: '',
              hostelBlock: c.hostelBlock,
              roomNumber: c.room || '',
              dateCreated: c.createdAt,
              dateUpdated: c.updatedAt,
            }))
          );
        } else if (user.role === 'Warden') {
          const res = await apiRequest<{ complaints: any[] }>('GET', '/complaints/block');
          setComplaints(
            res.complaints.map((c) => ({
              id: c._id,
              title: c.title,
              description: c.description,
              category: c.category,
              status: c.status,
              priority: c.priority,
              studentId: c.student,
              studentName: '',
              hostelBlock: c.hostelBlock,
              roomNumber: c.room || '',
              dateCreated: c.createdAt,
              dateUpdated: c.updatedAt,
            }))
          );
        }
      } catch (e) {
        console.error('Error fetching complaints:', e);
        // Show error to user
        if (e instanceof Error) {
          console.error('Error message:', e.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, [user]);

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'dateCreated' | 'dateUpdated'>) => {
    const payload = {
      title: complaintData.title,
      category: complaintData.category,
      description: complaintData.description,
      priority: complaintData.priority,
      room: complaintData.roomNumber,
      hostelBlock: complaintData.hostelBlock,
    };
    const res = await apiRequest<{ complaint: any; message?: string }>(
      'POST',
      '/complaints',
      payload
    );
    const c = res.complaint;
    const newComplaint: Complaint = {
      id: c._id,
      title: c.title,
      description: c.description,
      category: c.category,
      status: c.status,
      priority: c.priority,
      studentId: c.student,
      studentName: '',
      hostelBlock: c.hostelBlock,
      roomNumber: c.room || '',
      dateCreated: c.createdAt,
      dateUpdated: c.updatedAt,
    };
    setComplaints((prev) => [...prev, newComplaint]);
    return res.message;
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    const payload: any = {};
    if (updates.title) payload.title = updates.title;
    if (updates.category) payload.category = updates.category;
    if (updates.description) payload.description = updates.description;
    if (updates.priority) payload.priority = updates.priority;
    if (updates.roomNumber) payload.room = updates.roomNumber;
    await apiRequest('PATCH', `/complaints/${id}`, payload);
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } as Complaint : c)));
  };

  const deleteComplaint = async (id: string) => {
    await apiRequest('DELETE', `/complaints/${id}`);
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  const getComplaintsByStudent = (studentId: string) => {
    return complaints.filter(complaint => complaint.studentId === studentId);
  };

  const getComplaintsByBlock = (hostelBlock: string) => {
    return complaints.filter(complaint => complaint.hostelBlock === hostelBlock);
  };

  const value = {
    complaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintsByStudent,
    getComplaintsByBlock,
    transitionStatus: async (id: string, status: 'Pending' | 'In Progress' | 'Resolved') => {
      const res = await apiRequest<{ complaint: any }>('POST', `/complaints/${id}/status`, { status });
      const c = res.complaint;
      setComplaints((prev) => prev.map((it) => (it.id === id ? { ...it, status: c.status } as Complaint : it)));
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};