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

    const width = 800;
    const height = 800;
    const margin = { top: 40, right: 50, bottom: 20, left: 150 };

    // Prepare data for heatmaps
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

    // Create separate heatmap for each category
    const heatmapHeight = 120;
    const spacing = 20;

    categories.forEach((category, categoryIndex) => {
      const yOffset = categoryIndex * (heatmapHeight + spacing) + margin.top;
      
      // Filter data for this category
      const categoryData = heatmapData.filter(d => d.category === category && d.count > 0);
      
      if (categoryData.length === 0) return;

      // Create scales for this heatmap
      const xScale = d3.scaleBand()
        .domain(groups)
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(categoryData, d => d.count) || 1]);

      // Add category title
      svg.append("text")
        .attr("x", margin.left - 10)
        .attr("y", yOffset + heatmapHeight / 2)
        .attr("text-anchor", "end")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text(category);

      // Create cells for this category
      const cells = svg.selectAll(`.cell-${categoryIndex}`)
        .data(categoryData)
        .enter().append("g")
        .attr("class", `cell-${categoryIndex}`)
        .style("cursor", "pointer");

      cells.append("rect")
        .attr("x", d => xScale(d.group)!)
        .attr("y", yOffset)
        .attr("width", xScale.bandwidth())
        .attr("height", heatmapHeight - 20)
        .attr("fill", d => colorScale(d.count))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("rx", 4)
        .on("click", (event, d) => {
          if (d.devices.length > 0) {
            onDeviceClick(d.devices[0]);
          }
        });

      // Add count labels
      cells.append("text")
        .attr("x", d => xScale(d.group)! + xScale.bandwidth() / 2)
        .attr("y", yOffset + (heatmapHeight - 20) / 2)
        .attr("text-anchor", "middle")
        .attr("dy", "-0.3em")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", d => d.count > 2 ? "white" : "#374151")
        .text(d => d.count);

      // Add active count
      cells.append("text")
        .attr("x", d => xScale(d.group)! + xScale.bandwidth() / 2)
        .attr("y", yOffset + (heatmapHeight - 20) / 2)
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .attr("font-size", "12px")
        .attr("fill", d => d.count > 2 ? "white" : "#374151")
        .text(d => `${d.activeCount} active`);

      // Add confidence indicator
      cells.append("circle")
        .attr("cx", d => xScale(d.group)! + xScale.bandwidth() - 15)
        .attr("cy", yOffset + 15)
        .attr("r", 5)
        .attr("fill", d => d.avgConfidence > 0.8 ? "#10B981" : d.avgConfidence > 0.6 ? "#F59E0B" : "#EF4444");

      // Add group labels (only for first category)
      if (categoryIndex === 0) {
        svg.append("g")
          .selectAll("text")
          .data(groups)
          .enter().append("text")
          .attr("x", d => xScale(d)! + xScale.bandwidth() / 2)
          .attr("y", yOffset - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "500")
          .attr("fill", "#374151")
          .text(d => d);
      }
    });

    // Add legend
    const legendY = categories.length * (heatmapHeight + spacing) + margin.top + 20;
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${legendY})`);

    legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Legend:");

    legend.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("font-size", "11px")
      .text("Numbers show: Total devices / Active devices");

    // Confidence legend
    const confidenceItems = [
      { color: "#10B981", label: "High confidence (>80%)" },
      { color: "#F59E0B", label: "Medium confidence (60-80%)" },
      { color: "#EF4444", label: "Low confidence (<60%)" }
    ];

    confidenceItems.forEach((item, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(250, ${i * 15})`);

      legendItem.append("circle")
        .attr("r", 5)
        .attr("fill", item.color);

      legendItem.append("text")
        .attr("x", 12)
        .attr("y", 4)
        .attr("font-size", "11px")
        .text(item.label);
    });

  }, [devices, onDeviceClick]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Device Distribution by Category</h3>
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          width="800"
          height="800"
          className="border border-gray-200 rounded"
        />
      </div>
    </div>
  );
}
