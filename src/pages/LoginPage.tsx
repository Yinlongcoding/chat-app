import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { dispatch, state } = useApp();
  const { theme } = state;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      return;
    }
    const user = MOCK_USERS[0];
    const userToSave = {
      ...user,
      username: username.trim(),
      displayName: displayName.trim() || username.trim(),
    };
    dispatch({ type: 'SET_USER', payload: userToSave });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim() || !displayName.trim()) {
      setError('请填写所有字段');
      return;
    }
    const user = MOCK_USERS[0];
    const userToSave = {
      ...user,
      username: username.trim(),
      displayName: displayName.trim(),
    };
    dispatch({ type: 'SET_USER', payload: userToSave });
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden"
      style={{ backgroundColor: '#0D0B14' }}
    >
      {/* Aurora background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 animate-aurora-float"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
            top: '-10%', left: '-5%',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 animate-aurora-float-delayed"
          style={{
            background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
            bottom: '-10%', right: '-5%',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-20 animate-aurora-pulse"
          style={{
            background: 'radial-gradient(circle, #34D399 0%, transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(100px)',
          }}
        />

      </div>

      {/* Login Card — Glassmorphism */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-3xl animate-fade-in-up"
        style={{
          background: 'rgba(20, 17, 35, 0.65)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          boxShadow: '0 0 40px rgba(124, 58, 237, 0.15), 0 25px 50px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
            }}
          >
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold aurora-gradient-text mb-1">TeleChat</h1>
          <p className="text-sm" style={{ color: '#8B83A0' }}>
            {isLogin ? '欢迎回来' : '创建你的账号'}
          </p>
        </div>

        {/* Tab Switch */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: 'rgba(124, 58, 237, 0.1)' }}
        >
          <button
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: isLogin ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
              color: isLogin ? '#FFFFFF' : '#8B83A0',
              boxShadow: isLogin ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none',
            }}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            登录
          </button>
          <button
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: !isLogin ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
              color: !isLogin ? '#FFFFFF' : '#8B83A0',
              boxShadow: !isLogin ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none',
            }}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            注册
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B83A0' }}>显示名称</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="您的姓名"
                className="w-full rounded-xl px-4 py-3 outline-none text-sm transition-all duration-200"
                style={{
                  background: 'rgba(25, 22, 40, 0.6)',
                  border: '1px solid rgba(124, 58, 237, 0.12)',
                  color: '#E8E4F0',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.12)'}
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B83A0' }}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="输入用户名"
              className="w-full rounded-xl px-4 py-3 outline-none text-sm transition-all duration-200"
              style={{
                background: 'rgba(25, 22, 40, 0.6)',
                border: '1px solid rgba(124, 58, 237, 0.12)',
                color: '#E8E4F0',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.12)'}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B83A0' }}>密码</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full rounded-xl px-4 py-3 outline-none text-sm transition-all duration-200 pr-10"
                style={{
                  background: 'rgba(25, 22, 40, 0.6)',
                  border: '1px solid rgba(124, 58, 237, 0.12)',
                  color: '#E8E4F0',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.12)'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                style={{ color: '#5C5670' }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-center text-red-400 animate-fade-in">{error}</p>
          )}
          <button
            type="submit"
            className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 mt-2"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)',
            }}
          >
            {isLogin ? '登 录' : '创建账号'}
          </button>
        </form>

        {isLogin && (
          <p className="text-center text-xs mt-4" style={{ color: '#5C5670' }}>
            演示版：输入任意用户名密码即可登录
          </p>
        )}
      </div>
    </div>
  );
};
