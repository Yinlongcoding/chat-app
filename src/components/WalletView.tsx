import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Building2,
  Eye,
  EyeOff,
  Plus,
  ReceiptText,
  Send,
  Smartphone,
  WalletCards,
  X,
} from 'lucide-react';

interface WalletViewProps {
  onBack?: () => void;
  isStandalone?: boolean;
}

export const WalletView: React.FC<WalletViewProps> = ({ onBack, isStandalone = true }) => {
  const { state, dispatch } = useApp();
  const { wallet, theme } = state;
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeSheet, setActiveSheet] = useState<'add' | 'withdraw' | null>(null);
  const [addAmount, setAddAmount] = useState('250');
  const [withdrawAmount, setWithdrawAmount] = useState('300');
  const [selectedFundingMethod, setSelectedFundingMethod] = useState<'apple-pay' | 'debit-card' | 'ach'>('apple-pay');
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const c = isDark
    ? {
        shell: '#0D0B14',
        chrome: 'rgba(17, 15, 27, 0.92)',
        card: 'rgba(25, 22, 40, 0.86)',
        cardSoft: 'rgba(25, 22, 40, 0.6)',
        border: 'rgba(124, 58, 237, 0.14)',
        text: '#E8E4F0',
        textSec: '#8B83A0',
        textMuted: '#5C5670',
        accent: '#7C3AED',
        mint: '#34D399',
      }
    : {
        shell: '#F8F6FF',
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

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const maskedBalance = '******';
  const depositValue = useMemo(() => Number(addAmount), [addAmount]);
  const withdrawValue = useMemo(() => Number(withdrawAmount), [withdrawAmount]);
  const withdrawFee = Number.isFinite(withdrawValue) && withdrawValue > 0 ? withdrawValue * 0.015 : 0;
  const withdrawNet = Number.isFinite(withdrawValue) && withdrawValue > 0 ? withdrawValue - withdrawFee : 0;

  const quickActions = [
    {
      label: 'Add Money',
      icon: <Plus size={18} />,
      onClick: () => {
        setError('');
        setActiveSheet('add');
      },
    },
    {
      label: 'Send',
      icon: <Send size={18} />,
      onClick: () => setError(''),
    },
    {
      label: 'Withdraw',
      icon: <Banknote size={18} />,
      onClick: () => {
        setError('');
        setActiveSheet('withdraw');
      },
    },
  ];

  const fundingMethods = [
    {
      id: 'apple-pay' as const,
      label: 'Apple Pay',
      description: 'Instant funding with Face ID or Touch ID',
      icon: <Smartphone size={18} />,
      emphasis: true,
    },
    {
      id: 'debit-card' as const,
      label: 'Debit Card',
      description: 'Visa, Mastercard, and Maestro',
      icon: <WalletCards size={18} />,
      emphasis: false,
    },
    {
      id: 'ach' as const,
      label: 'Bank Transfer (ACH)',
      description: '1-3 business days',
      icon: <Building2 size={18} />,
      emphasis: false,
    },
  ];

  const activity = wallet.transactions.map(tx => ({
    id: tx.id,
    title: tx.note || (tx.type === 'deposit' ? 'Incoming transfer' : 'Instant withdrawal'),
    type: tx.type,
    amount: tx.amount,
    subtitle: formatTimestamp(tx.timestamp),
  }));

  const submitDeposit = () => {
    setError('');
    if (!Number.isFinite(depositValue) || depositValue <= 0) {
      setError('Enter a valid amount to add.');
      return;
    }

    const methodLabel = fundingMethods.find(method => method.id === selectedFundingMethod)?.label;
    dispatch({
      type: 'WALLET_DEPOSIT',
      payload: { amount: depositValue, note: methodLabel },
    });
    setActiveSheet(null);
  };

  const submitWithdraw = () => {
    setError('');
    if (!Number.isFinite(withdrawValue) || withdrawValue <= 0) {
      setError('Enter a valid withdrawal amount.');
      return;
    }
    if (withdrawValue > wallet.balance) {
      setError('Withdrawal amount exceeds available balance.');
      return;
    }

    dispatch({
      type: 'WALLET_WITHDRAW',
      payload: { amount: withdrawValue, note: 'Instant withdrawal' },
    });
    setActiveSheet(null);
  };

  return (
    <div className={`relative h-full w-full overflow-hidden ${isStandalone ? '' : 'rounded-[2.5rem]'}`} style={{ backgroundColor: c.shell }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_30%)]" />

      <div className="relative flex h-full flex-col">
        <div
          className="flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-6"
          style={{ background: c.chrome, borderBottom: `1px solid ${c.border}`, backdropFilter: 'blur(18px)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.18))',
                color: c.text,
                boxShadow: '0 12px 32px rgba(124, 58, 237, 0.18)',
              }}
            >
              <WalletCards size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>USD Wallet</p>
              <p className="text-sm font-medium" style={{ color: c.textSec }}>Available balance</p>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: c.cardSoft, color: c.textSec, border: `1px solid ${c.border}` }}
              aria-label="Back"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 md:px-6">
          <div className="mb-6 text-center">
            <div className="mb-3 flex justify-center">
              <button
                onClick={() => setIsBalanceVisible(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: c.cardSoft, color: c.textSec, border: `1px solid ${c.border}` }}
              >
                {isBalanceVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                Privacy
              </button>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: c.textMuted }}>Total Balance</p>
            <h2 className="text-[2.9rem] font-black leading-none tracking-[-0.06em]" style={{ color: c.text }}>
              {isBalanceVisible ? formatMoney(wallet.balance) : maskedBalance}
            </h2>
          </div>

          <div
            className="relative mb-6 overflow-hidden rounded-[2rem] p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(45,109,246,0.88) 58%, rgba(6,182,212,0.92))',
              boxShadow: '0 24px 60px rgba(30, 41, 59, 0.28)',
            }}
          >
            <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative text-white">
              <div className="mb-10 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/65">Virtual Debit</p>
                  <p className="mt-2 text-2xl font-bold tracking-[-0.03em]">TeleWallet Black</p>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/85">
                  USD
                </div>
              </div>

              <div className="mb-5 flex items-center gap-2 text-white/85">
                <div className="h-10 w-14 rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))]" />
                <div className="text-xs uppercase tracking-[0.25em]">Premium Access</div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">Card Holder</p>
                  <p className="mt-1 text-sm font-medium">Telegram Finance</p>
                </div>
                <p className="text-sm font-medium tracking-[0.32em] text-white/80">4921 84** **** 2804</p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="group flex flex-col items-center gap-3 rounded-[1.7rem] px-3 py-4 text-center transition duration-200 hover:scale-[1.03] active:scale-95"
                style={{ background: c.card, border: `1px solid ${c.border}`, boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.18)' : '0 12px 24px rgba(124,58,237,0.08)' }}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full transition duration-200 group-hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.85))', color: '#FFFFFF' }}
                >
                  {action.icon}
                </span>
                <span className="text-[13px] font-semibold" style={{ color: c.text }}>{action.label}</span>
              </button>
            ))}
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col rounded-[2rem] p-4 md:p-5"
            style={{ background: c.card, border: `1px solid ${c.border}`, boxShadow: isDark ? '0 16px 36px rgba(0,0,0,0.16)' : '0 16px 30px rgba(124,58,237,0.06)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>Recent Activity</p>
                <h3 className="mt-1 text-xl font-bold tracking-[-0.03em]" style={{ color: c.text }}>Latest movements</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: c.cardSoft, color: c.textSec }}>
                <ReceiptText size={18} />
              </div>
            </div>

            <div className="space-y-3">
              {activity.map(item => {
                const isIncome = item.type === 'deposit';
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-[1.4rem] px-4 py-3"
                    style={{ background: c.cardSoft, border: `1px solid ${c.border}` }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{
                          background: isIncome ? 'rgba(52, 211, 153, 0.14)' : 'rgba(124, 58, 237, 0.16)',
                          color: isIncome ? c.mint : c.text,
                        }}
                      >
                        {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" style={{ color: c.text }}>{item.title}</p>
                        <p className="truncate text-xs" style={{ color: c.textSec }}>{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold" style={{ color: isIncome ? c.mint : c.text }}>
                      {isIncome ? '+' : '-'}
                      {formatMoney(item.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {activeSheet && (
          <div className="absolute inset-0 flex items-end bg-black/35">
            <div
              className="w-full rounded-t-[2rem] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 animate-slide-up md:m-4 md:rounded-[2rem] md:px-5"
              style={{ background: c.chrome, borderTop: `1px solid ${c.border}`, backdropFilter: 'blur(20px)' }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>
                    {activeSheet === 'add' ? 'Add Funds' : 'Withdraw Funds'}
                  </p>
                  <h4 className="mt-1 text-2xl font-bold tracking-[-0.04em]" style={{ color: c.text }}>
                    {activeSheet === 'add' ? 'Top up your wallet' : 'Cash out instantly'}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setActiveSheet(null);
                    setError('');
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: c.cardSoft, color: c.textSec, border: `1px solid ${c.border}` }}
                  aria-label="Close panel"
                >
                  <X size={16} />
                </button>
              </div>

              {activeSheet === 'add' ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium" style={{ color: c.textSec }}>Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={addAmount}
                      onChange={event => setAddAmount(event.target.value)}
                      className="w-full rounded-[1.35rem] px-4 py-3 text-lg font-semibold outline-none transition"
                      style={{ background: c.cardSoft, color: c.text, border: `1px solid ${c.border}` }}
                    />
                  </label>

                  <div className="space-y-3">
                    {fundingMethods.map(method => {
                      const selected = selectedFundingMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedFundingMethod(method.id)}
                          className="flex w-full items-center justify-between rounded-[1.35rem] px-4 py-4 text-left transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
                          style={{
                            background: method.emphasis
                              ? 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(31,41,55,0.98))'
                              : selected
                                ? 'linear-gradient(135deg, rgba(124,58,237,0.16), rgba(6,182,212,0.10))'
                                : c.cardSoft,
                            color: method.emphasis ? '#FFFFFF' : c.text,
                            border: `1px solid ${selected ? 'rgba(124,58,237,0.4)' : c.border}`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-11 w-11 items-center justify-center rounded-full"
                              style={{
                                background: method.emphasis ? 'rgba(255,255,255,0.1)' : c.card,
                                color: method.emphasis ? '#FFFFFF' : c.text,
                              }}
                            >
                              {method.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{method.label}</p>
                              <p className="text-xs" style={{ color: method.emphasis ? 'rgba(255,255,255,0.72)' : c.textSec }}>
                                {method.description}
                              </p>
                            </div>
                          </div>
                          <div
                            className="h-5 w-5 rounded-full"
                            style={{
                              border: `1px solid ${selected ? c.accent : 'rgba(148, 163, 184, 0.5)'}`,
                              background: selected ? c.accent : 'transparent',
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium" style={{ color: c.textSec }}>Withdrawal amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={withdrawAmount}
                      onChange={event => setWithdrawAmount(event.target.value)}
                      className="w-full rounded-[1.35rem] px-4 py-3 text-lg font-semibold outline-none transition"
                      style={{ background: c.cardSoft, color: c.text, border: `1px solid ${c.border}` }}
                    />
                  </label>

                  <div className="rounded-[1.5rem] p-4" style={{ background: c.cardSoft, border: `1px solid ${c.border}` }}>
                    <div className="mb-3 flex items-center justify-between text-sm" style={{ color: c.textSec }}>
                      <span>Withdrawal amount</span>
                      <span className="font-semibold" style={{ color: c.text }}>{formatMoney(Number.isFinite(withdrawValue) ? withdrawValue : 0)}</span>
                    </div>
                    <div className="mb-3 flex items-center justify-between text-sm" style={{ color: c.textSec }}>
                      <span>1.5% fee</span>
                      <span className="font-semibold" style={{ color: c.text }}>-{formatMoney(withdrawFee)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed pt-3" style={{ borderColor: c.border }}>
                      <span className="text-sm font-medium" style={{ color: c.textSec }}>You receive</span>
                      <span className="text-xl font-bold tracking-[-0.03em]" style={{ color: c.text }}>
                        {formatMoney(withdrawNet > 0 ? withdrawNet : 0)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: c.mint }}>
                      Estimated instant arrival
                    </p>
                  </div>
                </div>
              )}

              {error && <p className="mt-4 text-sm font-medium text-red-400">{error}</p>}

              <button
                onClick={activeSheet === 'add' ? submitDeposit : submitWithdraw}
                className="mt-5 w-full rounded-[1.4rem] px-4 py-4 text-sm font-semibold text-white transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 14px 30px rgba(124, 58, 237, 0.28)' }}
              >
                {activeSheet === 'add' ? 'Confirm Add Money' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function formatTimestamp(timestamp: Date | string) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
