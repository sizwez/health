
import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { getLocalHealthInsights, findNearbyClinics } from '../services/gemini';
import { UserProfile, GroundingSource, HealthReading } from '../types';

interface DashboardProps {
  profile: UserProfile;
  readings: HealthReading[];
  addReading: (r: HealthReading) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, readings, addReading }) => {
  const [news, setNews] = useState<string>('Fetching provincial health updates...');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [clinics, setClinics] = useState<GroundingSource[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states for log vitals
  const [newReadingType, setNewReadingType] = useState<'BP' | 'Weight' | 'Glucose'>('Weight');
  const [newReadingValue, setNewReadingValue] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      const res = await getLocalHealthInsights(profile.province);
      setNews(res.text);
      setSources(res.sources);
      setLoadingNews(false);
    };
    fetchNews();
  }, [profile.province]);

  const handleLocate = () => {
    setLoadingClinics(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await findNearbyClinics(pos.coords.latitude, pos.coords.longitude);
      setClinics(res.sources);
      setLoadingClinics(false);
    }, () => {
      setLoadingClinics(false);
      alert("Please enable location to find clinics.");
    });
  };

  const latestReading = (type: string) => {
    return readings.find(r => r.type === type)?.value || '--';
  };

  const chartData = useMemo(() => {
    if (readings.length === 0) {
      return [
        { name: 'Mon', val: 70 }, { name: 'Tue', val: 71 }, { name: 'Wed', val: 70 },
        { name: 'Thu', val: 72 }, { name: 'Fri', val: 73 }, { name: 'Sat', val: 72 }, { name: 'Sun', val: 74 }
      ];
    }
    // Transform last 7 readings (reversed for chronological order)
    return readings
      .filter(r => r.type === 'Weight')
      .slice(0, 7)
      .reverse()
      .map(r => ({
        name: new Date(r.date).toLocaleDateString(undefined, { weekday: 'short' }),
        val: parseFloat(r.value)
      }));
  }, [readings]);

  const handleSaveReading = () => {
    if (!newReadingValue) return;
    addReading({
      type: newReadingType,
      value: newReadingValue,
      date: new Date().toISOString()
    });
    setNewReadingValue('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Molo, {profile.name}! 👋</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring {profile.province}</p>
        </div>
        <button 
          onClick={() => setShowLogModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Log Vitals
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vitals Summary Cards */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
              Health Trends
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Weight (kg)</span>
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Weight</p>
                <p className="text-xl font-black text-slate-800">{latestReading('Weight')} <span className="text-xs font-medium text-slate-400">kg</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Glucose</p>
                <p className="text-xl font-black text-slate-800">{latestReading('Glucose')} <span className="text-xs font-medium text-slate-400">mmol/L</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">BP</p>
                <p className="text-xl font-black text-slate-800">{latestReading('BP')}</p>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Local Health Alerts */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20l-4-4m0-7A7 7 0 111 8a7 7 0 0114 0z" /></svg>
              </div>
              Insights for {profile.province}
            </h3>
            {loadingNews ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-50 rounded w-3/4"></div>
                <div className="h-4 bg-slate-50 rounded w-full"></div>
                <div className="h-4 bg-slate-50 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-slate-600 leading-relaxed prose prose-indigo">
                  {news}
                </div>
                {sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                    {sources.map((s,i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[10px] bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-indigo-600 font-bold hover:bg-indigo-50 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Clinic Locator */}
          <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-2">Find a Clinic</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Search nearby medical facilities using real-time Google Maps data.</p>
            <button 
              onClick={handleLocate}
              disabled={loadingClinics}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-900/40"
            >
              {loadingClinics ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Search Nearby Clinics'}
            </button>
            {clinics.length > 0 && (
              <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                {clinics.map((c,i) => (
                  <a key={i} href={c.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{c.title}</span>
                    <svg className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* SOS Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-7 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <h4 className="text-sm font-bold mb-2 tracking-tight uppercase tracking-widest">Medical SOS</h4>
            <p className="text-xs opacity-90 mb-5 leading-relaxed">Instantly share your health vitals and location with emergency services.</p>
            <button className="w-full bg-white/20 backdrop-blur-md text-white font-bold py-3 rounded-2xl text-xs hover:bg-white/30 transition-all active:scale-95 border border-white/20">
              Request Ambulance
            </button>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          </div>
        </div>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">Log Health Vitals</h2>
              <button onClick={() => setShowLogModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">✕</button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Metric Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Weight', 'BP', 'Glucose'] as const).map(type => (
                    <button 
                      key={type}
                      onClick={() => setNewReadingType(type)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${newReadingType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Current Value</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-300 font-bold text-slate-800"
                  placeholder={newReadingType === 'Weight' ? 'e.g. 74.5' : newReadingType === 'BP' ? 'e.g. 120/80' : 'e.g. 5.4'}
                  value={newReadingValue}
                  onChange={(e) => setNewReadingValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveReading()}
                />
              </div>
            </div>
            <button 
              onClick={handleSaveReading}
              disabled={!newReadingValue}
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl mt-10 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-100"
            >
              Save Vital
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
