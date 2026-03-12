import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordCloudProps {
  words: { text: string; value: number }[];
  width?: number;
  height?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ words, width = 600, height = 800 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(true);

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return;

    setIsDrawing(true);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const maxFreq = Math.max(...words.map((w) => w.value));
    const minFreq = Math.min(...words.map((w) => w.value));
    
    const fontScale = d3.scaleSqrt().domain([minFreq, maxFreq]).range([24, 120]);
    
    // Vibrant and readable cute colors
    const cuteColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
      '#F06292', '#BA68C8', '#4DB6AC', '#FFB74D', '#FF8A65', 
      '#A1887F', '#64B5F6', '#81C784', '#E57373', '#9575CD'
    ];
    const colorScale = d3.scaleOrdinal(cuteColors);

    const layout = cloud()
      .size([width, height])
      .words(words.map((d) => ({ text: d.text, size: fontScale(d.value) })))
      .padding(12)
      .rotate(() => (Math.random() > 0.8 ? 90 : 0))
      .font('"Nunito", "Comic Sans MS", "Ma Shan Zheng", sans-serif')
      .fontSize((d) => d.size!)
      .on('end', draw);

    layout.start();

    function draw(words: any[]) {
      svg
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('max-width', '100%')
        .style('height', 'auto')
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d) => `${d.size}px`)
        .style('font-family', '"Nunito", "Comic Sans MS", "Ma Shan Zheng", sans-serif')
        .style('fill', (d, i) => colorScale(i.toString()))
        .style('font-weight', '900')
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text((d) => d.text)
        // Add a cute pop-in animation
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 20)
        .style('opacity', 1)
        .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate}) scale(1)`);
        
      setIsDrawing(false);
    }
  }, [words, width, height]);

  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden rounded-3xl bg-white/50 p-4 border-4 border-dashed border-pink-200">
      {isDrawing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-3xl">
          <div className="animate-bounce text-6xl">✨</div>
        </div>
      )}
      <svg ref={svgRef} className="w-full max-w-[600px] h-auto drop-shadow-sm" />
    </div>
  );
};

export default WordCloud;
