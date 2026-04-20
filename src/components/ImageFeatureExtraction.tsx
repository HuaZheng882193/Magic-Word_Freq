import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Scan, Search, Layers, Grid, Database, Calculator, ListOrdered, Shapes, Palette, Activity } from 'lucide-react';

export default function ImageFeatureExtraction() {
  return (
    <div className="space-y-8">
      <div className="text-pink-600 mb-8 font-medium text-lg leading-relaxed bg-pink-50/50 p-6 rounded-2xl border-2 border-pink-100">
        <strong className="text-xl inline-block mb-2">像AI一样“看”世界</strong><br />
        我们人类看图片是一眼看全，而AI是寻找图像中的“关键特征”，并把它们变成数字（特征向量）。
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {/* Core Concept */}
        <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-sm">
          <h3 className="font-bold text-pink-800 text-xl mb-4 flex items-center gap-2 border-b-2 border-pink-50 pb-2">
            <Layers className="w-6 h-6 text-pink-500" />
            核心概念：什么是图像特征？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl border border-pink-100">
              <div className="flex items-center gap-2 mb-2 font-bold text-pink-700">
                <Shapes className="w-5 h-5 text-orange-400" />
                图像的“本质信息”
              </div>
              <p className="text-sm text-slate-600">不看整体，看细节：<b className="text-pink-600">形状、纹理、颜色和边缘</b>。这些特征反映了图像本质的特定信息。</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl border border-pink-100">
              <div className="flex items-center gap-2 mb-2 font-bold text-pink-700">
                <Scan className="w-5 h-5 text-pink-400" />
                AI并不需要“完整观察”
              </div>
              <p className="text-sm text-slate-600">人工智能通过选取具有代表性的<b className="text-pink-600">关键位置（特征点）</b>来判断内容，而不是逐个像素看。</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl border border-pink-100">
              <div className="flex items-center gap-2 mb-2 font-bold text-pink-700">
                <Activity className="w-5 h-5 text-red-400" />
                从图像到数字的转换
              </div>
              <p className="text-sm text-slate-600">提取出的特征最终表现为一组数字，即<b className="text-pink-600">“特征向量”</b>。如：[0.3, 0.1, 0.9, 0.5, ...]</p>
            </div>
          </div>
        </div>

        {/* Feature Extraction Methods */}
        <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-sm">
          <h3 className="font-bold text-pink-800 text-xl mb-4 flex items-center gap-2 border-b-2 border-pink-50 pb-2">
            <Grid className="w-6 h-6 text-pink-500" />
            特征提取：AI如何获取信息？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-200 text-blue-800 flex items-center justify-center w-6 h-6 rounded-full text-sm">1</span>
                人工编码：关键点记录
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                像画数字“4”一样，选取关键位置：有颜色的记为1，无颜色的记为0，形成二进制编码。
              </p>
              <div className="bg-white rounded p-3 border border-blue-200 font-mono text-xs flex justify-around text-center">
                <div>
                  <div className="text-slate-400 mb-1">图像(数字)</div>
                  <div className="font-bold">4</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">关键点编码(特征)</div>
                  <div className="text-blue-600 font-bold tracking-widest">11001</div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
              <h4 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                <span className="bg-purple-200 text-purple-800 flex items-center justify-center w-6 h-6 rounded-full text-sm">2</span>
                自动提取：观察卡扫描
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                现代AI（如卷积神经网络）使用多个像“3x3观察卡”一样的小窗口扫描图片，<b className="text-purple-600">并行处理技术</b>获取多种特征。
              </p>
              <div className="flex items-center gap-3 bg-white p-3 rounded border border-purple-200">
                <ImageIcon className="w-8 h-8 text-purple-400" />
                <div className="flex-1">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-center">正在扫描提炼特征...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application */}
        <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-sm">
          <h3 className="font-bold text-pink-800 text-xl mb-4 flex items-center gap-2 border-b-2 border-pink-50 pb-2">
            <Search className="w-6 h-6 text-pink-500" />
            实际应用：以图搜图
          </h3>
          
          <div className="bg-emerald-50/50 rounded-xl p-5 mb-5 border border-emerald-100 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-800">相似度计算 (距离规律)</h4>
              <p className="text-sm text-slate-600">内容相近的图像，其在数字空间里的特征向量也更接近，距离越短越相似。</p>
            </div>
          </div>

          <h4 className="font-bold text-slate-700 text-center mb-4">“以图搜图”四步走</h4>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            <div className="flex flex-col items-center gap-2 text-pink-600">
              <div className="bg-pink-50 border-2 border-pink-200 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                <ImageIcon className="w-8 h-8" />
              </div>
              <span className="font-bold">1. 提取原图特征</span>
            </div>
            
            <div className="hidden md:block w-8 h-0.5 bg-slate-200"></div>
            
            <div className="flex flex-col items-center gap-2 text-indigo-600">
              <div className="bg-indigo-50 border-2 border-indigo-200 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                <Database className="w-8 h-8" />
              </div>
              <span className="font-bold">2. 提取库特征</span>
            </div>
            
            <div className="hidden md:block w-8 h-0.5 bg-slate-200"></div>

            <div className="flex flex-col items-center gap-2 text-orange-600">
              <div className="bg-orange-50 border-2 border-orange-200 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                <Calculator className="w-8 h-8" />
              </div>
              <span className="font-bold">3. 计算相似度</span>
            </div>
            
            <div className="hidden md:block w-8 h-0.5 bg-slate-200"></div>

            <div className="flex flex-col items-center gap-2 text-emerald-600">
              <div className="bg-emerald-50 border-2 border-emerald-200 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                <ListOrdered className="w-8 h-8" />
              </div>
              <span className="font-bold">4. 按相似度排序输出</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
