import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  Award, 
  Camera, 
  Layers, 
  Sliders, 
  Eye, 
  Download, 
  Sparkles, 
  Volume2, 
  X,
  Crosshair,
  RefreshCcw,
  Zap
} from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';

interface Interactive3DViewerProps {
  modelName: string;
  nodes: string[];
  category: string;
  onMasterModel?: () => void;
  isMastered?: boolean;
  onSelectNode?: (nodeName: string | null) => void;
  onAskAI?: (prompt: string) => void;
}

interface Point3D {
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  description?: string;
}

export default function Interactive3DViewer({
  modelName,
  nodes,
  category,
  onMasterModel,
  isMastered = false,
  onSelectNode,
  onAskAI
}: Interactive3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // 3D Canvas Transform States
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.6 });
  const [zoom, setZoom] = useState(1.1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(nodes[0] || null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Phase 3 WebXR & AR States
  const [isCameraAR, setIsCameraAR] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [explosionFactor, setExplosionFactor] = useState(1.0); // 1.0 = Normal, 2.5 = Full Exploded View
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<{ name: string; description: string; color: string } | null>(null);

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
      
      const r = 90; // Base sphere radius
      return {
        name: node,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: colors[index % colors.length],
        description: `Key structural node "${node}" involved in ${category.toLowerCase()} spatial alignment and bonding.`
      };
    });
    setPoints(pts);
    setSelectedNode(nodes[0] || null);
    if (pts[0]) {
      setActiveHotspot({ name: pts[0].name, description: pts[0].description || '', color: pts[0].color });
    }
  }, [nodes, category]);

  // WebXR / Real Camera Stream Toggle
  useEffect(() => {
    if (isCameraAR) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access failed:", err);
          alert("Could not access camera for AR view. Please check permissions.");
          setIsCameraAR(false);
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraAR]);

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

  // Canvas 3D Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background Glow (if not in camera AR mode)
    if (!isCameraAR) {
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(centerX, centerY));
      gradient.addColorStop(0, '#001b3d15');
      gradient.addColorStop(0.5, '#00173608');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Grid circles (orbital planes / X-Ray wireframes)
    ctx.strokeStyle = isWireframe ? '#38bdf888' : '#00173618';
    ctx.lineWidth = isWireframe ? 1.5 : 1;
    if (isWireframe) ctx.setLineDash([6, 6]);

    for (let r = 40; r <= 140; r += 40) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r * zoom * Math.min(1.5, explosionFactor), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw central core node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 16 * zoom, 0, Math.PI * 2);
    ctx.fillStyle = isCameraAR ? '#001736dd' : '#001736';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fe6a34';
    ctx.stroke();

    // Core Label
    ctx.font = 'bold 11px var(--font-mono)';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('3D CORE', centerX, centerY + 4);

    // 3D Perspective Projection with Exploded View Offset
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
      // Apply Explosion Factor to expand points outwards
      const exX = p.x * explosionFactor;
      const exY = p.y * explosionFactor;
      const exZ = p.z * explosionFactor;

      // Rotate around Y axis
      let x1 = exX * cosY - exZ * sinY;
      let z1 = exX * sinY + exZ * cosY;

      // Rotate around X axis
      let y2 = exY * cosX - z1 * sinX;
      let z2 = exY * sinX + z1 * cosX;

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
        radius: Math.max(7, 11 * perspectiveScale * zoom),
        originalPoint: p,
      };
    });

    // Sort by depth (draw back items first)
    projected.sort((a, b) => a.projZ - b.projZ);

    // Draw connecting vectors (central core to node)
    projected.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(p.projX, p.projY);
      ctx.strokeStyle = selectedNode === p.name ? '#fe6a34' : isWireframe ? '#38bdf866' : '#00173633';
      ctx.lineWidth = selectedNode === p.name ? 2.5 : 1.2;
      ctx.setLineDash(explosionFactor > 1.2 ? [3, 3] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Hotspot Nodes & Pins
    projected.forEach((p) => {
      const isSelected = selectedNode === p.name;

      // Outer Glow Pulse
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}44`;
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(p.projX, p.projY, p.radius + (isSelected ? 3 : 0), 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#fe6a34' : p.color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // Inner fill
      ctx.beginPath();
      ctx.arc(p.projX, p.projY, p.radius - 2, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#fe6a34' : '#ffffff';
      ctx.fill();

      // Hotspot Pin Marker Label
      ctx.font = isSelected ? 'bold 12px var(--font-sans)' : '600 11px var(--font-sans)';
      ctx.fillStyle = isSelected ? '#001736' : '#1e293b';
      ctx.textAlign = p.projX > centerX ? 'left' : 'right';
      
      const textX = p.projX > centerX ? p.projX + p.radius + 8 : p.projX - p.radius - 8;
      const textY = p.projY + 4;

      // Label background pill
      const textWidth = ctx.measureText(p.name).width;
      ctx.fillStyle = isCameraAR ? '#001736ee' : '#ffffffdd';
      ctx.beginPath();
      ctx.roundRect(
        p.projX > centerX ? textX - 4 : textX - textWidth - 4,
        textY - 11,
        textWidth + 8,
        16,
        4
      );
      ctx.fill();

      ctx.fillStyle = isCameraAR ? '#ffffff' : isSelected ? '#001736' : '#334155';
      ctx.fillText(p.name, textX, textY);
    });

  }, [points, rotation, zoom, selectedNode, explosionFactor, isWireframe, isCameraAR]);

  // Mouse drag handlers
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

  // Canvas Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = Math.max(340, container.clientHeight);
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

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const sinX = Math.sin(rotation.x);
    const cosX = Math.cos(rotation.x);
    const sinY = Math.sin(rotation.y);
    const cosY = Math.cos(rotation.y);

    for (const p of points) {
      const exX = p.x * explosionFactor;
      const exY = p.y * explosionFactor;
      const exZ = p.z * explosionFactor;

      let x1 = exX * cosY - exZ * sinY;
      let z1 = exX * sinY + exZ * cosY;
      let y2 = exY * cosX - z1 * sinX;
      let z2 = exY * sinX + z1 * cosX;

      const perspectiveScale = 300 / (300 - z2);
      const projX = centerX + x1 * zoom * perspectiveScale;
      const projY = centerY + y2 * zoom * perspectiveScale;

      const dist = Math.hypot(clickX - projX, clickY - projY);
      if (dist < 22) {
        setSelectedNode(p.name);
        setActiveHotspot({ name: p.name, description: p.description || '', color: p.color });
        break;
      }
    }
  };

  // Take Snapshot Download
  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `learnflow_3d_${modelName.toLowerCase().replace(/\s+/g, '_')}_snapshot.png`;
    a.click();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between group">
      
      {/* Live Video Camera Background (WebXR AR Mode) */}
      {isCameraAR && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* Top Controls Overlay */}
      <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {category}
            </span>
            {isMastered && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Mastered
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mt-1">{modelName}</h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Camera AR Toggle */}
          <button
            onClick={() => setIsCameraAR(!isCameraAR)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isCameraAR
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCameraAR ? 'Exit AR Mode' : 'WebXR AR View'}</span>
          </button>

          {/* Wireframe / X-Ray Toggle */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isWireframe
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>X-Ray Wireframe</span>
          </button>

          {/* Snapshot */}
          <button
            onClick={handleTakeSnapshot}
            title="Download PNG Snapshot"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onMasterModel && !isMastered && (
            <button
              onClick={onMasterModel}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mark Mastered</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Exploded View Slider Bar Overlay */}
      <div className="relative z-20 px-6 py-3 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Exploded View:</span>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={explosionFactor}
            onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
            className="w-full sm:w-48 accent-purple-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-purple-400 font-bold w-12">
            {((explosionFactor - 1) * 100).toFixed(0)}%
          </span>
        </div>

        {/* Zoom & Rotation Quick Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.2))}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.2))}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              autoRotate ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Auto Orbit</span>
          </button>
        </div>
      </div>

      {/* Floating Interactive Hotspot Popover Card */}
      {activeHotspot && (
        <div className="absolute bottom-16 left-6 right-6 sm:right-auto sm:max-w-md z-30 bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeHotspot.color }}></span>
              <h4 className="text-sm font-bold text-white">{activeHotspot.name}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeHotspot.description}
          </p>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
            <VoiceAssistant textToSpeak={`${activeHotspot.name}: ${activeHotspot.description}`} />

            {onAskAI && (
              <button
                onClick={() => onAskAI(`Explain the function and significance of "${activeHotspot.name}" in ${modelName}.`)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
