import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Maximize2, ZoomIn, ZoomOut, CheckCircle2, Award } from 'lucide-react';

interface Interactive3DViewerProps {
  modelName: string;
  nodes: string[];
  category: string;
  onMasterModel?: () => void;
  isMastered?: boolean;
  onSelectNode?: (nodeName: string | null) => void;
}

interface Point3D {
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

export default function Interactive3DViewer({
  modelName,
  nodes,
  category,
  onMasterModel,
  isMastered = false,
  onSelectNode,
}: Interactive3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.6 });
  const [zoom, setZoom] = useState(1.1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(nodes[0] || null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Sync selectedNode back to parent context
  useEffect(() => {
    if (onSelectNode) {
      onSelectNode(selectedNode);
    }
  }, [selectedNode, onSelectNode]);

  // Generate 3D points distributed spherically
  const [points, setPoints] = useState<Point3D[]>([]);

  useEffect(() => {
    const colors = [
      '#fe6a34', // Secondary orange
      '#a9c7ff', // Soft blue
      '#3b82f6', // Bright blue
      '#10b981', // Emerald green
      '#f59e0b', // Amber yellow
      '#ec4899', // Pink
    ];

    const pts: Point3D[] = nodes.map((node, index) => {
      // Golden spiral distribution on sphere for even spacing
      const phi = Math.acos(-1 + (2 * index) / Math.max(1, nodes.length - 1));
      const theta = Math.sqrt(nodes.length * Math.PI) * phi;
      
      const r = 100; // Sphere radius
      return {
        name: node,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: colors[index % colors.length],
      };
    });
    setPoints(pts);
    setSelectedNode(nodes[0] || null);
  }, [nodes]);

  // RequestAnimationFrame for auto rotation
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    let animId: number;
    const tick = () => {
      setRotation((prev) => ({
        x: prev.x + 0.003,
        y: prev.y + 0.002,
      }));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, isDragging]);

  // Handle Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Drawing background grids/radial glows
    const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(centerX, centerY));
    gradient.addColorStop(0, '#001b3d11');
    gradient.addColorStop(0.5, '#00173605');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid circles (orbital planes)
    ctx.strokeStyle = '#00173611';
    ctx.lineWidth = 1;
    for (let r = 50; r <= 150; r += 50) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r * zoom, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw central node (The Core Topic)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15 * zoom, 0, Math.PI * 2);
    ctx.fillStyle = '#001736';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fe6a3444';
    ctx.stroke();

    // Core Label
    ctx.font = 'bold 11px var(--font-mono)';
    ctx.fillStyle = '#001736';
    ctx.textAlign = 'center';
    ctx.fillText('CORE SYSTEM', centerX, centerY + 4);

    // Project and Sort points by Depth (z-index after rotation)
    const sinX = Math.sin(rotation.x);
    const cosX = Math.cos(rotation.x);
    const sinY = Math.sin(rotation.y);
    const cosY = Math.cos(rotation.y);

    interface ProjectedPoint {
      name: string;
      color: string;
      projX: number;
      projY: number;
      projZ: number;
      radius: number;
      originalPoint: Point3D;
    }

    const projected: ProjectedPoint[] = points.map((p) => {
      // Rotate around Y axis
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;

      // Rotate around X axis
      let y2 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      // 3D perspective projection
      const distance = 300;
      const perspectiveScale = distance / (distance - z2);
      
      const projX = centerX + x1 * zoom * perspectiveScale;
      const projY = centerY + y2 * zoom * perspectiveScale;

      return {
        name: p.name,
        color: p.color,
        projX,
        projY,
        projZ: z2,
        radius: Math.max(6, 10 * perspectiveScale * zoom),
        originalPoint: p,
      };
    });

    // Sort by depth (draw back items first)
    projected.sort((a, b) => a.projZ - b.projZ);

    // Draw connections (central core to node, and nodes to each other)
    projected.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(p.projX, p.projY);
      ctx.strokeStyle = selectedNode === p.name ? '#fe6a3488' : '#00173622';
      ctx.lineWidth = selectedNode === p.name ? 2 : 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw nodes and text labels
    projected.forEach((p) => {
      const isSelected = selectedNode === p.name;

      // Node Shadow/Glow
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}33`;
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(p.projX, p.projY, p.radius + (isSelected ? 2 : 0), 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#fe6a34' : p.color;
      ctx.lineWidth = isSelected ? 2 : 1.5;
      ctx.stroke();

      // Inner fill
      ctx.beginPath();
      ctx.arc(p.projX, p.projY, p.radius - 2, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#fe6a34' : '#ffffff';
      ctx.fill();

      // Node Name Label
      ctx.font = isSelected ? 'bold 12px var(--font-sans)' : '500 11px var(--font-sans)';
      ctx.fillStyle = isSelected ? '#001736' : '#43474f';
      ctx.textAlign = p.projX > centerX ? 'left' : 'right';
      
      const textX = p.projX > centerX ? p.projX + p.radius + 6 : p.projX - p.radius - 6;
      const textY = p.projY + 4;

      // Draw subtle label background for legibility
      const textWidth = ctx.measureText(p.name).width;
      ctx.fillStyle = '#ffffffdd';
      ctx.fillRect(
        p.projX > centerX ? textX - 2 : textX - textWidth - 2,
        textY - 10,
        textWidth + 4,
        14
      );

      ctx.fillStyle = isSelected ? '#001736' : '#43474f';
      ctx.fillText(p.name, textX, textY);
    });

  }, [points, rotation, zoom, selectedNode]);

  // Handle Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setRotation((prev) => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01,
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Canvas resize listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = Math.max(320, container.clientHeight);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Project points to check click collision
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const sinX = Math.sin(rotation.x);
    const cosX = Math.cos(rotation.x);
    const sinY = Math.sin(rotation.y);
    const cosY = Math.cos(rotation.y);

    let foundNode: string | null = null;
    let minDistance = 25; // Click radius margin

    points.forEach((p) => {
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;
      let y2 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      const distance = 300;
      const perspectiveScale = distance / (distance - z2);
      
      const projX = centerX + x1 * zoom * perspectiveScale;
      const projY = centerY + y2 * zoom * perspectiveScale;

      const dist = Math.sqrt((projX - clickX) ** 2 + (projY - clickY) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        foundNode = p.name;
      }
    });

    if (foundNode) {
      setSelectedNode(foundNode);
      setAutoRotate(false);
    }
  };

  return (
    <div className="bg-white border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row h-full">
      {/* Interactive 3D Canvas Panel */}
      <div className="flex-1 relative flex flex-col min-h-[320px] md:min-h-0" ref={containerRef}>
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
            {category}
          </span>
          <h3 className="text-lg font-bold text-primary mt-1">{modelName}</h3>
          <p className="text-xs text-charcoal/60 mt-0.5">Drag to rotate • Click nodes to inspect</p>
        </div>

        {/* 3D Action Controls */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))}
            className="p-1.5 bg-white border border-card-border hover:bg-surface-container rounded-md shadow-xs text-primary transition-all"
            title="Zoom In"
            id="btn_zoom_in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            className="p-1.5 bg-white border border-card-border hover:bg-surface-container rounded-md shadow-xs text-primary transition-all"
            title="Zoom Out"
            id="btn_zoom_out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAutoRotate((a) => !a)}
            className={`p-1.5 border rounded-md shadow-xs transition-all flex items-center gap-1.5 text-xs font-semibold ${
              autoRotate
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-card-border hover:bg-surface-container text-primary'
            }`}
            id="btn_toggle_rotate"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoRotate ? 'Auto Rotating' : 'Rotate Off'}</span>
          </button>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          className="w-full flex-1 cursor-grab active:cursor-grabbing bg-[#fafafc]"
          id="interactive_3d_canvas"
        />
      </div>

      {/* Explainer Sidebar Panel */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-card-border p-5 bg-surface-container-low flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-mono font-bold tracking-wider text-primary mb-2 uppercase">
            Interactive Annotations
          </h4>
          
          {selectedNode ? (
            <div className="animate-fade-in" key={selectedNode}>
              <h5 className="text-base font-bold text-primary mb-1.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block bg-secondary animate-pulse" />
                {selectedNode}
              </h5>
              <div className="text-sm text-charcoal/80 leading-relaxed mb-4">
                <p className="mb-2">
                  Analyzing the specific role of <strong>{selectedNode}</strong> within the 3D topology of {modelName}.
                </p>
                <p className="text-xs text-charcoal/60">
                  This sub-node is essential for the holistic operations of the educational concept. Double tap to review detailed examination annotations, structural integrity, and syllabus checklists.
                </p>
              </div>

              {/* Core Info Chip */}
              <div className="bg-white border border-card-border p-3 rounded-lg text-xs font-mono text-primary flex flex-col gap-1 shadow-2xs">
                <div>• Status: Active & Synced</div>
                <div>• Type: Vector Node (AR)</div>
                <div>• Priority: High Exam Yield</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-charcoal/40 text-sm">
              <p>Click on any 3D node point to load active syllabus breakdown and details.</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-card-border">
          {isMastered ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs font-semibold">
              <Award className="w-5 h-5 shrink-0" />
              <span>You have completed and mastered the 3D model: {modelName}!</span>
            </div>
          ) : (
            <button
              onClick={onMasterModel}
              className="w-full bg-primary hover:bg-primary-light text-white text-xs py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              id="btn_master_model"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Concept as Mastered (+5%)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
