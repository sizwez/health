
import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Profile</h2>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-6">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} className="w-20 h-20 rounded-full bg-indigo-50 p-1 ring-2 ring-indigo-100" alt="Avatar" />
          <div>
            <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
            <p className="text-sm text-slate-500">{profile.subscription} Member</p>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Province</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={profile.province}
                onChange={(e) => setProfile({...profile, province: e.target.value})}
              >
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50">
            <h4 className="font-bold text-slate-800 mb-4">Medical Aid & Billing</h4>
            <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Visa ending in 4242</p>
                  <p className="text-xs text-slate-500">Primary Payment Method</p>
                </div>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="font-bold text-red-800 text-sm">Sign Out</h4>
          <p className="text-xs text-red-600">Securely log out of your HealthBridge account.</p>
        </div>
        <button className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-red-100 transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
