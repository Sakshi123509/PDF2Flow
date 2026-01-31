// Advanced Flowchart Layout with Tree Structure and Branches
// This creates professional-looking flowcharts with decision points and hierarchies

export function createSmartFlowchart(steps) {
  if (steps.length === 0) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];
  let nodeId = 0;

  // Analyze steps to detect structure
  const structure = analyzeStepStructure(steps);
  
  // Create nodes based on detected type
  structure.forEach((item, index) => {
    const id = nodeId.toString();
    nodeId++;

    // Determine node type and style
    let nodeStyle = getNodeStyle(item.type, item.level);
    
    // Calculate position based on hierarchy
    const position = calculatePosition(item, index, structure);

    nodes.push({
      id,
      type: 'default',
      data: { 
        label: item.text,
      },
      position,
      style: nodeStyle,
    });

    item.id = id;
  });

  // Create edges with proper branching
  structure.forEach((item, index) => {
    if (item.parent !== null) {
      edges.push({
        id: `e-${item.parent}-${item.id}`,
        source: item.parent,
        target: item.id,
        animated: item.type === 'decision' || item.type === 'process',
        label: item.edgeLabel || '',
        style: {
          stroke: getEdgeColor(item.type),
          strokeWidth: item.type === 'start' || item.type === 'end' ? 3 : 2,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: getEdgeColor(item.type),
        },
      });
    }
  });

  return { nodes, edges };
}

// Analyze steps to detect their type (start, process, decision, end)
function analyzeStepStructure(steps) {
  const structure = [];
  let level = 0;
  let parentStack = [];

  steps.forEach((step, index) => {
    const normalized = step.toLowerCase().trim();
    
    // Detect indentation level
    const indent = step.match(/^\s*/)[0].length;
    const newLevel = Math.floor(indent / 2);
    
    // Detect step type
    let type = 'process';
    if (index === 0 || normalized.includes('start') || normalized.includes('begin')) {
      type = 'start';
    } else if (normalized.includes('?') || normalized.includes('if') || normalized.includes('decide') || normalized.includes('check')) {
      type = 'decision';
    } else if (normalized.includes('end') || normalized.includes('finish') || normalized.includes('complete')) {
      type = 'end';
    } else if (normalized.match(/^\d+\./)) {
      type = 'process';
    } else if (normalized.includes('yes') || normalized.includes('no')) {
      type = 'branch';
    }

    // Determine parent
    let parent = null;
    if (index > 0) {
      if (newLevel > level) {
        // Child of previous
        parent = structure[index - 1].id || (index - 1).toString();
      } else if (newLevel === level) {
        // Sibling - same parent
        parent = parentStack[newLevel] || (index - 1).toString();
      } else {
        // Going back up
        parent = parentStack[newLevel] || '0';
      }
    }

    const item = {
      text: step.replace(/^\s+/, '').replace(/^\d+\.\s*/, ''),
      type,
      level: newLevel,
      parent,
      id: null, // Will be set when creating nodes
      edgeLabel: type === 'branch' ? (normalized.includes('yes') ? 'Yes' : 'No') : '',
    };

    structure.push(item);
    parentStack[newLevel] = index.toString();
    level = newLevel;
  });

  return structure;
}

// Get node style based on type
function getNodeStyle(type, level) {
  const baseStyle = {
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '3px solid',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    minWidth: '150px',
    textAlign: 'center',
  };

  switch (type) {
    case 'start':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderColor: '#764ba2',
        borderRadius: '50px',
        color: '#fff',
        fontWeight: '700',
        padding: '20px 32px',
      };
    
    case 'end':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderColor: '#f5576c',
        borderRadius: '50px',
        color: '#fff',
        fontWeight: '700',
        padding: '20px 32px',
      };
    
    case 'decision':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
        borderColor: '#fdcb6e',
        borderRadius: '8px',
        color: '#2d3436',
        fontWeight: '700',
        padding: '20px',
        minWidth: '140px',
      };
    
    case 'process':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderColor: '#00f2fe',
        borderRadius: '12px',
        color: '#fff',
      };
    
    case 'branch':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        borderColor: '#38f9d7',
        borderRadius: '12px',
        color: '#fff',
        padding: '12px 20px',
        minWidth: '100px',
      };
    
    default:
      return {
        ...baseStyle,
        background: '#ffffff',
        borderColor: '#d1d5db',
        borderRadius: '12px',
        color: '#374151',
      };
  }
}

