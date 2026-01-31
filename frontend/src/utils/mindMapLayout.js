// Mind Map Layout Generator
// Creates a radial/hierarchical layout for better visualization

export function createMindMapLayout(steps) {
  if (steps.length === 0) return { nodes: [], edges: [] };

  const centerX = 500;
  const centerY = 400;
  
  // First step is the central topic
  const centralTopic = steps[0];
  const branches = steps.slice(1);

  // Create central node (main topic)
  const nodes = [
    {
      id: '0',
      type: 'default',
      data: { label: centralTopic },
      position: { x: centerX - 100, y: centerY - 75 },
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '50%',
        padding: '40px',
        border: '4px solid #764ba2',
        fontWeight: 'bold',
        fontSize: '18px',
        width: '200px',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(118, 75, 162, 0.4)',
      },
    },
  ];

  // Color palette for branches
  const colors = [
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: '#f5576c' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: '#00f2fe' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', border: '#38f9d7' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: '#fa709a' },
    { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', border: '#30cfd0' },
    { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: '#fed6e3' },
    { bg: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', border: '#ff6a88' },
    { bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', border: '#a6c1ee' },
  ];

  // Calculate positions in a circle around the center
  const radius = 300;
  const angleStep = (2 * Math.PI) / branches.length;

  branches.forEach((label, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle) - 80;
    const y = centerY + radius * Math.sin(angle) - 40;
    
    const colorIndex = index % colors.length;

    nodes.push({
      id: (index + 1).toString(),
      type: 'default',
      data: { label },
      position: { x, y },
      style: {
        background: colors[colorIndex].bg,
        color: '#fff',
        borderRadius: '20px',
        padding: '20px 25px',
        border: `3px solid ${colors[colorIndex].border}`,
        minWidth: '160px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: `0 8px 20px ${colors[colorIndex].border}40`,
        textAlign: 'center',
      },
    });
  });

  // Create edges from center to all branches
  const edges = branches.map((_, index) => ({
    id: `e-0-${index + 1}`,
    source: '0',
    target: (index + 1).toString(),
    animated: true,
    style: { 
      stroke: colors[index % colors.length].border,
      strokeWidth: 3,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: colors[index % colors.length].border,
    },
  }));

  return { nodes, edges };
}

// Hierarchical Mind Map (for better organization)
export function createHierarchicalMindMap(steps) {
  if (steps.length === 0) return { nodes: [], edges: [] };

  // Detect hierarchy by looking for patterns
  const hierarchy = detectHierarchy(steps);
  
  const centerX = 500;
  const centerY = 400;
  
  const nodes = [];
  const edges = [];
  let nodeId = 0;

  // Central node
  nodes.push({
    id: '0',
    data: { label: hierarchy.main },
    position: { x: centerX - 100, y: centerY - 75 },
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      borderRadius: '50%',
      padding: '40px',
      border: '4px solid #764ba2',
      fontWeight: 'bold',
      fontSize: '18px',
      width: '200px',
      height: '150px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(118, 75, 162, 0.4)',
    },
  });

  const colors = [
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: '#f5576c' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: '#00f2fe' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', border: '#38f9d7' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: '#fa709a' },
    { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', border: '#30cfd0' },
  ];

  // Create main branches
  const mainBranches = hierarchy.branches;
  const angleStep = (2 * Math.PI) / mainBranches.length;
  const mainRadius = 280;

  mainBranches.forEach((branch, branchIndex) => {
    nodeId++;
    const branchId = nodeId.toString();
    const angle = branchIndex * angleStep - Math.PI / 2;
    const x = centerX + mainRadius * Math.cos(angle) - 80;
    const y = centerY + mainRadius * Math.sin(angle) - 40;
    
    const colorIndex = branchIndex % colors.length;

    // Main branch node
    nodes.push({
      id: branchId,
      data: { label: branch.title },
      position: { x, y },
      style: {
        background: colors[colorIndex].bg,
        color: '#fff',
        borderRadius: '20px',
        padding: '20px 25px',
        border: `3px solid ${colors[colorIndex].border}`,
        minWidth: '160px',
        fontSize: '15px',
        fontWeight: '700',
        boxShadow: `0 8px 20px ${colors[colorIndex].border}40`,
        textAlign: 'center',
      },
    });

    // Edge from center to branch
    edges.push({
      id: `e-0-${branchId}`,
      source: '0',
      target: branchId,
      animated: true,
      style: { 
        stroke: colors[colorIndex].border,
        strokeWidth: 3,
      },
      markerEnd: {
        type: 'arrowclosed',
        color: colors[colorIndex].border,
      },
    });

    // Sub-items for this branch
    if (branch.items && branch.items.length > 0) {
      const subRadius = 150;
      const subAngleStep = Math.PI / (branch.items.length + 1);

      branch.items.forEach((item, itemIndex) => {
        nodeId++;
        const subId = nodeId.toString();
        const subAngle = angle + (itemIndex - branch.items.length / 2 + 1) * subAngleStep * 0.6;
        const subX = x + 80 + subRadius * Math.cos(subAngle);
        const subY = y + 40 + subRadius * Math.sin(subAngle);

        // Sub-item node (smaller, lighter)
        nodes.push({
          id: subId,
          data: { label: item },
          position: { x: subX, y: subY },
          style: {
            background: `${colors[colorIndex].border}20`,
            color: colors[colorIndex].border,
            borderRadius: '12px',
            padding: '12px 18px',
            border: `2px solid ${colors[colorIndex].border}`,
            minWidth: '120px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: `0 4px 12px ${colors[colorIndex].border}20`,
            textAlign: 'center',
          },
        });

        // Edge from branch to sub-item
        edges.push({
          id: `e-${branchId}-${subId}`,
          source: branchId,
          target: subId,
          animated: false,
          style: { 
            stroke: colors[colorIndex].border,
            strokeWidth: 2,
            strokeDasharray: '5,5',
          },
          markerEnd: {
            type: 'arrowclosed',
            color: colors[colorIndex].border,
          },
        });
      });
    }
  });

  return { nodes, edges };
}

// Detect hierarchy in text (simple version)
function detectHierarchy(steps) {
  const main = steps[0];
  const remaining = steps.slice(1);
  
  // Simple grouping - every 3-4 items becomes a branch
  const branches = [];
  const itemsPerBranch = Math.ceil(remaining.length / Math.min(5, Math.ceil(remaining.length / 3)));
  
  for (let i = 0; i < remaining.length; i += itemsPerBranch) {
    const items = remaining.slice(i, i + itemsPerBranch);
    if (items.length > 0) {
      branches.push({
        title: items[0],
        items: items.slice(1),
      });
    }
  }

  return { main, branches };
}