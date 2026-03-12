/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cloud, FileText, List, ArrowRight, RotateCcw, PenTool, BookOpen } from 'lucide-react';
import WordCloud from './components/WordCloud';

// Stop words for 7th grade level Chinese
const STOP_WORDS = new Set([
  '的', '了', '和', '是', '就', '都', '而', '及', '与', '着', '或', '一个', '没有', 
  '我们', '你们', '他们', '她', '他', '它', '在', '有', '我', '这', '也', '人', '为', 
  '上', '不', '到', '说', '要', '去', '你', '会', '把', '好', '让', '那', '很', '看', 
  '这', '那', '啊', '呀', '吧', '呢', '吗', '可以', '这个', '那个', '自己', '什么', '如果',
  '但是', '因为', '所以', '就是', '还是', '只是', '一样', '一些', '时候', '出来', '起来',
  '怎么', '那么', '然后', '这种', '那些', '一样', '觉得', '知道', '开始', '现在', '已经',
  '这些', '虽然', '不过', '为了', '可能', '应该', '这样', '一样', '一直', '最后', '其实'
]);

function analyzeText(text: string) {
  // Use Intl.Segmenter for Chinese word segmentation
  const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
  const segments = segmenter.segment(text);
  
  const freqMap = new Map<string, number>();
  
  for (const { segment, isWordLike } of segments) {
    if (isWordLike) {
      const word = segment.trim();
      // Filter out punctuation, numbers, and stop words
      if (word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
        freqMap.set(word, (freqMap.get(word) || 0) + 1);
      }
    }
  }
  
  return Array.from(freqMap.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value);
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [wordData, setWordData] = useState<{ text: string; value: number }[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      alert('老师，请先输入一些文字哦！📝');
      return;
    }
    const data = analyzeText(inputText);
    if (data.length === 0) {
      alert('没有找到合适的词语呢，请换一段文字试试！🤔');
      return;
    }
    setWordData(data);
    setStep(2);
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateCloud = () => {
    setStep(3);
    setTimeout(() => {
      step3Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setInputText('');
    setWordData([]);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Default text for demonstration
  const loadDemoText = () => {
    setInputText('春天来了，万物复苏。小草从泥土里探出头来，好奇地张望着这个美丽的世界。花儿们也竞相开放，红的像火，粉的像霞，白的像雪，五颜六色，美丽极了。蝴蝶在花丛中翩翩起舞，蜜蜂在花朵上辛勤地采蜜。小河里的冰雪融化了，河水叮叮咚咚地流着，像是在唱着欢快的歌。小鸟在枝头叽叽喳喳地叫着，仿佛在告诉人们春天到来的好消息。春天是一个充满生机和希望的季节，让我们一起走进春天，感受春天的美好吧！');
  };

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-sans text-slate-800 selection:bg-pink-200 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b-4 border-pink-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-orange-400 p-2 rounded-2xl shadow-md transform rotate-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
              魔法词频分析器
            </h1>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold hover:bg-amber-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-16">
        
        {/* Step 1: Input */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 shadow-xl shadow-pink-100/50 border-4 border-white relative"
        >
          <div className="absolute -top-6 -left-6 bg-blue-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-12 border-4 border-white">
            1
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-500">
              <PenTool className="w-7 h-7" />
              输入文章
            </h2>
            <button 
              onClick={loadDemoText}
              className="text-sm font-bold text-blue-400 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              加载示例课文
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="老师，请在这里粘贴您要分析的课文或段落哦..."
            className="w-full h-64 p-6 bg-blue-50/50 rounded-2xl border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-lg leading-relaxed placeholder:text-blue-300"
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleAnalyze}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-400 to-cyan-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 shadow-xl shadow-blue-200"
            >
              <span className="flex items-center gap-2 text-xl">
                <List className="w-6 h-6" />
                开始分词与统计
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </motion.section>

        {/* Step 2: Frequency List */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.section 
              ref={step2Ref}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-emerald-100/50 border-4 border-white relative"
            >
              <div className="absolute -top-6 -left-6 bg-emerald-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-12 border-4 border-white">
                2
              </div>
              
              <h2 className="text-2xl font-bold flex items-center gap-3 text-emerald-500 mb-6">
                <FileText className="w-7 h-7" />
                词频统计结果
              </h2>

              <div className="bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 p-6">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-emerald-600 font-bold">一共找到了 {wordData.length} 个不同的词语！</span>
                  <span className="text-emerald-400 text-sm">只显示出现次数最多的前30个词哦</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wordData.slice(0, 30).map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      key={item.text} 
                      className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-emerald-50 hover:border-emerald-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-emerald-400 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                          {index + 1}
                        </span>
                        <span className="font-bold text-lg text-slate-700">{item.text}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-sm font-black">
                        {item.value}次
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleGenerateCloud}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-400 to-orange-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 hover:scale-105 shadow-xl shadow-pink-200"
                >
                  <span className="flex items-center gap-2 text-xl">
                    <Cloud className="w-6 h-6" />
                    生成魔法词云
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 3: Word Cloud */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.section 
              ref={step3Ref}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-purple-100/50 border-4 border-white relative"
            >
              <div className="absolute -top-6 -left-6 bg-purple-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-12 border-4 border-white">
                3
              </div>
              
              <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-500 mb-6">
                <Cloud className="w-7 h-7" />
                魔法词云
              </h2>

              <div className="bg-purple-50/30 rounded-3xl p-4 md:p-8">
                {/* Only pass top 100 words to word cloud to keep it clean */}
                <WordCloud words={wordData.slice(0, 100)} />
              </div>
              
              <div className="mt-8 text-center text-purple-400 font-medium">
                <p>✨ 词语出现得越多，在词云里就越大哦！ ✨</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

