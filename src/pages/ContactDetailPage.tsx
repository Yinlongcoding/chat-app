import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/Avatar';
import type { Chat } from '@/types';
import { ArrowLeft, MessageCircle, Phone, ShieldCheck, Star, UserRound } from 'lucide-react';

export const ContactDetailPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch, users } = useApp();
  const { chats, theme } = state;
  const returnPath =
    typeof location.state?.from === 'string'
      ? location.state.from
      : directChatPath(chats, userId) || '/app/chats';

  const user = users.find(item => item.id === userId);
  const isDark = theme === 'dark';

  const c = isDark
    ? {
        bg: '#0D0B14',
        chrome: 'rgba(17, 15, 27, 0.92)',
        card: 'rgba(25, 22, 40, 0.82)',
        cardSoft: 'rgba(25, 22, 40, 0.6)',
        border: 'rgba(124, 58, 237, 0.14)',
        text: '#E8E4F0',
        textSec: '#8B83A0',
        textMuted: '#5C5670',
        accent: '#7C3AED',
        mint: '#34D399',
      }
    : {
        bg: '#F8F6FF',
        chrome: 'rgba(255, 255, 255, 0.92)',
        card: 'rgba(255, 255, 255, 0.92)',
        cardSoft: '#F3F0FA',
        border: 'rgba(124, 58, 237, 0.12)',
        text: '#1E1B2E',
        textSec: '#6B6580',
        textMuted: '#9B95A8',
        accent: '#7C3AED',
        mint: '#059669',
      };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center" style={{ backgroundColor: c.bg }}>
        <button
          onClick={() => navigate(returnPath)}
          className="rounded-2xl px-5 py-3 text-sm font-medium"
          style={{ background: c.card, color: c.text, border: `1px solid ${c.border}` }}
        >
          Contact not found. Go back
        </button>
      </div>
    );
  }

  const directChat = chats.find(chat => chat.type === 'private' && chat.members.includes(user.id));

  const startChat = () => {
    if (!directChat) return;
    navigate(`/app/chats/${directChat.id}`);
  };

  return (
    <div className="relative h-full overflow-y-auto" style={{ backgroundColor: c.bg }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_26%)]" />

      <div className="relative flex h-full flex-col">
        <div
          className="flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-6"
          style={{ background: c.chrome, borderBottom: `1px solid ${c.border}`, backdropFilter: 'blur(18px)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(returnPath)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: c.cardSoft, color: c.textSec, border: `1px solid ${c.border}` }}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>Contact</p>
              <p className="text-sm font-medium" style={{ color: c.textSec }}>Profile details</p>
            </div>
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: c.cardSoft, color: c.textSec, border: `1px solid ${c.border}` }}
            aria-label="Favorite"
          >
            <Star size={18} />
          </button>
        </div>

        <div className="flex-1 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 md:px-6">
          <div
            className="mb-6 rounded-[2.2rem] p-6 text-center"
            style={{ background: c.card, border: `1px solid ${c.border}`, boxShadow: isDark ? '0 20px 44px rgba(0,0,0,0.18)' : '0 20px 38px rgba(124,58,237,0.06)' }}
          >
            <div className="mb-4 flex justify-center">
              <Avatar name={user.displayName} color={user.avatarColor} size="lg" online={user.status === 'online'} />
            </div>
            <h1 className="text-[2rem] font-black tracking-[-0.05em]" style={{ color: c.text }}>{user.displayName}</h1>
            <p className="mt-1 text-sm" style={{ color: c.textSec }}>@{user.username}</p>
            <p className="mt-3 text-sm" style={{ color: user.status === 'online' ? c.mint : c.textSec }}>
              {user.status === 'online' ? 'Online now' : user.status === 'recently' ? 'Recently active' : 'Offline'}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={startChat}
                disabled={!directChat}
                className="flex items-center justify-center gap-2 rounded-[1.3rem] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
              >
                <MessageCircle size={18} />
                Message
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-[1.3rem] px-4 py-3 text-sm font-semibold transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: c.cardSoft, color: c.text, border: `1px solid ${c.border}` }}
              >
                <Phone size={18} />
                Call
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <DetailCard
              icon={<UserRound size={18} />}
              title="About"
              value={user.bio || 'No status message yet'}
              c={c}
            />
            <DetailCard
              icon={<Phone size={18} />}
              title="Phone"
              value={user.phone || 'Not shared'}
              c={c}
            />
            <DetailCard
              icon={<ShieldCheck size={18} />}
              title="Privacy"
              value="Mutual contacts and secure chats enabled"
              c={c}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  c: Record<string, string>;
}> = ({ icon, title, value, c }) => (
  <div
    className="rounded-[1.8rem] p-4"
    style={{ background: c.card, border: `1px solid ${c.border}`, boxShadow: '0 10px 28px rgba(124,58,237,0.05)' }}
  >
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: c.cardSoft, color: c.textSec }}>
        {icon}
      </div>
      <p className="text-sm font-semibold" style={{ color: c.text }}>{title}</p>
    </div>
    <p className="text-sm leading-6" style={{ color: c.textSec }}>{value}</p>
  </div>
);

function directChatPath(chats: Chat[], userId?: string) {
  if (!userId) return null;
  const directChat = chats.find(chat => chat.type === 'private' && chat.members.includes(userId));
  return directChat ? `/app/chats/${directChat.id}` : '/app/chats';
}
