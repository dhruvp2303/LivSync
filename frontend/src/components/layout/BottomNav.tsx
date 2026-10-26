import { Compass, Bookmark, MessageSquare, Users, User } from 'lucide-react';
import type { Page } from '@/types/navigation';

interface BottomNavProps {
  active: Page;
  onChange: (page: Page) => void;
  pendingRequestsCount?: number;
  matchesCount?: number;
}

export function BottomNav({ active, onChange, pendingRequestsCount = 0 }: BottomNavProps) {
  const items: { id: Page; label: string; Icon: typeof Compass; badge?: number }[] = [
    { id: 'discover', label: 'Discover', Icon: Compass },
    { id: 'saved', label: 'Saved', Icon: Bookmark },
    { id: 'connections', label: 'Connect', Icon: MessageSquare, badge: pendingRequestsCount },
    { id: 'groups', label: 'Groups', Icon: Users },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d24]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[430px] mx-auto flex items-stretch px-2">
        {items.map(({ id, label, Icon, badge }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all duration-200 relative
                ${isActive ? 'text-[#a29bfe]' : 'text-[#8892b0] hover:text-white'}`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  fill={isActive && (id === 'saved' || id === 'discover') ? 'currentColor' : 'none'}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_#6C5CE7]' : ''}`}
                />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#FD79A8] text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-[#a29bfe]' : 'font-medium text-[#8892b0]'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#a29bfe] rounded-full shadow-[0_0_8px_#a29bfe]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
