import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Chat from './pages/Chat/Chat';
import Nav from './pages/Nav/Nav';
import Admin from './pages/admin/Admin';
import IndexPage from "./pages/IndexPage"

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes> {/* Wrap Route components in Routes */}
          
          <Route path="/chat" element={<Chat />} />
          <Route path="/adminX" element={<Admin />} />
          <Route path="/" element={<IndexPage />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
