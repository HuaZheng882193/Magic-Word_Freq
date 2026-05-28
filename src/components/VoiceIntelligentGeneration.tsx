import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Play, Square, Volume2, Info, ArrowRight, ShieldAlert,
  HelpCircle, CheckCircle2, RefreshCw, BarChart2, ShieldCheck, Scale, Music,
  SlidersHorizontal
} from 'lucide-react';

const SYLLABLES = [
  { id: 'ni', word: '你', pinyin: 'nǐ' },
  { id: 'hao', word: '好', pinyin: 'hǎo' },
  { id: 'chun', word: '春', pinyin: 'chūn' },
  { id: 'tian', word: '天', pinyin: 'tiān' },
  { id: 'lao', word: '老', pinyin: 'lǎo' },
  { id: 'shi', word: '师', pinyin: 'shī' },
  { id: 'xue', word: '学', pinyin: 'xué' },
  { id: 'sheng', word: '生', pinyin: 'shēng' },
];

export default function VoiceIntelligentGeneration() {
  const [activeSubTab, setActiveSubTab] = useState<'wave' | 'concat' | 'model'>('wave');

  // PART 1: WAVE SIMULATOR STATE
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [frequency, setFrequency] = useState<number>(440); // Standard A4 note
  const [amplitude, setAmplitude] = useState<number>(0.5);
  const [isPlayingWave, setIsPlayingWave] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // PART 2: CONCAT SYLLABLES STATE
  const [selectedWords, setSelectedWords] = useState<typeof SYLLABLES>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // PART 3: MODEL & ETHICS STATE
  const [promptText, setPromptText] = useState('春天来了，万物复苏。让我们唱一首赞美春天的歌吧！');
  const [voiceMood, setVoiceMood] = useState<'happy' | 'calm' | 'excited' | 'sad'>('happy');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioPlay, setGeneratedAudioPlay] = useState(false);
  const [votes, setVotes] = useState({ fraud: 0, copyright: 0, standards: 0 });
  const [votedKeys, setVotedKeys] = useState<Set<string>>(new Set());

  // Waveform renderer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;

      const midY = canvas.height / 2;
      const ampScale = amplitude * (canvas.height / 2.5);
      const cycles = (frequency / 220) * 2;

      for (let x = 0; x < canvas.width; x++) {
        const t = x / canvas.width;
        let y = midY;

        if (waveType === 'sine') {
          y = midY + Math.sin(t * Math.PI * 2 * cycles + offset) * ampScale;
        } else if (waveType === 'square') {
          y = midY + (Math.sin(t * Math.PI * 2 * cycles + offset) >= 0 ? 1 : -1) * ampScale;
        } else if (waveType === 'triangle') {
          const raw = Math.asin(Math.sin(t * Math.PI * 2 * cycles + offset)) / (Math.PI / 2);
          y = midY + raw * ampScale;
        } else if (waveType === 'sawtooth') {
          const raw = 2 * (t * cycles + offset / (2 * Math.PI) - Math.floor(0.5 + t * cycles + offset / (2 * Math.PI)));
          y = midY + raw * ampScale;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      if (isPlayingWave) {
        offset += 0.15;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [waveType, frequency, amplitude, isPlayingWave]);

  // Audio Playback using Web Audio API
  const startAudioWave = () => {
    try {
      if (isPlayingWave) {
        stopAudioWave();
        return;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillatorRef.current = osc;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(amplitude * 0.1, ctx.currentTime); // Limit max volume slightly
      gainNodeRef.current = gain;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setIsPlayingWave(true);
    } catch (e) {
      console.error('Audio Context not supported or allowed', e);
    }
  };

  const stopAudioWave = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) { }
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlayingWave(false);
  };

  // Update frequency/type dynamically during playback
  useEffect(() => {
    if (isPlayingWave && oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    }
  }, [frequency]);

  useEffect(() => {
    if (isPlayingWave && oscillatorRef.current) {
      oscillatorRef.current.type = waveType;
    }
  }, [waveType]);

  useEffect(() => {
    if (isPlayingWave && gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(amplitude * 0.1, audioContextRef.current.currentTime);
    }
  }, [amplitude]);

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      stopAudioWave();
    };
  }, []);

  // Concatenate speaker using Web Speech API (TTS)
  const handleSpeakConcat = () => {
    if (selectedWords.length === 0) return;
    setIsSpeaking(true);

    const sentence = selectedWords.map(w => w.word).join('');
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'zh-CN';

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const addWord = (wordObj: typeof SYLLABLES[0]) => {
    if (selectedWords.length < 10) {
      setSelectedWords([...selectedWords, wordObj]);
    }
  };

  const clearWords = () => {
    setSelectedWords([]);
    window.speechSynthesis.cancel();
  };

  // AI Generation simulation
  const handleGenerateAudio = () => {
    setIsGeneratingAudio(true);
    setGeneratedAudioPlay(false);
    setTimeout(() => {
      setIsGeneratingAudio(false);
      setGeneratedAudioPlay(true);
    }, 1500);
  };

  // Vote handler
  const handleVote = (topic: 'fraud' | 'copyright' | 'standards') => {
    if (votedKeys.has(topic)) return;
    setVotes(prev => ({ ...prev, [topic]: prev[topic] + 1 }));
    setVotedKeys(new Set([...votedKeys, topic]));
  };

  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-6 rounded-3xl border-2 border-violet-100">
        <h3 className="text-xl font-bold text-violet-800 mb-2 flex items-center gap-2">
          <Music className="w-6 h-6 text-violet-500" />
          第14课：声音的智能生成 (AI Audio Generation)
        </h3>
        <p className="text-violet-700 leading-relaxed font-medium">
          声音是频率的波澜，AI如何模仿自然声线甚至创造一首美妙音乐？
          让我们亲历声音生成的“三种魔法”，并对技术伦理进行一次智慧激辩！
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-2 overflow-x-auto">
          <button
            onClick={() => { stopAudioWave(); setActiveSubTab('wave'); }}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'wave' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> 1. 数学模拟波形
          </button>
          <button
            onClick={() => { stopAudioWave(); setActiveSubTab('concat'); }}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'concat' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Volume2 className="w-4 h-4" /> 2. 字词拼接合成
          </button>
          <button
            onClick={() => { stopAudioWave(); setActiveSubTab('model'); }}
            className={`px-5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeSubTab === 'model' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Scale className="w-4 h-4" /> 3. 大模型与伦理
          </button>
        </div>
      </div>

      {/* Contents */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'wave' && (
          <motion.div
            key="wave"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-violet-50/40 rounded-3xl p-6 md:p-8 border-2 border-violet-100 space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-violet-800 mb-2">魔法一：数学波形合成模拟波形</h4>
              <p className="text-violet-600 text-sm">
                声音的本质是波形。调节振幅和频率，点击播放按钮，听到数学函数在你耳边发声！
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Waveform Canvas */}
              <div className="bg-white rounded-3xl border-2 border-violet-100 p-6 flex flex-col items-center justify-center shadow-sm relative">
                <span className="absolute top-4 left-4 bg-violet-100 text-violet-600 px-2 py-0.5 rounded text-[10px] font-bold">
                  实时数学波形图
                </span>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="w-full bg-slate-50 rounded-xl border border-slate-100 max-h-[160px]"
                />

                <button
                  onClick={startAudioWave}
                  className={`mt-6 w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white shadow-md ${isPlayingWave ? 'bg-red-500 shadow-red-100 hover:bg-red-600' : 'bg-violet-500 shadow-violet-100 hover:bg-violet-600'}`}
                >
                  {isPlayingWave ? (
                    <>
                      <Square className="w-5 h-5 fill-white" /> 停止播放
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" /> 启动播放发声
                    </>
                  )}
                </button>
              </div>

              {/* Math Control Knobs */}
              <div className="bg-white rounded-3xl border-2 border-violet-100 p-6 space-y-6 shadow-sm">
                <div>
                  <span className="text-xs font-black text-violet-500 block uppercase tracking-wider mb-2">🔊 波形选择</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['sine', 'square', 'triangle', 'sawtooth'].map(type => (
                      <button
                        key={type}
                        onClick={() => setWaveType(type as OscillatorType)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase text-center border-2 transition-all ${waveType === type ? 'bg-violet-50 border-violet-400 text-violet-700' : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                      >
                        {type === 'sine' && '正弦波'}
                        {type === 'square' && '方波'}
                        {type === 'triangle' && '三角波'}
                        {type === 'sawtooth' && '锯齿波'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1 text-slate-600">
                    <span>频率 (Frequency - 决定音调高低)</span>
                    <span className="text-violet-600 font-mono font-black">{frequency} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="220"
                    max="880"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                    <span>低音 (220Hz)</span>
                    <span>标准A音 (440Hz)</span>
                    <span>高音 (880Hz)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1 text-slate-600">
                    <span>振幅 (Amplitude - 决定音量大小)</span>
                    <span className="text-violet-600 font-mono font-black">{(amplitude * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={amplitude}
                    onChange={(e) => setAmplitude(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'concat' && (
          <motion.div
            key="concat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-indigo-50/40 rounded-3xl p-6 md:p-8 border-2 border-indigo-100 space-y-6"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-black text-indigo-800 mb-2">魔法二：字词拼接与语音合成 (Concatenative TTS)</h4>
              <p className="text-indigo-600 text-sm">
                AI先录制字词音节库，通过输入指令，在后台按顺序进行“积木对齐”拼接，合成一段流畅的语音！
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Syllables Library */}
              <div className="bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-sm">
                <span className="text-xs font-black text-indigo-500 block uppercase tracking-wider mb-4">📚 音节字词库 (点击拼装)</span>
                <div className="grid grid-cols-4 gap-3">
                  {SYLLABLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => addWord(s)}
                      className="py-3 px-2 bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-2xl flex flex-col items-center justify-center transition-all group active:scale-95"
                    >
                      <span className="text-2xl font-black text-slate-700 group-hover:text-indigo-600">{s.word}</span>
                      <span className="text-[10px] text-slate-400 font-bold group-hover:text-indigo-400">{s.pinyin}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesizer Rack */}
              <div className="bg-white rounded-3xl border-2 border-indigo-100 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
                <div>
                  <span className="text-xs font-black text-indigo-500 block uppercase tracking-wider mb-4">⛓️ 待播放拼接链</span>

                  {selectedWords.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {selectedWords.map((word, idx) => (
                        <motion.div
                          key={`${word.id}-${idx}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white border border-indigo-100 shadow-sm px-3 py-1.5 rounded-xl flex flex-col items-center"
                        >
                          <span className="font-black text-indigo-700 text-lg">{word.word}</span>
                          <span className="text-[8px] text-indigo-400 font-bold">{word.pinyin}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <span className="text-xs text-slate-400">请点击左侧字词，构筑拼接合成序列...</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-6">
                  <button
                    onClick={handleSpeakConcat}
                    disabled={selectedWords.length === 0 || isSpeaking}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSpeaking ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        声谱发声中...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" /> 拼接合成发声
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearWords}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold px-4 rounded-xl transition-all text-sm"
                  >
                    重置清空
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'model' && (
          <motion.div
            key="model"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-pink-50/40 rounded-3xl p-6 md:p-8 border-2 border-pink-100 space-y-8"
          >
            {/* AI Generation Box */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-3xl border-2 border-pink-100 p-6 space-y-6 shadow-sm">
                <span className="text-xs font-black text-pink-500 block uppercase tracking-wider">🌟 魔法三：AI大模型生成高质量音频</span>

                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full h-28 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-pink-300 transition-all font-bold text-sm text-slate-700 resize-none"
                />

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'happy', label: '😊 欢快' },
                    { key: 'calm', label: '😌 沉稳' },
                    { key: 'excited', label: '🤩 激昂' },
                    { key: 'sad', label: '😢 忧伤' }
                  ].map(mood => (
                    <button
                      key={mood.key}
                      onClick={() => setVoiceMood(mood.key as any)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black border-2 transition-all ${voiceMood === mood.key ? 'bg-pink-50 border-pink-400 text-pink-700' : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingAudio}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-pink-100 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isGeneratingAudio ? '大模型推理合成中...' : '生成高质量播报音频'}
                </button>
              </div>

              {/* Simulated Audiospace output */}
              <div className="bg-white rounded-3xl border-2 border-pink-100 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
                <div>
                  <span className="text-xs font-black text-pink-500 block uppercase tracking-wider mb-4">🎧 生成音频播放厅</span>
                  {isGeneratingAudio ? (
                    <div className="text-center py-10">
                      <RefreshCw className="w-10 h-10 text-pink-300 animate-spin mx-auto mb-2" />
                      <span className="text-xs text-pink-400 font-bold">神经网络深度算力调理中...</span>
                    </div>
                  ) : generatedAudioPlay ? (
                    <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-pink-800 text-sm">✨ 高清大模型生成音频</h5>
                        <p className="text-[10px] text-pink-500">已对齐词意：大自然的声音谱系 ({voiceMood === 'happy' ? '开心欢悦' : voiceMood === 'calm' ? '平静和缓' : voiceMood === 'excited' ? '激动热情' : '情感忧伤'})</p>
                      </div>

                      {/* Interactive Trigger Audio Readout */}
                      <button
                        onClick={() => {
                          const utter = new SpeechSynthesisUtterance(promptText);
                          utter.lang = 'zh-CN';
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utter);
                        }}
                        className="bg-pink-500 text-white p-2.5 rounded-full hover:bg-pink-600 transition-colors shadow shadow-pink-200"
                      >
                        <Play className="w-4 h-4 fill-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <span className="text-xs text-slate-400">点击左侧生成音频，体会深度模型的情感表现力</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mt-4 text-[10px] text-slate-500 leading-relaxed font-medium">
                  <strong>ℹ️ 伦理提示：</strong>
                  大模型能极真还原任何人声，这带来了巨大的拟真便利，但同时也蕴含了一定的伪造欺诈风险。我们需要合理安全地应用它。
                </div>
              </div>
            </div>

            {/* Ethics & Regulation Discussion (伦理与法规) */}
            <div className="bg-white rounded-3xl border-2 border-pink-100 p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                <ShieldAlert className="w-6 h-6 text-pink-500" />
                <h5 className="font-bold text-slate-700 text-base">技术背后的思考：AI伦理与法规</h5>
              </div>

              <p className="text-xs text-slate-500">
                声音的智能生成极度逼真，师生们可点击进行情境决策与投票，探寻合规使用的社会共识：
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Panel 1 */}
                <div className="bg-pink-50/50 rounded-2xl border border-pink-100 p-4 flex flex-col justify-between">
                  <div>
                    <h6 className="font-bold text-pink-800 text-sm mb-2">🚫 声音伪造诈骗</h6>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      AI克隆家人或领导声线进行网络诈骗。我们如何进行多维身份防伪和证据链审核？
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote('fraud')}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${votedKeys.has('fraud') ? 'bg-pink-100 text-pink-600' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {votedKeys.has('fraud') ? `已投票 (${votes.fraud + 88}人赞同监管)` : '赞同防伪监管'}
                  </button>
                </div>

                {/* Panel 2 */}
                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4 flex flex-col justify-between">
                  <div>
                    <h6 className="font-bold text-indigo-800 text-sm mb-2">🎼 著作权与原创权</h6>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      AI生成音乐融入歌手原音特征，版权红利应划归AI所属人还是原词曲版权方？
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote('copyright')}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${votedKeys.has('copyright') ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    {votedKeys.has('copyright') ? `已投票 (${votes.copyright + 112}人要求确权)` : '主张版权保护'}
                  </button>
                </div>

                {/* Panel 3 */}
                <div className="bg-cyan-50/50 rounded-2xl border border-cyan-100 p-4 flex flex-col justify-between">
                  <div>
                    <h6 className="font-bold text-cyan-800 text-sm mb-2">⚖️ 建立行业规范</h6>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      在推动AI技术大步前进的同时，必须制定伦理规范与透明标识，打上“AI合成”水印。
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote('standards')}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${votedKeys.has('standards') ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {votedKeys.has('standards') ? `已投票 (${votes.standards + 156}人支持立法)` : '共建行业标准'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
