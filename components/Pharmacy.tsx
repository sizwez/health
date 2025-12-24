
import React, { useState, useRef } from 'react';
import { PHARMACY_ITEMS } from '../constants';
import { PharmacyProduct } from '../types';

interface PharmacyProps {
  scriptUploaded: boolean;
  setScriptUploaded: (val: boolean) => void;
}

const Pharmacy: React.FC<PharmacyProps> = ({ scriptUploaded, setScriptUploaded }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [cart, setCart] = useState<PharmacyProduct[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Prescription', 'OTC', 'Supplement', 'Wellness'];

  const filteredItems = activeCategory === 'All' 
    ? PHARMACY_ITEMS 
    : PHARMACY_ITEMS.filter(item => item.category === activeCategory);

  const addToCart = (item: PharmacyProduct) => {
    setCart(prev => [...prev, item]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
  const hasRxItem = cart.some(item => item.category === 'Prescription');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScriptUploaded(true);
      alert("Prescription script uploaded successfully! You can now proceed with your order.");
    }
  };

  const handlePlaceOrder = () => {
    if (hasRxItem && !scriptUploaded) {
      alert("Your cart contains prescription items. Please upload your script first.");
      return;
    }
    alert("Order Successful! Sizwe will deliver your package in 24 hours.");
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pharmacy</h2>
          <p className="text-slate-500 text-sm font-medium">Safe and reliable healthcare essentials delivered.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Prescription Upload Zone */}
        <div className="md:col-span-1">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={handleFileUpload}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center text-center justify-center h-full min-h-[250px] group cursor-pointer transition-all ${scriptUploaded ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'}`}
          >
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform ${scriptUploaded ? 'bg-white text-green-600' : 'bg-white text-indigo-600'}`}>
              {scriptUploaded ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </div>
            <p className={`text-sm font-bold ${scriptUploaded ? 'text-green-800' : 'text-indigo-800'}`}>
              {scriptUploaded ? 'Script Uploaded!' : 'Upload Script'}
            </p>
            <p className={`text-[10px] mt-2 font-medium ${scriptUploaded ? 'text-green-600' : 'text-indigo-500'}`}>
              {scriptUploaded ? 'Click to replace file' : 'Necessary for Rx medications'}
            </p>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {item.category === 'Prescription' && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border border-red-200">
                    Rx
                  </div>
                )}
              </div>
              <div className="flex-1 px-1">
                <h4 className="font-bold text-slate-800 leading-tight mb-1">{item.name}</h4>
                <p className="text-slate-400 text-[10px] line-clamp-2 leading-relaxed font-medium">{item.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between px-1">
                <span className="text-base font-black text-slate-900">R {item.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 active:scale-90 transition-all shadow-lg shadow-indigo-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-24 right-8 z-40 md:bottom-8">
          <button onClick={() => setShowCheckout(true)} className="bg-slate-900 text-white px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-5 hover:scale-105 transition-all group active:scale-95">
            <div className="relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">{cart.length}</span>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Shopping Bag</p>
              <p className="text-base font-black tracking-tight">R {cartTotal.toFixed(2)}</p>
            </div>
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-xs font-black">R {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {hasRxItem && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border ${scriptUploaded ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {scriptUploaded ? (
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-tight">
                    {scriptUploaded ? 'Prescription Verified' : 'Prescription Required to Finish Checkout'}
                  </p>
                </div>
              )}

              <div className="p-6 bg-slate-50 rounded-[28px] space-y-3">
                <div className="flex justify-between text-xs font-medium text-slate-500"><span>Cart Subtotal</span><span className="font-bold">R {cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-xs font-medium text-slate-500"><span>Service & Delivery</span><span className="font-bold text-green-600">FREE</span></div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline"><span className="text-sm font-black">Total Due</span><span className="text-xl font-black text-indigo-600">R {cartTotal.toFixed(2)}</span></div>
              </div>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[24px] mt-8 hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
