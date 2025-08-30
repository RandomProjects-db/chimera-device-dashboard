'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Device } from '@/types/device';

interface RadialClusterProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
}

export default function RadialCluster({ devices, onDeviceClick }: RadialClusterProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || devices.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;

    // Group devices by category
    const categories = d3.group(devices, d => d.ai_classification.device_category);
    const categoryArray = Array.from(categories.entries());

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Position categories in a circle
    categoryArray.forEach(([category, categoryDevices], categoryIndex) => {
      const categoryAngle = (categoryIndex / categoryArray.length) * 2 * Math.PI;
      const categoryX = centerX + Math.cos(categoryAngle) * radius;
      const categoryY = centerY + Math.sin(categoryAngle) * radius;

      // Draw category circle
      svg.append("circle")
        .attr("cx", categoryX)
        .attr("cy", categoryY)
        .attr("r", 40)
        .attr("fill", colorScale(category))
        .attr("fill-opacity", 0.2)
        .attr("stroke", colorScale(category))
        .attr("stroke-width", 2);

      // Add category label
      svg.append("text")
        .attr("x", categoryX)
        .attr("y", categoryY - 50)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", colorScale(category))
        .text(category);

      // Position devices around category center
      categoryDevices.forEach((device, deviceIndex) => {
        const deviceAngle = (deviceIndex / categoryDevices.length) * 2 * Math.PI;
        const deviceRadius = 30 + (device.ai_classification.confidence * 20);
        const deviceX = categoryX + Math.cos(deviceAngle) * deviceRadius;
        const deviceY = categoryY + Math.sin(deviceAngle) * deviceRadius;

        // Create device group
        const deviceGroup = svg.append("g")
          .attr("transform", `translate(${deviceX}, ${deviceY})`)
          .style("cursor", "pointer");

        // Device circle
        deviceGroup.append("circle")
          .attr("r", device.is_active ? 8 : 5)
          .attr("fill", device.is_active ? colorScale(category) : "#ccc")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .on("click", () => onDeviceClick(device));

        // Confidence ring
        deviceGroup.append("circle")
          .attr("r", 12)
          .attr("fill", "none")
          .attr("stroke", colorScale(category))
          .attr("stroke-width", 2)
          .attr("stroke-opacity", device.ai_classification.confidence)
          .attr("stroke-dasharray", `${device.ai_classification.confidence * 20} 5`);

        // Device label
        deviceGroup.append("text")
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#333")
          .text(device.given_name.substring(0, 8));

        // Hover effects
        deviceGroup
          .on("mouseover", function() {
            d3.select(this).select("circle")
              .transition().duration(200)
              .attr("r", device.is_active ? 12 : 8);
          })
          .on("mouseout", function() {
            d3.select(this).select("circle")
              .transition().duration(200)
              .attr("r", device.is_active ? 8 : 5);
          });

        // Connect to category center
        svg.append("line")
          .attr("x1", categoryX)
          .attr("y1", categoryY)
          .attr("x2", deviceX)
          .attr("y2", deviceY)
          .attr("stroke", colorScale(category))
          .attr("stroke-opacity", 0.3)
          .attr("stroke-width", 1);
      });
    });

    // Add legend
    const legend = svg.append("g")
      .attr("transform", "translate(20, 20)");

    legend.append("rect")
      .attr("width", 150)
      .attr("height", categoryArray.length * 25 + 10)
      .attr("fill", "white")
      .attr("stroke", "#ccc")
      .attr("rx", 5);

    categoryArray.forEach(([category], index) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(10, ${index * 25 + 20})`);

      legendItem.append("circle")
        .attr("r", 6)
        .attr("fill", colorScale(category));

      legendItem.append("text")
        .attr("x", 15)
        .attr("y", 4)
        .attr("font-size", "12px")
        .text(category);
    });

  }, [devices, onDeviceClick]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Device Categories (Radial View)</h3>
      <svg
        ref={svgRef}
        width="600"
        height="600"
        className="border border-gray-200 rounded"
      />
    </div>
  );
}
