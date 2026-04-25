import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import type { Chat } from '@/types';
import { formatTime, getUserById } from '../data/mockData';
import {
  Search, Plus, Settings, Moon, Sun, Users, Radio, MessageCircle,
  Pin, BellOff, ChevronDown, LogOut, X, Menu
} from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';

export const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const { chats, currentUser, theme, searchQuery, activeFilter } = state;
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDark = theme === 'dark';

  // Aurora theme colors
  const c = isDark ? {
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
    mint: '#34D399',
    glowLeft: '3px solid #7C3AED',
    msgBg: 'rgba(25, 22, 40, 0.8)',
    dropdownBg: 'rgba(20, 17, 35, 0.9)',
  } : {
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
    mint: '#059669',
    glowLeft: '3px solid #7C3AED',
    msgBg: '#FFFFFF',
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

  const handleCreateChannel = () => {
    if (!channelName.trim()) return;
    dispatch({ type: 'CREATE_CHANNEL', payload: { name: channelName, description: channelDesc } });
    setChannelName('');
    setChannelDesc('');
    setShowCreateChannel(false);
  };

  return (
    <div className="flex flex-col h-full w-full relative" style={{ backgroundColor: c.bg }}>
      {/* Aurora top glow decoration */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%)',
        }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-4 py-3 z-10"
        style={{ borderBottom: `1px solid ${c.border}` }}
      >
        <button className="relative" onClick={() => setShowMenu(!showMenu)}>
          <Avatar name={currentUser?.displayName || ''} color={c.accent} size="md" />
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
            title={theme === 'dark' ? '切换亮色模式' : '切换深色模式'}
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

        {/* Dropdown Menu - Desktop (top-right) */}
        {!isMobile && showMenu && (
          <div
            className="absolute top-16 right-2 z-50 rounded-2xl py-2 w-52 animate-fade-in shadow-2xl"
            style={{
              background: c.dropdownBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${c.border}`,
            }}
          >
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { setShowCreateGroup(true); setShowMenu(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Users size={16} style={{ color: c.accent }} />
              新建群组
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { setShowCreateChannel(true); setShowMenu(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Radio size={16} style={{ color: c.cyan }} />
              新建频道
            </button>
            <div className="my-1 mx-3" style={{ borderTop: `1px solid ${c.border}` }} />
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
              style={{ color: '#EF4444' }}
              onClick={() => { dispatch({ type: 'LOGOUT' }); setShowMenu(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Drawer Menu */}
      {isMobile && showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowMenu(false)}
          />
          <div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl py-4 px-4 animate-slide-up"
            style={{
              background: c.dropdownBg,
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid ${c.border}`,
            }}
          >
            {/* Drag handle */}
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: c.textMuted }} />
            {/* User info */}
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: `1px solid ${c.border}` }}>
              <Avatar name={currentUser?.displayName || ''} color={c.accent} size="md" />
              <div>
                <p className="font-semibold text-sm" style={{ color: c.text }}>{currentUser?.displayName}</p>
                <p className="text-xs" style={{ color: c.textSec }}>@{currentUser?.username}</p>
              </div>
            </div>
            {/* Menu items */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl"
              style={{ color: c.text }}
              onClick={() => { setShowCreateGroup(true); setShowMenu(false); }}
            >
              <Users size={18} style={{ color: c.accent }} />
              新建群组
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl"
              style={{ color: c.text }}
              onClick={() => { setShowCreateChannel(true); setShowMenu(false); }}
            >
              <Radio size={18} style={{ color: c.cyan }} />
              新建频道
            </button>
            <div className="my-2 mx-2" style={{ borderTop: `1px solid ${c.border}` }} />
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl"
              style={{ color: '#EF4444' }}
              onClick={() => { dispatch({ type: 'LOGOUT' }); setShowMenu(false); }}
            >
              <LogOut size={18} />
              退出登录
            </button>
          </div>
        </>
      )}

      {/* Search */}
      <div className="relative px-3 py-2 z-10">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200"
          style={{ background: c.inputBg, border: `1px solid ${c.border}` }}
        >
          <Search size={16} style={{ color: c.textMuted }} />
          <input
            type="text"
            placeholder="搜索..."
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

      {/* Filter Tabs */}
      <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto no-scrollbar relative z-10">
        {([
          { key: 'all', label: '全部', icon: <MessageCircle size={12} /> },
          { key: 'private', label: '私聊', icon: <MessageCircle size={12} /> },
          { key: 'group', label: '群组', icon: <Users size={12} /> },
          { key: 'channel', label: '频道', icon: <Radio size={12} /> },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: f.key })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 cursor-pointer"
            style={{
              background: activeFilter === f.key
                ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                : 'transparent',
              color: activeFilter === f.key ? '#FFFFFF' : c.textSec,
              boxShadow: activeFilter === f.key ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none',
            }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {filtered.length === 0 ? (
          <div className="text-center text-sm py-12" style={{ color: c.textMuted }}>
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p>没有找到对话</p>
          </div>
        ) : (
          filtered.map(chat => (
            <ChatItem key={chat.id} chat={chat} c={c} />
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-2xl p-6 w-80 shadow-2xl animate-fade-in-up"
            style={{
              background: c.dropdownBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${c.border}`,
            }}
          >
            <h3 className="font-semibold text-lg mb-4" style={{ color: c.text }}>新建频道</h3>
            <input
              className="w-full rounded-xl px-4 py-2.5 mb-3 outline-none text-sm transition-all duration-200"
              style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.border}` }}
              placeholder="频道名称"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
            />
            <textarea
              className="w-full rounded-xl px-4 py-2.5 mb-4 outline-none text-sm resize-none transition-all duration-200"
              style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.border}` }}
              placeholder="频道描述（可选）"
              rows={3}
              value={channelDesc}
              onChange={e => setChannelDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-xl text-sm cursor-pointer transition-colors duration-200"
                style={{ background: c.bgHover, color: c.textSec }}
                onClick={() => setShowCreateChannel(false)}
              >取消</button>
              <button
                className="flex-1 py-2 rounded-xl text-white text-sm font-medium cursor-pointer transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)',
                }}
                onClick={handleCreateChannel}
              >创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ChatItemProps {
  chat: Chat;
  c: Record<string, string>;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, c }) => {
  const { state, dispatch } = useApp();
  const isActive = state.activeChat === chat.id;
  const [showCtx, setShowCtx] = useState(false);

  const lastMsg = chat.lastMessage;
  const preview = lastMsg
    ? lastMsg.senderId === 'me'
      ? `你: ${lastMsg.content}`
      : lastMsg.type === 'system'
      ? lastMsg.content
      : lastMsg.content
    : '暂无消息';

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200"
      style={{
        background: isActive ? c.bgActive : 'transparent',
        borderLeft: isActive ? c.glowLeft : '3px solid transparent',
      }}
      onClick={() => dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat.id })}
      onContextMenu={e => { e.preventDefault(); setShowCtx(true); }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = c.bgHover; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Avatar with subtle glow on active */}
      <div className="relative flex-shrink-0">
        {isActive && (
          <div
            className="absolute -inset-0.5 rounded-full animate-aurora-pulse"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))', filter: 'blur(4px)' }}
          />
        )}
        <Avatar name={chat.name} color={chat.avatarColor} size="md" />
        {chat.type === 'channel' && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5"
            style={{ background: c.accent }}
          >
            <Radio size={8} className="text-white" />
          </span>
        )}
        {chat.type === 'group' && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5"
            style={{ background: c.cyan }}
          >
            <Users size={8} className="text-white" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1 min-w-0">
            {chat.pinned && <Pin size={11} style={{ color: c.textMuted }} />}
            <span className="font-medium text-sm truncate" style={{ color: c.text }}>{chat.name}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {lastMsg && (
              <span className="text-xs" style={{ color: c.textMuted }}>{formatTime(lastMsg.timestamp)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs truncate flex-1" style={{ color: c.textSec }}>{preview}</p>
          <div className="flex items-center gap-1 ml-2">
            {chat.muted && <BellOff size={11} style={{ color: c.textMuted }} />}
            {chat.unreadCount > 0 && (
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white"
                style={{
                  background: chat.muted ? 'rgba(124, 58, 237, 0.2)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: chat.muted ? c.accent : '#FFFFFF',
                }}
              >
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showCtx && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowCtx(false)} />
          <div
            className="absolute left-12 top-6 z-50 rounded-xl shadow-2xl py-2 w-44 animate-fade-in"
            style={{
              background: c.dropdownBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${c.border}`,
            }}
          >
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { dispatch({ type: 'PIN_CHAT', payload: chat.id }); setShowCtx(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Pin size={14} style={{ color: c.textSec }} />
              {chat.pinned ? '取消置顶' : '置顶'}
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { dispatch({ type: 'MUTE_CHAT', payload: chat.id }); setShowCtx(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <BellOff size={14} style={{ color: c.textSec }} />
              {chat.muted ? '取消静音' : '静音'}
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => { dispatch({ type: 'MARK_READ', payload: chat.id }); setShowCtx(false); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <MessageCircle size={14} style={{ color: c.textSec }} />
              标为已读
            </button>
          </div>
        </>
      )}
    </div>
  );
};
