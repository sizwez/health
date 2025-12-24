
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Telemedicine from './components/Telemedicine';
import Pharmacy from './components/Pharmacy';
import FitnessCoach from './components/FitnessCoach';
import Profile from './components/Profile';
import SymptomChecker from './components/SymptomChecker';
import { AppTab, UserProfile, HealthReading } from './types';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  province: 'Gauteng',
  onboarded: false,
  subscription: 'Free'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hb_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [readings, setReadings] = useState<HealthReading[]>(() => {
    const saved = localStorage.getItem('hb_readings');
    return saved ? JSON.parse(saved) : [];
  });

  const [scriptUploaded, setScriptUploaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('hb_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hb_readings', JSON.stringify(readings));
  }, [readings]);

  const addReading = (reading: HealthReading) => {
    setReadings(prev => [reading, ...prev].slice(0, 50)); // Keep last 50
  };

  if (!profile.onboarded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HealthBridge SA</h1>
            <p className="text-slate-500 text-sm">Your all-in-one South African health portal.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">What should we call you?</label>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Where are you located?</label>
              <select 
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none bg-white"
                value={profile.province}
                onChange={(e) => setProfile({...profile, province: e.target.value})}
              >
                {['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            disabled={!profile.name.trim()}
            onClick={() => setProfile({...profile, onboarded: true})}
            className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard profile={profile} readings={readings} addReading={addReading} />;
      case AppTab.TRIAGE:
        return <SymptomChecker profile={profile} />;
      case AppTab.TELEMEDICINE:
        return <Telemedicine />;
      case AppTab.PHARMACY:
        return <Pharmacy scriptUploaded={scriptUploaded} setScriptUploaded={setScriptUploaded} />;
      case AppTab.FITNESS:
        return <FitnessCoach profile={profile} />;
      case AppTab.PROFILE:
        return <Profile profile={profile} setProfile={setProfile} />;
      default:
        return <Dashboard profile={profile} readings={readings} addReading={addReading} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      
      {/* Floating Emergency Button */}
      <button 
        onClick={() => {
          if(confirm("Dialing Emergency Services (112)? This will also alert your emergency contacts.")) {
            window.location.href = "tel:112";
          }
        }}
        className="fixed bottom-24 left-6 md:bottom-8 z-40 bg-red-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-red-700 hover:scale-105 transition-all group active:scale-95"
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="hidden md:inline font-bold text-sm uppercase tracking-widest">Emergency</span>
        </div>
      </button>
    </Layout>
  );
};

export default App;
