import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlowChart from "../components/flowchart";

const FlowContainer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState("flowchart");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("flowData");
    
    if (!storedData) {
      setError("No flowchart data found. Please upload a PDF first.");
      return;
    }

    try {
      const textArray = JSON.parse(storedData);
      
      if (!Array.isArray(textArray) || textArray.length === 0) {
        setError("Invalid flowchart data.");
        return;
      }

      let newNodes = [];
      let newEdges = [];

      if (mode === "mindmap") {
        const result = createMindMapWithSolidArrows(textArray);
        newNodes = result.nodes;
        newEdges = result.edges;
      } else {
        const result = createFlowchartWithBranches(textArray);
        newNodes = result.nodes;
        newEdges = result.edges;
      }

      setNodes(newNodes);
      setEdges(newEdges);
      setError(null);
      
    } catch (err) {
      console.error("Error parsing flowchart data:", err);
      setError("Failed to load flowchart data.");
    }
  }, [mode]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
          >
            Upload PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PDF Visualizer</h1>
            <p className="text-sm text-gray-600">{nodes.length} concepts</p>
          </div>

          {/* Mode Toggle - Only 2 buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("flowchart")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                mode === "flowchart"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📊 Flowchart
            </button>

            <button
              onClick={() => setMode("mindmap")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                mode === "mindmap"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🧠 Mind Map
            </button>

            <button
              onClick={() => navigate("/upload")}
              className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
            >
              New PDF
            </button>
          </div>
        </div>
      </div>

      {/* Flowchart - FILLS REMAINING SPACE */}
      <div className="flex-1 overflow-hidden">
        <FlowChart nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

// ============================================
// FLOWCHART WITH BRANCHES AND BETTER COLORS
// ============================================
function createFlowchartWithBranches(steps) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;

  // Detect if there are questions/decisions in the text
  const hasDecisions = steps.some(s => 
    s.includes('?') || 
    s.toLowerCase().includes('if') ||
    s.toLowerCase().includes('yes') ||
    s.toLowerCase().includes('no')
  );

  if (hasDecisions) {
    // Create flowchart with branches for decisions
    return createFlowchartWithDecisionBranches(steps);
  } else {
    // Create simple vertical flowchart with heading colors
    return createSimpleFlowchartWithHeadings(steps);
  }
}

function createFlowchartWithDecisionBranches(steps) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;
  let yPosition = 50;
  let currentParent = null;

  steps.forEach((text, index) => {
    const id = nodeId.toString();
    const normalized = text.toLowerCase();
    
    let nodeType = 'content';
    let style;
    let position;

    // Detect node type
    if (index === 0 || normalized.includes('start') || normalized.includes('begin')) {
      nodeType = 'start';
      style = {
        background: '#1E40AF', // Dark blue for START
        color: '#fff',
        borderRadius: '25px',
        padding: '20px 28px',
        border: '3px solid #1E3A8A',
        minWidth: '200px',
        fontSize: '16px',
        fontWeight: '700',
        textAlign: 'center',
      };
      position = { x: 500, y: yPosition };
      yPosition += 120;
    } 
    else if (normalized.includes('?') || normalized.includes('if') || normalized.includes('check')) {
      nodeType = 'decision';
      style = {
        background: '#FBBF24', // Yellow for DECISIONS
        color: '#78350F',
        borderRadius: '10px',
        padding: '18px 24px',
        border: '3px solid #F59E0B',
        minWidth: '180px',
        fontSize: '15px',
        fontWeight: '700',
        textAlign: 'center',
      };
      position = { x: 500, y: yPosition };
      yPosition += 120;
    }
    else if (normalized.includes('yes') || normalized.includes('no')) {
      nodeType = 'branch';
      const isYes = normalized.includes('yes');
      style = {
        background: isYes ? '#10B981' : '#EF4444', // Green for YES, Red for NO
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 22px',
        border: `3px solid ${isYes ? '#059669' : '#DC2626'}`,
        minWidth: '160px',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'center',
      };
      // Position branches left and right
      position = { 
        x: isYes ? 700 : 300, 
        y: yPosition - 20
      };
    }
    else if (normalized.includes('end') || normalized.includes('finish')) {
      nodeType = 'end';
      style = {
        background: '#BE185D', // Dark pink for END
        color: '#fff',
        borderRadius: '25px',
        padding: '20px 28px',
        border: '3px solid #9F1239',
        minWidth: '200px',
        fontSize: '16px',
        fontWeight: '700',
        textAlign: 'center',
      };
      position = { x: 500, y: yPosition };
      yPosition += 120;
    }
    else {
      // Regular content nodes
      style = {
        background: '#64748B', // Gray for CONTENT
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 22px',
        border: '3px solid #475569',
        minWidth: '200px',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'center',
      };
      position = { x: 500, y: yPosition };
      yPosition += 110;
    }

    nodes.push({
      id,
      data: { label: text },
      position,
      style,
    });

    // Create edges
    if (currentParent !== null) {
      edges.push({
        id: `e-${currentParent}-${id}`,
        source: currentParent,
        target: id,
        animated: nodeType === 'decision',
        style: { 
          stroke: '#64748B',
          strokeWidth: 3,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#64748B',
        },
      });
    }

    if (nodeType !== 'branch') {
      currentParent = id;
    }

    nodeId++;
  });

  return { nodes, edges };
}

