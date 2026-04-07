import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Frown, Sparkles, MoveRight, Star, Search, ShieldCheck, Scale, MousePointerClick } from 'lucide-react';

export default function AttentionMechanism() {
  const [activeTab, setActiveTab] = useState<'pk' | 'distribution'>('pk');
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  // Example sentence for distribution
  const exampleSentence = "猫咪 在 柔软 的 垫子 上 安静 地 睡觉".split(" ");
  // Attention weights mapping (simplified for UI demo)
  // When hovering on word index `i`, how much it attends to previous words `j`
  const getWeight = (currentIndex: number, targetIndex: number) => {
    if (targetIndex >= currentIndex) return 0;
    
    // Hardcoded relationships matching human intuition for "猫咪 在 垫子 上 睡觉"
    const relationships: Record<string, Record<string, number>> = {
      "睡觉": { "猫咪": 80, "安静": 60, "在": 20, "垫子": 40 },
      "在": { "猫咪": 70 },
      "垫子": { "在": 80, "柔软": 60, "猫咪": 30 },
      "上": { "垫子": 90, "在": 60 },
      "安静": { "猫咪": 80, "垫子": 20 },
      "地": { "安静": 90 }
    };
    
    const currentWord = exampleSentence[currentIndex];
    const targetWord = exampleSentence[targetIndex];
    
    return relationships[currentWord]?.[targetWord] || 10;
  };

  return (
    <div className="space-y-10">
      {/* Introduction Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-100 flex flex-col items-center text-center"
        >
          <div className="bg-purple-200 p-3 rounded-full mb-4">
            <Search className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-purple-800 text-lg mb-2">数字化注意力</h3>
          <p className="text-purple-600 text-sm">AI通过自动识别文本中的重要信息，像人类阅读一样聚焦关键词句。</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-100 flex flex-col items-center text-center"
        >
          <div className="bg-teal-200 p-3 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="font-bold text-teal-800 text-lg mb-2">告别"胡言乱语"</h3>
          <p className="text-teal-600 text-sm">这种机制能避免生成语义不连贯逻辑混乱的内容，保证文本质量。</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-100 flex flex-col items-center text-center"
        >
          <div className="bg-amber-200 p-3 rounded-full mb-4">
            <Scale className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-bold text-amber-800 text-lg mb-2">动态衡量权重</h3>
          <p className="text-amber-600 text-sm">AI会实时计算不同词汇的重要性(分数)，从而精准预测下一个字。</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-2">
          <button 
            onClick={() => setActiveTab('pk')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'pk' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            造句接力大PK
          </button>
          <button 
            onClick={() => setActiveTab('distribution')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'distribution' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            注意力分布图演示
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'pk' && (
          <motion.div 
            key="pk"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Blind Relay */}
            <div className="bg-slate-50 rounded-3xl p-8 border-2 border-slate-200 flex flex-col items-center">
              <h3 className="text-xl font-bold text-slate-500 mb-8 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
                盲目接力 (无注意力)
              </h3>
              
              <div className="relative w-full h-48 flex items-center justify-center">
                <div className="absolute left-8 bottom-8 text-3xl">☁️</div>
                <div className="absolute right-12 top-4 text-3xl">🌸</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow-md text-slate-800 font-bold border-2 border-slate-200 z-10 flex items-center gap-2">
                  <Frown className="w-5 h-5 text-slate-400" />
                  词语乱连
                </div>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ strokeDasharray: "4 4" }}>
                  <path d="M 50 150 Q 100 100 150 100" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                  <path d="M 150 100 Q 200 150 250 50" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                </svg>

                <div className="absolute left-0 bottom-0 text-slate-400 font-medium text-sm bg-white/80 px-2 py-1 rounded">
                  句子偏离原意
                </div>
              </div>
            </div>

            {/* Scored Relay (With Attention) */}
            <div className="bg-amber-50 rounded-3xl p-8 border-2 border-amber-200 flex flex-col items-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
              <h3 className="text-xl font-bold text-amber-700 mb-8 bg-white px-6 py-2 rounded-full shadow-sm border border-amber-100 z-10">
                有分数的接力 (加注意力)
              </h3>
              
              <div className="relative w-full h-48 flex items-center justify-center">
                {/* 1st Word */}
                <div className="absolute left-4 bottom-12 flex flex-col items-center z-10">
                  <div className="relative">
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-yellow-900 text-xs mt-1">主语</span>
                  </div>
                </div>
                
                {/* 2nd Word */}
                <div className="absolute left-1/3 top-8 flex flex-col items-center z-10">
                  <div className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full text-xs absolute -top-3 -right-2 shadow-sm border border-orange-200">
                    80分
                  </div>
                  <div className="relative">
                    <Star className="w-16 h-16 text-orange-400 fill-orange-400 drop-shadow-md" />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-orange-950 text-sm mt-1">动作</span>
                  </div>
                </div>

                {/* 3rd Word */}
                <div className="absolute right-8 bottom-16 flex flex-col items-center z-10">
                  <div className="bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full text-xs absolute -top-3 -left-4 shadow-sm border border-pink-200">
                    95分
                  </div>
                  <div className="relative">
                    <Star className="w-14 h-14 text-pink-400 fill-pink-400 drop-shadow-md" />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-pink-900 text-xs mt-1">闭环</span>
                  </div>
                </div>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm">
                  <path d="M 65 140 Q 100 80 140 70" fill="none" stroke="#FBBF24" strokeWidth="4" />
                  <path d="M 160 85 Q 220 150 290 120" fill="none" stroke="#F59E0B" strokeWidth="4" />
                  {/* Arrows */}
                  <polygon points="140,70 130,68 135,78" fill="#FBBF24" />
                  <polygon points="290,120 280,125 282,115" fill="#F59E0B" />
                </svg>

                <div className="absolute left-0 bottom-0 text-amber-700 font-bold text-sm bg-white/80 px-3 py-1 rounded-lg border border-amber-100">
                  ✓ 句子更符合逻辑
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'distribution' && (
          <motion.div 
            key="distribution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border-2 border-indigo-100 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-indigo-400 flex items-center gap-2 text-sm font-bold bg-white/50 px-3 py-1.5 rounded-full">
              <MousePointerClick className="w-4 h-4" /> 让鼠标悬停在词语上！
            </div>

            <h3 className="text-xl font-bold text-indigo-800 mb-12 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              词语接力：每个词都在“关注”谁？
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-4 relative py-12">
              {exampleSentence.map((word, i) => {
                const isHovered = hoveredWordIndex === i;
                const isTarget = hoveredWordIndex !== null && hoveredWordIndex > i;
                const weight = hoveredWordIndex !== null ? getWeight(hoveredWordIndex, i) : 0;
                
                return (
                  <div key={i} className="relative flex flex-col items-center">
                    {/* Weight badge that pop ups when a subsequent word is hovered */}
                    <AnimatePresence>
                      {isTarget && weight > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.5 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className={`absolute -top-10 font-black text-sm px-2 py-1 rounded-md shadow-sm border ${
                            weight >= 80 ? 'bg-red-100 text-red-600 border-red-200' : 
                            weight >= 50 ? 'bg-orange-100 text-orange-600 border-orange-200' : 
                            'bg-blue-100 text-blue-600 border-blue-200'
                          }`}
                        >
                          {weight}分
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onMouseEnter={() => setHoveredWordIndex(i)}
                      onMouseLeave={() => setHoveredWordIndex(null)}
                      whileHover={{ scale: 1.1 }}
                      className={`
                        relative z-10 px-4 py-3 rounded-xl font-bold text-lg shadow-sm border-2 transition-all duration-300
                        ${isHovered ? 'bg-indigo-500 text-white border-indigo-600 shadow-indigo-200 shadow-lg scale-110' : 
                          isTarget && weight > 0 ? 
                            (weight >= 80 ? 'bg-red-50 text-red-700 border-red-200 scale-105' : 'bg-orange-50 text-orange-700 border-orange-200') : 
                            'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}
                      `}
                    >
                      {word}
                    </motion.button>

                    {/* Connecting line visualization via SVG (Conceptual, using absolute positioning trick in React is tricky without strict bounds, 
                         so we use a simpler visual cue: highlighting and connecting colors) */}
                  </div>
                )
              })}
            </div>
            
            <div className="mt-8 bg-white/60 p-4 rounded-xl text-center text-sm text-indigo-700 font-medium">
              分数越高，代表当前的词在生成时，受到了前面该词语越多的“注意力”影响。<br/>
              就像一盏盏指示灯，提醒AI后续造句应该侧重哪些关键点。
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
