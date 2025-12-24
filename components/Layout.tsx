
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(AppTab.DASHBOARD)}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">HealthBridge <span className="text-indigo-600">SA</span></span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: AppTab.DASHBOARD, label: 'Dashboard' },
                { id: AppTab.TRIAGE, label: 'Symptom Check' },
                { id: AppTab.TELEMEDICINE, label: 'Telehealth' },
                { id: AppTab.PHARMACY, label: 'Pharmacy' },
                { id: AppTab.FITNESS, label: 'Coach' },
                { id: AppTab.PROFILE, label: 'Account' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <button onClick={() => setActiveTab(AppTab.PROFILE)} className="focus:outline-none">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=sizwe`} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </main>

      <nav className="md:hidden bg-white border-t sticky bottom-0 z-50">
        <div className="flex justify-around items-center h-20 px-2">
          {[
            { id: AppTab.DASHBOARD, label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: AppTab.TRIAGE, label: 'Check', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
            { id: AppTab.TELEMEDICINE, label: 'Doc', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: AppTab.PHARMACY, label: 'Store', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
            { id: AppTab.PROFILE, label: 'You', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
