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
  Languages,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  KeyRound,
  RefreshCw,
  Zap,
  ShieldAlert
} from 'lucide-react';

type AppState = 'LOGIN' | 'SUCCESS' | 'RESET_PWD';
type Lang = 'zh' | 'en';
type Scenario = 'normal' | 'v1_reuse' | 'v2_leakage' | 'v3_manipulation' | 'v4_brute' | 'v5_bypass';

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
    verifying: '验证中',
    sidebarTitle: '漏洞场景',
    scenarios: {
      normal: '正常模式',
      v1_reuse: '验证码套用',
      v2_leakage: '客户端回显',
      v3_manipulation: '状态值篡改',
      v4_brute: '验证码爆破',
      v5_bypass: '流程绕过'
    },
    resetTitle: '重置密码',
    newPwdLabel: '新密码',
    resetBtn: '重置密码',
    resetSuccess: '密码重置成功！'
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
    verifying: 'Verifying',
    sidebarTitle: 'Vulnerabilities',
    scenarios: {
      normal: 'Normal Mode',
      v1_reuse: 'OTP Reuse',
      v2_leakage: 'Client Leakage',
      v3_manipulation: 'Status Manipulation',
      v4_brute: 'Brute Force',
      v5_bypass: 'Process Bypass'
    },
    resetTitle: 'Reset Password',
    newPwdLabel: 'New Password',
    resetBtn: 'Reset Password',
    resetSuccess: 'Password reset successful!'
  }
};

const scenarioIcons = {
  normal: <ShieldCheck className="w-4 h-4" />,
  v1_reuse: <RefreshCw className="w-4 h-4" />,
  v2_leakage: <Eye className="w-4 h-4" />,
  v3_manipulation: <Zap className="w-4 h-4" />,
  v4_brute: <ShieldAlert className="w-4 h-4" />,
  v5_bypass: <AlertTriangle className="w-4 h-4" />
};

const countryCodes = [
  { code: '+86', label: 'CN' },
  { code: '+1', label: 'US' },
  { code: '+44', label: 'UK' },
  { code: '+81', label: 'JP' },
  { code: '+82', label: 'KR' },
  { code: '+49', label: 'DE' },
  { code: '+33', label: 'FR' },
  { code: '+7', label: 'RU' },
  { code: '+91', label: 'IN' },
  { code: '+852', label: 'HK' },
  { code: '+886', label: 'TW' },
];

const scenarios: Scenario[] = ['normal', 'v1_reuse', 'v2_leakage', 'v3_manipulation', 'v4_brute', 'v5_bypass'];

