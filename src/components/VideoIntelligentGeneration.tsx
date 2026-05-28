import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Play, Square, Video, Eye, Layers, Settings, ShieldCheck, 
  RotateCcw, Sliders, ArrowRight, UserCheck, AlertTriangle, RefreshCw, PenTool
} from 'lucide-react';

// Frame data for Persistence of Vision (视觉暂留)
const FLIP_FRAMES = [
  '🚶', '🏃', '🏃‍♂️', '👟', '💨'
];

const ROBOT_FRAMES = [
  '🤖 (双手垂下)',
  '🤖 (抬起左手)',
  '🤖 (双手平举)',
  '🤖 (抬起右手)',
  '🤖 (向您挥手)'
];

const MODELS = [
  { id: 'boy', name: '🎒 可爱小男孩', emoji: '👦' },
  { id: 'girl', name: '👗 萌萌小女孩', emoji: '👧' },
  { id: 'robot', name: '🤖 智能机器人', emoji: '🤖' }
];

const INSTRUCTIONS = [
  { id: 'dance', name: '💃 快乐地转圈跳舞', action: '正在欢快地原地旋转起舞' },
  { id: 'run', name: '🏃 飞快地奔跑', action: '正迈开大步向前奔跑' },
  { id: 'wave', name: '👋 热情地招手微笑', action: '正露出灿烂笑容向大家挥手' }
];

