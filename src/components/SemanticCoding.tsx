import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, MoveRight, Layers, Compass, 
  Dog, Plane, MousePointer2, Ruler, 
  Search, Wand2, Info, ArrowUpRight,
  Computer, Layout, Tent, Sparkles
} from 'lucide-react';

// Help functions to simulate embeddings
const generateMockVector = (seed: string, length = 12) => {
  if (!seed) return Array(length).fill(0);
  // Simple deterministic pseudo-random vector based on string
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 13, 0);
  return Array.from({ length }, (_, i) => {
    const val = Math.abs(Math.sin(hash * (i + 1)) * 0.8 + Math.cos(i * 1.5) * 0.2);
    return Math.max(0.1, Math.min(0.95, parseFloat(val.toFixed(2))));
  });
};

const COORDS_DATA = [
  { id: 'plane', text: '飞机', x: 1, y: 3, icon: Plane, category: '交通工具' },
  { id: 'dog', text: '狗', x: 3, y: 1, icon: Dog, category: '陆地生物' },
  { id: 'cat', text: '猫', x: 3, y: 0.2, icon: Tent, category: '陆地生物' }, // Using Tent as substitute if Cat icon missing (actually we can use custom emoji)
];

const VectorBar: React.FC<{ value: number; index: number }> = ({ value, index }) => (
  <div className="flex flex-col items-center gap-1 flex-1">
    <div className="w-full bg-slate-100 rounded-t-lg h-32 relative overflow-hidden flex items-end">
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: `${value * 100}%` }}
        transition={{ type: 'spring', damping: 15, stiffness: 100, delay: index * 0.05 }}
        className="w-full bg-gradient-to-t from-pink-400 to-orange-300 rounded-t-sm"
      />
    </div>
    <span className="text-[10px] text-slate-400 font-mono">{value.toFixed(1)}</span>
  </div>
);

