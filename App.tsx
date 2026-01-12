
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Museums from './pages/Museums';
import Accommodations from './pages/Accommodations';
import AccommodationDetail from './pages/AccommodationDetail';
import Dining from './pages/Dining';
import Merchants from './pages/Merchants';
import Walks from './pages/Walks';
import WalkDetail from './pages/WalkDetail';
import Contact from './pages/Contact';
import Experiences from './pages/Experiences';
import Agenda from './pages/Agenda';
import Blog from './pages/Blog';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import Crossage from './pages/Crossage';
import CrossageDetail from './pages/CrossageDetail';
import Bulletin from './pages/Bulletin';
import Team from './pages/Team';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { PageContentProvider } from './contexts/PageContentContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ContentProvider>
          <PageContentProvider>
            <Router>
              <ScrollToTop />
              <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/musees" element={<Museums />} />
                <Route path="/balades" element={<Walks />} />
                <Route path="/balades/:id" element={<WalkDetail />} />
                <Route path="/hebergements" element={<Accommodations />} />
                <Route path="/hebergements/:slug" element={<AccommodationDetail />} />
                <Route path="/hebergement" element={<Accommodations />} /> {/* Redirection pour compatibilité */}
                <Route path="/restaurants" element={<Dining />} />
                <Route path="/commercants" element={<Merchants />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/boutique" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/equipe" element={<Team />} />
                <Route path="/crossage" element={<Crossage />} />
                <Route path="/crossage/detail" element={<CrossageDetail />} />
                <Route path="/bulletin" element={<Bulletin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
          </Router>
        </PageContentProvider>
      </ContentProvider>
    </DataProvider>
    </AuthProvider>
  );
}

export default App;
