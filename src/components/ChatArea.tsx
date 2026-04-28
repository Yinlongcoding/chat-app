import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { MobilePageStack } from './MobilePageStack';
import type { Chat, Message } from '@/types';
import { formatTime, getUserById, MOCK_USERS } from '../data/mockData';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  Radio,
  Reply,
  Search,
  Send,
  Smile,
  Users,
  Video,
  X,
} from 'lucide-react';

const EMOJIS = [':)', ':D', ';)', '<3', ':P', '++', 'ok', 'yay', 'wow', 'hi', 'gm', 'ty', 'brb', 'lol', 'gg', 'go'];

interface ChatAreaProps {
  isMobile: boolean;
  onMobileBack?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ isMobile, onMobileBack }) => {
  const { state, dispatch } = useApp();
  const { activeChat, chats, messages, theme } = state;
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchMsg, setSearchMsg] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = theme === 'dark';
  const routeChatId = getRouteChatId(location.pathname);
  const currentChatId = routeChatId || activeChat;
  const showInfo = Boolean(currentChatId && /\/info$/.test(location.pathname));

  const c = isDark
    ? {
        bg: '#0D0B14',
        headerBg: 'rgba(17, 15, 27, 0.88)',
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
      }
    : {
        bg: '#F8F6FF',
        headerBg: 'rgba(248, 246, 255, 0.88)',
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

  const chat = chats.find(ch => ch.id === currentChatId);
  const chatMessages = (currentChatId ? messages[currentChatId] : []) || [];
  const filtered = showSearch && searchMsg
    ? chatMessages.filter(message => message.content.toLowerCase().includes(searchMsg.toLowerCase()))
    : chatMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, currentChatId]);

  useEffect(() => {
    setShowSearch(false);
    setSearchMsg('');
    setReplyTo(null);
  }, [currentChatId]);

  const handleSend = () => {
    if (!input.trim() || !currentChatId) return;

    dispatch({
      type: 'SEND_MESSAGE',
      payload: { chatId: currentChatId, content: input.trim(), replyTo: replyTo?.id },
    });

    setInput('');
    setReplyTo(null);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!currentChatId || !chat) {
    return <EmptyState c={c} />;
  }

  const getMemberStatus = () => {
    if (chat.type === 'private') {
      const other = MOCK_USERS.find(user => user.id !== 'me' && chat.members.includes(user.id));
      if (other?.status === 'online') return 'Online';
      return 'Recently active';
    }
    if (chat.type === 'group') return `${chat.members.length} members`;
    if (chat.type === 'channel') return `${chat.subscriberCount?.toLocaleString()} subscribers`;
    return '';
  };

  const groupedMessages: { date: string; messages: Message[] }[] = [];
  filtered.forEach(message => {
    const dateStr = new Date(message.timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const existing = groupedMessages.find(group => group.date === dateStr);
    if (existing) {
      existing.messages.push(message);
    } else {
      groupedMessages.push({ date: dateStr, messages: [message] });
    }
  });

  const openInfoPage = () => navigate(`/app/chats/${currentChatId}/info`);
  const closeInfoPage = () => navigate(`/app/chats/${currentChatId}`);

  const chatPage = (
    <div className="flex h-full w-full flex-col" style={{ backgroundColor: c.bg }}>
      <div
        className="flex items-center gap-3 px-4 py-3 z-10"
        style={{
          borderBottom: `1px solid ${c.border}`,
          background: c.headerBg,
          backdropFilter: 'blur(16px)',
        }}
      >
        {isMobile && (
          <button
            className="rounded-full p-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ color: c.textSec }}
            onClick={() => onMobileBack?.()}
            aria-label="Back to chats"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <Avatar name={chat.name} color={chat.avatarColor} size="md" />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="min-w-0 flex-1 cursor-pointer" onClick={openInfoPage}>
            <div className="flex items-center gap-1.5">
              {chat.type === 'channel' && <Radio size={12} style={{ color: c.cyan }} />}
              {chat.type === 'group' && <Users size={12} style={{ color: c.cyan }} />}
              <p className="truncate text-sm font-semibold" style={{ color: c.text }}>{chat.name}</p>
            </div>
            <p className="text-xs" style={{ color: c.textSec }}>{getMemberStatus()}</p>
          </div>

          {isMobile ? (
            <button
              className="flex items-center gap-1 rounded-full px-2 py-1 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ color: c.textSec, backgroundColor: c.hover }}
              onClick={openInfoPage}
              aria-label="Open chat details"
            >
              <span className="text-xs">Details</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="flex-shrink-0 rounded-full p-2 transition-all duration-200"
              style={{
                color: c.textSec,
                transform: showInfo ? 'rotate(90deg)' : 'rotate(0deg)',
                backgroundColor: showInfo ? 'rgba(124,58,237,0.15)' : 'transparent',
              }}
              onClick={() => (showInfo ? closeInfoPage() : openInfoPage())}
            >
              <MoreVertical size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            className="rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ color: c.textSec }}
            onClick={() => {
              setShowSearch(prev => !prev);
              setSearchMsg('');
            }}
          >
            <Search size={18} />
          </button>
          <button className="rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95" style={{ color: c.textSec }}>
            <Phone size={18} />
          </button>
          <button className="rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95" style={{ color: c.textSec }}>
            <Video size={18} />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}>
            <Search size={14} style={{ color: c.textMuted }} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchMsg}
              onChange={event => setSearchMsg(event.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
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

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {groupedMessages.map(group => (
          <div key={group.date}>
            <div className="my-4 flex justify-center">
              <span className="rounded-full px-3 py-1 text-xs" style={{ background: c.hover, color: c.textMuted }}>
                {group.date}
              </span>
            </div>

            {group.messages.map(message => {
              const isSelf = message.senderId === 'me';
              const senderUser = !isSelf ? getUserById(message.senderId) : null;
              const showAvatar = !isSelf && (chat.type === 'group' || chat.type === 'channel');

              return (
                <div key={message.id} className={`mb-2 flex animate-fade-in-up ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  {!isSelf && (
                    <div className="mr-2 mt-auto h-8 w-8 flex-shrink-0">
                      {showAvatar && (
                        <Avatar name={senderUser?.displayName || ''} color={senderUser?.avatarColor || c.accent} size="sm" />
                      )}
                    </div>
                  )}

                  <div className="max-w-[78%]">
                    {showAvatar && (
                      <p className="mb-0.5 ml-1 text-xs" style={{ color: c.accent }}>
                        {senderUser?.displayName}
                      </p>
                    )}

                    {message.replyTo && (
                      <div
                        className="mb-1 rounded-lg rounded-bl-none border-l-2 px-3 py-1.5 text-xs"
                        style={{ background: c.replyBg, borderLeftColor: c.accent, color: c.textSec }}
                      >
                        {(() => {
                          const origin = chatMessages.find(item => item.id === message.replyTo);
                          const originSender = origin ? getUserById(origin.senderId) : null;
                          return origin ? `${originSender?.displayName || 'Unknown'}: ${origin.content}` : '';
                        })()}
                      </div>
                    )}

                    <div
                      className="px-3.5 py-2 text-sm"
                      style={{
                        background: isSelf ? c.bubbleSelf : c.bubbleOther,
                        color: isSelf ? c.bubbleSelfText : c.bubbleOtherText,
                        borderRadius: isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        ...(isDark && !isSelf ? { backdropFilter: 'blur(8px)' } : {}),
                        ...(isDark && !isSelf ? { boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {}),
                      }}
                    >
                      {message.type === 'system' ? (
                        <span className="text-xs italic" style={{ color: c.textMuted }}>{message.content}</span>
                      ) : (
                        <>
                          <p className="leading-relaxed">{message.content}</p>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="text-[10px] opacity-60">{formatTime(message.timestamp)}</span>
                            {isSelf && (message.status === 'read' ? <CheckCheck size={14} className="opacity-60" /> : message.status === 'sent' ? <Check size={14} className="opacity-60" /> : null)}
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

      {replyTo && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: c.replyBg, borderTop: `1px solid ${c.border}` }}>
          <Reply size={14} style={{ color: c.accent }} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium" style={{ color: c.accent }}>
              {replyTo.senderId === 'me' ? 'You' : getUserById(replyTo.senderId)?.displayName}
            </p>
            <p className="truncate text-xs" style={{ color: c.textSec }}>{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="cursor-pointer">
            <X size={16} style={{ color: c.textMuted }} />
          </button>
        </div>
      )}

      {showEmoji && (
        <div className="grid grid-cols-8 gap-1 px-4 py-2" style={{ background: c.emojiBg, borderTop: `1px solid ${c.border}` }}>
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              className="rounded-lg p-1 text-sm transition-transform hover:scale-110"
              onClick={() => {
                setInput(prev => prev + ` ${emoji}`);
                inputRef.current?.focus();
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-3" style={{ borderTop: `1px solid ${c.border}` }}>
        <div className="flex items-end gap-2 rounded-2xl px-3 py-2" style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}>
          <button className="rounded-full p-1.5 transition-colors" style={{ color: c.textMuted }} onClick={() => setShowEmoji(prev => !prev)}>
            <Smile size={20} />
          </button>
          <button className="rounded-full p-1.5 transition-colors" style={{ color: c.textMuted }}>
            <Paperclip size={20} />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent py-1 text-sm outline-none"
            style={{ color: c.text }}
          />
          {!input.trim() ? (
            <button className="rounded-full p-1.5 transition-colors" style={{ color: c.textMuted }}>
              <Mic size={20} />
            </button>
          ) : (
            <button
              className="rounded-full p-1.5 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)' }}
              onClick={handleSend}
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const infoPage = <InfoPanel chat={chat} onClose={closeInfoPage} dispatch={dispatch} c={c} isMobile={isMobile} />;

  if (isMobile) {
    return (
      <MobilePageStack
        activeIndex={showInfo ? 1 : 0}
        pages={[
          { key: 'chat-content', backgroundColor: c.bg, content: chatPage },
          { key: 'chat-info', backgroundColor: c.infoBg, content: infoPage },
        ]}
      />
    );
  }

  return (
    <div className="relative flex h-full" style={{ backgroundColor: c.bg }}>
      <div className={`flex h-full flex-col ${showInfo ? 'flex-1' : 'w-full'}`}>{chatPage}</div>

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
        {infoPage}
      </div>

      {showInfo && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={closeInfoPage}
        />
      )}
    </div>
  );
};

function getRouteChatId(pathname: string) {
  const match = pathname.match(/^\/app\/chats\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const EmptyState: React.FC<{ c: Record<string, string> }> = ({ c }) => (
  <div className="flex h-full w-full flex-col items-center justify-center" style={{ backgroundColor: c.bg }}>
    <div
      className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
      style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))', boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)' }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <h3 className="mb-2 text-lg font-semibold" style={{ color: c.text }}>Select a chat</h3>
    <p className="text-sm" style={{ color: c.textSec }}>Choose any conversation from the list to start messaging.</p>
  </div>
);

interface InfoPanelProps {
  chat: Chat;
  onClose: () => void;
  dispatch: React.Dispatch<any>;
  c: Record<string, string>;
  isMobile?: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ chat, onClose, dispatch, c, isMobile = false }) => {
  const { state } = useApp();
  const { currentUser } = state;
  const members = MOCK_USERS.filter(user => chat.members.includes(user.id)).map(user =>
    user.id === currentUser?.id ? { ...user, ...currentUser } : user
  );
  const navigate = useNavigate();
  const location = useLocation();
  const openMember = (userId: string) => {
    if (userId === currentUser?.id) {
      navigate('/app/settings', {
        state: {
          from: location.pathname,
          chatId: chat.id,
        },
      });
      return;
    }

    navigate(`/app/contacts/${userId}`, {
      state: {
        from: location.pathname,
        chatId: chat.id,
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ color: c.textSec }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <p className="text-sm font-semibold" style={{ color: c.text }}>Chat Details</p>
        </div>
        {!isMobile && (
          <button onClick={onClose} className="cursor-pointer" style={{ color: c.textSec }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-shrink-0">
        <div className="flex flex-col items-center px-4 py-6">
          <div
            className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${chat.avatarColor}, ${chat.avatarColor}dd)`, boxShadow: `0 0 25px ${chat.avatarColor}44` }}
          >
            {chat.name.charAt(0)}
          </div>
          <h4 className="font-semibold" style={{ color: c.text }}>{chat.name}</h4>
          <p className="mt-1 text-xs" style={{ color: c.textSec }}>
            {chat.type === 'private' ? 'Private' : chat.type === 'group' ? 'Group' : 'Channel'}
          </p>
          {chat.description && (
            <p className="mt-2 text-center text-xs" style={{ color: c.textMuted }}>{chat.description}</p>
          )}
        </div>

        <div className="space-y-1 px-4">
          {[
            { icon: <Bell size={16} />, label: chat.muted ? 'Unmute notifications' : 'Mute notifications' },
            { icon: <Pin size={16} />, label: chat.pinned ? 'Unpin chat' : 'Pin chat' },
            { icon: <Search size={16} />, label: 'Search messages' },
          ].map((item, index) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
              style={{ color: c.text }}
              onClick={() => {
                if (index === 0) dispatch({ type: 'MUTE_CHAT', payload: chat.id });
                if (index === 1) dispatch({ type: 'PIN_CHAT', payload: chat.id });
                if (index === 2) onClose();
              }}
              onMouseEnter={event => (event.currentTarget.style.background = c.hover)}
              onMouseLeave={event => (event.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: c.textSec }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h5 className="sticky top-0 mb-2 py-1 text-xs font-medium" style={{ color: c.textMuted, backgroundColor: c.infoBg }}>
          Members ({members.length})
        </h5>
        <div className="space-y-0.5">
          {members.map(user => (
            <div
              key={user.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors"
              onClick={() => openMember(user.id)}
              onMouseEnter={event => (event.currentTarget.style.background = c.hover)}
              onMouseLeave={event => (event.currentTarget.style.background = 'transparent')}
            >
              <Avatar
                name={user.displayName}
                color={user.avatarColor}
                size="sm"
                online={user.status === 'online'}
                src={user.avatar}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm" style={{ color: c.text }}>{user.displayName}</p>
                <p className="text-xs" style={{ color: user.status === 'online' ? c.mint : c.textMuted }}>
                  {user.status === 'online' ? 'Online' : 'Recently active'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
