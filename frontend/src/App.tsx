import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Chat from './pages/Chat/Chat';
import Nav from './pages/Nav/Nav';
import Admin from './pages/admin/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes> {/* Wrap Route components in Routes */}
          
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Chat />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
