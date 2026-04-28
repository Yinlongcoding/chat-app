import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import type { Chat } from '@/types';
import { formatTime } from '../data/mockData';
import {
  Search,
  Moon,
  Sun,
  Users,
  Radio,
  MessageCircle,
  Pin,
  BellOff,
  ChevronDown,
  LogOut,
  X,
  WalletCards,
  Settings,
} from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';

interface SidebarProps {
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const { state, dispatch } = useApp();
  const { chats, currentUser, theme, searchQuery, activeFilter } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');

  const isDark = theme === 'dark';

  const c = isDark
    ? {
        bg: '#110F1B',
        bgHover: 'rgba(124, 58, 237, 0.08)',
        bgActive: 'rgba(124, 58, 237, 0.15)',
        border: 'rgba(124, 58, 237, 0.12)',
        inputBg: 'rgba(25, 22, 40, 0.6)',
        text: '#E8E4F0',
        textSec: '#8B83A0',
        textMuted: '#5C5670',
        accent: '#7C3AED',
        cyan: '#06B6D4',
        glowLeft: '3px solid #7C3AED',
        dropdownBg: 'rgba(20, 17, 35, 0.9)',
      }
    : {
        bg: '#F3F0FA',
        bgHover: 'rgba(124, 58, 237, 0.06)',
        bgActive: 'rgba(124, 58, 237, 0.12)',
        border: 'rgba(124, 58, 237, 0.1)',
        inputBg: '#EDE9FE',
        text: '#1E1B2E',
        textSec: '#6B6580',
        textMuted: '#9B95A8',
        accent: '#7C3AED',
        cyan: '#0891B2',
        glowLeft: '3px solid #7C3AED',
        dropdownBg: 'rgba(255, 255, 255, 0.95)',
      };

