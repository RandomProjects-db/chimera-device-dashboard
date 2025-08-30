'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Device } from '@/types/device';

interface NetworkGraphProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
}

export default function NetworkGraph({ devices, onDeviceClick }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<any>(null);

  useEffect(() => {
    if (!svgRef.current || devices.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom as any);

    // Create container for zoomable content
    const container = svg.append("g");

    // Create nodes with enhanced properties
    const nodes = devices.map(device => ({
      ...device,
      x: centerX + Math.random() * 200 - 100,
      y: centerY + Math.random() * 200 - 100,
      radius: device.is_active ? 12 : 8,
      color: getDeviceColor(device)
    }));

    // Create links based on groups and device types
    const links = createLinks(nodes);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collision", d3.forceCollide().radius(20));

    // Create links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2);

    // Create nodes
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .style("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for devices
    node.append("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add device type icons/text
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .text((d: any) => getDeviceIcon(d.ai_classification.device_type));

    // Add labels
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "25px")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text((d: any) => d.given_name);

    // Add click handler
    node.on("click", (event, d) => {
      onDeviceClick(d as Device);
    });

    // Add hover effects
    node.on("mouseover", function(event, d) {
      d3.select(this).select("circle")
        .transition().duration(200)
        .attr("r", (d: any) => d.radius * 1.5);
    })
    .on("mouseout", function(event, d) {
      d3.select(this).select("circle")
        .transition().duration(200)
        .attr("r", (d: any) => d.radius);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [devices, onDeviceClick]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Network Topology</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (zoomRef.current && svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.transition().call(
                  zoomRef.current.transform,
                  d3.zoomIdentity.scale(1).translate(0, 0)
                );
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Reset View
          </button>
        </div>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          width="800"
          height="600"
          className="border border-gray-200 rounded"
        />
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded text-xs text-gray-600">
          <div>🖱️ Drag to pan</div>
          <div>🔍 Scroll to zoom</div>
          <div>📱 Drag nodes to move</div>
        </div>
      </div>
    </div>
  );
}

function getDeviceColor(device: Device): string {
  const category = device.ai_classification.device_category;
  const colorMap: Record<string, string> = {
    'Network Infrastructure': '#3B82F6',
    'IoT Device': '#10B981',
    'Computer': '#8B5CF6',
    'Mobile Device': '#F59E0B',
    'Server': '#EF4444',
    'Security Device': '#6366F1'
  };
  return colorMap[category] || '#6B7280';
}

function getDeviceIcon(deviceType: string): string {
  const iconMap: Record<string, string> = {
    'Gateway': '🌐',
    'Access Point': '📡',
    'Switch': '🔀',
    'Router': '🔄',
    'Computer': '💻',
    'Phone': '📱',
    'Tablet': '📱',
    'IoT': '🔗',
    'Server': '🖥️',
    'Camera': '📹'
  };
  return iconMap[deviceType] || '📱';
}

function createLinks(nodes: any[]): any[] {
  const links: any[] = [];
  
  // Connect devices in the same group
  const groups = d3.group(nodes, d => d.group.name);
  groups.forEach(groupDevices => {
    for (let i = 0; i < groupDevices.length - 1; i++) {
      for (let j = i + 1; j < groupDevices.length; j++) {
        links.push({
          source: groupDevices[i].id,
          target: groupDevices[j].id
        });
      }
    }
  });

  // Connect gateways to other devices
  const gateways = nodes.filter(n => n.ai_classification.device_type === 'Gateway');
  gateways.forEach(gateway => {
    nodes.forEach(node => {
      if (node.id !== gateway.id && Math.random() > 0.7) {
        links.push({
          source: gateway.id,
          target: node.id
        });
      }
    });
  });

  return links;
}