// Get edge color based on node type
function getEdgeColor(type) {
  switch (type) {
    case 'start': return '#764ba2';
    case 'end': return '#f5576c';
    case 'decision': return '#fdcb6e';
    case 'process': return '#00f2fe';
    case 'branch': return '#38f9d7';
    default: return '#6b7280';
  }
}

// Calculate position with proper spacing and branching
function calculatePosition(item, index, structure) {
  const baseX = 400;
  const baseY = 100;
  const verticalGap = 150;
  const horizontalGap = 250;

  // For decisions, create branches
  if (item.type === 'decision') {
    return {
      x: baseX,
      y: baseY + (index * verticalGap),
    };
  }

  // For branches (yes/no), offset horizontally
  if (item.type === 'branch') {
    const parentIndex = structure.findIndex(s => s.id === item.parent);
    const isYes = item.text.toLowerCase().includes('yes');
    return {
      x: baseX + (isYes ? horizontalGap : -horizontalGap),
      y: baseY + ((parentIndex + 1) * verticalGap),
    };
  }

  // Default positioning with level offset
  return {
    x: baseX + (item.level * horizontalGap * 0.5),
    y: baseY + (index * verticalGap),
  };
}

// ============================================
// TREE STRUCTURE LAYOUT (Hierarchical)
// ============================================

export function createTreeLayout(steps) {
  if (steps.length === 0) return { nodes: [], edges: [] };

  // Build tree structure
  const tree = buildTree(steps);
  
  // Calculate positions using tree algorithm
  const positions = calculateTreePositions(tree);
  
  // Create nodes and edges
  const nodes = [];
  const edges = [];

  function traverseTree(node, parentId = null) {
    const pos = positions.get(node.id);
    
    nodes.push({
      id: node.id,
      data: { label: node.text },
      position: { x: pos.x, y: pos.y },
      style: getTreeNodeStyle(node.depth),
    });

    if (parentId !== null) {
      edges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        animated: true,
        style: {
          stroke: getDepthColor(node.depth),
          strokeWidth: 3,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: getDepthColor(node.depth),
        },
      });
    }

    node.children.forEach(child => traverseTree(child, node.id));
  }

  traverseTree(tree);

  return { nodes, edges };
}

function buildTree(steps) {
  const root = {
    id: '0',
    text: steps[0],
    children: [],
    depth: 0,
  };

  let nodeId = 1;
  let currentParent = root;
  let lastAtDepth = { 0: root };

  for (let i = 1; i < steps.length; i++) {
    const step = steps[i];
    const indent = step.match(/^\s*/)[0].length;
    const depth = Math.floor(indent / 2) + 1;

    const node = {
      id: nodeId.toString(),
      text: step.replace(/^\s+/, '').replace(/^\d+\.\s*/, ''),
      children: [],
      depth,
    };

    // Determine parent based on depth
    if (depth === 1) {
      root.children.push(node);
      currentParent = node;
    } else {
      const parent = lastAtDepth[depth - 1] || root;
      parent.children.push(node);
      currentParent = node;
    }

    lastAtDepth[depth] = node;
    nodeId++;
  }

  return root;
}

function calculateTreePositions(tree) {
  const positions = new Map();
  const xGap = 200;
  const yGap = 150;

  function layout(node, depth, leftBound, rightBound) {
    const x = (leftBound + rightBound) / 2;
    const y = 100 + depth * yGap;
    
    positions.set(node.id, { x, y });

    const childCount = node.children.length;
    if (childCount > 0) {
      const childWidth = (rightBound - leftBound) / childCount;
      node.children.forEach((child, i) => {
        const childLeft = leftBound + i * childWidth;
        const childRight = childLeft + childWidth;
        layout(child, depth + 1, childLeft, childRight);
      });
    }
  }

  layout(tree, 0, 0, 1200);
  return positions;
}

function getTreeNodeStyle(depth) {
  const colors = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: '#764ba2' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: '#f5576c' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: '#00f2fe' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', border: '#38f9d7' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: '#fa709a' },
  ];

  const color = colors[depth % colors.length];

  return {
    background: color.bg,
    color: '#fff',
    border: `3px solid ${color.border}`,
    borderRadius: depth === 0 ? '50px' : '15px',
    padding: depth === 0 ? '24px 32px' : '16px 24px',
    fontWeight: depth === 0 ? '700' : '600',
    fontSize: depth === 0 ? '16px' : '14px',
    minWidth: depth === 0 ? '200px' : '150px',
    boxShadow: `0 8px 20px ${color.border}40`,
    textAlign: 'center',
  };
}

function getDepthColor(depth) {
  const colors = ['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fa709a'];
  return colors[depth % colors.length];
}