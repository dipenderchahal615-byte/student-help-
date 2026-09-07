import { Calculator, Clock, CheckCircle2, ChevronRight, Hash, Percent, Calendar } from 'lucide-react';
import { useState } from 'react';

const TOOLS = [
  { name: 'CGPA to Percentage', icon: Percent, category: 'Academic' },
  { name: 'Attendance Calculator', icon: Calendar, category: 'Planning' },
  { name: 'Word & Character Counter', icon: Hash, category: 'Writing' },
  { name: 'Age Calculator', icon: Calendar, category: 'Utility' },
];

export default function StudentTools() {
  const [activeTool, setActiveTool] = useState(TOOLS[0].name);

  // States for CGPA
  const [cgpa, setCgpa] = useState('');
  const [percentageResult, setPercentageResult] = useState<number | null>(null);

  // States for Attendance
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [targetAttendance, setTargetAttendance] = useState('75');
  const [attendanceResult, setAttendanceResult] = useState<{current: number, needed: number, status: string} | null>(null);

  // States for Word/Char Counter
  const [textToCount, setTextToCount] = useState('');

  // States for Age Calculator
  const [dob, setDob] = useState('');
  const [ageResult, setAgeResult] = useState<{years: number, months: number, days: number} | null>(null);

  const calculateCGPA = () => {
    const val = parseFloat(cgpa);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      setPercentageResult(Number((val * 9.5).toFixed(2)));
    } else {
      setPercentageResult(null);
    }
  };

  const calculateAttendance = () => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);
    const target = parseInt(targetAttendance);
    
    if (!isNaN(total) && !isNaN(attended) && total > 0 && attended >= 0 && attended <= total && !isNaN(target)) {
      const currentPerc = (attended / total) * 100;
      
      if (currentPerc >= target) {
        // Can miss how many?
        // (attended) / (total + miss) = target/100
        // attended * 100 = target * (total + miss)
        // (attended * 100 / target) - total = miss
        const canMiss = Math.floor((attended * 100 / target) - total);
        setAttendanceResult({ current: Number(currentPerc.toFixed(2)), needed: 0, status: `You can miss ${canMiss} more classes and stay above ${target}%.` });
      } else {
        // Need to attend how many?
        // (attended + need) / (total + need) = target/100
        // 100 * attended + 100 * need = target * total + target * need
        // need * (100 - target) = target * total - 100 * attended
        const need = Math.ceil((target * total - 100 * attended) / (100 - target));
        setAttendanceResult({ current: Number(currentPerc.toFixed(2)), needed: need, status: `You need to attend ${need} more classes to reach ${target}%.` });
      }
    } else {
      setAttendanceResult(null);
    }
  };

  const calculateAge = () => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) {
        months--;
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
      }
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      if (years >= 0) {
        setAgeResult({ years, months, days });
      } else {
        setAgeResult(null);
      }
    }
  };

  const wordCount = textToCount.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = textToCount.length;

  return (
    <div className="space-y-8 px-6 py-8 h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Utilities</h1>
          <p className="text-slate-500 font-medium mt-1">Quick calculators and tools for daily student life.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Sidebar Tools List */}
        <div className="w-full md:w-80 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm shrink-0 overflow-y-auto custom-scrollbar">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">All Tools</h2>
          <div className="space-y-1">
            {TOOLS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => {
                  setActiveTool(tool.name);
                  setPercentageResult(null);
                  setAttendanceResult(null);
                  setAgeResult(null);
                  setTextToCount('');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  activeTool === tool.name 
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' 
                    : 'bg-transparent text-slate-600 font-medium hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tool.icon size={18} className={activeTool === tool.name ? 'text-blue-600' : 'text-slate-400'} />
                  <span className="text-sm">{tool.name}</span>
                </div>
                {activeTool === tool.name && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Workspace */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-y-auto custom-scrollbar flex items-center justify-center relative">
          <div className="w-full max-w-xl">
            
            {/* CGPA to Percentage */}
            {activeTool === 'CGPA to Percentage' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Percent size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">CGPA to Percentage</h2>
                  <p className="text-slate-500 text-sm mt-1">Standard conversion formula (CGPA × 9.5)</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Enter your CGPA (out of 10)</label>
                  <input type="number" step="0.1" max="10" min="0" value={cgpa} onChange={e=>setCgpa(e.target.value)} placeholder="e.g. 8.5" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-center transition-all" />
                  <button onClick={calculateCGPA} className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    Calculate Percentage
                  </button>
                </div>

                {percentageResult !== null && (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                    <div className="text-sm font-bold text-emerald-700 mb-1">Equivalent Percentage</div>
                    <div className="text-4xl font-black text-emerald-700">{percentageResult}%</div>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Calculator */}
            {activeTool === 'Attendance Calculator' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Attendance Calculator</h2>
                  <p className="text-slate-500 text-sm mt-1">Find out how many classes you can miss or need to attend.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Total Classes Held</label>
                      <input type="number" min="1" value={totalClasses} onChange={e=>setTotalClasses(e.target.value)} placeholder="e.g. 40" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Classes Attended</label>
                      <input type="number" min="0" value={attendedClasses} onChange={e=>setAttendedClasses(e.target.value)} placeholder="e.g. 30" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Percentage (%)</label>
                    <input type="number" min="1" max="100" value={targetAttendance} onChange={e=>setTargetAttendance(e.target.value)} placeholder="e.g. 75" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <button onClick={calculateAttendance} className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    Calculate
                  </button>
                </div>

                {attendanceResult && (
                  <div className={`p-6 rounded-2xl text-center border ${attendanceResult.needed > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                    <div className="text-sm font-bold mb-1">Current Attendance: {attendanceResult.current}%</div>
                    <div className="text-lg font-bold">{attendanceResult.status}</div>
                  </div>
                )}
              </div>
            )}

            {/* Word & Character Counter */}
            {activeTool === 'Word & Character Counter' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Hash size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Word & Character Counter</h2>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <textarea 
                    value={textToCount}
                    onChange={e => setTextToCount(e.target.value)}
                    placeholder="Paste or type your essay/assignment here..." 
                    rows={8}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none custom-scrollbar" 
                  />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                      <div className="text-3xl font-black text-blue-600 mb-1">{wordCount}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Words</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                      <div className="text-3xl font-black text-blue-600 mb-1">{charCount}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Characters</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Age Calculator */}
            {activeTool === 'Age Calculator' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Age Calculator</h2>
                  <p className="text-slate-500 text-sm mt-1">Calculate your exact age in years, months, and days.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                  <input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700" />
                  <button onClick={calculateAge} className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    Calculate Age
                  </button>
                </div>

                {ageResult && (
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-center">
                    <div className="text-sm font-bold text-blue-700 mb-1">Your exact age is</div>
                    <div className="text-2xl font-black text-blue-700">
                      {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
