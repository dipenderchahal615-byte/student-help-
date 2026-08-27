import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db as firestore, auth } from './firebase';
import { handleFirestoreError, OperationType } from './firestore-errors';

export interface User {
  id: string; // auth.uid
  name: string;
  email: string;
  xp?: number;
  level?: number;
  streak?: number;
  lastActive?: number;
}

export interface JobApplication {
  id: string;
  userId: string;
  role: string;
  company: string;
  location: string;
  status: 'Saved' | 'Applied' | 'Interview' | 'Selected' | 'Rejected';
  appliedDate?: number;
  notes?: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface PortfolioData {
  id: string;
  userId: string;
  slug: string;
  theme: 'light' | 'dark' | 'colorful';
  isPublic: boolean;
  resumeId: string; // link to resume data
  publishedUrl?: string;
  createdAt: number;
  updatedAt: number;
}


export interface StudyPlan {
  id: string;
  userId: string;
  course: string;
  subjects: string[];
  examDate: string;
  hoursPerDay: number;
  weakSubjects: string[];
  strongSubjects: string[];
  tasks: StudyTask[];
  createdAt: number;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  completed: boolean;
}

export interface SavedNote {
  id: string;
  userId: string;
  topic: string;
  type: string;
  content: string;
  createdAt: number;
}

export interface ResumeData {
  id: string;
  userId: string;
  personal: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
  };
  objective: string;
  education: Array<{ id: string; degree: string; institution: string; year: string; score: string }>;
  experience: Array<{ id: string; role: string; company: string; duration: string; description: string }>;
  projects: Array<{ id: string; title: string; description: string; link: string }>;
  skills: string[];
  certificates: Array<{ id: string; name: string; issuer: string; year: string }>;
  lastUpdated: number;
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  career: string;
  content: string;
  createdAt: number;
}

function ensureAuth() {
  if (!auth.currentUser) throw new Error("User not authenticated");
  return auth.currentUser.uid;
}

export const db = {
  user: {
    get: async (): Promise<User | null> => {
      const uid = auth.currentUser?.uid;
      if (!uid) return null;
      try {
        const d = await getDoc(doc(firestore, 'users', uid));
        if (d.exists()) return { id: d.id, ...d.data() } as User;
        return null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${uid}`);
        return null;
      }
    },
    set: async (user: User) => {
      const uid = ensureAuth();
      try {
        await setDoc(doc(firestore, 'users', uid), {
          email: user.email,
          name: user.name
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      }
    }
  },
  studyPlans: {
    getAll: async (): Promise<StudyPlan[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'studyPlans'), where('userId', '==', uid));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as StudyPlan));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'studyPlans');
        return [];
      }
    },
    save: async (plan: StudyPlan) => {
      const uid = ensureAuth();
      plan.userId = uid;
      try {
        await setDoc(doc(firestore, 'studyPlans', plan.id), plan);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `studyPlans/${plan.id}`);
      }
    },
    delete: async (id: string) => {
      ensureAuth();
      try {
        await deleteDoc(doc(firestore, 'studyPlans', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `studyPlans/${id}`);
      }
    }
  },
  notes: {
    getAll: async (): Promise<SavedNote[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'notes'), where('userId', '==', uid));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as SavedNote));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'notes');
        return [];
      }
    },
    save: async (note: SavedNote) => {
      const uid = ensureAuth();
      note.userId = uid;
      try {
        await setDoc(doc(firestore, 'notes', note.id), note);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `notes/${note.id}`);
      }
    },
    delete: async (id: string) => {
      ensureAuth();
      try {
        await deleteDoc(doc(firestore, 'notes', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
      }
    }
  },
  portfolios: {
    getAll: async (): Promise<PortfolioData[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'portfolios'), where('userId', '==', uid));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioData));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'portfolios');
        return [];
      }
    },
    save: async (portfolio: PortfolioData) => {
      const uid = ensureAuth();
      portfolio.userId = uid;
      try {
        await setDoc(doc(firestore, 'portfolios', portfolio.id), portfolio);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `portfolios/${portfolio.id}`);
      }
    }
  },
  resumes: {
    get: async (id: string): Promise<ResumeData | null> => {
      const uid = ensureAuth();
      try {
        const d = await getDoc(doc(firestore, 'resumes', id));
        if (d.exists() && d.data().userId === uid) return { id: d.id, ...d.data() } as ResumeData;
        return null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `resumes/${id}`);
        return null;
      }
    },
    getAll: async (): Promise<ResumeData[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'resumes'), where('userId', '==', uid));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as ResumeData));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'resumes');
        return [];
      }
    },
    save: async (resume: ResumeData) => {
      const uid = ensureAuth();
      resume.userId = uid;
      try {
        await setDoc(doc(firestore, 'resumes', resume.id), resume);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `resumes/${resume.id}`);
      }
    },
    delete: async (id: string) => {
      ensureAuth();
      try {
        await deleteDoc(doc(firestore, 'resumes', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `resumes/${id}`);
      }
    }
  },
  roadmaps: {
    getAll: async (): Promise<CareerRoadmap[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'roadmaps'), where('userId', '==', uid));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as CareerRoadmap));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'roadmaps');
        return [];
      }
    },
    save: async (rm: CareerRoadmap) => {
      const uid = ensureAuth();
      rm.userId = uid;
      try {
        await setDoc(doc(firestore, 'roadmaps', rm.id), rm);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `roadmaps/${rm.id}`);
      }
    },
    delete: async (id: string) => {
      ensureAuth();
      try {
        await deleteDoc(doc(firestore, 'roadmaps', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `roadmaps/${id}`);
      }
    }
  },
  applications: {
    getAll: async (): Promise<JobApplication[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'applications'), where('userId', '==', uid));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'applications');
        return [];
      }
    },
    save: async (app: JobApplication) => {
      const uid = ensureAuth();
      app.userId = uid;
      try {
        await setDoc(doc(firestore, 'applications', app.id), app);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `applications/${app.id}`);
      }
    },
    delete: async (id: string) => {
      ensureAuth();
      try {
        await deleteDoc(doc(firestore, 'applications', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `applications/${id}`);
      }
    }
  },
  chats: {
    getAll: async (): Promise<ChatMessage[]> => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'chats'), where('userId', '==', uid), orderBy('timestamp', 'asc'));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'chats');
        return [];
      }
    },
    save: async (chat: ChatMessage) => {
      const uid = ensureAuth();
      chat.userId = uid;
      try {
        await setDoc(doc(firestore, 'chats', chat.id), chat);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `chats/${chat.id}`);
      }
    },
    clearAll: async () => {
      const uid = ensureAuth();
      try {
        const q = query(collection(firestore, 'chats'), where('userId', '==', uid));
        const res = await getDocs(q);
        const deletePromises = res.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'chats');
      }
    }
  },
  gamification: {
    addXP: async (amount: number) => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      try {
        const userRef = doc(firestore, 'users', uid);
        const d = await getDoc(userRef);
        let currentXP = d.exists() && d.data().xp ? d.data().xp : 0;
        let currentLevel = d.exists() && d.data().level ? d.data().level : 1;
        
        const newXP = currentXP + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;

        await setDoc(userRef, {
          xp: newXP,
          level: newLevel
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      }
    }
  }
};
