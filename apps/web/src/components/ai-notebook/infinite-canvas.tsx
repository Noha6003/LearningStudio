'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Square, Type, PenTool, Clipboard, Trash2, Plus, 
  Sparkles, Move, ZoomIn, ZoomOut, CheckCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useThemeMode } from '../providers/theme-mode-provider';

interface CanvasNodeData {
  id: string;
  type: 'sticky' | 'text' | 'flashcard';
  x: number;
  y: number;
  content: string;
  color?: string;
}

export function InfiniteCanvas() {
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  const [nodes, setNodes] = useState<CanvasNodeData[]>([
    { id: '1', type: 'sticky', x: 100, y: 150, content: 'Remember to study Mars gravity!', color: 'bg-yellow-200 text-yellow-950 border-yellow-300' },
    { id: '2', type: 'flashcard', x: 400, y: 100, content: 'Front: What is Mars?\nBack: The 4th planet from the sun.', color: 'bg-purple-100 text-purple-950 border-purple-300' }
  ]);

  const [tool, setTool] = useState<'select' | 'sticky' | 'text' | 'draw'>('select');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Drawing Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Initialize Canvas dimensions
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * 2;
      canvasRef.current.height = window.innerHeight * 2;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = isKids ? '#e11d48' : '#6366f1'; // Rose for kids, Indigo for normal
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
      }
    }
  }, [isKids]);

  // Drawing Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'draw' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Calculate coordinates respecting zoom and pan
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || tool !== 'draw' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Node Actions
  const handleAddNode = (type: 'sticky' | 'text' | 'flashcard') => {
    const colors = [
      'bg-yellow-100 text-yellow-950 border-yellow-200',
      'bg-cyan-100 text-cyan-950 border-cyan-200',
      'bg-pink-100 text-pink-950 border-pink-200',
      'bg-emerald-100 text-emerald-950 border-emerald-200'
    ];
    const newId = String(Date.now());
    const newNode: CanvasNodeData = {
      id: newId,
      type,
      x: 200 - pan.x,
      y: 200 - pan.y,
      content: type === 'flashcard' ? 'Front: Question?\nBack: Answer.' : 'Double click to edit note...',
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newId);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const handleNodeTextChange = (id: string, text: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, content: text } : n));
  };

  // Reset Canvas Drawings
  const clearDrawings = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <div className="relative flex-1 h-[600px] w-full border border-border rounded-2xl overflow-hidden bg-slate-50/50 select-none">
      
      {/* Infinite Canvas dotted Grid pattern */}
      <div 
        className="absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      />

      {/* Drawing Canvas Layer */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "absolute inset-0 z-10 origin-top-left pointer-events-auto",
          tool === 'draw' ? 'cursor-crosshair' : 'pointer-events-none'
        )}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      />

      {/* Nodes Layer */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            drag
            dragMomentum={false}
            onDrag={(e, info) => {
              // Track drag boundaries
              setNodes(prev => prev.map(n => n.id === node.id ? { ...n, x: n.x + info.delta.x / zoom, y: n.y + info.delta.y / zoom } : n));
            }}
            style={{ x: node.x, y: node.y }}
            className={cn(
              "absolute pointer-events-auto flex flex-col p-4 w-48 border-2 shadow-md transition-shadow",
              node.color || "bg-white text-slate-800 border-slate-200",
              selectedNode === node.id ? "ring-2 ring-brand-primary shadow-lg scale-102" : "",
              isKids ? "rounded-3xl border-3" : "rounded-xl"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNode(node.id);
            }}
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-black/10 pb-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider opacity-60">
              <span>{node.type === 'flashcard' ? '🃏 Flashcard' : '📌 Note'}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                className="hover:text-brand-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Input area */}
            <textarea
              value={node.content}
              onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
              className="w-full bg-transparent resize-none border-none text-xs focus:outline-none font-medium leading-relaxed font-sans placeholder-slate-400"
              style={{ minHeight: '60px' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating Toolbar Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-border shadow-lg">
        <Button 
          variant={tool === 'select' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => setTool('select')}
          className="rounded-full h-9 w-9 p-0"
        >
          <Move className="h-4 w-4" />
        </Button>
        <Button 
          variant={tool === 'sticky' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => { setTool('select'); handleAddNode('sticky'); }}
          className="rounded-full h-9 w-9 p-0"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button 
          variant={tool === 'text' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => { setTool('select'); handleAddNode('flashcard'); }}
          className="rounded-full h-9 w-9 p-0"
        >
          <Clipboard className="h-4 w-4" />
        </Button>
        <Button 
          variant={tool === 'draw' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => setTool('draw')}
          className="rounded-full h-9 w-9 p-0"
        >
          <PenTool className="h-4 w-4" />
        </Button>
        
        {tool === 'draw' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearDrawings}
            className="rounded-full text-xs px-2.5 py-1"
          >
            Clear Sketch
          </Button>
        )}
      </div>

      {/* Zoom / Pan Map controls */}
      <div className="absolute top-6 right-6 z-30 flex flex-col space-y-1.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-xl border border-border shadow-md">
        <button 
          onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
          className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.6))}
          className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Floating Instructions */}
      <div className="absolute top-6 left-6 z-30 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        <span>FigJam Infinite Canvas Enabled</span>
      </div>
    </div>
  );
}
