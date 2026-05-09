import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Layers, RefreshCw, Image as ImageIcon, Wand2, Scale, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

export default function ImageStyleTransfer() {
  const [activeTab, setActiveTab] = useState<'principle' | 'styles' | 'ethics'>('principle');

  return (
    <div className="space-y-8">
      {/* Introduction text */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-2xl border-2 border-violet-100 text-violet-800">
        <p className="text-lg leading-relaxed font-medium">
          图像风格迁移是一种将一幅图像（风格图）的艺术风格应用到另一幅图像（内容图）上的AI技术。
          它让我们见证了当人工智能遇见艺术时，是如何创造出令人惊叹的视觉魔法的。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'principle', label: '原理与流程', icon: RefreshCw },
          { id: 'styles', label: '艺术风格特征', icon: Palette },
          { id: 'ethics', label: '边界与责任', icon: Scale },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-violet-500 text-white shadow-md scale-105' 
                : 'bg-white text-violet-600 hover:bg-violet-50 border-2 border-violet-100'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-violet-100 min-h-[400px]">
        {activeTab === 'principle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-violet-800">原理与实现流程</h3>
              <p className="text-violet-500 font-medium">核心思想：结构与视觉的融合</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-violet-50 rounded-2xl p-6 flex items-center justify-between border border-violet-100">
                <div className="text-center space-y-2 flex-1">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-200">
                    <Layers className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="font-bold text-blue-700">内容图</div>
                  <div className="text-sm text-blue-500">(结构特征：边缘、形像、部分)</div>
                </div>
                
                <RefreshCw className="w-8 h-8 text-violet-300 mx-2 animate-spin-slow" />
                
                <div className="text-center space-y-2 flex-1">
                  <div className="w-20 h-20 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center border-2 border-pink-200">
                    <Palette className="w-10 h-10 text-pink-500" />
                  </div>
                  <div className="font-bold text-pink-700">风格图</div>
                  <div className="text-sm text-pink-500">(视觉特征：色彩特色、纹理特征)</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-violet-700">从提取特征到生成新图</h4>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                  通过分析色彩和造型特征，将风格图的视觉元素（如梵高星空中的旋转笔触与色彩）巧妙地应用到内容图的结构上，实现一幅内容的视觉重构。
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-violet-100">
              <h4 className="font-bold text-lg text-violet-700 text-center mb-6">风格迁移的三步操作</h4>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center space-y-3 relative">
                  <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl">1</div>
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-700">选择内容图</div>
                </div>
                <div className="hidden md:flex items-center text-violet-300">➜</div>
                <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center space-y-3 relative">
                  <div className="w-12 h-12 mx-auto bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">2</div>
                  <Palette className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-700">选择风格图</div>
                </div>
                <div className="hidden md:flex items-center text-violet-300">➜</div>
                <div className="flex-1 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-4 rounded-xl shadow-md text-center space-y-3 text-white">
                  <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                  <Wand2 className="w-8 h-8 text-white mx-auto" />
                  <div className="font-bold">一键生成新作品</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'styles' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-violet-800">艺术风格在AI分析中的特征差异</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* 卡通 */}
              <div className="bg-[#FFF4E6] rounded-2xl overflow-hidden border-2 border-orange-200">
                <div className="bg-orange-400 text-white font-bold text-center py-2">卡通</div>
                <div className="p-5 space-y-4">
                  <div className="h-32 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200 mb-4">
                    <span className="text-4xl">👦</span>
                  </div>
                  <div>
                    <strong className="text-orange-800 block mb-1">造型特征：</strong>
                    <p className="text-orange-700 text-sm">线条明确，造型夸张</p>
                  </div>
                  <div>
                    <strong className="text-orange-800 block mb-1">色彩与光影特征：</strong>
                    <p className="text-orange-700 text-sm">以色块为主，通常无光影变化</p>
                  </div>
                </div>
              </div>

              {/* 水墨画 */}
              <div className="bg-[#F0F4FF] rounded-2xl overflow-hidden border-2 border-blue-200">
                <div className="bg-blue-400 text-white font-bold text-center py-2">水墨画</div>
                <div className="p-5 space-y-4">
                  <div className="h-32 bg-slate-200 rounded-xl flex items-center justify-center border border-slate-300 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-400 via-slate-200 to-white opacity-80 mix-blend-multiply"></div>
                    <span className="text-4xl relative z-10">⛰️</span>
                  </div>
                  <div>
                    <strong className="text-blue-800 block mb-1">造型特征：</strong>
                    <p className="text-blue-700 text-sm">线条简练，粗细变化</p>
                  </div>
                  <div>
                    <strong className="text-blue-800 block mb-1">色彩与光影特征：</strong>
                    <p className="text-blue-700 text-sm">墨色层次丰富，留白多</p>
                  </div>
                </div>
              </div>

              {/* 油画 */}
              <div className="bg-[#E6F8F0] rounded-2xl overflow-hidden border-2 border-emerald-200">
                <div className="bg-emerald-400 text-white font-bold text-center py-2">油画</div>
                <div className="p-5 space-y-4">
                  <div className="h-32 bg-amber-100 rounded-xl flex items-center justify-center border border-emerald-200 mb-4 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200 via-emerald-100 to-blue-200 blur-[2px]"></div>
                     <span className="text-4xl relative z-10">🌌</span>
                  </div>
                  <div>
                    <strong className="text-emerald-800 block mb-1">造型特征：</strong>
                    <p className="text-emerald-700 text-sm">笔触厚重斑驳</p>
                  </div>
                  <div>
                    <strong className="text-emerald-800 block mb-1">色彩与光影特征：</strong>
                    <p className="text-emerald-700 text-sm">色彩丰富，富有质感与立体感</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ethics' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-violet-800 flex items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6" /> 创作边界与法律责任
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-red-800 text-lg">潜在的著作权风险</h4>
                <p className="text-sm text-red-600">随意使用他人艺术风格生成作品可能涉及版权法律问题。</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-blue-800 text-lg">增强合规创作意识</h4>
                <p className="text-sm text-blue-600">在商业用途发布作品时，需考虑是否标注原风格出处。</p>
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                  <Scale className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-emerald-800 text-lg">科技与伦理的平衡</h4>
                <p className="text-sm text-emerald-600">在运用AI展现艺术之美的同时，应尊重原创并遵守法律法规。</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