export default function VideoIntelligentGeneration() {
  const [activeSubTab, setActiveSubTab] = useState<'pov' | 'methods' | 'create'>('pov');

  // PART 1: POV STATE
  const [fps, setFps] = useState<number>(2);
  const [isPlayingPov, setIsPlayingPov] = useState(false);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const povTimerRef = useRef<number | null>(null);

  // PART 2: METHODS STATE
  const [activeMethod, setActiveMethod] = useState<'interpolate' | 'sequence'>('interpolate');
  const [interpolateProgress, setInterpolateProgress] = useState(0); // 0 to 4 frames
  const [isInterpolating, setIsInterpolating] = useState(false);
  const [sequenceStep, setSequenceStep] = useState(0); // 0 to 4 frames predicted

  // PART 3: CREATE STATE
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedInstruction, setSelectedInstruction] = useState(INSTRUCTIONS[0]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoDefect, setVideoDefect] = useState<'stiff' | 'inconsistent' | 'polished'>('stiff');

  // POV Animation Loop
  useEffect(() => {
    if (povTimerRef.current) clearInterval(povTimerRef.current);

    if (isPlayingPov) {
      povTimerRef.current = window.setInterval(() => {
        setCurrentFrameIdx(prev => (prev + 1) % FLIP_FRAMES.length);
      }, 1000 / fps);
    }

    return () => {
      if (povTimerRef.current) clearInterval(povTimerRef.current);
    };
  }, [isPlayingPov, fps]);

  const handleTogglePov = () => {
    setIsPlayingPov(!isPlayingPov);
  };

  // Interpolation simulation
  const startInterpolate = () => {
    setIsInterpolating(true);
    setInterpolateProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setInterpolateProgress(current);
      if (current >= 4) {
        clearInterval(interval);
        setIsInterpolating(false);
      }
    }, 500);
  };

  // Sequence prediction simulation
  const nextSequenceStep = () => {
    setSequenceStep(prev => (prev + 1) % 5);
  };

  // Generate Video
  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoDefect('stiff'); // Reset to default stiff motion

    setTimeout(() => {
      setIsGeneratingVideo(false);
      setGeneratedVideoUrl(`${selectedModel.id}_${selectedInstruction.id}`);
    }, 1800);
  };

  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-3xl border-2 border-teal-100">
        <h3 className="text-xl font-bold text-teal-800 mb-2 flex items-center gap-2">
          <Video className="w-6 h-6 text-teal-500" />
          第15课：AI 视频生成：从静止到灵动的“魔法”
        </h3>
        <p className="text-teal-700 leading-relaxed font-medium">
          视频是运动的艺术，AI如何让静态图片“活”起来？
          让我们一同体验**视觉暂留**的核心原理，探索**图像扩展与时序建模**两大生图魔法，并在合规伦理的保护下，让画作灵动飞舞！
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveSubTab('pov')}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'pov' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Eye className="w-4 h-4" /> 1. 视觉暂留实验舱
          </button>
          <button 
            onClick={() => setActiveSubTab('methods')}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'methods' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Layers className="w-4 h-4" /> 2. AI生成双方法演练
          </button>
          <button 
            onClick={() => setActiveSubTab('create')}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'create' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" /> 3. 双要素创作与修正
          </button>
        </div>
      </div>

      {/* Sub-Tab Contents */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'pov' && (
          <motion.div 
            key="pov"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-teal-50/40 rounded-3xl p-6 md:p-8 border-2 border-teal-100 space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-teal-800 mb-2">核心原理：视觉暂留 (Persistence of Vision)</h4>
              <p className="text-teal-600 text-sm">
                视频其实是一系列快速播放的静态图像！人眼具有视觉暂留特性，当帧率（FPS）足够高时，断续的画面就融合成了连续的动态世界。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Column: Playback Screen */}
              <div className="bg-white rounded-3xl border-2 border-teal-100 p-8 flex flex-col items-center justify-center shadow-sm relative min-h-[250px]">
                <span className="absolute top-4 left-4 bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  胶片模拟放映机
                </span>

                <div className="w-40 h-40 bg-teal-50/50 rounded-full border-4 border-dashed border-teal-200 flex items-center justify-center text-7xl shadow-inner relative overflow-hidden">
                  <motion.div 
                    key={currentFrameIdx}
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="select-none"
                  >
                    {FLIP_FRAMES[currentFrameIdx]}
                  </motion.div>
                </div>

                <div className="mt-6 flex gap-4 w-full">
                  <button 
                    onClick={handleTogglePov}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white shadow-md ${isPlayingPov ? 'bg-red-500 shadow-red-100 hover:bg-red-600' : 'bg-teal-500 shadow-teal-100 hover:bg-teal-600'}`}
                  >
                    {isPlayingPov ? (
                      <>
                        <Square className="w-5 h-5 fill-white" /> 停止播放
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-white" /> 启动播放放映
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Settings & Teaching Box */}
              <div className="bg-white rounded-3xl border-2 border-teal-100 p-6 space-y-6 shadow-sm">
                <h5 className="font-bold text-teal-800 text-base mb-2 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-500" />
                  放映速率与观测控制
                </h5>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1 text-slate-600">
                    <span>帧率 (FPS - 每秒播放的图片张数)</span>
                    <span className="text-teal-600 font-mono font-black">{fps} 帧/秒</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                    <span>幻灯片卡顿 (1 FPS)</span>
                    <span>动画流畅分界线 (8-12 FPS)</span>
                    <span>丝滑连贯 (15 FPS)</span>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-2xl p-4 text-xs text-teal-700 leading-relaxed font-medium">
                  <strong>👩‍🏫 老师互动提示：</strong>
                  <br />
                  把帧率滑块拉到 <strong>1 或 2 帧</strong>，同学们会觉得这只是一幅幅无连贯的静态“照片”。
                  把滑块向右拉到 <strong>10帧以上</strong>，神奇的事情发生了！原本断续的小人竟然连贯跑起来了！这就是人眼“视觉暂留”的神奇魔法！
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'methods' && (
          <motion.div 
            key="methods"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-cyan-50/40 rounded-3xl p-6 md:p-8 border-2 border-cyan-100 space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-cyan-800 mb-2">生成魔法：AI视频生成的两大黄金路线</h4>
              <p className="text-cyan-600 text-sm">
                AI是如何凭空制造出连贯动作的？主要基于两种生成策略，点击选项可进行深度体验：
              </p>
            </div>

            {/* Methods Select Toggle */}
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-1 rounded-full flex gap-2">
                <button
                  onClick={() => setActiveMethod('interpolate')}
                  className={`px-5 py-1.5 rounded-full font-bold text-xs transition-all ${activeMethod === 'interpolate' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500'}`}
                >
                  方法一：基于图像扩展 (帧间补全)
                </button>
                <button
                  onClick={() => setActiveMethod('sequence')}
                  className={`px-5 py-1.5 rounded-full font-bold text-xs transition-all ${activeMethod === 'sequence' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500'}`}
                >
                  方法二：基于时序建模 (逐帧预测)
                </button>
              </div>
            </div>

            {/* Simulation Space */}
            <div className="bg-white rounded-3xl border-2 border-cyan-100 p-6 shadow-sm">
              {activeMethod === 'interpolate' ? (
                <div className="space-y-6">
                  <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100">
                    <h5 className="font-bold text-cyan-800 text-sm mb-1">💡 帧插值补全机制 (适合人脸渐变、短动画)</h5>
                    <p className="text-xs text-cyan-600">AI自动计算开头帧与结尾帧的像素变化趋势，并在其间补齐关键帧，平滑动作过渡。</p>
                  </div>

                  {/* Interpolate frame track */}
                  <div className="grid grid-cols-5 gap-3 items-center pt-4">
                    {/* Frame 1: Keyframe Start */}
                    <div className="bg-cyan-100 border-2 border-cyan-300 rounded-2xl p-3 flex flex-col items-center shadow-inner">
                      <span className="text-3xl">👦</span>
                      <span className="text-[10px] text-cyan-600 font-bold mt-2">起点关键帧 A</span>
                    </div>

                    {/* Dynamic AI mid frames */}
                    {[1, 2, 3].map((val) => (
                      <div 
                        key={val} 
                        className={`rounded-2xl p-3 flex flex-col items-center border border-dashed transition-all ${interpolateProgress >= val ? 'bg-teal-50 border-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-40'}`}
                      >
                        {interpolateProgress >= val ? (
                          <>
                            <span className="text-3xl">
                              {val === 1 && '👦 (微昂首)'}
                              {val === 2 && '👦 (举起手)'}
                              {val === 3 && '👦 (挥起手)'}
                            </span>
                            <span className="text-[8px] bg-teal-100 text-teal-700 px-1 rounded mt-2 font-bold">AI过渡帧 #{val}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl text-slate-300">❓</span>
                            <span className="text-[8px] text-slate-400 mt-2">等待AI补全</span>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Frame 5: Keyframe End */}
                    <div className="bg-cyan-100 border-2 border-cyan-300 rounded-2xl p-3 flex flex-col items-center shadow-inner">
                      <span className="text-3xl">🙋‍♂️</span>
                      <span className="text-[10px] text-cyan-600 font-bold mt-2">终点关键帧 B</span>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={startInterpolate}
                      disabled={isInterpolating}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-cyan-100 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {isInterpolating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          AI深度像素补全中...
                        </>
                      ) : (
                        <>
                          <PenTool className="w-4 h-4" />
                          开始AI插值补全 🚀
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100">
                    <h5 className="font-bold text-cyan-800 text-sm mb-1">💡 时序网络帧预测 (适合宏大、复杂变化场景)</h5>
                    <p className="text-xs text-cyan-600">AI模拟运动规律，学习前后帧的因果关系，预测角色接下来的姿态轨迹并逐步生成新画卷。</p>
                  </div>

                  {/* Timeline modeling tracker */}
                  <div className="flex items-center justify-between w-full max-w-xl mx-auto pt-6 gap-4">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <div 
                        key={idx}
                        className={`flex-1 border-2 rounded-2xl p-3 flex flex-col items-center transition-all ${sequenceStep >= idx ? 'bg-cyan-500 border-cyan-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-50'}`}
                      >
                        <span className="text-xs font-black mb-1">帧 t+{idx}</span>
                        <span className="text-2xl my-2">
                          {idx === 0 && '🤖'}
                          {idx === 1 && '🤖 (起跳)'}
                          {idx === 2 && '🚀'}
                          {idx === 3 && '🛸'}
                          {idx === 4 && '🌠'}
                        </span>
                        <span className="text-[8px] font-mono opacity-80">
                          {idx === 0 ? '源输入' : sequenceStep >= idx ? '时序预测' : '未解锁'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={nextSequenceStep}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-cyan-100 flex items-center gap-2 text-sm"
                    >
                      <span>推进下一个时序预测 (t+{sequenceStep === 4 ? 0 : sequenceStep + 1})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'create' && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-indigo-50/40 rounded-3xl p-6 md:p-8 border-2 border-indigo-100 space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-indigo-800 mb-2">输入双要素：指令与模特 (Double Elements)</h4>
              <p className="text-indigo-600 text-sm">
                文字描述作为“指令”控制特定动作，而静态照片作为“模特”提供核心形象，两者缺一不可！
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Model Picker */}
              <div className="bg-white p-5 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
                <span className="text-xs font-black text-indigo-500 block uppercase tracking-wider">👤 1. 选择静态视觉模特</span>
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-left border-2 transition-all flex items-center gap-3 ${selectedModel.id === m.id ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    {m.name}
                  </button>
                ))}
              </div>

              {/* Instruction Picker */}
              <div className="bg-white p-5 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
                <span className="text-xs font-black text-indigo-500 block uppercase tracking-wider">📜 2. 赋予文字控制指令</span>
                {INSTRUCTIONS.map(i => (
                  <button
                    key={i.id}
                    onClick={() => setSelectedInstruction(i)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-left border-2 transition-all ${selectedInstruction.id === i.id ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                  >
                    {i.name}
                  </button>
                ))}
              </div>

              {/* Generate & Player Console */}
              <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-2">生成指令概要：</span>
                  <p className="text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    将以模特「{selectedModel.name}」的相貌为核心框架，生成「{selectedInstruction.action}」的动态小短片。
                  </p>

                  {/* Ethics rule notice */}
                  <div className="mt-4 flex gap-2 items-start bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-indigo-700 leading-normal">
                      <strong>🛡️ 伦理底线守护：</strong>
                      系统已锁定防伪协议，拒绝为他人制作虚假捏造视频或侵权肖像，安全度 100%。
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo}
                  className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-black py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isGeneratingVideo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      时序像素建模合成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      指令+模特 灵动生成 ✨
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Simulated Video Screen */}
            <AnimatePresence>
              {(isGeneratingVideo || generatedVideoUrl) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border-4 border-indigo-50 p-6 flex flex-col items-center justify-center min-h-[340px] shadow-sm relative overflow-hidden"
                >
                  {isGeneratingVideo ? (
                    <div className="space-y-4 text-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-dashed border-indigo-500 border-t-transparent rounded-full flex items-center justify-center mx-auto shadow-inner text-2xl"
                      >
                        🎬
                      </motion.div>
                      <p className="text-indigo-600 font-bold text-sm">正在提炼静态模特核心骨架，并加载运动学物理惯性轨迹预测...</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-8 items-center w-full max-w-3xl">
                      {/* Video screen box */}
                      <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-teal-50 rounded-2xl border-4 border-indigo-900 overflow-hidden shadow-lg flex items-center justify-center">
                        <div className="absolute top-2 left-2 bg-indigo-900/80 backdrop-blur text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-wider">
                          AI VIDEO RECORDER
                        </div>

                        {/* Defect based animations */}
                        <div className="flex flex-col items-center gap-1">
                          <motion.span 
                            animate={
                              videoDefect === 'stiff' 
                              ? { y: [0, -10, 0], rotate: [0, 5, 0] } 
                              : videoDefect === 'inconsistent'
                              ? { scale: [1, 1.4, 0.7, 1], y: [0, 15, -15, 0] }
                              : { x: [0, 10, -10, 0], y: [0, -20, 0], rotate: [0, 360, 0] }
                            }
                            transition={{ 
                              repeat: Infinity, 
                              duration: videoDefect === 'stiff' ? 1.5 : videoDefect === 'inconsistent' ? 0.6 : 2.5 
                            }}
                            className="text-7xl"
                          >
                            {selectedModel.emoji}
                          </motion.span>
                          
                          {/* Stiff joints marker to teach technical limits */}
                          {videoDefect === 'stiff' && (
                            <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded animate-pulse">⚠️ 关节动作僵硬</span>
                          )}
                          {videoDefect === 'inconsistent' && (
                            <span className="text-[9px] bg-yellow-100 text-yellow-600 px-1 rounded animate-pulse">⚠️ 五官扭曲闪烁</span>
                          )}
                          {videoDefect === 'polished' && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded">✅ 人工润色：完美流畅一致</span>
                          )}
                        </div>
                      </div>

                      {/* Control challenges pane */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          技术局限：仍需人工干预
                        </h5>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          当前 AI 自动生成的视频，往往存在关节动作僵硬、形像闪烁不一致等致命物理Bug。这表明——<strong>技术绝非完美，必须引入人类智慧进行润色提炼</strong>。
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                          <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">🛠️ 互动修复：</span>
                          {videoDefect !== 'polished' ? (
                            <button
                              onClick={() => setVideoDefect('polished')}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                            >
                              <UserCheck className="w-4 h-4" />
                              进行人类“人工润色修复” ✨
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-white p-2 rounded-xl border border-emerald-200">
                              <ShieldCheck className="w-4 h-4 shrink-0" />
                              修复成功！五官重构匹配，物理规律校正完毕。
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