const CountryCodeSelector = ({
  countryCode,
  setCountryCode,
  showDropdown,
  setShowDropdown,
  colorScheme = 'emerald'
}: {
  countryCode: string;
  setCountryCode: (c: string) => void;
  showDropdown: boolean;
  setShowDropdown: (s: boolean) => void;
  colorScheme?: 'emerald' | 'blue';
}) => {
  const focusClasses = colorScheme === 'blue' 
    ? 'focus:ring-blue-500/20 focus:border-blue-500' 
    : 'focus:ring-emerald-500/20 focus:border-emerald-500';

  return (
    <div className="relative w-28 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <input
          type="text"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value.startsWith('+') ? e.target.value : '+' + e.target.value.replace(/\D/g, ''))}
          onFocus={() => setShowDropdown(true)}
          className={`w-full pl-3 pr-8 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm font-medium ${focusClasses}`}
        />
        <button 
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${showDropdown ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      </div>
      
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-48 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto"
          >
            {countryCodes.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCountryCode(c.code);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
              >
                <span className="font-medium text-zinc-900">{c.label}</span>
                <span className="text-zinc-400">{c.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>('LOGIN');
  const [lang, setLang] = useState<Lang>('zh');
  const [scenario, setScenario] = useState<Scenario>(() => scenarios[Math.floor(Math.random() * scenarios.length)]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [countryCode, setCountryCode] = useState('+86');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const t = translations[lang];

  const fullPhone = `${countryCode}${phone}`;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowCountryDropdown(false);
    if (showCountryDropdown) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showCountryDropdown]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 5) {
      setError(t.errorPhone);
      return;
    }
    setError('');
    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, scenario }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setGeneratedOtp('PENDING');
        setCountdown(60);
        // Scenario 2: Leakage - the code is in the response!
        if (scenario === 'v2_leakage' && data.debug_code) {
          console.log("%c[VULNERABILITY] OTP Leaked in Response: " + data.debug_code, "color: red; font-weight: bold; font-size: 14px;");
        }
      } else {
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
        body: JSON.stringify({ phone: fullPhone, otp, scenario }),
      });

      const data = await response.json();

      // Scenario 3: Manipulation
      // In this scenario, the client might check a specific field
      if (scenario === 'v3_manipulation') {
        if (data.status === "success" || (data.data && data.data.verified)) {
          setState('SUCCESS');
        } else {
          setError(t.errorVerify);
        }
      } else if (response.ok) {
        setState('SUCCESS');
      } else {
        setError(data.error || t.errorVerify);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, newPassword, scenario }),
      });
      if (response.ok) {
        alert(t.resetSuccess);
        setState('SUCCESS');
      } else {
        const data = await response.json();
        setError(data.error || 'Reset failed');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (generatedOtp === 'PENDING' || (generatedOtp && showHint)) {
      const fetchHint = async () => {
        try {
          const res = await fetch(`/api/otp-hint?phone=${encodeURIComponent(fullPhone)}&scenario=${scenario}`);
          const data = await res.json();
          if (data.code) setGeneratedOtp(data.code);
        } catch (e) {
          console.error("Hint fetch failed");
        }
      };
      const timer = setTimeout(fetchHint, 500);
      return () => clearTimeout(timer);
    }
  }, [fullPhone, generatedOtp, showHint, scenario]);

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
    <div className="min-h-screen flex bg-zinc-50 font-sans text-zinc-900 antialiased overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={sidebarOpen ? { width: 280, opacity: 1 } : { width: 0, opacity: 0 }}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="h-screen bg-white border-r border-zinc-200 flex-shrink-0 z-40 overflow-hidden relative"
      >
        <div className="p-6 w-[280px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t.sidebarTitle}</h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {(Object.keys(translations.zh.scenarios) as Scenario[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setScenario(s);
                  reset();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  scenario === s 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <span className={scenario === s ? 'text-emerald-600' : 'text-zinc-400'}>
                  {scenarioIcons[s]}
                </span>
                {t.scenarios[s]}
                {scenario === s && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="mt-12 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-400 uppercase mb-2">Scenario Info</h3>
            <p className="text-[11px] leading-relaxed text-zinc-500 italic">
              {scenario === 'v5_bypass' ? 'Try accessing the Reset Password page directly or skipping verification.' : 'Test how the OTP behaves under different conditions.'}
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-y-auto">
        {/* Sidebar Toggle Button (Visible when sidebar is closed) */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => setSidebarOpen(true)}
              className="fixed top-6 left-6 z-50 p-3 bg-white shadow-xl border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all flex items-center gap-2"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider pr-1">{t.sidebarTitle}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
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
              <div className="bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-8 md:p-10 relative overflow-hidden">
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
                  
                  {/* Scenario Badge */}
                  <div className="mt-4 px-3 py-1 bg-zinc-100 rounded-full flex items-center gap-2">
                    <span className="text-zinc-400">{scenarioIcons[scenario]}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.scenarios[scenario]}</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 ml-1">{t.phoneLabel}</label>
                    <div className="flex gap-2">
                      <CountryCodeSelector 
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
                        showDropdown={showCountryDropdown}
                        setShowDropdown={setShowCountryDropdown}
                        colorScheme="emerald"
                      />
                      <div className="relative flex-1">
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

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isVerifying || !phone || (!generatedOtp && scenario !== 'v4_brute')}
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : t.loginBtn}
                    </button>

                    {/* Scenario 5: Link to Reset Password */}
                    {scenario === 'v5_bypass' && (
                      <button
                        type="button"
                        onClick={() => setState('RESET_PWD')}
                        className="text-sm text-zinc-400 hover:text-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        {t.resetTitle} (Bypass Target)
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          ) : state === 'RESET_PWD' ? (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md relative"
            >
              <button
                onClick={() => setState('LOGIN')}
                className="absolute -top-16 left-0 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium group"
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                {t.backBtn}
              </button>

              <div className="bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-8 md:p-10">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <KeyRound className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-zinc-900">{t.resetTitle}</h1>
                  <p className="text-zinc-500 mt-2 text-center">Enter your phone and new password</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 ml-1">{t.phoneLabel}</label>
                    <div className="flex gap-2">
                      <CountryCodeSelector 
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
                        showDropdown={showCountryDropdown}
                        setShowDropdown={setShowCountryDropdown}
                        colorScheme="blue"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 ml-1">{t.newPwdLabel}</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:bg-zinc-200 transition-all"
                  >
                    {isVerifying ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.resetBtn}
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
              <button
                onClick={reset}
                className="absolute -top-16 left-0 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium group"
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                {t.backBtn}
              </button>

              <div className="bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-12 text-center">
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
          <div className="fixed bottom-8 right-8 flex items-end gap-3 z-30">
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
        <footer className="fixed bottom-6 right-6 text-zinc-400 text-xs font-medium">
          UnderSec Lab &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
