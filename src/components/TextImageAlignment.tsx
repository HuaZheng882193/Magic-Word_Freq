import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Compass, Eye, Image as ImageIcon, Search, ScanSearch, CheckCircle2, 
  RotateCcw, SlidersHorizontal, ArrowRight, BookOpen, Layers
} from 'lucide-react';

// Custom icons or emojis for visual representations
const SUBJECTS = [
  { id: 'panda', name: '🐼 可爱的熊猫', value: '一只可爱的熊猫' },
  { id: 'robot', name: '🤖 智能机器人', value: '一个帅气的智能机器人' },
  { id: 'cat', name: '🐱 软萌的小猫', value: '一只活泼可爱的橘猫' },
];

const ACTIONS = [
  { id: 'eat', name: '🎋 悠闲地吃竹子', value: '正津津有味地吃着翠绿的竹子' },
  { id: 'code', name: '💻 认真地写代码', value: '正全神贯注地在电脑前编写程序' },
  { id: 'sleep', name: '☁️ 甜甜地做美梦', value: '正在柔软的白云里呼呼大睡' },
];

const SCENES = [
  { id: 'bamboo', name: '🌿 在阳光竹林里', value: '，背景是阳光洒满的茂密竹林' },
  { id: 'space', name: '🚀 在神秘太空中', value: '，背景是星光璀璨的浩瀚太空' },
  { id: 'classroom', name: '🏫 在未来的教室里', value: '，背景是充满科技感的AI智慧教室' },
];

const STYLES = [
  { id: 'cartoon', name: '🎨 卡通手绘风', value: '，呈现出温馨可爱的卡通手绘风格。' },
  { id: 'cyberpunk', name: '⚡ 赛博朋克风', value: '，呈现出霓虹闪烁的未来赛博朋克风格。' },
  { id: 'ink', name: '🖌️ 古典国潮水墨', value: '，呈现出意境悠远的水墨画意境。' },
];

