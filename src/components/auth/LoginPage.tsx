import React, { useState } from 'react';
import { Shield, Mail, Lock, ArrowRight, Loader2, Landmark, RefreshCw, CheckCircle, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; avatar: string }) => void;
}

type LoginStep = 'login' | 'signup' | 'forgot-password' | 'email-sent';

interface MockUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<LoginStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Mock Database
  const [users, setUsers] = useState<MockUser[]>([
    {
      name: 'Agnivesh',
      email: 'agnivesh2510@gmail.com',
      password: 'password',
      avatar: 'https://ui-avatars.com/api/?name=Agnivesh&background=0052D1&color=fff'
    }
  ]);

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const emailLower = email.toLowerCase().trim();
      const passwordTrimmed = password.trim();
      const existingUser = users.find(u => u.email.toLowerCase() === emailLower);
      const user = existingUser && existingUser.password.trim() === passwordTrimmed ? existingUser : null;
      
      if (user) {
        onLogin({
          name: user.name,
          email: user.email,
          avatar: user.avatar
        });
      } else if (existingUser) {
        setError('Incorrect identity key for this official email. Please try again.');
        setIsLoading(false);
      } else {
        // PERMISSIVE: Auto-register new users on login if they haven't registered yet
        const newUser: MockUser = {
          name: email.split('@')[0],
          email: emailLower,
          password: passwordTrimmed,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=0052D1&color=fff`
        };
        setUsers(prev => [...prev, newUser]);
        onLogin({
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar
        });
      }
    }, 1500);
  };

  const handleSimulatedSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const emailLower = signupEmail.toLowerCase().trim();
      const passwordTrimmed = signupPassword.trim();
      const existingUser = users.find(u => u.email.toLowerCase() === emailLower);

      if (existingUser) {
        // If they already exist, just update their password/name 
        // This effectively "bypasses" the error
        setUsers(prev => prev.map(u => 
          u.email.toLowerCase() === emailLower 
            ? { ...u, name: signupName, password: passwordTrimmed } 
            : u
        ));
      } else {
        const newUser: MockUser = {
          name: signupName,
          email: emailLower,
          password: passwordTrimmed,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupName)}&background=random`
        };
        setUsers(prev => [...prev, newUser]);
      }

      setIsLoading(false);
      
      // Move back to login
      setEmail(emailLower);
      setPassword(passwordTrimmed);
      setStep('login');
      setError('Registration successful! You can now access the portal.');
      
      // Clear signup fields
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStep('email-sent');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-primary p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-white/10 text-9xl">
            <Landmark className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Complaint to Action</h1>
            <p className="text-primary-fixed-dim text-sm mt-1 uppercase tracking-widest font-bold">Citizen Portal</p>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-primary">Secure Access</h2>
                  <p className="text-on-surface-variant text-sm">Please identify yourself to access the dashboard.</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
                      error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {error.includes('successful') ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSimulatedLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Official Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Identity Key</label>
                      <button 
                        type="button"
                        onClick={() => setStep('forgot-password')}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                      >
                        Forgot Identity Key?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-primary transition-colors focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying Identity...
                      </>
                    ) : (
                      <>
                        Access Portal
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => {
                        setStep('signup');
                        setError(null);
                      }}
                      className="text-sm font-bold text-primary flex items-center justify-center gap-2 mx-auto hover:underline"
                    >
                      <UserPlus className="w-4 h-4" />
                      New citizen? Create account
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-primary">Citizen Registration</h2>
                  <p className="text-on-surface-variant text-sm">Join the platform to report and track civic issues.</p>
                </div>

                {error && (
                  <div className="p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSimulatedSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Email</label>
                    <input 
                      type="email" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input 
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create a strong password"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary outline-none transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-primary transition-colors focus:outline-none"
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setStep('login');
                      setError(null);
                    }}
                    className="w-full py-2 text-outline font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    Already have an account? Login
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'forgot-password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-primary">Reset Access</h2>
                  <p className="text-on-surface-variant text-sm">Enter your official email to receive an identity key reset link.</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Official Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        Send Recovery Link
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setStep('login')}
                    className="w-full py-2 text-outline font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    Back to Secure Access
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'email-sent' && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">Check Your Email</h2>
                  <p className="text-on-surface-variant text-sm mt-2">
                    A secure recovery link has been sent to:<br/>
                    <span className="font-bold text-primary">{email}</span>
                  </p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg text-left">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>Note:</strong> Recovery links are valid for 24 hours. Contact your department lead if you encounter issues.
                  </p>
                </div>
                <button 
                  onClick={() => setStep('login')}
                  className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-surface-container transition-all"
                >
                  Return to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-outline-variant flex items-center justify-center gap-4 grayscale opacity-50">
            <div className="text-[10px] font-bold text-outline">SECURED BY MULTI-FACTOR</div>
            <div className="w-1 h-1 bg-outline rounded-full"></div>
            <div className="text-[10px] font-bold text-outline">ENCRYPTED PORTAL</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

