import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Settings2, BookOpen, Layers, 
  ThermometerSun, Sparkles, Send, MoveRight, Loader2, Key
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || "";
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";

export default function TextGenerationFactors() {
  const [topic, setTopic] = useState("光合作用的过程");
  
  // Quality Inspectors & Tuners
  const [useMoralObserver, setUseMoralObserver] = useState(true);
  const [styleVal, setStyleVal] = useState("科普");
  const [lengthVal, setLengthVal] = useState("200字以内");
  
  // Temperature
  const [temperature, setTemperature] = useState<number>(0.7);
  
  // Base vs Fine-tuned Mode
  const [isFineTuned, setIsFineTuned] = useState(true);

  // Result state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [rawPrompt, setRawPrompt] = useState("");

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult("");

    let finalPrompt = "";
    if (isFineTuned) {
        // Construct the prompt taking into account all "factors"
        let instructions = [];
        if (styleVal) instructions.push(`以【${styleVal}】风格`);
        instructions.push(`介绍${topic}`);
        if (lengthVal) instructions.push(`字数在【${lengthVal}】`);
        
        finalPrompt = instructions.join("，") + "。";
        
        if (useMoralObserver) {
            finalPrompt += " (注意：请作为道德观察员，必须过滤并拒绝回答任何血腥、暴力等不妥内容。)";
        }
    } else {
        // Base model (fuzzy/empty prompt without structured constraints)
        finalPrompt = `${topic}`;
    }

    setRawPrompt(finalPrompt);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            {
              role: 'user',
              content: finalPrompt
            }
          ],
          temperature: temperature,
          max_tokens: 512,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (e) {
      console.error(e);
      setResult("Oops! 硅基流动API调用失败了。可能网络连接有问题，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border-2 border-cyan-100">
        <h3 className="text-xl font-bold text-cyan-700 mb-2 flex items-center gap-2">
          <Settings2 className="w-6 h-6" />
          后台揭秘：给AI设定规则
        </h3>
        <p className="text-cyan-600 leading-relaxed font-medium">
          在AI为你写文章之前，其实经过了多重“审核”和“参数调优”。这些提示词和参数，决定了最终输出内容的质量与多样性。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Control Panel */}
        <div className="space-y-6">
          {/* Section 1: Quality Inspectors */}
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-50 shadow-sm border-t-8 border-t-cyan-400">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
               <ShieldAlert className="w-5 h-5 text-cyan-500" />
               文本生成的“质检员”
            </h4>

            <div className="space-y-4">
               {/* Moral Observer */}
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                  <div className="flex flex-col">
                     <span className="font-bold text-slate-700 text-sm">道德观察员</span>
                     <span className="text-xs text-slate-400">过滤血腥、暴力等不当内容</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={useMoralObserver} onChange={e => setUseMoralObserver(e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400"></div>
                  </label>
               </div>

               {/* Style Inspector */}
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                  <div className="flex flex-col">
                     <span className="font-bold text-slate-700 text-sm">文风质检员</span>
                     <span className="text-xs text-slate-400">统一文本风格</span>
                  </div>
                  <select 
                    value={styleVal} 
                    onChange={e => setStyleVal(e.target.value)}
                    className="bg-white border-2 border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2 outline-none font-bold"
                  >
                    <option value="科普">科普</option>
                    <option value="古风">古风</option>
                    <option value="新闻播报">新闻播报</option>
                    <option value="童话故事">童话故事</option>
                  </select>
               </div>

               {/* Discipline Committee */}
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                  <div className="flex flex-col">
                     <span className="font-bold text-slate-700 text-sm">纪律委员</span>
                     <span className="text-xs text-slate-400">硬性字数与格式约束</span>
                  </div>
                  <select 
                    value={lengthVal} 
                    onChange={e => setLengthVal(e.target.value)}
                    className="bg-white border-2 border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2 outline-none font-bold"
                  >
                     <option value="50字以内">50字以内</option>
                     <option value="150字以内">150字以内</option>
                     <option value="300字左右">300字左右</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Section 2: Tuners (Temperature) */}
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-50 shadow-sm border-t-8 border-t-orange-400">
             <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
               <ThermometerSun className="w-5 h-5 text-orange-500" />
               “温度” 参数决定多样性
            </h4>
            
            <div className="px-2">
               <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span className={temperature < 0.5 ? 'text-orange-500' : ''}>稳定乏味 (0.0)</span>
                  <span className="text-orange-500 text-lg">{temperature.toFixed(1)}</span>
                  <span className={temperature > 1.5 ? 'text-orange-500' : ''}>创意失控 (2.0)</span>
               </div>
               <input 
                  type="range" 
                  min="0" max="2" step="0.1" 
                  value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
               />
               <div className="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-600 font-medium">
                  {temperature < 0.5 && "低温度：AI趋向于选择概率最高的词，内容准确但也比较固定。"}
                  {temperature >= 0.5 && temperature <= 1.2 && "中等温度：兼顾了相关性和一定的创新性，平时最常用。"}
                  {temperature > 1.2 && "高温度：AI会选择低概率词，极具创造性，但也容易“胡言乱语”。"}
               </div>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="flex flex-col h-full space-y-6">
           <div className="bg-white p-6 rounded-3xl border-4 border-blue-50 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                 {/* Mode Toggle */}
                 <div className="bg-slate-100 p-1 flex rounded-xl w-full">
                    <button 
                       onClick={() => setIsFineTuned(false)}
                       className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isFineTuned ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       基础模型模式
                    </button>
                    <button 
                       onClick={() => setIsFineTuned(true)}
                       className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isFineTuned ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       特定任务微调模式
                    </button>
                 </div>
              </div>

              <div className="mb-4">
                 <label className="text-xs font-black text-blue-400 px-2 uppercase tracking-wider">讨论主题</label>
                 <div className="flex gap-2 mt-1">
                    <input 
                       type="text" 
                       value={topic}
                       onChange={(e) => setTopic(e.target.value)}
                       placeholder="如：光合作用的过程"
                       className="flex-1 p-3 rounded-xl bg-blue-50 border-2 border-blue-100 focus:border-blue-400 outline-none transition-all font-bold text-blue-900"
                    />
                    <button 
                       onClick={handleGenerate}
                       disabled={loading || !topic}
                       className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 min-w-[100px]"
                    >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> 生成</>}
                    </button>
                 </div>
              </div>

              {/* Generated Result Box */}
              <div className="flex-1 bg-slate-800 rounded-2xl p-5 border-4 border-slate-700 text-slate-100 text-sm leading-relaxed overflow-y-auto max-h-[300px] shadow-inner relative flex flex-col font-mono">
                 {rawPrompt && (
                    <div className="mb-4 pb-4 border-b border-slate-600">
                       <div className="text-blue-400 font-bold mb-1 flex items-center gap-2 text-xs">
                          <Key className="w-3 h-3" />
                          发送给AI的最终Prompt：
                       </div>
                       <div className="text-slate-300 bg-slate-900/50 p-2 rounded-lg break-words">
                          {rawPrompt}
                       </div>
                    </div>
                 )}
                 
                 {loading ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-slate-400 gap-3">
                       <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                       <p className="font-bold animate-pulse">大模型正在思考输出中...</p>
                    </div>
                 ) : result ? (
                    <div className="whitespace-pre-wrap">{result}</div>
                 ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-slate-500 text-center px-4">
                       输入一个主题，点击生成，<br/>看看不同的设定会产生怎样截然不同的结果吧！
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
