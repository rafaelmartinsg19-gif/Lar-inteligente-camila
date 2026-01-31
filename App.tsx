
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Market from './pages/Market';
import Finances from './pages/Finances';
import FoodCalc from './pages/FoodCalc';
import Utilities from './pages/Utilities';
import Maintenance from './pages/Maintenance';
import Manual from './pages/Manual';

const AppContent: React.FC = () => {
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('lar_inteligente_user') || '');
  const navigate = useNavigate();

  const handleLogin = (name: string) => {
    setUserName(name);
    localStorage.setItem('lar_inteligente_user', name);
    navigate('/home');
  };

  return (
    <div className="w-full h-full max-w-none mx-auto bg-[#FAFAF8] relative overflow-hidden flex flex-col h-[100vh]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home userName={userName} />} />
        <Route path="/recipes" element={<Recipes userName={userName} />} />
        <Route path="/market" element={<Market userName={userName} />} />
        <Route path="/finances" element={<Finances userName={userName} />} />
        <Route path="/food-calc" element={<FoodCalc userName={userName} />} />
        <Route path="/utilities" element={<Utilities userName={userName} />} />
        <Route path="/maintenance" element={<Maintenance userName={userName} />} />
        <Route path="/manual" element={<Manual userName={userName} />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