function createSimpleFlowchartWithHeadings(steps) {
  const nodes = [];
  const edges = [];

  steps.forEach((text, index) => {
    const isHeading = index === 0 || text.length < 50 || /^[A-Z][^.!?]*$/.test(text.trim());
    
    let style;
    if (index === 0) {
      // First item - Main heading
      style = {
        background: '#1E40AF',
        color: '#fff',
        borderRadius: '25px',
        padding: '22px 30px',
        border: '3px solid #1E3A8A',
        minWidth: '220px',
        fontSize: '17px',
        fontWeight: '700',
        textAlign: 'center',
      };
    } else if (isHeading) {
      // Sub-headings
      style = {
        background: '#7C3AED',
        color: '#fff',
        borderRadius: '15px',
        padding: '18px 26px',
        border: '3px solid #6D28D9',
        minWidth: '200px',
        fontSize: '15px',
        fontWeight: '700',
        textAlign: 'center',
      };
    } else {
      // Content
      style = {
        background: '#64748B',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 22px',
        border: '3px solid #475569',
        minWidth: '200px',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'center',
      };
    }

    nodes.push({
      id: index.toString(),
      data: { label: text },
      position: { 
        x: 500, 
        y: 50 + index * 110
      },
      style,
    });

    if (index > 0) {
      edges.push({
        id: `e-${index - 1}-${index}`,
        source: (index - 1).toString(),
        target: index.toString(),
        animated: false,
        style: { 
          stroke: '#64748B',
          strokeWidth: 3,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#64748B',
        },
      });
    }
  });

  return { nodes, edges };
}

// ============================================
// MIND MAP WITH SOLID ARROWS (NO DOTS)
// ============================================
function createMindMapWithSolidArrows(steps) {
  const nodes = [];
  const edges = [];

  if (steps.length === 0) return { nodes, edges };

  // Calculate canvas center
  const centerX = 600;
  const centerY = 400;

  // Central topic - MAIN HEADING
  const centralTopic = steps[0];
  nodes.push({
    id: '0',
    data: { label: centralTopic },
    position: { x: centerX - 130, y: centerY - 85 },
    style: {
      background: '#1E40AF', // Dark blue for main heading
      color: '#fff',
      borderRadius: '50%',
      padding: '40px',
      border: '4px solid #1E3A8A',
      fontWeight: '700',
      fontSize: '17px',
      width: '260px',
      height: '170px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  });

  // Branch topics - CONTENT
  const branches = steps.slice(1);
  const colors = [
    { bg: '#8B5CF6', border: '#7C3AED' },  // Purple
    { bg: '#EC4899', border: '#DB2777' },  // Pink
    { bg: '#10B981', border: '#059669' },  // Green
    { bg: '#F59E0B', border: '#D97706' },  // Orange
    { bg: '#14B8A6', border: '#0D9488' },  // Teal
    { bg: '#3B82F6', border: '#2563EB' },  // Blue
    { bg: '#EF4444', border: '#DC2626' },  // Red
    { bg: '#64748B', border: '#475569' },  // Gray
  ];

  const radius = 320;
  const angleStep = (2 * Math.PI) / branches.length;

  branches.forEach((label, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - 90;
    const y = centerY + radius * Math.sin(angle) - 42;
    
    const colorIndex = index % colors.length;

    nodes.push({
      id: (index + 1).toString(),
      data: { label },
      position: { x, y },
      style: {
        background: colors[colorIndex].bg,
        color: '#fff',
        borderRadius: '14px',
        padding: '18px 24px',
        border: `3px solid ${colors[colorIndex].border}`,
        minWidth: '180px',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'center',
      },
    });

    // SOLID ARROWS - NOT DOTTED
    edges.push({
      id: `e-0-${index + 1}`,
      source: '0',
      target: (index + 1).toString(),
      animated: true,
      style: { 
        stroke: '#64748B',
        strokeWidth: 3,
        // NO strokeDasharray - makes it solid!
      },
      markerEnd: {
        type: 'arrowclosed',
        color: '#64748B',
      },
    });
  });

  return { nodes, edges };
}

export default FlowContainer;