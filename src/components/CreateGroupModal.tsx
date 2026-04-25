import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { MOCK_USERS } from '../data/mockData';
import { X, Search } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const CreateGroupModal: React.FC<Props> = ({ onClose }) => {
  const { dispatch, state } = useApp();
  const { theme } = state;
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const isDark = theme === 'dark';

  const c = isDark ? {
    bg: 'rgba(20, 17, 35, 0.9)',
    inputBg: 'rgba(25, 22, 40, 0.6)',
    hover: 'rgba(124, 58, 237, 0.08)',
    border: 'rgba(124, 58, 237, 0.12)',
    text: '#E8E4F0',
    textSec: '#8B83A0',
    textMuted: '#5C5670',
    accent: '#7C3AED',
    selectedBg: 'rgba(124, 58, 237, 0.15)',
    checkBg: '#7C3AED',
  } : {
    bg: 'rgba(255, 255, 255, 0.95)',
    inputBg: '#EDE9FE',
    hover: 'rgba(124, 58, 237, 0.06)',
    border: 'rgba(124, 58, 237, 0.1)',
    text: '#1E1B2E',
    textSec: '#6B6580',
    textMuted: '#9B95A8',
    accent: '#7C3AED',
    selectedBg: 'rgba(124, 58, 237, 0.1)',
    checkBg: '#7C3AED',
  };

  const contacts = MOCK_USERS.filter(u => u.id !== 'me').filter(u =>
    u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!name.trim() || selected.length === 0) return;
    dispatch({ type: 'CREATE_GROUP', payload: { name, members: selected, description: desc } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="rounded-2xl p-6 w-80 shadow-2xl animate-fade-in-up max-h-[80vh] flex flex-col"
        style={{
          background: c.bg,
          backdropFilter: 'blur(24px)',
          border: `1px solid ${c.border}`,
          boxShadow: '0 0 40px rgba(124, 58, 237, 0.1), 0 25px 50px rgba(0,0,0,0.25)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg" style={{ color: c.text }}>新建群组</h3>
          <button onClick={onClose} className="cursor-pointer" style={{ color: c.textSec }}>
            <X size={18} />
          </button>
        </div>

        <input
          className="w-full rounded-xl px-4 py-2.5 mb-2 outline-none text-sm transition-all duration-200"
          style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.border}` }}
          placeholder="群组名称 *"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl px-4 py-2.5 mb-3 outline-none text-sm transition-all duration-200"
          style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.border}` }}
          placeholder="群组描述（可选）"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ background: c.inputBg, border: `1px solid ${c.border}` }}
        >
          <Search size={14} style={{ color: c.textMuted }} />
          <input
            type="text"
            placeholder="搜索联系人..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: c.text }}
          />
        </div>

        {selected.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            {selected.map(id => {
              const u = MOCK_USERS.find(u => u.id === id)!;
              return (
                <button key={id} onClick={() => toggle(id)} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                  <div className="relative">
                    <Avatar name={u.displayName} color={u.avatarColor} size="sm" />
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                      <X size={8} className="text-white" />
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: c.textSec }}>{u.displayName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {contacts.map(u => (
            <div
              key={u.id}
              className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors duration-200"
              style={{ background: selected.includes(u.id) ? c.selectedBg : 'transparent' }}
              onClick={() => toggle(u.id)}
              onMouseEnter={e => { if (!selected.includes(u.id)) e.currentTarget.style.background = c.hover; }}
              onMouseLeave={e => { if (!selected.includes(u.id)) e.currentTarget.style.background = 'transparent'; }}
            >
              <Avatar name={u.displayName} color={u.avatarColor} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: c.text }}>{u.displayName}</p>
                <p className="text-xs" style={{ color: c.textSec }}>@{u.username}</p>
              </div>
              {selected.includes(u.id) && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: c.checkBg, boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 py-2 rounded-xl text-sm cursor-pointer transition-colors duration-200"
            style={{ background: c.hover, color: c.textSec }}
            onClick={onClose}
          >取消</button>
          <button
            className="flex-1 py-2 rounded-xl text-white text-sm font-medium cursor-pointer transition-all duration-200"
            style={{
              background: name.trim() && selected.length > 0
                ? 'linear-gradient(135deg, #7C3AED, #06B6D4)'
                : c.inputBg,
              color: name.trim() && selected.length > 0 ? '#FFFFFF' : c.textMuted,
              boxShadow: name.trim() && selected.length > 0 ? '0 2px 10px rgba(124, 58, 237, 0.3)' : 'none',
            }}
            onClick={handleCreate}
            disabled={!name.trim() || selected.length === 0}
          >
            创建 ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};
