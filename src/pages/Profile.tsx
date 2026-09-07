import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, User as DBUser } from '../lib/db';
import { User, Mail, Shield, Trophy, Flame, Star, LogOut, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const u = await db.user.get();
        setDbUser(u);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <Shield size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Not Signed In</h2>
        <p className="text-slate-500">Please sign in to view your profile and stats.</p>
      </div>
    );
  }

  const xp = dbUser?.xp || 0;
  const level = dbUser?.level || 1;
  const streak = dbUser?.streak || 0;
  const nextLevelXP = level * 1000;
  const progressToNextLevel = Math.round((xp / nextLevelXP) * 100);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and view your progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm md:col-span-1 flex flex-col items-center text-center">
          <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={48} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.displayName || 'Student'}</h2>
          <p className="text-sm text-slate-500 flex items-center gap-2 mb-2 font-medium">
            <Mail size={16} /> {user.email}
          </p>
          
          <div className="w-full h-px bg-slate-100 my-8"></div>
          
          <button 
            onClick={handleSignOut}
            className="w-full py-3.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Gamification Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-8 text-xl flex items-center gap-2">
              <Trophy className="text-blue-600"/> Level & Experience
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-28 h-28 rounded-full border-8 border-blue-50 flex items-center justify-center relative shadow-sm">
                <div className="absolute inset-[-4px] rounded-full border-[8px] border-blue-500 border-t-transparent" style={{ transform: `rotate(${progressToNextLevel * 3.6}deg)` }}></div>
                <div className="text-center z-10">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level</span>
                  <span className="block text-3xl font-black text-slate-900 leading-none mt-1">{level}</span>
                </div>
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <p className="font-bold text-slate-800 mb-3 text-lg">{xp} <span className="text-slate-400">/ {nextLevelXP} XP</span></p>
                <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner">
                  <div className="bg-blue-600 h-4 rounded-full transition-all duration-1000" style={{ width: `${progressToNextLevel}%` }}></div>
                </div>
                <p className="text-sm text-slate-500 mt-4 font-medium">Earn <span className="text-blue-600 font-bold">{nextLevelXP - xp} more XP</span> to reach level {level + 1}!</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className="bg-white p-3.5 rounded-xl shadow-sm text-orange-500"><Flame size={24}/></div>
                <div>
                  <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">Day Streak</p>
                  <p className="text-2xl font-black text-orange-900 leading-none">{streak}</p>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className="bg-white p-3.5 rounded-xl shadow-sm text-purple-500"><Star size={24}/></div>
                <div>
                  <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-1">Total XP</p>
                  <p className="text-2xl font-black text-purple-900 leading-none">{xp}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Account Settings</h3>
            <p className="text-slate-500 text-sm mb-6">More settings coming soon to customize your learning experience.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-800 text-sm">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive reminders for study plans.</p>
                </div>
                <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-not-allowed opacity-50">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-800 text-sm">Dark Mode</p>
                  <p className="text-xs text-slate-500">Toggle dark appearance.</p>
                </div>
                <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-not-allowed opacity-50">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
