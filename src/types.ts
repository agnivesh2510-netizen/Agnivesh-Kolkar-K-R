export type ViewState = 'dashboard' | 'new-complaint' | 'analysis' | 'tracker';

export interface Report {
  id: string;
  title: string;
  category: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending Review' | 'In Progress' | 'Resolved';
  timeAgo: string;
  description: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  type: 'resolved' | 'comment' | 'photo';
  title: string;
  detail: string;
  timeAgo: string;
}
