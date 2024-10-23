'use client';

import { useEffect, useRef } from 'react';
import { useAlgorithmStore } from '@/store/algorithmStore';
import * as d3 from 'd3';

export default function GraphVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { graph, currentStep, steps } = useAlgorithmStore();
  const currentState = steps[currentStep] || { 
    visited: [], 
    queue: [], 
    current: null 
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create arrow marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#94a3b8');

    // Draw edges
    const edges = svg.append('g')
      .selectAll('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('x1', d => {
        const source = graph.nodes.find(n => n.id === d.from);
        return source ? source.x : 0;
      })
      .attr('y1', d => {
        const source = graph.nodes.find(n => n.id === d.from);
        return source ? source.y : 0;
      })
      .attr('x2', d => {
        const target = graph.nodes.find(n => n.id === d.to);
        return target ? target.x : 0;
      })
      .attr('y2', d => {
        const target = graph.nodes.find(n => n.id === d.to);
        return target ? target.y : 0;
      })
      .attr('stroke', '#94a3b8')
      .attr('marker-end', 'url(#arrowhead)');

    // Draw nodes
    const nodes = svg.append('g')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Node circles
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        if (d.id === currentState.current) return '#fbbf24';
        if (currentState.visited.includes(d.id)) return '#3b82f6';
        if (currentState.queue.includes(d.id)) return '#60a5fa';
        return '#ffffff';
      })
      .attr('stroke', '#1e40af')
      .attr('stroke-width', 2);

    // Node labels
    nodes.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('fill', '#000000');

  }, [graph, currentState]);

  return (
    <svg
      ref={svgRef}
      width="800"
      height="400"
      className="w-full h-full"
      viewBox="0 0 800 400"
    />
  );
}