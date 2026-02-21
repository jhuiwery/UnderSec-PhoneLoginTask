/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2,
  Lock,
  Languages
} from 'lucide-react';

type AppState = 'LOGIN' | 'SUCCESS';
type Lang = 'zh' | 'en';

const translations = {
  zh: {
    title: '登录',
    subtitle: '请输入您的手机号以继续',
    phoneLabel: '手机号码',
    phonePlaceholder: '输入手机号',
    otpLabel: '验证码',
    otpPlaceholder: '4位验证码',
    getOtp: '获取验证码',
    loginBtn: '立即登录',
    backBtn: '返回登录',
    successTitle: '登录成功',
    successSubtitle: '欢迎回来，您的身份已通过验证。',
    footerNote: '这是一个用于网络安全教学的模拟环境',
    hintLabel: '模拟验证码',
    errorPhone: '请输入有效的手机号',
    errorOtp: '请输入验证码',
    errorVerify: '验证码错误，请重试',
    sending: '发送中',
    verifying: '验证中'
  },
  en: {
    title: 'Login',
    subtitle: 'Please enter your phone number to continue',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    otpLabel: 'Verification Code',
    otpPlaceholder: '4-digit code',
    getOtp: 'Get Code',
    loginBtn: 'Login Now',
    backBtn: 'Back to Login',
    successTitle: 'Login Successful',
    successSubtitle: 'Welcome back, your identity has been verified.',
    footerNote: 'This is a simulation environment for cybersecurity education',
    hintLabel: 'Mock OTP',
    errorPhone: 'Please enter a valid phone number',
    errorOtp: 'Please enter verification code',
    errorVerify: 'Invalid code, please try again',
    sending: 'Sending',
    verifying: 'Verifying'
  }
};

export default function App() {
  const [state, setState] = useState<AppState>('LOGIN');
  const [lang, setLang] = useState<Lang>('zh');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const t = translations[lang];

  // Handle countdown for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError(t.errorPhone);
      return;
    }
    setError('');
    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      if (response.ok) {
        // Trigger hint update
        setGeneratedOtp('PENDING'); // Just to trigger the hint UI
        setCountdown(60);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsSending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError(t.errorOtp);
      return;
    }
    
    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      if (response.ok) {
        setState('SUCCESS');
      } else {
        const data = await response.json();
        setError(data.error || t.errorVerify);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Poll for hint from server
  useEffect(() => {
    if (generatedOtp === 'PENDING' || (generatedOtp && showHint)) {
      const fetchHint = async () => {
        try {
          const res = await fetch(`/api/otp-hint?phone=${phone}`);
          const data = await res.json();
          if (data.code) setGeneratedOtp(data.code);
        } catch (e) {
          console.error("Hint fetch failed");
        }
      };
      const timer = setTimeout(fetchHint, 500);
      return () => clearTimeout(timer);
    }
  }, [phone, generatedOtp, showHint]);

  const reset = () => {
    setState('LOGIN');
    setPhone('');
    setOtp('');
    setGeneratedOtp('');
    setCountdown(0);
    setError('');
  };

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <AnimatePresence mode="wait">
        {state === 'LOGIN' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md relative"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-8 md:p-10 relative overflow-hidden">
              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                <Languages className="w-4 h-4" />
                {lang === 'zh' ? 'EN' : '中文'}
              </button>

              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900">{t.title}</h1>
                <p className="text-zinc-500 mt-2 text-center">{t.subtitle}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 ml-1">{t.phoneLabel}</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 ml-1">{t.otpLabel}</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input
                        type="text"
                        maxLength={4}
                        placeholder={t.otpPlaceholder}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isSending || countdown > 0}
                      onClick={handleSendOtp}
                      className="px-4 py-3.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500 transition-colors min-w-[100px]"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : countdown > 0 ? (
                        `${countdown}s`
                      ) : (
                        t.getOtp
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm font-medium ml-1"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || !generatedOtp}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : t.loginBtn}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md relative"
          >
            {/* Back Button in top-left */}
            <button
              onClick={reset}
              className="absolute -top-16 left-0 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              {t.backBtn}
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-12 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900">{t.successTitle}</h2>
              <p className="text-zinc-500 mt-4 text-lg">
                {t.successSubtitle}
              </p>
              <div className="mt-10 pt-10 border-t border-zinc-100">
                <p className="text-sm text-zinc-400">
                  {t.footerNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Hint Tooltip in bottom-right */}
      {generatedOtp && state === 'LOGIN' && (
        <div className="fixed bottom-8 right-8 flex items-end gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-zinc-800"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{t.hintLabel}</span>
              <span className="font-mono text-lg tracking-widest font-bold">
                {showHint ? generatedOtp : '••••'}
              </span>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title={showHint ? "隐藏" : "显示"}
            >
              {showHint ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 text-zinc-400 text-xs font-medium">
        UnderSec Lab &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
