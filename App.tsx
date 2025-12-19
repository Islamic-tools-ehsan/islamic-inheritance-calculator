import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Download, Languages, Info, ShieldCheck, ChevronDown, Scale, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// --- CONSTANTS & DATA ---
const CURRENCIES = [
  { code: 'PKR', symbol: '₨' }, { code: 'SAR', symbol: '﷼' }, { code: 'USD', symbol: '$' },
  { code: 'AED', symbol: 'د.إ' }, { code: 'INR', symbol: '₹' }, { code: 'TRY', symbol: '₺' }
];

const DICT: any = {
  en: { title: "Al-Fara'id Pro", estate: "Total Estate", calc: "Calculate", school: "Fiqh School", lang: "Language" },
  ar: { title: "الميراث برو", estate: "إجمالي التركة", calc: "احسب", school: "المذهب الفقهي", lang: "اللغة" },
  ur: { title: "وراثت پرو", estate: "کل ترکہ", calc: "حساب کریں", school: "فقہی مذہب", lang: "زبان" }
};

// --- CORE ENGINE LOGIC ---
const calculateInheritance = (estate: number, school: string, heirs: any) => {
  let results: any[] = [];
  const totalParts = 24; // Standard base denominator

  // Simple Logic for Wife/Husband (Simplified for Mobile Test)
  if (heirs.wives > 0) {
    const hasKids = heirs.sons > 0 || heirs.daughters > 0;
    const parts = hasKids ? 3 : 6; // 1/8 or 1/4
    results.push({ name: 'Wife', parts, label: hasKids ? '1/8' : '1/4', color: '#10B981', reasoning: "Fixed Quranic share for the wife." });
  }

  if (heirs.sons > 0 || heirs.daughters > 0) {
    const remainingParts = totalParts - results.reduce((acc, r) => acc + r.parts, 0);
    const totalHeads = (heirs.sons * 2) + heirs.daughters;
    if (heirs.sons > 0) {
      results.push({ name: 'Sons', parts: (remainingParts * (heirs.sons * 2) / totalHeads), label: 'Residue', color: '#059669', reasoning: "Sons take twice the share of daughters." });
    }
    if (heirs.daughters > 0) {
      results.push({ name: 'Daughters', parts: (remainingParts * heirs.daughters / totalHeads), label: 'Residue', color: '#34D399', reasoning: "Daughters take half the share of sons." });
    }
  }

  return results.map(r => ({
    ...r,
    amount: (r.parts / totalParts) * estate,
    percentage: (r.parts / totalParts) * 100
  }));
};

// --- MAIN MOBILE COMPONENT ---
export default function App() {
  const [lang, setLang] = useState('en');
  const [school, setSchool] = useState('HANAFI');
  const [currency, setCurrency] = useState('PKR');
  const [estate, setEstate] = useState(1000000);
  const [heirs, setHeirs] = useState({ sons: 1, daughters: 1, wives: 1 });

  const results = useMemo(() => calculateInheritance(estate, school, heirs), [estate, school, heirs]);
  const t = DICT[lang] || DICT.en;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${t.title} Report`, 10, 10);
    const tableData = results.map(r => [r.name, r.label, `${r.amount.toLocaleString()} ${currency}`]);
    (doc as any).autoTable({ head: [['Heir', 'Share', 'Amount']], body: tableData });
    doc.save('Inheritance.pdf');
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] pb-10 font-sans ${lang !== 'en' ? 'text-right' : 'text-left'}`} dir={lang === 'en' ? 'ltr' : 'rtl'}>
      {/* NAVBAR */}
      <nav className="bg-[#059669] p-4 text-white shadow-lg sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          <h1 className="font-black flex items-center gap-2"><Scale size={20} /> {t.title}</h1>
          <div className="flex gap-2">
            {['en', 'ar', 'ur'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`text-xs px-2 py-1 rounded ${lang === l ? 'bg-white text-emerald-700 font-bold' : 'bg-emerald-800'}`}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        {/* ESTATE INPUT CARD */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.estate}</label>
          <div className="flex gap-2 mt-2">
            <input 
              type="number" 
              value={estate} 
              onChange={(e) => setEstate(Number(e.target.value))}
              className="flex-1 text-2xl font-bold bg-emerald-50 text-emerald-900 p-4 rounded-2xl focus:outline-none"
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-100 px-4 rounded-2xl font-bold">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
        </div>

        {/* HEIR CONTROLS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="flex items-center gap-2 font-bold mb-4 text-slate-700"><Users size={18}/> Heirs</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(heirs).map((h: string) => (
              <div key={h} className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{h}</p>
                <div className="flex items-center justify-center gap-2 bg-slate-50 p-2 rounded-xl">
                  <button onClick={() => setHeirs({...heirs, [h]: Math.max(0, (heirs as any)[h] - 1)})} className="w-6 h-6 bg-white rounded-md shadow-sm">-</button>
                  <span className="font-bold">{(heirs as any)[h]}</span>
                  <button onClick={() => setHeirs({...heirs, [h]: (heirs as any)[h] + 1})} className="w-6 h-6 bg-white rounded-md shadow-sm">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISUAL CHART */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm h-64 border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={results} dataKey="parts" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5}>
                {results.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RESULTS LIST */}
        <div className="space-y-3">
          {results.map((res, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border-l-4" style={{ borderColor: res.color }}>
              <div>
                <p className="font-bold text-slate-800">{res.name}</p>
                <p className="text-xs text-slate-400">{res.reasoning}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-600">{res.amount.toLocaleString()} {currency}</p>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{res.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* EXPORT BUTTON */}
        <button 
          onClick={exportPDF}
          className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Download size={20} /> Download PDF Report
        </button>
      </div>
    </div>
  );
}
