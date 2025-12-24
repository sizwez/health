
import React, { useState } from 'react';
import { generateHealthPlan } from '../services/gemini';
import { FitnessPlan, UserProfile } from '../types';

const FitnessCoach: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [goal, setGoal] = useState('Build healthy habits in ' + profile.province);
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateHealthPlan(goal, level, profile.province);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">AI Coach Bridge</h2>
          <p className="text-indigo-100 mb-8 opacity-90">Personalized health routines featuring {profile.province}'s best outdoor spots and local favorites.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Target Goal</label>
              <input 
                type="text" 
                className="w-full bg-indigo-600/50 border border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white focus:outline-none"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Intensity</label>
              <select 
                className="w-full bg-indigo-600/50 border border-indigo-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white focus:outline-none"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Professional</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="mt-8 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                Analyzing Data...
              </>
            ) : (
              'Create My Routine'
            )}
          </button>
        </div>
      </div>

      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Workout
            </h3>
            <ul className="space-y-3">
              {plan.workout.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <span className="text-indigo-600 font-bold">{idx + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              Nutrition
            </h3>
            <ul className="space-y-3">
              {plan.nutrition.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <span className="text-indigo-600 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-600 p-6 rounded-2xl text-white">
            <h3 className="font-bold mb-4">Coach's Advice</h3>
            <p className="text-sm italic opacity-90 leading-relaxed">
              "{plan.advice}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessCoach;
