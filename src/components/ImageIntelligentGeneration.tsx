import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Image as ImageIcon, BrainCircuit, ScanSearch, ShieldCheck, XCircle, CheckCircle2, Settings2, SlidersHorizontal, Eye, CloudRain, Flower2 } from 'lucide-react';

export default function ImageIntelligentGeneration() {
  const [activeTab, setActiveTab] = useState<'gan' | 'diffusion'>('gan');
  
  // GAN State
  const [threshold, setThreshold] = useState<number>(50);
  const [isGeneratingGan, setIsGeneratingGan] = useState(false);
  const [ganResults, setGanResults] = useState<{id: number, quality: number, pass: boolean}[]>([]);

  // Diffusion State
  const [diffusionStep, setDiffusionStep] = useState<number>(0); // 0: clear, 1-4: adding noise, 5: full noise, 6-9: denoising, 10: new clear art
  
  // Handle GAN generation
  const handleGenerateGan = () => {
    setIsGeneratingGan(true);
    setGanResults([]);
    
    setTimeout(() => {
      // Generate 12 random images with random quality scores (0-100)
      const results = Array.from({ length: 12 }, (_, i) => {
        const quality = Math.floor(Math.random() * 100);
        return {
          id: i,
          quality,
          pass: quality >= threshold
        };
      });
      setGanResults(results);
      setIsGeneratingGan(false);
    }, 800);
  };

  // Run initial GAN generation
  useEffect(() => {
    if (activeTab === 'gan' && ganResults.length === 0) {
      handleGenerateGan();
    }
  }, [activeTab]);

  return (
    <div className="space-y-10">
      {/* Intro Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-100 flex flex-col items-center text-center shadow-sm"
        >
          <div className="flex gap-4 mb-4">
            <div className="bg-emerald-200 p-3 rounded-full relative">
              <BrainCircuit className="w-8 h-8 text-emerald-700" />
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"><PenToolIcon className="w-4 h-4 text-emerald-500" /></div>
            </div>
            <div className="bg-emerald-200 p-3 rounded-full relative">
              <ScanSearch className="w-8 h-8 text-emerald-700" />
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"><Eye className="w-4 h-4 text-emerald-500" /></div>
            </div>
          </div>
          <h3 className="font-bold text-emerald-800 text-lg mb-2">对抗生成 (GAN)</h3>
          <p className="text-emerald-600 text-sm">生成网络负责画图，判别网络负责找茬。两者在“博弈”中不断提升图像质量。</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-100 flex flex-col items-center text-center shadow-sm"
        >
          <div className="bg-teal-200 p-3 rounded-full mb-4">
            <CloudRain className="w-8 h-8 text-teal-700" />
          </div>
          <h3 className="font-bold text-teal-800 text-lg mb-2">扩散生成 (Diffusion)</h3>
          <p className="text-teal-600 text-sm">先给清晰图片加“雪花”噪点，再让AI学习如何从一团乱码的噪点反向还原出美丽图像。</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-2">
          <button 
            onClick={() => setActiveTab('gan')}
            className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'gan' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <ShieldCheck className="w-4 h-4" /> 互动一：我是小法官
          </button>
          <button 
            onClick={() => setActiveTab('diffusion')}
            className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'diffusion' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" /> 互动二：魔法除噪实验
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'gan' && (
          <motion.div 
            key="gan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50/50 rounded-3xl p-8 border-2 border-emerald-100"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Teacher Control Panel */}
              <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col gap-6">
                <div>
                  <h3 className="text-emerald-800 font-bold text-lg mb-2 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-500" /> 
                    质量门槛 (Threshold)
                  </h3>
                  <p className="text-emerald-600 text-xs mb-4">调节判别网络的严厉程度！阈值越高，对画质要求越高。</p>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-400">0</span>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={threshold}
                      onChange={(e) => {
                        setThreshold(Number(e.target.value));
                        handleGenerateGan();
                      }}
                      className="flex-1 accent-emerald-500"
                    />
                    <span className="text-sm font-bold text-slate-400">100</span>
                  </div>
                  <div className="text-center mt-2 font-black text-emerald-600 text-2xl">{threshold} 分</div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl text-sm text-emerald-700">
                  <p className="font-bold mb-1">👩‍🏫 老师提问：</p>
                  <p>如果我们要又快又多地画出草图，门槛应该怎么拉？如果要拿去参加顶级画展呢？同学们自己动手拉拉看！</p>
                </div>
              </div>

              {/* Output Gallery */}
              <div className="w-full md:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-emerald-800">判别网络审核结果：</h3>
                  <div className="text-sm text-emerald-600 font-medium">
                    通过数: <span className="font-black text-lg">{ganResults.filter(r => r.pass).length}</span> / 12
                  </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {isGeneratingGan ? (
                      <div className="col-span-full h-48 flex items-center justify-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                          <Settings2 className="w-10 h-10 text-emerald-300" />
                        </motion.div>
                      </div>
                    ) : (
                      ganResults.map((res, i) => (
                        <motion.div 
                          key={res.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2
                            ${res.pass ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'}`}
                        >
                          <ImageIcon className={`w-8 h-8 mb-2 ${res.pass ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className={`text-xs font-bold ${res.pass ? 'text-emerald-600' : 'text-slate-500'}`}>画质: {res.quality}</span>
                          
                          {/* Pass / Fail Icon */}
                          <div className="absolute -top-2 -right-2 bg-white rounded-full">
                            {res.pass ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-400" />
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'diffusion' && (
          <motion.div 
            key="diffusion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-teal-50/50 rounded-3xl p-8 border-2 border-teal-100"
          >
            <div className="text-center mb-8">
              <h3 className="text-teal-800 font-bold text-xl mb-2">扩散生成：从“噪点”到艺术</h3>
              <p className="text-teal-600">点击下方按钮，观察图像是如何被破坏，又是如何被AI“变魔术”般还原的！</p>
            </div>

            <div className="flex flex-col items-center gap-8">
              
              {/* Image Display */}
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-200 flex items-center justify-center">
                {/* Simulated clear image (Flower) */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center bg-teal-100"
                  animate={{ opacity: diffusionStep <= 5 ? 1 - (diffusionStep * 0.2) : (diffusionStep - 5) * 0.2 }}
                >
                  <Flower2 className="w-24 h-24 text-teal-600" />
                </motion.div>
                
                {/* Simulated Noise overlay */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                    mixBlendMode: 'overlay'
                  }}
                  animate={{ 
                    opacity: diffusionStep <= 5 ? diffusionStep * 0.2 : 1 - ((diffusionStep - 5) * 0.2) 
                  }}
                />

                {/* State Label */}
                <div className="absolute bottom-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-800 shadow-sm">
                  {diffusionStep === 0 && '原图 (清晰)'}
                  {diffusionStep > 0 && diffusionStep < 5 && '训练阶段 (添加噪点中)'}
                  {diffusionStep === 5 && '纯噪点 (乱码)'}
                  {diffusionStep > 5 && diffusionStep < 10 && '生成阶段 (去噪还原中)'}
                  {diffusionStep === 10 && 'AI生成的新艺术图！'}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="flex w-full max-w-2xl justify-between relative px-4">
                <div className="absolute top-1/2 left-4 right-4 h-2 bg-teal-100 -translate-y-1/2 rounded-full -z-10"></div>
                <div 
                  className="absolute top-1/2 left-4 h-2 bg-teal-400 -translate-y-1/2 rounded-full -z-10 transition-all duration-500"
                  style={{ width: `calc(${(diffusionStep / 10) * 100}% - 2rem)` }}
                ></div>

                {[0, 5, 10].map((stepMark, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-4 border-white shadow-sm transition-colors ${diffusionStep >= stepMark ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-400'}`}>
                    {i === 0 ? '图' : i === 1 ? '噪' : '生'}
                  </div>
                ))}
              </div>

              {/* Teacher Controls */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setDiffusionStep(prev => Math.min(prev + 1, 5))}
                  disabled={diffusionStep >= 5}
                  className="px-6 py-3 rounded-full font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <CloudRain className="w-5 h-5" /> ➕ 添加噪点 (模拟训练)
                </button>
                <button 
                  onClick={() => setDiffusionStep(prev => Math.min(prev + 1, 10))}
                  disabled={diffusionStep < 5 || diffusionStep >= 10}
                  className="px-6 py-3 rounded-full font-bold bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" /> 🪄 反向推算 (生成艺术)
                </button>
                <button 
                  onClick={() => setDiffusionStep(0)}
                  className="px-4 py-3 rounded-full font-bold text-teal-600 hover:bg-teal-100 transition-colors"
                >
                  重置
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline helper component for the PenTool icon used above
function PenToolIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>
    </svg>
  );
}
