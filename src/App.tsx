/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './lib/AuthContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StudyPlanner from './pages/StudyPlanner';
import StudyHub from './pages/StudyHub';
import AINotes from './pages/AINotes';
import AIChat from './pages/AIChat';
import ResumeBuilder from './pages/ResumeBuilder';
import Portfolio from './pages/Portfolio';
import CareerRoadmap from './pages/CareerRoadmap';
import InterviewPractice from './pages/InterviewPractice';
import Jobs from './pages/Jobs';
import StudentTools from './pages/StudentTools';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Study & AI */}
            <Route path="/study-hub" element={<StudyHub />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="/ai-notes" element={<AINotes />} />
            <Route path="/ai-chat" element={<AIChat />} />
            
            {/* Career & Jobs */}
            <Route path="/career-roadmap" element={<CareerRoadmap />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/interview-practice" element={<InterviewPractice />} />
            <Route path="/jobs" element={<Jobs />} />
            
            {/* Utils */}
            <Route path="/tools" element={<StudentTools />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