  const filtered = chats
    .filter(chat => {
      if (activeFilter === 'private') return chat.type === 'private';
      if (activeFilter === 'group') return chat.type === 'group';
      if (activeFilter === 'channel') return chat.type === 'channel';
      return true;
    })
    .filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const aTime = a.lastMessage?.timestamp?.getTime() || 0;
      const bTime = b.lastMessage?.timestamp?.getTime() || 0;
      return bTime - aTime;
    });

  const closeAllMenus = () => {
    setShowMenu(false);
    setShowCreateGroup(false);
    setShowCreateChannel(false);
  };

  const openWallet = () => {
    navigate('/app/wallet', {
      state: {
        from: location.pathname.startsWith('/app/chats') ? location.pathname : '/app/chats',
      },
    });
    setShowMenu(false);
  };

  const openSettings = () => {
    navigate('/app/settings', {
      state: {
        from: location.pathname.startsWith('/app') ? location.pathname : '/app/chats',
      },
    });
    setShowMenu(false);
  };

  const handleCreateChannel = () => {
    if (!channelName.trim()) return;
    dispatch({ type: 'CREATE_CHANNEL', payload: { name: channelName, description: channelDesc } });
    setChannelName('');
    setChannelDesc('');
    setShowCreateChannel(false);
  };

  return (
    <div className="flex flex-col h-full w-full relative" style={{ backgroundColor: c.bg }}>
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%)' }}
      />

      <div className="relative flex items-center gap-3 px-4 py-3 z-10" style={{ borderBottom: `1px solid ${c.border}` }}>
        <button className="relative transition-transform duration-200 hover:scale-105 active:scale-95" onClick={openSettings} aria-label="Open settings">
          <Avatar
            name={currentUser?.displayName || ''}
            color={currentUser?.avatarColor || c.accent}
            size="md"
            src={currentUser?.avatar}
          />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: c.text }}>{currentUser?.displayName}</p>
          <p className="text-xs" style={{ color: c.textSec }}>@{currentUser?.username}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ color: c.textSec }}
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="p-2 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ color: c.textSec }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {!isMobile && showMenu && (
          <div
            className="absolute top-16 right-2 z-50 rounded-2xl py-2 w-56 animate-fade-in shadow-2xl"
            style={{ background: c.dropdownBg, backdropFilter: 'blur(20px)', border: `1px solid ${c.border}` }}
          >
            <MenuEntry icon={<Users size={16} style={{ color: c.accent }} />} label="New Group" c={c} onClick={() => { setShowCreateGroup(true); setShowMenu(false); }} />
            <MenuEntry icon={<Radio size={16} style={{ color: c.cyan }} />} label="New Channel" c={c} onClick={() => { setShowCreateChannel(true); setShowMenu(false); }} />
            <MenuEntry icon={<WalletCards size={16} style={{ color: c.accent }} />} label="Wallet" c={c} onClick={openWallet} />
            <MenuEntry icon={<Settings size={16} style={{ color: c.textSec }} />} label="Settings" c={c} onClick={openSettings} />
            <div className="my-1 mx-3" style={{ borderTop: `1px solid ${c.border}` }} />
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
              style={{ color: '#EF4444' }}
              onClick={() => { dispatch({ type: 'LOGOUT' }); setShowMenu(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

      {isMobile && showMenu && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowMenu(false)} />
          <div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl py-4 px-4 animate-slide-up"
            style={{ background: c.dropdownBg, backdropFilter: 'blur(20px)', borderTop: `1px solid ${c.border}` }}
          >
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: c.textMuted }} />
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: `1px solid ${c.border}` }}>
              <button
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
                onClick={openSettings}
                aria-label="Open settings"
              >
                <Avatar
                  name={currentUser?.displayName || ''}
                  color={currentUser?.avatarColor || c.accent}
                  size="md"
                  src={currentUser?.avatar}
                />
              </button>
              <div>
                <p className="font-semibold text-sm" style={{ color: c.text }}>{currentUser?.displayName}</p>
                <p className="text-xs" style={{ color: c.textSec }}>@{currentUser?.username}</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl" style={{ color: c.text }} onClick={() => { setShowCreateGroup(true); setShowMenu(false); }}>
              <Users size={18} style={{ color: c.accent }} />
              New Group
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl" style={{ color: c.text }} onClick={() => { setShowCreateChannel(true); setShowMenu(false); }}>
              <Radio size={18} style={{ color: c.cyan }} />
              New Channel
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl" style={{ color: c.text }} onClick={openWallet}>
              <WalletCards size={18} style={{ color: c.accent }} />
              Wallet
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl" style={{ color: c.text }} onClick={openSettings}>
              <Settings size={18} style={{ color: c.textSec }} />
              Settings
            </button>
            <div className="my-2 mx-2" style={{ borderTop: `1px solid ${c.border}` }} />
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl" style={{ color: '#EF4444' }} onClick={() => { dispatch({ type: 'LOGOUT' }); setShowMenu(false); }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </>
      )}

      <div className="relative px-3 py-2 z-10">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200" style={{ background: c.inputBg, border: `1px solid ${c.border}` }}>
          <Search size={16} style={{ color: c.textMuted }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: c.text }}
          />
          {searchQuery && (
            <button onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })} className="cursor-pointer">
              <X size={14} style={{ color: c.textMuted }} />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto no-scrollbar relative z-10">
        {([
          { key: 'all', label: 'All', icon: <MessageCircle size={12} /> },
          { key: 'private', label: 'Private', icon: <MessageCircle size={12} /> },
          { key: 'group', label: 'Group', icon: <Users size={12} /> },
          { key: 'channel', label: 'Channel', icon: <Radio size={12} /> },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: f.key })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 cursor-pointer"
            style={{
              background: activeFilter === f.key ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
              color: activeFilter === f.key ? '#FFFFFF' : c.textSec,
              boxShadow: activeFilter === f.key ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none',
            }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative z-10">
        {filtered.length === 0 ? (
          <div className="text-center text-sm py-12" style={{ color: c.textMuted }}>
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p>No chats found</p>
          </div>
        ) : (
          filtered.map(chat => <ChatItem key={chat.id} chat={chat} c={c} />)
        )}
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      {showCreateChannel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-2xl p-6 w-80 shadow-2xl animate-fade-in-up"
            style={{ background: c.dropdownBg, backdropFilter: 'blur(20px)', border: `1px solid ${c.border}` }}
          >
            <h3 className="font-semibold text-lg mb-4" style={{ color: c.text }}>New Channel</h3>
            <input
              className="w-full rounded-xl px-4 py-2.5 mb-3 outline-none text-sm transition-all duration-200"
              style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.border}` }}
              placeholder="Channel name"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
            />
            <textarea
              className="w-full rounded-xl px-4 py-2.5 mb-4 outline-none text-sm resize-none transition-all duration-200"
              style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.border}` }}
              placeholder="Description (optional)"
              rows={3}
              value={channelDesc}
              onChange={e => setChannelDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-sm cursor-pointer transition-colors duration-200" style={{ background: c.bgHover, color: c.textSec }} onClick={() => setShowCreateChannel(false)}>
                Cancel
              </button>
              <button
                className="flex-1 py-2 rounded-xl text-white text-sm font-medium cursor-pointer transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)' }}
                onClick={handleCreateChannel}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuEntry: React.FC<{
  icon: React.ReactNode;
  label: string;
  c: Record<string, string>;
  onClick: () => void;
}> = ({ icon, label, c, onClick }) => (
  <button
    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
    style={{ color: c.text }}
    onClick={onClick}
    onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
  >
    {icon}
    {label}
  </button>
);

interface ChatItemProps {
  chat: Chat;
  c: Record<string, string>;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, c }) => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const isActive = state.activeChat === chat.id;
  const [showCtx, setShowCtx] = useState(false);

  const lastMsg = chat.lastMessage;
  const preview = lastMsg
    ? lastMsg.senderId === 'me'
      ? `You: ${lastMsg.content}`
      : lastMsg.content
    : 'No messages yet';

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200"
      style={{ background: isActive ? c.bgActive : 'transparent', borderLeft: isActive ? c.glowLeft : '3px solid transparent' }}
      onClick={() => {
        navigate(`/app/chats/${chat.id}`);
      }}
      onContextMenu={e => { e.preventDefault(); setShowCtx(true); }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = c.bgHover; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <div className="relative flex-shrink-0">
        {isActive && (
          <div className="absolute -inset-0.5 rounded-full animate-aurora-pulse" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))', filter: 'blur(4px)' }} />
        )}
        <Avatar name={chat.name} color={chat.avatarColor} size="md" />
        {chat.type === 'channel' && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5" style={{ background: c.accent }}>
            <Radio size={8} className="text-white" />
          </span>
        )}
        {chat.type === 'group' && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5" style={{ background: c.cyan }}>
            <Users size={8} className="text-white" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1 min-w-0">
            {chat.pinned && <Pin size={11} style={{ color: c.textMuted }} />}
            <span className="font-medium text-sm truncate" style={{ color: c.text }}>{chat.name}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {lastMsg && <span className="text-xs" style={{ color: c.textMuted }}>{formatTime(lastMsg.timestamp)}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs truncate flex-1" style={{ color: c.textSec }}>{preview}</p>
          <div className="flex items-center gap-1 ml-2">
            {chat.muted && <BellOff size={11} style={{ color: c.textMuted }} />}
            {chat.unreadCount > 0 && (
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white"
                style={{ background: chat.muted ? 'rgba(124, 58, 237, 0.2)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: chat.muted ? c.accent : '#FFFFFF' }}
              >
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {showCtx && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowCtx(false)} />
          <div
            className="absolute left-12 top-6 z-50 rounded-xl shadow-2xl py-2 w-44 animate-fade-in"
            style={{ background: c.dropdownBg, backdropFilter: 'blur(20px)', border: `1px solid ${c.border}` }}
          >
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { dispatch({ type: 'PIN_CHAT', payload: chat.id }); setShowCtx(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Pin size={14} style={{ color: c.textSec }} />
              {chat.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { dispatch({ type: 'MUTE_CHAT', payload: chat.id }); setShowCtx(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <BellOff size={14} style={{ color: c.textSec }} />
              {chat.muted ? 'Unmute' : 'Mute'}
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { dispatch({ type: 'MARK_READ', payload: chat.id }); setShowCtx(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <MessageCircle size={14} style={{ color: c.textSec }} />
              Mark as read
            </button>
          </div>
        </>
      )}
    </div>
  );
};
