'use client';

import { useEffect, useRef } from 'react';
import { useAlgorithmStore } from '@/store/algorithmStore';
import * as d3 from 'd3';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export default function TreeVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tree } = useAlgorithmStore();

  useEffect(() => {
    if (!svgRef.current || !tree.root) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Create tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

    // Create hierarchy
    const root = d3.hierarchy(tree.root);
    const treeData = treeLayout(root);

    // Create links
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('path')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8');

    // Create nodes
    const nodes = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('g')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', d => tree.visited.includes(d.data.value) ? '#3b82f6' : '#ffffff')
      .attr('stroke', '#1e40af')
      .attr('stroke-width', 2);

    // Add labels
    nodes.append('text')
      .text(d => d.data.value)
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#000000');

  }, [tree]);

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