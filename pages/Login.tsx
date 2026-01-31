
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC<{ onLogin: (n: string) => void }> = ({ onLogin }) => {
  const [name, setName] = useState('');
  
  return (
    <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white flex flex-col items-center gap-10">
        <div className="w-20 h-20 bg-[#e85d97]/10 rounded-3xl flex items-center justify-center text-4xl">
          <span className="text-[#e85d97] font-black">L</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Bem-vinda!</h1>
          <p className="text-lg text-slate-400 font-medium">Vamos organizar o seu lar?</p>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-black text-slate-900 ml-2">Qual o seu nome?</p>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite aqui..."
              className="w-full bg-slate-100 border-none rounded-3xl py-6 px-8 text-xl font-black outline-none focus:ring-4 focus:ring-[#e85d97]/10 transition-all"
            />
          </div>

          <button 
            onClick={() => name.trim() && onLogin(name)}
            className="w-full bg-slate-900 text-white py-6 rounded-3xl text-xl font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95"
          >
            Avançar
          </button>
        </div>

        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mt-4">
          Seus dados estão seguros <br /> e ficam salvos apenas com você.
        </p>
      </div>
    </div>
  );
};

export default Login;
