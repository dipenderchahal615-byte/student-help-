import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit, DocumentData } from 'firebase/firestore';
import { db as firestore } from './firebase';
import { handleFirestoreError, OperationType } from './firestore-errors';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  isAIGenerated: boolean;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
  scheduledAt?: number;
  readingTime: number;
  serverSecret?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface BlogTag {
  id: string;
  name: string;
  count: number;
}

export interface AutomationSettings {
  id: string;
  enabled: boolean;
  scheduleTime: string; // "07:00 PM"
  timezone: string; // "Asia/Kolkata"
  autoPublish: boolean;
  defaultLanguage: string;
  defaultCategory: string;
  defaultTone: string;
  defaultLength: string;
  targetAudience: string;
  topicPreferences: string;
  primaryTopics: string;
  excludeTopics: string;
}

export interface AutomationRun {
  id: string;
  runDate: string; // YYYY-MM-DD
  scheduledTime: string;
  startedAt: number;
  completedAt?: number;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'RUNNING';
  generatedPostId?: string;
  errorMessage?: string;
  retryCount: number;
}

export const blogDb = {
  blogs: {
    getAll: async (status?: string): Promise<BlogPost[]> => {
      try {
        let q = query(collection(firestore, 'blogs'), orderBy('createdAt', 'desc'));
        if (status) {
          q = query(collection(firestore, 'blogs'), where('status', '==', status), orderBy('createdAt', 'desc'));
        }
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    getBySlug: async (slug: string): Promise<BlogPost | null> => {
      try {
        const q = query(collection(firestore, 'blogs'), where('slug', '==', slug), limit(1));
        const res = await getDocs(q);
        if (res.empty) return null;
        return { id: res.docs[0].id, ...res.docs[0].data() } as BlogPost;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    save: async (blog: BlogPost) => {
      try {
        await setDoc(doc(firestore, 'blogs', blog.id), blog);
      } catch (error) {
        console.error(error);
      }
    },
    delete: async (id: string) => {
      try {
        await deleteDoc(doc(firestore, 'blogs', id));
      } catch (error) {
        console.error(error);
      }
    }
  },
  categories: {
    getAll: async (): Promise<BlogCategory[]> => {
      try {
        const res = await getDocs(collection(firestore, 'categories'));
        return res.docs.map(d => ({ id: d.id, ...d.data() } as BlogCategory));
      } catch (error) { return []; }
    },
    save: async (cat: BlogCategory) => {
      try { await setDoc(doc(firestore, 'categories', cat.id), cat); } catch (e) {}
    },
    delete: async (id: string) => {
      try { await deleteDoc(doc(firestore, 'categories', id)); } catch (e) {}
    }
  },
  tags: {
    getAll: async (): Promise<BlogTag[]> => {
      try {
        const res = await getDocs(collection(firestore, 'tags'));
        return res.docs.map(d => ({ id: d.id, ...d.data() } as BlogTag));
      } catch (error) { return []; }
    },
    save: async (tag: BlogTag) => {
      try { await setDoc(doc(firestore, 'tags', tag.id), tag); } catch (e) {}
    },
    delete: async (id: string) => {
      try { await deleteDoc(doc(firestore, 'tags', id)); } catch (e) {}
    }
  },
  settings: {
    get: async (): Promise<AutomationSettings | null> => {
      try {
        const d = await getDoc(doc(firestore, 'automationSettings', 'main'));
        if (d.exists()) return { id: 'main', ...d.data() } as AutomationSettings;
        return null;
      } catch (e) { return null; }
    },
    save: async (settings: AutomationSettings) => {
      try {
        await setDoc(doc(firestore, 'automationSettings', 'main'), settings);
      } catch (e) {}
    }
  },
  automationRuns: {
    getAll: async (): Promise<AutomationRun[]> => {
      try {
        const q = query(collection(firestore, 'automationRuns'), orderBy('startedAt', 'desc'));
        const res = await getDocs(q);
        return res.docs.map(d => ({ id: d.id, ...d.data() } as AutomationRun));
      } catch (error) { return []; }
    }
  }
};
