import { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle, signOut as logOut } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db } from './db';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let localUid = localStorage.getItem('studenthelp_local_uid');
    if (!localUid) {
      localUid = 'local_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('studenthelp_local_uid', localUid);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Ensure user is in db
        await db.user.set({
          id: currentUser.uid,
          name: currentUser.displayName || 'Student',
          email: currentUser.email || ''
        });
      } else {
        // Provide a mock user to bypass login
        const mockUser = {
          uid: localUid,
          displayName: 'Student',
          email: 'student@local.dev',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + localUid
        };
        setUser(mockUser);
        
        // Ensure mock user is in db too, bypassing the strict auth check on client side
        try {
          await db.user.set({
            id: mockUser.uid,
            name: mockUser.displayName,
            email: mockUser.email
          });
        } catch (e) {
          console.warn("Could not save mock user to DB (expected if rules restrict it):", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    await logOut();
    // After log out, they will immediately be given a mock user again due to onAuthStateChanged
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