export default function SemanticCoding({ words }: { words: { text: string; value: number }[] }) {
  const [selectedWord, setSelectedWord] = useState(words[0]?.text || '春天');
  const [windowContext, setWindowContext] = useState<'A' | 'B'>('A');
  const [sentenceA, setSentenceA] = useState('我想去公园玩。');
  const [sentenceB, setSentenceB] = useState('我希望能到公园去玩。');

  const currentVector = useMemo(() => generateMockVector(selectedWord), [selectedWord]);
  
  const windowVector = useMemo(() => {
    const base = generateMockVector('窗口');
    if (windowContext === 'A') return base.map(v => Math.min(0.9, v + 0.05));
    return base.map(v => Math.max(0.1, v - 0.05));
  }, [windowContext]);

  // Mock similarity calculation
  const similarity = useMemo(() => {
    if (!sentenceA || !sentenceB) return 0;
    // Jaccard similarity of characters as a proxy for visual feedback
    const setA = new Set(sentenceA.split(''));
    const setB = new Set(sentenceB.split(''));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }, [sentenceA, sentenceB]);

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-2xl border-2 border-orange-100 mb-8">
        <h3 className="text-xl font-bold text-orange-700 mb-2 flex items-center gap-2">
          <Wand2 className="w-6 h-6" />
          什么是语义编码？
        </h3>
        <p className="text-orange-600 leading-relaxed font-medium">
          在AI的世界里，词语不再是干巴巴的数字编号，而是一张张生动的“特征画像”。
          通过一组数字（向量），AI能识别出词语背后的含义、情感和属性。
        </p>
      </div>

      {/* Part 1: Vector Portrait */}
      <div className="grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
              <Dna className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">语义编码：给词语“画”像</h4>
          </div>
          <p className="text-slate-500 text-sm">
            点击下方的词，看看AI是如何通过这组数字特征来“记住”它的。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {words.slice(0, 10).map(w => (
              <button 
                key={w.text}
                onClick={() => setSelectedWord(w.text)}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                  selectedWord === w.text 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300'
                }`}
              >
                {w.text}
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3 bg-white p-6 rounded-3xl border-4 border-pink-50 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-pink-50 px-3 py-1 rounded-full text-xs font-bold text-pink-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            特征向量: [0.2, 0.8, ...]
          </div>
          
          <div className="flex items-end gap-2 mt-6">
            {currentVector.map((v, i) => (
              <VectorBar key={`${selectedWord}-${i}`} index={i} value={v} />
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 py-4 bg-slate-50 rounded-2xl">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">数字编号</div>
              <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center font-bold text-slate-600">123</div>
            </div>
            <MoveRight className="text-slate-300 w-8 h-8" />
            <div className="text-center px-6 py-2 bg-pink-100 rounded-2xl border-2 border-pink-200">
               <div className="text-xs text-pink-400 mb-1">语义编码 (画像)</div>
               <div className="font-mono text-pink-600 font-black">[{selectedWord}] 向量</div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Context Adjustment & 2D Space */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Context Change */}
        <div className="bg-white p-8 rounded-[2rem] border-4 border-amber-50 shadow-sm">
          <h4 className="text-lg font-bold text-amber-600 mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6" />
            词语也会“变脸”：动态调整
          </h4>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setWindowContext('A')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${
                windowContext === 'A' 
                ? 'bg-amber-50 border-amber-400 shadow-md transform -translate-y-1' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200'
              }`}
            >
              <div className="font-bold text-sm mb-2 text-amber-600">语境A: 我打开了窗口</div>
              <Layout className={`w-8 h-8 ${windowContext === 'A' ? 'text-amber-500' : 'text-slate-300'}`} />
            </button>
            <button 
              onClick={() => setWindowContext('B')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${
                windowContext === 'B' 
                ? 'bg-blue-50 border-blue-400 shadow-md transform -translate-y-1' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
              }`}
            >
              <div className="font-bold text-sm mb-2 text-blue-600">语境B: 电脑上的窗口</div>
              <Computer className={`w-8 h-8 ${windowContext === 'B' ? 'text-blue-500' : 'text-slate-300'}`} />
            </button>
          </div>
          
          <div className="relative h-24 bg-slate-50 rounded-2xl p-4 flex items-center gap-1">
             {windowVector.map((v, i) => (
                <motion.div 
                  key={`window-${i}`}
                  animate={{ height: `${v * 100}%` }}
                  className={`flex-1 rounded-full ${windowContext === 'A' ? 'bg-amber-400' : 'bg-blue-400'}`}
                />
             ))}
             <div className="absolute inset-0 flex items-center justify-center">
                <span className={`px-4 py-1 rounded-full text-white font-black shadow-lg ${windowContext === 'A' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                  窗口
                </span>
             </div>
          </div>
          <p className="mt-6 text-sm text-slate-500 font-medium">
            同样的词在不同环境下含义不同，语义编码会根据上下文自动调整数值。
          </p>
        </div>

        {/* 2D Space Neighbors */}
        <div className="bg-white p-8 rounded-[2rem] border-4 border-emerald-50 shadow-sm relative">
           <h4 className="text-lg font-bold text-emerald-600 mb-6 flex items-center gap-2">
            <Compass className="w-6 h-6" />
            坐标中的邻居：降维观察
          </h4>
          
          <div className="aspect-square bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 p-4 relative">
            {/* Grid lines */}
            <div className="absolute left-10 right-4 top-4 bottom-10 grid grid-cols-4 grid-rows-4">
              {Array.from({length: 25}).map((_, i) => (
                <div key={i} className="border-[0.5px] border-emerald-100/50" />
              ))}
            </div>
            
            {/* Axes */}
            <div className="absolute left-10 bottom-10 right-4 h-0.5 bg-emerald-700 flex items-center">
               <span className="absolute right-[-10px] text-[10px] font-bold text-emerald-700">X</span>
            </div>
            <div className="absolute left-10 bottom-10 top-4 w-0.5 bg-emerald-700 flex justify-center">
               <span className="absolute top-[-10px] text-[10px] font-bold text-emerald-700">Y</span>
               <span className="absolute bottom-[-20px] left-[-10px] text-[10px] font-bold text-emerald-700">0</span>
            </div>
            
            {/* Points from image */}
            <AnimatePresence>
               {COORDS_DATA.map(point => {
                  const Icon = point.icon;
                  // Scale coords [0-4] to % [0-100]
                  const left = 10 + (point.x / 4.5) * 85; 
                  const bottom = 10 + (point.y / 4) * 80;
                  
                  return (
                    <motion.div 
                      key={point.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute translate-x-[-50%] translate-y-[50%]"
                      style={{ left: `${left}%`, bottom: `${bottom}%` }}
                    >
                      <div className="group relative flex flex-col items-center">
                         <div className={`p-2 rounded-xl bg-white shadow-md border-2 border-emerald-200 group-hover:scale-110 transition-transform cursor-pointer`}>
                            {point.id === 'cat' ? <span className="text-xl">🐱</span> : <Icon className="w-6 h-6 text-emerald-600" />}
                         </div>
                         <div className="mt-1 flex flex-col items-center">
                            <span className="text-[10px] font-black bg-emerald-700 text-white px-1 rounded">{point.text}</span>
                            <span className="text-[8px] text-emerald-500 font-mono">({point.x}, {point.y})</span>
                         </div>
                      </div>
                    </motion.div>
                  )
               })}
            </AnimatePresence>
            
            {/* Relationship line Dog-Cat */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1="70%" y1="78%" x2="70%" y2="88%"
                stroke="#6EE7B7" strokeWidth="2" strokeDasharray="4 4"
              />
            </svg>
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <p className="text-sm text-slate-500 font-medium">
               在坐标系中，语义相近的词距离更近。
            </p>
          </div>
        </div>
      </div>

      {/* Part 3: Sentence Similarity */}
      <div className="bg-white p-8 rounded-[3rem] border-4 border-indigo-50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h4 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <Ruler className="w-7 h-7" />
              相似度：词语间的“亲密度”
            </h4>
            <p className="text-slate-500 font-medium mt-1">
              AI将句子里的词语“打包”合并，就能计算两句话是否意思相近。
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
             <span className="text-sm font-bold text-indigo-400">距离(A, B) = </span>
             <motion.span 
               key={similarity}
               initial={{ scale: 1.5, color: '#818CF8' }}
               animate={{ scale: 1, color: '#4F46E5' }}
               className="text-xl font-black"
             >
               {similarity > 0.8 ? '极小' : similarity > 0.5 ? '较小' : '较大'}
             </motion.span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-black text-indigo-400 px-2 uppercase tracking-wider">句子 A</label>
                <input 
                  type="text" 
                  value={sentenceA}
                  onChange={(e) => setSentenceA(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 focus:border-indigo-400 outline-none transition-all font-bold text-indigo-900"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-pink-400 px-2 uppercase tracking-wider">句子 B</label>
                <input 
                  type="text" 
                  value={sentenceB}
                  onChange={(e) => setSentenceB(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-pink-100 focus:border-pink-400 outline-none transition-all font-bold text-pink-900"
                />
             </div>
          </div>

          <div className="flex flex-col items-center">
             <div className="relative flex items-center justify-center py-10 w-full max-w-xs">
                {/* Ruler animation */}
                <motion.div 
                  animate={{ width: `${(1 - similarity) * 100 + 40}%` }}
                  className="h-12 bg-amber-100 border-t-4 border-b-4 border-amber-300 relative flex items-center justify-between px-2 overflow-hidden rounded-md transition-all"
                >
                   {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className={`w-0.5 bg-amber-300 ${i % 5 === 0 ? 'h-6' : 'h-3'}`} />
                   ))}
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-amber-500 tracking-widest">DISTANCE</span>
                   </div>
                </motion.div>
                
                {/* Distance indicators */}
                <div className="absolute inset-0 flex items-center justify-between -mx-6">
                   <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">A</div>
                   <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">B</div>
                </div>
             </div>
             <p className="mt-4 text-center text-sm font-bold text-indigo-400">
               {similarity > 0.7 
                ? '✨ 距离越短，意思越像哦！ ✨' 
                : '这两句话在AI眼里差别挺大的~'}
             </p>
          </div>
        </div>
      </div>
      
      {/* Detailed Packing Logic Note */}
      <div className="flex gap-4 items-start bg-slate-100 p-6 rounded-2xl border-l-8 border-slate-300">
         <Info className="w-6 h-6 text-slate-400 shrink-0 mt-1" />
         <div className="text-sm text-slate-600 leading-relaxed">
            <strong className="block mb-1 text-slate-700">背后的原理：</strong>
            通过对词语编码<strong>求平均值</strong>或<strong>提取最值</strong>，可以将整段话转化为一个整体的语义表示。
            以此计算两段文本的“空间距离”，就能判断它们在说什么了。
         </div>
      </div>
    </div>
  );
}
