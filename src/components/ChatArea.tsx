import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import type { Message, Chat } from '@/types';
import { formatFullTime, formatTime, getUserById, MOCK_USERS } from '../data/mockData';
import {
  PanelLeftClose, Search, Phone, Video, MoreVertical, Send, Smile,
  Paperclip, Mic, Reply, X, Check, CheckCheck, Radio, Users,
  Info, Pin, BellOff, Bell
} from 'lucide-react';

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','😅','👍','❤️','🎉','🔥','✅','😭','🙏','💯','🚀'];

export const ChatArea: React.FC<{
  onShowInfo?: (show: boolean) => void;
  onIsMobile?: (mobile: boolean) => void;
}> = ({ onShowInfo, onIsMobile }) => {
  const { state, dispatch } = useApp();
  const { activeChat, chats, messages, currentUser, theme } = state;
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [searchMsg, setSearchMsg] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Lifted state: sync with parent on mobile
  useEffect(() => {
    if (onIsMobile) onIsMobile(isMobile);
  }, [isMobile]);

  const handleShowInfo = (val: boolean) => {
    setShowInfo(val);
    if (onShowInfo) onShowInfo(val);
  };

  const isDark = theme === 'dark';

  const c = isDark ? {
    bg: '#0D0B14',
    headerBg: 'rgba(17, 15, 27, 0.85)',
    bubbleSelf: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    bubbleSelfText: '#FFFFFF',
    bubbleOther: 'rgba(25, 22, 40, 0.8)',
    bubbleOtherText: '#E8E4F0',
    inputBg: 'rgba(25, 22, 40, 0.6)',
    inputBorder: 'rgba(124, 58, 237, 0.12)',
    border: 'rgba(124, 58, 237, 0.12)',
    text: '#E8E4F0',
    textSec: '#8B83A0',
    textMuted: '#5C5670',
    accent: '#7C3AED',
    cyan: '#06B6D4',
    mint: '#34D399',
    infoBg: '#110F1B',
    replyBg: 'rgba(124, 58, 237, 0.1)',
    emojiBg: 'rgba(20, 17, 35, 0.95)',
    hover: 'rgba(124, 58, 237, 0.08)',
  } : {
    bg: '#F8F6FF',
    headerBg: 'rgba(248, 246, 255, 0.85)',
    bubbleSelf: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    bubbleSelfText: '#FFFFFF',
    bubbleOther: '#FFFFFF',
    bubbleOtherText: '#1E1B2E',
    inputBg: '#EDE9FE',
    inputBorder: 'rgba(124, 58, 237, 0.15)',
    border: 'rgba(124, 58, 237, 0.1)',
    text: '#1E1B2E',
    textSec: '#6B6580',
    textMuted: '#9B95A8',
    accent: '#7C3AED',
    cyan: '#0891B2',
    mint: '#059669',
    infoBg: '#F3F0FA',
    replyBg: 'rgba(124, 58, 237, 0.06)',
    emojiBg: 'rgba(255, 255, 255, 0.95)',
    hover: 'rgba(124, 58, 237, 0.05)',
  };

  const chat = chats.find(ch => ch.id === activeChat);
  const chatMessages = (activeChat ? messages[activeChat] : []) || [];
  const filtered = showSearch && searchMsg
    ? chatMessages.filter(m => m.content.toLowerCase().includes(searchMsg.toLowerCase()))
    : chatMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, activeChat]);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    dispatch({
      type: 'SEND_MESSAGE',
      payload: { chatId: activeChat, content: input.trim(), replyTo: replyTo?.id },
    });
    setInput('');
    setReplyTo(null);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat || !chat) {
    return <EmptyState c={c} />;
  }

  const getMemberStatus = () => {
    if (chat.type === 'private') {
      const other = MOCK_USERS.find(u => u.id !== 'me' && chat.members.includes(u.id));
      if (other?.status === 'online') return '在线';
      return '最近在线';
    }
    if (chat.type === 'group') return `${chat.members.length} 名成员`;
    if (chat.type === 'channel') return `${chat.subscriberCount?.toLocaleString()} 名订阅者`;
    return '';
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  filtered.forEach(msg => {
    const dateStr = new Date(msg.timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const existing = groupedMessages.find(g => g.date === dateStr);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateStr, messages: [msg] });
    }
  });

  return (
    <div className="flex h-full">
      {/* Main chat */}
      <div className={`flex flex-col h-full ${showInfo ? 'flex-1' : 'w-full'}`}>
        {/* Chat Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 z-10"
          style={{
            borderBottom: `1px solid ${c.border}`,
            background: c.headerBg,
            backdropFilter: 'blur(16px)',
          }}
        >
          <button
            className="p-1.5 rounded-full transition-colors duration-200 cursor-pointer md:hidden"
            style={{ color: c.textSec }}
            onClick={() => dispatch({ type: 'SET_ACTIVE_CHAT', payload: null })}
          >
            <PanelLeftClose size={20} />
          </button>
          <Avatar name={chat.name} color={chat.avatarColor} size="md" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleShowInfo(!showInfo)}>
              <div className="flex items-center gap-1.5">
                {chat.type === 'channel' && <Radio size={12} style={{ color: c.cyan }} />}
                {chat.type === 'group' && <Users size={12} style={{ color: c.cyan }} />}
                <p className="font-semibold text-sm truncate" style={{ color: c.text }}>{chat.name}</p>
              </div>
              <p className="text-xs" style={{ color: c.textSec }}>{getMemberStatus()}</p>
            </div>
            <button
              className="p-2 rounded-full cursor-pointer flex-shrink-0 transition-all duration-200"
              style={{
                color: c.textSec,
                transform: showInfo ? 'rotate(90deg)' : 'rotate(0deg)',
                backgroundColor: showInfo ? 'rgba(124,58,237,0.15)' : 'transparent',
              }}
              onClick={() => handleShowInfo(!showInfo)}
            >
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: c.textSec }}
              onClick={() => { setShowSearch(!showSearch); setSearchMsg(''); }}
            >
              <Search size={18} />
            </button>
            <button className="p-2 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: c.textSec }}
            >
              <Phone size={18} />
            </button>
            <button className="p-2 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: c.textSec }}
            >
              <Video size={18} />
            </button>

          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}
            >
              <Search size={14} style={{ color: c.textMuted }} />
              <input
                type="text"
                placeholder="搜索消息..."
                value={searchMsg}
                onChange={e => setSearchMsg(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1"
                style={{ color: c.text }}
                autoFocus
              />
              {searchMsg && (
                <button onClick={() => setSearchMsg('')} className="cursor-pointer">
                  <X size={14} style={{ color: c.textMuted }} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3" style={{ backgroundColor: c.bg }}>
          {groupedMessages.map(group => (
            <div key={group.date}>
              <div className="flex justify-center my-4">
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: c.hover, color: c.textMuted }}
                >
                  {group.date}
                </span>
              </div>
              {group.messages.map(msg => {
                const isSelf = msg.senderId === 'me';
                const senderUser = !isSelf ? getUserById(msg.senderId) : null;
                const showAvatar = !isSelf && (chat.type === 'group' || chat.type === 'channel');

                return (
                  <div
                    key={msg.id}
                    className={`flex mb-2 animate-fade-in-up ${isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isSelf && (
                      <div className="w-8 h-8 mr-2 flex-shrink-0 mt-auto">
                        {showAvatar && (
                          <Avatar name={senderUser?.displayName || ''} color={senderUser?.avatarColor || c.accent} size="sm" />
                        )}
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      {showAvatar && (
                        <p className="text-xs mb-0.5 ml-1" style={{ color: c.accent }}>
                          {senderUser?.displayName}
                        </p>
                      )}

                      {/* Reply reference */}
                      {msg.replyTo && (
                        <div
                          className="text-xs px-3 py-1.5 mb-1 rounded-lg rounded-bl-none border-l-2"
                          style={{
                            background: c.replyBg,
                            borderLeftColor: c.accent,
                            color: c.textSec,
                          }}
                        >
                          {(() => {
                            const origMsg = chatMessages.find(m => m.id === msg.replyTo);
                            const origSender = origMsg ? getUserById(origMsg.senderId) : null;
                            return origMsg ? `${origSender?.displayName || 'Unknown'}: ${origMsg.content}` : '';
                          })()}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className="px-3.5 py-2 rounded-2xl text-sm"
                        style={{
                          background: isSelf ? c.bubbleSelf : c.bubbleOther,
                          color: isSelf ? c.bubbleSelfText : c.bubbleOtherText,
                          borderRadius: isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          ...(isDark && !isSelf ? { backdropFilter: 'blur(8px)' } : {}),
                          ...(isDark && !isSelf ? { boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {}),
                        }}
                      >
                        {msg.type === 'system' ? (
                          <span className="text-xs italic" style={{ color: c.textMuted }}>{msg.content}</span>
                        ) : (
                          <>
                            <p className="leading-relaxed">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-[10px] opacity-60">{formatTime(msg.timestamp)}</span>
                              {isSelf && (
                                msg.status === 'read'
                                  ? <CheckCheck size={14} className="opacity-60" />
                                  : msg.status === 'sent'
                                  ? <Check size={14} className="opacity-60" />
                                  : null
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply bar */}
        {replyTo && (
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ background: c.replyBg, borderTop: `1px solid ${c.border}` }}
          >
            <Reply size={14} style={{ color: c.accent }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: c.accent }}>
                {replyTo.senderId === 'me' ? '你' : getUserById(replyTo.senderId)?.displayName}
              </p>
              <p className="text-xs truncate" style={{ color: c.textSec }}>{replyTo.content}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="cursor-pointer">
              <X size={16} style={{ color: c.textMuted }} />
            </button>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmoji && (
          <div
            className="px-4 py-2 grid grid-cols-8 gap-1"
            style={{
              background: c.emojiBg,
              borderTop: `1px solid ${c.border}`,
            }}
          >
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                className="text-xl p-1 rounded-lg transition-transform hover:scale-110 cursor-pointer"
                onClick={() => {
                  setInput(prev => prev + emoji);
                  inputRef.current?.focus();
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div
          className="px-4 py-3"
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <div
            className="flex items-end gap-2 rounded-2xl px-3 py-2"
            style={{
              background: c.inputBg,
              border: `1px solid ${c.inputBorder}`,
            }}
          >
            <button className="p-1.5 rounded-full transition-colors cursor-pointer"
              style={{ color: c.textMuted }}
            >
              <Smile size={20} onClick={() => setShowEmoji(!showEmoji)} />
            </button>
            <button className="p-1.5 rounded-full transition-colors cursor-pointer"
              style={{ color: c.textMuted }}
            >
              <Paperclip size={20} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none py-1 max-h-32"
              style={{ color: c.text }}
            />
            {!input.trim() ? (
              <button className="p-1.5 rounded-full transition-colors cursor-pointer"
                style={{ color: c.textMuted }}
              >
                <Mic size={20} />
              </button>
            ) : (
              <button
                className="p-1.5 rounded-full text-white cursor-pointer transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                }}
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Panel - Right Drawer (always rendered for animation) */}
      <div
        className="fixed top-0 right-0 z-50 h-full"
        style={{
          width: '50%',
          transform: showInfo ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease-in-out',
          backgroundColor: c.infoBg,
          borderLeft: `1px solid ${c.border}`,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
        }}
      >
        <InfoPanel chat={chat} onClose={() => handleShowInfo(false)} dispatch={dispatch} c={c} />
      </div>

      {/* Overlay */}
      {showInfo && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ backgroundColor: isMobile ? 'transparent' : 'rgba(0,0,0,0.4)' }}
          onClick={() => handleShowInfo(false)}
        />
      )}
    </div>
  );
};

/* ─── Empty State ─── */
const EmptyState: React.FC<{ c: Record<string, string> }> = ({ c }) => (
  <div
    className="flex flex-col items-center justify-center h-full w-full"
    style={{ backgroundColor: c.bg }}
  >
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
        boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)',
      }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2" style={{ color: c.text }}>选择一个对话</h3>
    <p className="text-sm" style={{ color: c.textSec }}>从左侧列表中选择对话开始聊天</p>
  </div>
);

/* ─── Info Panel ─── */
interface InfoPanelProps {
  chat: Chat;
  onClose: () => void;
  dispatch: React.Dispatch<any>;
  c: Record<string, string>;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ chat, onClose, dispatch, c }) => {
  const members = MOCK_USERS.filter(u => chat.members.includes(u.id));

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-end px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${c.border}` }}
      >
        <button onClick={onClose} className="cursor-pointer" style={{ color: c.textSec }}>
          <X size={18} />
        </button>
      </div>

      {/* Fixed content area */}
      <div className="flex-shrink-0">
        {/* Chat info */}
        <div className="flex flex-col items-center py-6 px-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 text-white text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${chat.avatarColor}, ${chat.avatarColor}dd)`,
              boxShadow: `0 0 25px ${chat.avatarColor}44`,
            }}
          >
            {chat.name.charAt(0)}
          </div>
          <h4 className="font-semibold" style={{ color: c.text }}>{chat.name}</h4>
          <p className="text-xs mt-1" style={{ color: c.textSec }}>
            {chat.type === 'private' ? '私聊' : chat.type === 'group' ? '群组' : '频道'}
          </p>
          {chat.description && (
            <p className="text-xs text-center mt-2" style={{ color: c.textMuted }}>{chat.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 space-y-1">
          {[
            { icon: <Bell size={16} />, label: chat.muted ? '取消静音' : '静音通知' },
            { icon: <Pin size={16} />, label: chat.pinned ? '取消置顶' : '置顶对话' },
            { icon: <Search size={16} />, label: '搜索消息' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              style={{ color: c.text }}
              onClick={() => {
                if (i === 0) dispatch({ type: 'MUTE_CHAT', payload: chat.id });
                if (i === 1) dispatch({ type: 'PIN_CHAT', payload: chat.id });
              }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: c.textSec }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Members area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h5 className="text-xs font-medium mb-2 sticky top-0 py-1" style={{ color: c.textMuted, backgroundColor: c.infoBg }}>
          成员 ({members.length})
        </h5>
        <div className="space-y-0.5">
          {members.map(u => (
            <div
              key={u.id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = c.hover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Avatar name={u.displayName} color={u.avatarColor} size="sm" online={u.status === 'online'} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: c.text }}>{u.displayName}</p>
                <p className="text-xs" style={{ color: u.status === 'online' ? c.mint : c.textMuted }}>
                  {u.status === 'online' ? '在线' : '最近在线'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
