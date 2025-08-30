'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Device } from '@/types/device';

interface DeviceHeatmapProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
}

export default function DeviceHeatmap({ devices, onDeviceClick }: DeviceHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || devices.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 500;
    const margin = { top: 80, right: 120, bottom: 60, left: 180 };

    // Prepare data for heatmap
    const groups = Array.from(new Set(devices.map(d => d.group.name)));
    const categories = Array.from(new Set(devices.map(d => d.ai_classification.device_category)));

    const heatmapData: any[] = [];
    groups.forEach(group => {
      categories.forEach(category => {
        const groupDevices = devices.filter(d => d.group.name === group && d.ai_classification.device_category === category);
        const activeCount = groupDevices.filter(d => d.is_active).length;
        const avgConfidence = groupDevices.length > 0 
          ? groupDevices.reduce((sum, d) => sum + d.ai_classification.confidence, 0) / groupDevices.length 
          : 0;
        
        heatmapData.push({
          group,
          category,
          count: groupDevices.length,
          activeCount,
          avgConfidence,
          devices: groupDevices
        });
      });
    });

    // Scales
    const xScale = d3.scaleBand()
      .domain(categories)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(groups)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([0, d3.max(heatmapData, d => d.count) || 1]);

    // Draw heatmap cells
    const cells = svg.selectAll(".cell")
      .data(heatmapData.filter(d => d.count > 0))
      .enter().append("g")
      .attr("class", "cell")
      .style("cursor", "pointer");

    cells.append("rect")
      .attr("x", d => xScale(d.category)!)
      .attr("y", d => yScale(d.group)!)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.count))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d) => {
        if (d.devices.length > 0) {
          onDeviceClick(d.devices[0]);
        }
      });

    // Add count labels
    cells.append("text")
      .attr("x", d => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.group)! + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", d => d.count > 3 ? "white" : "black")
      .text(d => d.count);

    // Add active count
    cells.append("text")
      .attr("x", d => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.group)! + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("font-size", "10px")
      .attr("fill", d => d.count > 3 ? "white" : "black")
      .text(d => `${d.activeCount} active`);

    // Add confidence indicator
    cells.append("circle")
      .attr("cx", d => xScale(d.category)! + xScale.bandwidth() - 10)
      .attr("cy", d => yScale(d.group)! + 10)
      .attr("r", 4)
      .attr("fill", d => d.avgConfidence > 0.8 ? "#10B981" : d.avgConfidence > 0.6 ? "#F59E0B" : "#EF4444");

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0, ${margin.top})`)
      .call(d3.axisTop(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "-0.5em")
      .style("font-size", "12px")
      .style("fill", "#374151");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#374151");

    // Add axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Device Categories");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Groups");

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5);

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");

    gradient.selectAll("stop")
      .data(d3.range(0, 1.1, 0.1))
      .enter().append("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => colorScale(d * (colorScale.domain()[1] - colorScale.domain()[0]) + colorScale.domain()[0]));

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legend.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);

    legend.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Device Count");

  }, [devices, onDeviceClick]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Device Distribution Heatmap</h3>
      <svg
        ref={svgRef}
        width="900"
        height="500"
        className="border border-gray-200 rounded"
      />
    </div>
  );
}