// Mock database for text-to-image search
const SEARCH_DATABASE = [
  {
    id: 1,
    title: '熊猫吃竹子',
    keywords: ['熊猫', '竹子', '吃'],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    emoji: '🐼🎋',
    desc: '阳光竹林中悠闲吃竹子的可爱大熊猫'
  },
  {
    id: 2,
    title: '机器人编程',
    keywords: ['机器人', '代码', '写', '电脑'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400',
    emoji: '🤖💻',
    desc: '未来科技教室里写代码的智能机器人'
  },
  {
    id: 3,
    title: '小猫做美梦',
    keywords: ['小猫', '猫', '睡觉', '云'],
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    emoji: '🐱☁️',
    desc: '白云般柔软的窝里熟睡的可爱小橘猫'
  }
];

export default function TextImageAlignment() {
  const [activeSubTab, setActiveSubTab] = useState<'align' | 'generate' | 'search'>('align');

  // PART 1: ALIGNMENT STATE
  const [isTrained, setIsTrained] = useState(false);
  const [alignSimilarity, setAlignSimilarity] = useState({ cat: 0.32, dog: 0.28, car: 0.15 });

  // PART 2: GENERATION STATE
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedAction, setSelectedAction] = useState(ACTIONS[0]);
  const [selectedScene, setSelectedScene] = useState(SCENES[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // PART 3: SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ item: typeof SEARCH_DATABASE[0], similarity: number }[]>([]);

  // Alignment positions helper
  const getPosition = (type: 'text' | 'image', category: 'cat' | 'dog' | 'car') => {
    if (isTrained) {
      if (category === 'cat') return { x: 30, y: 35 };
      if (category === 'dog') return { x: 75, y: 70 };
      return { x: 50, y: 20 };
    } else {
      if (type === 'text') {
        if (category === 'cat') return { x: 15, y: 55 };
        if (category === 'dog') return { x: 85, y: 45 };
        return { x: 35, y: 80 };
      } else {
        if (category === 'cat') return { x: 45, y: 15 };
        if (category === 'dog') return { x: 60, y: 85 };
        return { x: 80, y: 15 };
      }
    }
  };

  const handleTrain = () => {
    setIsTrained(true);
    // Smooth transition simulation for similarities
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setAlignSimilarity(prev => ({
        cat: parseFloat((0.32 + (0.96 - 0.32) * (count / 10)).toFixed(2)),
        dog: parseFloat((0.28 + (0.94 - 0.28) * (count / 10)).toFixed(2)),
        car: parseFloat((0.15 + (0.91 - 0.15) * (count / 10)).toFixed(2))
      }));
      if (count >= 10) clearInterval(interval);
    }, 100);
  };

  const handleResetTrain = () => {
    setIsTrained(false);
    setAlignSimilarity({ cat: 0.32, dog: 0.28, car: 0.15 });
  };

  // Generate Image Action
  const handleGenerateImage = () => {
    setIsGenerating(true);
    setGeneratedResult(null);
    setTimeout(() => {
      setIsGenerating(false);
      // Determine output emoji combination or custom abstract render representation
      setGeneratedResult(`${selectedSubject.id}_${selectedAction.id}_${selectedScene.id}_${selectedStyle.id}`);
    }, 1500);
  };

  // Search Action
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Simulate similarity score based on keywords matched
    const results = SEARCH_DATABASE.map(item => {
      let score = 0.1;
      item.keywords.forEach(kw => {
        if (query.includes(kw)) {
          score += 0.3;
        }
      });
      // Add small randomness
      score += Math.random() * 0.15;
      score = Math.min(0.99, Math.max(0.08, parseFloat(score.toFixed(2))));
      return { item, similarity: score };
    }).sort((a, b) => b.similarity - a.similarity);

    setSearchResults(results);
  };

  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border-2 border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-500" />
          第13课：根据文字生成图像 (Text-to-Image)
        </h3>
        <p className="text-emerald-700 leading-relaxed font-medium">
          文字和图像属于不同的“语言”。AI如何用画笔还原文字的意境？
          这需要先建立<strong>图文对齐</strong>的语义空间，然后通过智能模型创造图像！
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveSubTab('align')}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'align' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Layers className="w-4 h-4" /> 1. 图文语义对齐
          </button>
          <button 
            onClick={() => setActiveSubTab('generate')}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'generate' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" /> 2. 拼图文生图
          </button>
          <button 
            onClick={() => setActiveSubTab('search')}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'search' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Search className="w-4 h-4" /> 3. 以文搜图应用
          </button>
        </div>
      </div>

      {/* Contents */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'align' && (
          <motion.div 
            key="align"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50/40 rounded-3xl p-6 md:p-8 border-2 border-emerald-100 space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-emerald-800 mb-2">对齐训练：“同义更近，异义更远”</h4>
              <p className="text-emerald-600 text-sm">
                老师和学生们，让我们一起来看看，文字和图片编码在没训练时分布在宇宙的两侧，点击“对齐训练”按钮，看AI如何把同义的图文拉近吧！
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Coordinates Visualization */}
              <div className="md:col-span-2 bg-white rounded-3xl border-2 border-emerald-100 p-4 aspect-[4/3] relative overflow-hidden shadow-sm">
                <div className="absolute inset-4 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-emerald-100" />
                  ))}
                </div>

                {/* Plot Area */}
                <div className="w-full h-full relative">
                  {/* Semantic points */}
                  {/* Category: Cat */}
                  <motion.div 
                    animate={getPosition('text', 'cat')}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <span className="bg-orange-100 border border-orange-200 text-orange-700 font-bold px-2 py-1 rounded-lg text-xs shadow-sm">
                      📝 文字: 猫
                    </span>
                  </motion.div>
                  <motion.div 
                    animate={getPosition('image', 'cat')}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center text-xl shadow-md">
                      🐱
                    </div>
                    <span className="text-[10px] text-orange-500 font-bold mt-1">图片: 猫咪</span>
                  </motion.div>

                  {/* Category: Dog */}
                  <motion.div 
                    animate={getPosition('text', 'dog')}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <span className="bg-sky-100 border border-sky-200 text-sky-700 font-bold px-2 py-1 rounded-lg text-xs shadow-sm">
                      📝 文字: 狗
                    </span>
                  </motion.div>
                  <motion.div 
                    animate={getPosition('image', 'dog')}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-400 border-2 border-white flex items-center justify-center text-xl shadow-md">
                      🐶
                    </div>
                    <span className="text-[10px] text-sky-500 font-bold mt-1">图片: 狗狗</span>
                  </motion.div>

                  {/* Category: Car */}
                  <motion.div 
                    animate={getPosition('text', 'car')}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <span className="bg-pink-100 border border-pink-200 text-pink-700 font-bold px-2 py-1 rounded-lg text-xs shadow-sm">
                      📝 文字: 汽车
                    </span>
                  </motion.div>
                  <motion.div 
                    animate={getPosition('image', 'car')}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-400 border-2 border-white flex items-center justify-center text-xl shadow-md">
                      🚗
                    </div>
                    <span className="text-[10px] text-pink-500 font-bold mt-1">图片: 汽车</span>
                  </motion.div>

                  {/* Connect dotted lines between matches when not trained, solid when trained */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Cat Link */}
                    <motion.line
                      x1={`${getPosition('text', 'cat').x}%`} y1={`${getPosition('text', 'cat').y}%`}
                      x2={`${getPosition('image', 'cat').x}%`} y2={`${getPosition('image', 'cat').y}%`}
                      stroke="#F97316" strokeWidth={isTrained ? 2 : 1.5} strokeDasharray={isTrained ? "0" : "5 5"}
                    />
                    {/* Dog Link */}
                    <motion.line
                      x1={`${getPosition('text', 'dog').x}%`} y1={`${getPosition('text', 'dog').y}%`}
                      x2={`${getPosition('image', 'dog').x}%`} y2={`${getPosition('image', 'dog').y}%`}
                      stroke="#38BDF8" strokeWidth={isTrained ? 2 : 1.5} strokeDasharray={isTrained ? "0" : "5 5"}
                    />
                    {/* Car Link */}
                    <motion.line
                      x1={`${getPosition('text', 'car').x}%`} y1={`${getPosition('text', 'car').y}%`}
                      x2={`${getPosition('image', 'car').x}%`} y2={`${getPosition('image', 'car').y}%`}
                      stroke="#F43F5E" strokeWidth={isTrained ? 2 : 1.5} strokeDasharray={isTrained ? "0" : "5 5"}
                    />
                  </svg>
                </div>
              </div>

              {/* Right Column: Interaction Controls & Metrics */}
              <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h5 className="font-bold text-emerald-800 text-base mb-4 flex items-center gap-2 border-b-2 border-emerald-50 pb-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
                    对齐指标与训练
                  </h5>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-orange-600">猫 图文相似度</span>
                        <span className="font-mono">{(alignSimilarity.cat * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${alignSimilarity.cat * 100}%` }}
                          className="bg-orange-400 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-sky-600">狗 图文相似度</span>
                        <span className="font-mono">{(alignSimilarity.dog * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${alignSimilarity.dog * 100}%` }}
                          className="bg-sky-400 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-pink-600">车 图文相似度</span>
                        <span className="font-mono">{(alignSimilarity.car * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${alignSimilarity.car * 100}%` }}
                          className="bg-pink-400 h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-4 mt-6 text-xs text-emerald-700 leading-relaxed font-medium">
                    👩‍🏫 <strong>教师寄语：</strong>
                    <br />
                    对齐训练就像让文字和图片两个不同国家的使者互相学习。训练前，他们在宇宙两侧；训练后，同义词和对应图就被紧紧吸引到一起啦！
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {!isTrained ? (
                    <button 
                      onClick={handleTrain}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      启动对齐训练 🚀
                    </button>
                  ) : (
                    <button 
                      onClick={handleResetTrain}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      还原训练状态
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'generate' && (
          <motion.div 
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-teal-50/40 rounded-3xl p-6 md:p-8 border-2 border-teal-100 space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-teal-800 mb-2">拼图文生图 (Prompt Constructor)</h4>
              <p className="text-teal-600 text-sm">
                让学生自由组合“主体、动作、场景、风格”四大魔咒，看看能生成怎样的魔法画卷！
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {/* Selectors */}
              <div className="bg-white p-4 rounded-2xl border border-teal-100 space-y-3">
                <span className="text-xs font-black text-teal-500 block uppercase tracking-wider">🌟 1. 选择主体</span>
                {SUBJECTS.map(sub => (
                  <button 
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm text-left border-2 transition-all ${selectedSubject.id === sub.id ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-teal-100 space-y-3">
                <span className="text-xs font-black text-teal-500 block uppercase tracking-wider">🎬 2. 选择动作</span>
                {ACTIONS.map(act => (
                  <button 
                    key={act.id}
                    onClick={() => setSelectedAction(act)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm text-left border-2 transition-all ${selectedAction.id === act.id ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                  >
                    {act.name}
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-teal-100 space-y-3">
                <span className="text-xs font-black text-teal-500 block uppercase tracking-wider">🗺️ 3. 选择场景</span>
                {SCENES.map(sce => (
                  <button 
                    key={sce.id}
                    onClick={() => setSelectedScene(sce)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm text-left border-2 transition-all ${selectedScene.id === sce.id ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                  >
                    {sce.name}
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-teal-100 space-y-3">
                <span className="text-xs font-black text-teal-500 block uppercase tracking-wider">🎨 4. 选择风格</span>
                {STYLES.map(sty => (
                  <button 
                    key={sty.id}
                    onClick={() => setSelectedStyle(sty)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm text-left border-2 transition-all ${selectedStyle.id === sty.id ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                  >
                    {sty.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="bg-white rounded-3xl border-2 border-teal-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1 space-y-2">
                <span className="text-xs font-black text-teal-400">生成的提示词 (Prompt)：</span>
                <p className="text-lg font-bold text-teal-900 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  "{selectedSubject.value}{selectedAction.value}{selectedScene.value}{selectedStyle.value}"
                </p>
              </div>
              
              <button 
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white font-black py-4 px-8 rounded-full shadow-lg shadow-teal-100 transition-all flex items-center gap-2 shrink-0 text-lg disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 1 }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    AI努力作画中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    魔法生图 ✨
                  </>
                )}
              </button>
            </div>

            {/* Simulated Generated Image Display */}
            <AnimatePresence>
              {(isGenerating || generatedResult) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border-4 border-teal-50 p-6 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm"
                >
                  {isGenerating ? (
                    <div className="space-y-4">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner"
                      >
                        🎨
                      </motion.div>
                      <p className="text-teal-600 font-bold text-sm">正在将文字转化为特征向量，并在语义空间寻索对应的艺术特征...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 w-full max-w-sm">
                      <div className="relative aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl overflow-hidden border-2 border-teal-100 flex items-center justify-center shadow-md">
                        {/* Dynamic graphics/icons depending on combination */}
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-7xl">
                            {selectedSubject.id === 'panda' && '🐼'}
                            {selectedSubject.id === 'robot' && '🤖'}
                            {selectedSubject.id === 'cat' && '🐱'}
                          </span>
                          <span className="text-4xl">
                            {selectedAction.id === 'eat' && '🎋'}
                            {selectedAction.id === 'code' && '💻'}
                            {selectedAction.id === 'sleep' && '☁️'}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          {selectedStyle.name}
                        </div>
                      </div>
                      <h5 className="font-bold text-teal-800 text-lg">“画卷已呈现在您面前，老师！”</h5>
                      <p className="text-slate-500 text-xs font-medium">这是AI在对齐的图文空间中，根据您的魔咒提示词自动构筑的主体、状态和意境。</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeSubTab === 'search' && (
          <motion.div 
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-cyan-50/40 rounded-3xl p-6 md:p-8 border-2 border-cyan-100 space-y-6"
          >
            <div className="text-center max-w-2xl mx-auto mb-4">
              <h4 className="text-lg font-black text-cyan-800 mb-2">以文搜图应用 (Text-to-Image Search)</h4>
              <p className="text-cyan-600 text-sm">
                让学生在下方搜索框输入查询词，看看AI是如何计算库中每张图片的图文匹配相似度，并推荐最吻合图片的！
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="max-w-xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="试试输入：大熊猫吃竹子、写代码的机器人..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-cyan-150 focus:border-cyan-400 rounded-full font-bold outline-none shadow-sm focus:ring-4 focus:ring-cyan-50 transition-all text-cyan-900"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex justify-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 flex items-center">热搜词：</span>
              {['熊猫吃竹子', '写代码的机器人', '猫咪睡觉', '竹林'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="text-xs font-bold bg-white text-cyan-600 px-3 py-1 rounded-full border border-cyan-100 hover:border-cyan-300 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="space-y-4 max-w-2xl mx-auto pt-4">
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <motion.div 
                    key={res.item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-4 rounded-2xl border-2 border-cyan-50 flex flex-col md:flex-row items-center gap-6 hover:shadow-md hover:border-cyan-150 transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-3xl shadow-sm shrink-0">
                      {res.item.emoji}
                    </div>
                    <div className="flex-1 space-y-1 w-full text-center md:text-left">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-700">{res.item.title}</h5>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-400">
                          ID: #{res.item.id}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{res.item.desc}</p>
                      
                      {/* Similarity Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-cyan-500 font-bold">图文语义相似度 (Similarity)</span>
                          <span className="font-black text-cyan-600">{(res.similarity * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${res.similarity * 100}%` }}
                            className={`h-full rounded-full ${i === 0 ? 'bg-cyan-500' : i === 1 ? 'bg-cyan-300' : 'bg-slate-300'}`}
                          />
                        </div>
                      </div>
                    </div>
                    {i === 0 && (
                      <div className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 最佳推荐
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-cyan-200">
                  <ScanSearch className="w-12 h-12 text-cyan-200 mx-auto mb-2 animate-bounce" />
                  <p className="text-slate-400 text-sm font-medium">请在上方输入关键词开始以文搜图实验吧！</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
