export type ViewState = 'dashboard' | 'new-complaint' | 'analysis' | 'tracker' | 'profile';

export interface Report {
  id: string;
  title: string;
  category: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending Review' | 'In Progress' | 'Resolved';
  timeAgo: string;
  description: string;
  imageUrl?: string;
  estimatedDays?: number;
  rating?: number;
}

export interface Activity {
  id: string;
  type: 'resolved' | 'comment' | 'photo' | 'pending';
  title: string;
  detail: string;
  timeAgo: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}
