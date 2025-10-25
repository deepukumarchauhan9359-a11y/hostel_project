import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { FileText, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const WardenDashboard = () => {
  const { user } = useAuth();
  const { getComplaintsByBlock, updateComplaint, transitionStatus } = useData();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const blockComplaints = user?.hostelBlock ? getComplaintsByBlock(user.hostelBlock) : [];

  const stats = [
    {
      title: 'Total Complaints',
      value: blockComplaints.length,
      icon: FileText,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: blockComplaints.filter(c => c.status === 'Pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: blockComplaints.filter(c => c.status === 'In Progress').length,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Resolved',
      value: blockComplaints.filter(c => c.status === 'Resolved').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  const getFilteredComplaints = () => {
    return blockComplaints.filter(complaint => {
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      setBusyId(id);
      await transitionStatus(id, newStatus as any);
      showToast(`Complaint status updated to ${newStatus}`, 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to update status', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const categories = ['Cleaning', 'Food Quality', 'Electricity', 'Water', 'Maintenance', 'Security', 'Other'];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Warden Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Managing complaints for {user?.hostelBlock}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.lightColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaints */}
            <div className="space-y-6">
              {getFilteredComplaints().length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                  <p className="text-gray-600">
                    {statusFilter === 'all' && categoryFilter === 'all'
                      ? `No complaints have been submitted for ${user?.hostelBlock} yet.`
                      : 'No complaints match your current filters.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {getFilteredComplaints()
                    .sort((a, b) => {
                      // Sort by status priority (Pending > In Progress > Resolved)
                      const statusOrder = { 'Pending': 0, 'In Progress': 1, 'Resolved': 2 };
                      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
                    })
                    .map(complaint => (
                      <ComplaintCard
                        key={complaint.id}
                        complaint={complaint}
                        onStatusUpdate={handleStatusUpdate}
                        statusDisabled={busyId !== null && busyId !== complaint.id}
                        showActions={true}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WardenDashboard;