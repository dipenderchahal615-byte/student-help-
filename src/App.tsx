/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider } from './lib/AuthContext';
import { FocusProvider } from './lib/FocusContext';
import { ThemeProvider } from './lib/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StudyPlanner from './pages/StudyPlanner';
import StudyHub from './pages/StudyHub';
import NotesStudio from './pages/NotesStudio';
import AIAssistant from './pages/AIAssistant';
import ResumeBuilder from './pages/ResumeBuilder';
import Portfolio from './pages/Portfolio';
import CareerRoadmap from './pages/CareerRoadmap';
import InterviewPractice from './pages/InterviewPractice';
import Jobs from './pages/Jobs';
import StudentTools from './pages/StudentTools';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PublicPageTemplate from './pages/PublicPageTemplate';
import LegalPage from './pages/LegalPage';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPosts from './pages/admin/AdminPosts';
import AdminPostEditor from './pages/admin/AdminPostEditor';
import AdminAIBlog from './pages/admin/AdminAIBlog';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTags from './pages/admin/AdminTags';
import AdminMedia from './pages/admin/AdminMedia';
import AdminAutomation from './pages/admin/AdminAutomation';

import BlogList from './pages/blog/BlogList';
import BlogDetail from './pages/blog/BlogDetail';

// New Pages
import FeaturesPage from './pages/Features';
import AITools from './pages/AITools';
import ResumeStudio from './pages/ResumeStudio';
import CareerExplorer from './pages/CareerExplorer';
import InterviewLab from './pages/InterviewLab';

import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <FocusProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
            {/* Public Routes with Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<PublicPageTemplate title="About Us" />} />
            <Route path="/contact" element={<PublicPageTemplate title="Contact" />} />
            <Route path="/privacy" element={<LegalPage title="Privacy Policy" lastUpdated="January 1, 2026" sections={[{ title: "Data Collection", content: ["We collect information..."] }]} />} />
            <Route path="/terms" element={<LegalPage title="Terms of Service" lastUpdated="January 1, 2026" sections={[{ title: "Usage", content: ["By using this site..."] }]} />} />
            <Route path="/disclaimer" element={<LegalPage title="Disclaimer" lastUpdated="January 1, 2026" sections={[{ title: "General Information", content: ["Educational content is for general informational purposes..."] }]} />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
          </Route>

          {/* Standalone Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Study & AI */}
              <Route path="/study" element={<StudyHub />} />
              <Route path="/study-planner" element={<StudyPlanner />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/notes" element={<NotesStudio />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              
              {/* Career & Jobs */}
              <Route path="/career" element={<CareerExplorer />} />
              <Route path="/career-roadmap" element={<CareerRoadmap />} />
              <Route path="/resume" element={<ResumeStudio />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/portfolio-builder" element={<Portfolio />} />
              <Route path="/interview" element={<InterviewLab />} />
              <Route path="/interview-practice" element={<InterviewPractice />} />
              <Route path="/jobs" element={<Jobs />} />
              
              {/* Utils */}
              <Route path="/student-tools" element={<StudentTools />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/new" element={<AdminPostEditor />} />
              <Route path="posts/:id/edit" element={<AdminPostEditor />} />
              <Route path="ai-blog" element={<AdminAIBlog />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="tags" element={<AdminTags />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="automation" element={<AdminAutomation />} />
            </Route>
          </Route>

          <Route path="*" element={<PublicPageTemplate title="Page Not Found" />} />
        </Routes>
      </BrowserRouter>
      </FocusProvider>
    </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

