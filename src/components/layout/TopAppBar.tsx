import { Bell, User } from 'lucide-react';

interface TopAppBarProps {
  userImage?: string;
  userName?: string;
}

export default function TopAppBar({ 
  userImage = "https://lh3.googleusercontent.com/a/default-user", 
  userName = "JD" 
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white border-b border-outline-variant">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden border border-outline-variant">
          {userImage ? (
            <img 
              src={userImage} 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold">{userName}</div>
          )}
        </div>
        <span className="text-lg font-bold text-primary">Complaint to Action</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors relative">
          <Bell className="w-6 h-6 text-primary" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
}
