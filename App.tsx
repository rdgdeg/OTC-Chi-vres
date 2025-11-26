
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Museums from './pages/Museums';
import Accommodation from './pages/Accommodation';
import Dining from './pages/Dining';
import Merchants from './pages/Merchants';
import Walks from './pages/Walks';
import Contact from './pages/Contact';
import Experiences from './pages/Experiences';
import Agenda from './pages/Agenda';
import Blog from './pages/Blog';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import Crossage from './pages/Crossage';
import Bulletin from './pages/Bulletin';
import Team from './pages/Team';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/musees" element={<Museums />} />
            <Route path="/balades" element={<Walks />} />
            <Route path="/hebergement" element={<Accommodation />} />
            <Route path="/restaurants" element={<Dining />} />
            <Route path="/commercants" element={<Merchants />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/crossage" element={<Crossage />} />
            <Route path="/bulletin" element={<Bulletin />} />
            <Route path="/admin" element={<Admin />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
