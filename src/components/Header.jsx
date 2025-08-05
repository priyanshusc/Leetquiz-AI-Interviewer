import React from 'react';

const Header = () => {
  return (
    <header className="py-4 px-8 text-center bg-slate-900/50 border-b border-cyan-500/20 shadow-lg">
      <h1 className="text-5xl font-bold text-white tracking-wider">
        Leet<span className="text-cyan-400">quiz</span>
      </h1>
      <p className="text-xl text-slate-400 mt-2">
        AI Coding Interview Platform
      </p>
    </header>
  );
};

export default Header;