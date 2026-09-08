/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const StudyPlanner = React.lazy(() => import('./pages/StudyPlanner'));
const StudyHub = React.lazy(() => import('./pages/StudyHub'));
const NotesStudio = React.lazy(() => import('./pages/NotesStudio'));
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'));
const ResumeBuilder = React.lazy(() => import('./pages/ResumeBuilder'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const CareerRoadmap = React.lazy(() => import('./pages/CareerRoadmap'));
const InterviewPractice = React.lazy(() => import('./pages/InterviewPractice'));
const Jobs = React.lazy(() => import('./pages/Jobs'));
const StudentTools = React.lazy(() => import('./pages/StudentTools'));
const Resources = React.lazy(() => import('./pages/Resources'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const PublicPageTemplate = React.lazy(() => import('./pages/PublicPageTemplate'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));

const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPosts = React.lazy(() => import('./pages/admin/AdminPosts'));
const AdminPostEditor = React.lazy(() => import('./pages/admin/AdminPostEditor'));
const AdminAIBlog = React.lazy(() => import('./pages/admin/AdminAIBlog'));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories'));
const AdminTags = React.lazy(() => import('./pages/admin/AdminTags'));
const AdminMedia = React.lazy(() => import('./pages/admin/AdminMedia'));
const AdminAutomation = React.lazy(() => import('./pages/admin/AdminAutomation'));

const BlogList = React.lazy(() => import('./pages/blog/BlogList'));
const BlogDetail = React.lazy(() => import('./pages/blog/BlogDetail'));

// New Pages
import FeaturesPage from './pages/Features';
const AITools = React.lazy(() => import('./pages/AITools'));
const ResumeStudio = React.lazy(() => import('./pages/ResumeStudio'));
const CareerExplorer = React.lazy(() => import('./pages/CareerExplorer'));
const InterviewLab = React.lazy(() => import('./pages/InterviewLab'));

import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <FocusProvider>
            <BrowserRouter>
              <ScrollToTop />
                            <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
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
              </Suspense>
      </BrowserRouter>
      </FocusProvider>
    </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

