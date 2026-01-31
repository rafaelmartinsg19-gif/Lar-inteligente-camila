
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC<{ onLogin: (n: string) => void }> = ({ onLogin }) => {
  const [name, setName] = useState('');
  
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border-4 border-white flex flex-col items-center gap-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-16 h-16 bg-[#fff1f6] rounded-2xl flex items-center justify-center shadow-inner border border-white rotate-3">
          <span className="text-[#e85d97] font-black text-3xl">L</span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">Bem-vinda!</h1>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-tight opacity-70">Vamos organizar o seu lar?</p>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-black uppercase tracking-widest ml-2">Qual o seu nome?</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite aqui..."
              className="w-full bg-[#fdfaf6] border-2 border-white rounded-2xl py-5 px-6 text-xl font-black outline-none focus:border-[#e85d97] transition-all shadow-inner uppercase placeholder:opacity-20 text-center"
            />
          </div>

          <button 
            onClick={() => name.trim() && onLogin(name)}
            className="w-full bg-slate-950 text-white py-5 rounded-2xl text-xl font-black shadow-lg active:scale-95 transition-all border-b-4 border-black/40 uppercase"
          >
            Avançar
          </button>
        </div>

        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center leading-relaxed">
          Seus dados estão seguros <br /> e ficam salvos apenas com você.
        </p>
      </div>
    </div>
  );
};

export default Login;
