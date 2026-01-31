import React from "react";
import ReactFlow, { Controls, MiniMap, Background } from "reactflow";
import "reactflow/dist/style.css";

const FlowChart = ({ nodes, edges }) => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#f8fafc" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{
          padding: 0.15,
          includeHiddenNodes: false,
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnScroll={true}
        panOnScroll={false}
        minZoom={0.1}
        maxZoom={1.5}
      >
        {/* Clean background */}
        <Background 
          gap={20} 
          size={1}
          color="#cbd5e1"
          style={{ background: "#f8fafc" }}
        />

        {/* Controls */}
        <Controls 
          showInteractive={false}
          style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />

        {/* Mini map */}
        <MiniMap
          nodeColor={(node) => {
            const bg = node.style?.background || '#64748b';
            // Extract hex color from background
            if (bg.includes('#')) {
              return bg.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#64748b';
            }
            return '#64748b';
          }}
          nodeStrokeWidth={2}
          maskColor="rgba(0, 0, 0, 0.05)"
          style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowChart;