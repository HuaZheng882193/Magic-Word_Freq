/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cloud, FileText, List, ArrowRight, RotateCcw, PenTool, BookOpen, BrainCircuit, Link, Type, Compass, Star } from 'lucide-react';
import WordCloud from './components/WordCloud';
import SemanticCoding from './components/SemanticCoding';
import AttentionMechanism from './components/AttentionMechanism';

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

function analyzeBigrams(text: string) {
  const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
  const segments = Array.from(segmenter.segment(text));
  
  const bigramMap = new Map<string, Map<string, number>>();
  let prevWord: string | null = null;
  
  for (const { segment, isWordLike } of segments) {
    if (isWordLike) {
      const word = segment.trim();
      // Skip very long segments or pure numbers
      if (word.length > 0 && !/^\d+$/.test(word)) {
        if (prevWord) {
          if (!bigramMap.has(prevWord)) {
            bigramMap.set(prevWord, new Map());
          }
          const nextWordMap = bigramMap.get(prevWord)!;
          nextWordMap.set(word, (nextWordMap.get(word) || 0) + 1);
        }
        prevWord = word;
      }
    } else {
      // Punctuation resets the previous word so we don't connect across sentences
      const punctuationRegex = /[。！？；，、\n\r]/;
      if (punctuationRegex.test(segment)) {
        prevWord = null;
      }
    }
  }
  
  const table: { prev: string; next: string; count: number }[] = [];
  const dict: Record<string, {text: string; value: number}[]> = {};
  
  for (const [prev, nextWords] of bigramMap.entries()) {
    const sortedNexts = Array.from(nextWords.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);
    
    dict[prev] = sortedNexts;
    for (const {text, value} of sortedNexts) {
      table.push({ prev, next: text, count: value });
    }
  }
  
  table.sort((a, b) => b.count - a.count);
  return { table, dict };
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [wordData, setWordData] = useState<{ text: string; value: number }[]>([]);
  const [bigramTable, setBigramTable] = useState<{ prev: string; next: string; count: number }[]>([]);
  const [bigramDict, setBigramDict] = useState<Record<string, {text: string; value: number}[]>>({});
  const [generatedPoem, setGeneratedPoem] = useState<string[]>([]);
  const [startWord, setStartWord] = useState('');
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const step6Ref = useRef<HTMLDivElement>(null);

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
    
    const { table, dict } = analyzeBigrams(inputText);
    setBigramTable(table);
    setBigramDict(dict);
    
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

  const handleGeneratePoem = () => {
    setStep(4);
    setTimeout(() => {
      step4Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGoToAttention = () => {
    setStep(5);
    setTimeout(() => {
      step5Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGoToSemantic = () => {
    setStep(6);
    setTimeout(() => {
      step6Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generateNextWord = (currentWord: string) => {
    if (!bigramDict[currentWord] || bigramDict[currentWord].length === 0) {
      return null;
    }
    return bigramDict[currentWord][0].text;
  };

  const generatePoemSequence = (start: string) => {
    if (!start) return;
    const seq = [start];
    const visited = new Set<string>([start]);
    let current = start;
    
    for (let i = 0; i < 15; i++) {
      const next = generateNextWord(current);
      if (!next || visited.has(next)) break;
      seq.push(next);
      visited.add(next);
      current = next;
    }
    setGeneratedPoem(seq);
  };

  const handleReset = () => {
    setInputText('');
    setWordData([]);
    setBigramTable([]);
    setBigramDict({});
    setGeneratedPoem([]);
    setStartWord('');
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

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleGeneratePoem}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-400 to-indigo-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 hover:scale-105 shadow-xl shadow-purple-200"
                >
                  <span className="flex items-center gap-2 text-xl">
                    <BrainCircuit className="w-6 h-6" />
                    探索AI写诗预测
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 4: Bigrams & AI Text Gen */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.section 
              ref={step4Ref}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-100/50 border-4 border-white relative"
            >
              <div className="absolute -top-6 -left-6 bg-indigo-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-12 border-4 border-white">
                4
              </div>
              
              <h2 className="text-2xl font-bold flex items-center gap-3 text-indigo-500 mb-6">
                <BrainCircuit className="w-7 h-7" />
                统计与文本生成：AI是怎么“写”诗的？
              </h2>

              <div className="text-indigo-600 mb-8 font-medium text-lg leading-relaxed bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100">
                <strong className="text-xl inline-block mb-2">预测的奥秘：前文决定后文</strong><br/>
                词语不是孤立存在的。相邻关系是关键，统计相邻字词共同出现的次数，是进行文本预测的基础。我们把这叫做<strong>建立统计表</strong>。
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Statistics Table */}
                <div className="bg-white rounded-2xl border-2 border-indigo-100 overflow-hidden shadow-sm">
                  <div className="bg-indigo-100 px-4 py-3 border-b-2 border-indigo-100 font-bold text-indigo-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    建立统计表 (词语接龙)
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-indigo-50/50 text-indigo-600 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 font-bold bg-indigo-50/90 backdrop-blur">前字</th>
                          <th className="px-4 py-2 font-bold bg-indigo-50/90 backdrop-blur">后字</th>
                          <th className="px-4 py-2 font-bold bg-indigo-50/90 backdrop-blur">出现次数</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bigramTable.slice(0, 30).map((row, i) => (
                          <tr key={i} className="border-t border-indigo-50 hover:bg-indigo-50/30 transition-colors">
                            <td className="px-4 py-2 font-medium text-indigo-900">{row.prev}</td>
                            <td className="px-4 py-2 font-medium text-indigo-900">{row.next}</td>
                            <td className="px-4 py-2">
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-sm font-bold">
                                {row.count}次
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Prediction Generation */}
                <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="font-bold text-indigo-800 text-xl mb-6 flex items-center gap-2">
                    <Link className="w-6 h-6" />
                    概率连线生成 (让AI试试！)
                  </h3>
                  
                  <div className="w-full max-w-sm flex items-center gap-2 mb-6">
                    <input 
                      type="text" 
                      value={startWord} 
                      onChange={(e) => setStartWord(e.target.value)}
                      placeholder="输入一个词作为开头..."
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                    <button 
                      onClick={() => generatePoemSequence(startWord)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-200 text-lg"
                    >
                      生成
                    </button>
                  </div>

                  {generatedPoem.length > 0 && (
                    <div className="bg-indigo-50 text-indigo-900 p-6 rounded-2xl w-full text-left">
                      <div className="flex flex-wrap items-center gap-2 text-xl font-bold">
                        {generatedPoem.map((word, idx) => (
                          <React.Fragment key={idx}>
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.2 }}
                              className="bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm"
                            >
                              {word}
                            </motion.span>
                            {idx < generatedPoem.length - 1 && (
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.2 + 0.1 }}
                                className="text-indigo-400"
                              >
                                <ArrowRight className="w-5 h-5" />
                              </motion.span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="mt-6 text-sm text-indigo-500 font-medium">
                        * 根据统计规律，从起点不断预测连线概率最高的下一个词语
                      </p>
                    </div>
                  )}
                  {generatedPoem.length === 0 && (
                    <p className="text-indigo-400 text-sm font-medium">
                      试试输入上面统计表里的“前字”哦！<br/>比如输入示例课文里的「<span className="text-indigo-600 font-bold cursor-pointer" onClick={() => setStartWord('春天')}>春天</span>」
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleGoToAttention}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-fuchsia-400 to-pink-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 hover:scale-105 shadow-xl shadow-fuchsia-200"
                >
                  <span className="flex items-center gap-2 text-xl">
                    <Star className="w-6 h-6" />
                    继续：揭秘文本生成的“注意力”魔法
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 5: Attention Mechanism */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.section 
              ref={step5Ref}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-fuchsia-100/50 border-4 border-white relative"
            >
              <div className="absolute -top-6 -left-6 bg-fuchsia-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-12 border-4 border-white">
                5
              </div>
              
              <h2 className="text-2xl font-bold flex items-center gap-3 text-fuchsia-500 mb-8">
                <Star className="w-7 h-7" />
                AI小课堂：揭秘文本生成的“注意力”魔法
              </h2>

              <AttentionMechanism />

              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleGoToSemantic}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-orange-400 to-amber-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 hover:scale-105 shadow-xl shadow-orange-200"
                >
                  <span className="flex items-center gap-2 text-xl">
                    <Compass className="w-6 h-6" />
                    终极进阶：探索语义编码模型
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 6: Semantic Coding */}
        <AnimatePresence>
          {step >= 6 && (
            <motion.section 
              ref={step6Ref}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-orange-100/50 border-4 border-white relative"
            >
              <div className="absolute -top-6 -left-6 bg-orange-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-12 border-4 border-white">
                6
              </div>
              
              <h2 className="text-2xl font-bold flex items-center gap-3 text-orange-500 mb-8">
                <Compass className="w-7 h-7" />
                语义空间：AI是如何“理解”文字的？
              </h2>

              <SemanticCoding words={wordData} />
              
              <div className="mt-12 pt-8 border-t-2 border-orange-50 text-center">
                <button 
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  完成探索，重新开始
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

