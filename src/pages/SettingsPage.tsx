import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { getInitials } from '@/data/mockData';
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  KeyRound,
  LogOut,
  Pencil,
  Smartphone,
  WalletCards,
  X,
} from 'lucide-react';

type EditableField = 'displayName' | 'username';

export const SettingsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { currentUser, theme, wallet } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState('');

  const returnPath = typeof location.state?.from === 'string' ? location.state.from : '/app/chats';
  const isDark = theme === 'dark';

  const c = isDark
    ? {
        bg: '#0D0B14',
        card: 'rgba(25, 22, 40, 0.88)',
        cardHover: 'rgba(255, 255, 255, 0.06)',
        soft: 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(124, 58, 237, 0.14)',
        text: '#E8E4F0',
        textSec: '#8B83A0',
        textMuted: '#5C5670',
        modal: 'rgba(20, 17, 35, 0.96)',
      }
    : {
        bg: '#F4F6FB',
        card: '#FFFFFF',
        cardHover: '#F3F4F6',
        soft: '#F1F5F9',
        border: 'rgba(15, 23, 42, 0.08)',
        text: '#0F172A',
        textSec: '#64748B',
        textMuted: '#94A3B8',
        modal: '#FFFFFF',
      };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const openEditor = (field: EditableField) => {
    setEditingField(field);
    setDraftValue(field === 'displayName' ? currentUser?.displayName || '' : currentUser?.username || '');
  };

  const saveEditor = () => {
    if (!editingField) return;
    const value = draftValue.trim();
    if (!value) return;
    dispatch({ type: 'UPDATE_USER', payload: { [editingField]: value } });
    setEditingField(null);
    setDraftValue('');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        dispatch({ type: 'UPDATE_USER', payload: { avatar: reader.result } });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-full w-full overflow-y-auto" style={{ backgroundColor: c.bg, color: c.text }}>
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(returnPath)}
            className="flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition hover:bg-gray-100 active:scale-95 dark:hover:bg-white/5"
            style={{ background: c.card, color: c.textSec, border: `1px solid ${c.border}` }}
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>
          <p className="text-sm font-semibold" style={{ color: c.textSec }}>Settings</p>
          <div className="h-11 w-11" />
        </div>

        <section className="mb-8 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative mb-4 rounded-full transition hover:scale-[1.02] active:scale-95"
            aria-label="Upload avatar"
          >
            <div
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full text-4xl font-black text-white shadow-[0_20px_44px_rgba(15,23,42,0.18)]"
              style={{ backgroundColor: currentUser?.avatarColor || '#2563EB', border: `8px solid ${c.card}` }}
            >
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.displayName} className="h-full w-full object-cover" />
              ) : (
                getInitials(currentUser?.displayName || 'User')
              )}
            </div>
            <span className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg">
              <Camera size={17} />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

          <button
            type="button"
            onClick={() => openEditor('displayName')}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1 transition hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <h1 className="text-2xl font-black" style={{ color: c.text }}>{currentUser?.displayName || 'Current User'}</h1>
            <Pencil size={15} style={{ color: c.textMuted }} />
          </button>
          <button
            type="button"
            onClick={() => openEditor('username')}
            className="mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-white/5"
            style={{ color: c.textSec }}
          >
            @{currentUser?.username || 'username'}
            <Pencil size={14} />
          </button>
        </section>

        <div className="space-y-5">
          <SettingsGroup title={undefined} c={c}>
            <SettingsRow
              icon={<WalletCards size={20} />}
              label="Wallet"
              value={formatMoney(wallet.balance)}
              c={c}
              onClick={() =>
                navigate('/app/wallet', {
                  state: { from: '/app/settings' },
                })
              }
            />
          </SettingsGroup>

          <SettingsGroup title="Privacy & Security" c={c}>
            <SettingsRow icon={<Smartphone size={20} />} label="Sessions" c={c} onClick={() => undefined} />
            <SettingsRow icon={<KeyRound size={20} />} label="2FA" c={c} onClick={() => undefined} />
          </SettingsGroup>
        </div>

        <div className="mt-auto pt-8">
          <SettingsGroup title={undefined} c={c}>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-16 w-full items-center gap-3 px-4 text-left text-red-500 transition hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                <LogOut size={20} />
              </span>
              <span className="flex-1 text-[15px] font-semibold">Log Out</span>
            </button>
          </SettingsGroup>
        </div>
      </div>

      {editingField && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/45 px-4 pb-4 sm:items-center sm:justify-center sm:p-4">
          <div
            className="w-full max-w-sm rounded-3xl p-5 shadow-2xl"
            style={{ background: c.modal, color: c.text, border: `1px solid ${c.border}` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingField === 'displayName' ? 'Edit Name' : 'Edit Username'}</h2>
              <button
                onClick={() => setEditingField(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 dark:hover:bg-white/5"
                style={{ color: c.textSec }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <input
              value={draftValue}
              onChange={event => setDraftValue(event.target.value)}
              autoFocus
              className="mb-4 w-full rounded-2xl px-4 py-3 text-sm outline-none"
              style={{ background: c.soft, color: c.text, border: `1px solid ${c.border}` }}
            />

            <button
              onClick={saveEditor}
              className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:scale-[1.01] active:scale-[0.99] dark:bg-white dark:text-slate-950"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsGroup: React.FC<{ title?: string; children: React.ReactNode; c: Record<string, string> }> = ({ title, children, c }) => (
  <section>
    {title && <h2 className="mb-2 px-1 text-xs font-bold uppercase" style={{ color: c.textMuted }}>{title}</h2>}
    <div className="overflow-hidden rounded-3xl shadow-sm" style={{ background: c.card, border: `1px solid ${c.border}` }}>
      {children}
    </div>
  </section>
);

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
  c: Record<string, string>;
}> = ({ icon, label, value, onClick, c }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-16 w-full items-center gap-3 px-4 text-left transition hover:bg-gray-100 dark:hover:bg-white/5"
  >
    <RowIcon c={c}>{icon}</RowIcon>
    <span className="flex-1 text-[15px] font-semibold" style={{ color: c.text }}>{label}</span>
    {value && <span className="max-w-[42%] truncate text-sm font-semibold" style={{ color: c.textSec }}>{value}</span>}
    <ChevronRight size={19} style={{ color: c.textMuted }} />
  </button>
);

const RowIcon: React.FC<{ children: React.ReactNode; c: Record<string, string> }> = ({ children, c }) => (
  <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: c.soft, color: c.text }}>
    {children}
  </span>
);
