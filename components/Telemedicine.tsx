
import React, { useState } from 'react';
import { DOCTORS } from '../constants';
import { Doctor } from '../types';

const Telemedicine: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);

  const filteredDocs = DOCTORS.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Telemedicine</h2>
          <p className="text-slate-500 text-sm">Consult with verified South African medical professionals.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">{doc.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                    ★ {doc.rating}
                  </div>
                </div>
                <p className="text-indigo-600 text-sm font-medium">{doc.specialty}</p>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {doc.location}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Consultation Fee</p>
                <p className="font-bold text-slate-800">R {doc.consultationFee}</p>
              </div>
              <button 
                onClick={() => setSelectedDoc(doc)}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal (Simplified) */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-slate-800">Confirm Booking</h2>
              <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
              <img src={selectedDoc.image} alt={selectedDoc.name} className="w-12 h-12 rounded-xl" />
              <div>
                <p className="font-bold text-slate-800">{selectedDoc.name}</p>
                <p className="text-xs text-slate-500">{selectedDoc.specialty}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-800">Select Available Slot</p>
              <div className="grid grid-cols-3 gap-2">
                {selectedDoc.availability.map(slot => (
                  <button key={slot} className="py-2 text-sm border border-slate-200 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all font-medium">
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl mt-8 hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200">
              Confirm & Pay R {selectedDoc.consultationFee}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 px-8">A 5% service fee is included. You will receive a secure video link via email/SMS.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Telemedicine;
