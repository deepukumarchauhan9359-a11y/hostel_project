import { Calendar, User, MapPin, AlertCircle, Paperclip, Star, MessageSquare } from 'lucide-react';
import { Complaint } from '../context/DataContext';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusUpdate?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  onFeedback?: (id: string) => void;
  showActions?: boolean;
  statusDisabled?: boolean;
}

const ComplaintCard = ({ complaint, onStatusUpdate, onDelete, onFeedback, showActions = false, statusDisabled = false }: ComplaintCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'badge-warning';
      case 'In Progress': return 'badge-primary';
      case 'Resolved': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-error-600 bg-error-50';
      case 'Medium': return 'text-warning-600 bg-warning-50';
      case 'Low': return 'text-success-600 bg-success-50';
      default: return 'text-secondary-600 bg-secondary-50';
    }
  };

  return (
    <div className="card-hover p-6 group">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors">
            {complaint.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge badge-primary">
              {complaint.category}
            </span>
            <span className={`badge ${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </span>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
              <AlertCircle className="w-3 h-3 mr-1" />
              {complaint.priority} Priority
            </div>
          </div>
        </div>
      </div>

      <p className="text-secondary-600 mb-6 leading-relaxed">{complaint.description}</p>

      {/* Attachments */}
      {(complaint as any).attachments && (complaint as any).attachments.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Paperclip className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-secondary-700">Attachments:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(complaint as any).attachments.map((attachment: any, index: number) => (
              <a
                key={index}
                href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api/v1'}/complaints/files/${attachment.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-sm text-primary-700 transition-colors duration-200 border border-primary-200"
              >
                <Paperclip className="w-3 h-3 mr-2" />
                {attachment.originalName}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {(complaint as any).feedback && (
        <div className="mb-6 p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200">
          <div className="flex items-center mb-3">
            <Star className="w-5 h-5 text-warning-500 mr-2" />
            <span className="text-sm font-semibold text-success-800">Student Feedback:</span>
          </div>
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < (complaint as any).feedback.rating ? 'text-warning-400 fill-current' : 'text-secondary-300'}`}
                />
              ))}
            </div>
            <span className="ml-3 text-sm font-medium text-success-700">
              {(complaint as any).feedback.rating}/5
            </span>
          </div>
          {(complaint as any).feedback.comment && (
            <div className="flex items-start">
              <MessageSquare className="w-4 h-4 text-success-600 mr-2 mt-1" />
              <p className="text-sm text-success-800 leading-relaxed">{(complaint as any).feedback.comment}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center text-sm text-secondary-500 space-x-6 mb-6">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-primary-600" />
          <span className="font-medium">{complaint.studentName}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-primary-600" />
          <span className="font-medium">{complaint.hostelBlock} - Room {complaint.roomNumber}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-primary-600" />
          <span className="font-medium">{complaint.dateCreated}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-secondary-200 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {onStatusUpdate && (
              <select
                value={complaint.status}
                onChange={(e) => onStatusUpdate(complaint.id, e.target.value)}
                disabled={statusDisabled}
                className={`input text-sm ${statusDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            )}
            {complaint.status === 'Resolved' && onFeedback && !(complaint as any).feedback && (
              <button
                onClick={() => onFeedback(complaint.id)}
                className="btn-success px-4 py-2 text-sm font-semibold"
              >
                Give Feedback
              </button>
            )}
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(complaint.id)}
              className="btn-error px-4 py-2 text-sm font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;