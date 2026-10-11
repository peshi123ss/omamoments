import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KImage } from 'react-konva';
import type Konva from 'konva';
import { Check, Crop, LoaderCircle, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { initialTransform, photoGeometry, type Transform } from '../utils/layout';
import { exportImage } from '../utils/exportImage';
const box = { x: 0, y: 0, width: 1080, height: 1080 };
interface Props { image: HTMLImageElement; onApply: (blob: Blob) => Promise<void>; onCancel: () => void }
export function CropModal({ image, onApply, onCancel }: Props) {
 const dialog = useRef<HTMLDialogElement>(null), viewport = useRef<HTMLDivElement>(null), stage = useRef<Konva.Stage | null>(null);
 const [size, setSize] = useState(320), [transform, setTransform] = useState<Transform>(initialTransform);
 const [busy, setBusy] = useState(false), [error, setError] = useState('');
 const pinch = useRef<{ distance: number; zoom: number; x: number; y: number; cx: number; cy: number } | null>(null);
 const scale = size / 1080, geometry = photoGeometry(image, box, transform);
 useEffect(() => {
  const modal = dialog.current, el = viewport.current;
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
  modal?.showModal();
  const observer = new ResizeObserver(entries => setSize(Math.max(1, Math.floor(entries[0].contentRect.width))));
  if (el) observer.observe(el);
  return () => { observer.disconnect(); modal?.close(); document.body.style.overflow = oldOverflow; previouslyFocused?.focus(); };
 }, []);
 function update(next: Transform) { const zoom = Math.max(1, Math.min(4, next.zoom)); const g = photoGeometry(image, box, { ...next, zoom }); setTransform({ zoom, x: g.offsetX, y: g.offsetY }); }
 async function apply() { if (!stage.current || busy) return; setBusy(true); setError(''); try { const blob = await exportImage(stage.current); await onApply(blob); } catch (e) { setError(e instanceof Error ? e.message : 'Could not crop your photo. Try again.'); setBusy(false); } }
 function touchStart(e: React.TouchEvent) {
  if (e.touches.length !== 2 || busy) return; e.preventDefault();
  stage.current?.findOne('Image')?.stopDrag();
  const [a, b] = [e.touches[0], e.touches[1]];
  pinch.current = { distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), zoom: transform.zoom, x: transform.x, y: transform.y, cx: (a.clientX + b.clientX) / 2, cy: (a.clientY + b.clientY) / 2 };
 }
 function touchMove(e: React.TouchEvent) {
  const p = pinch.current; if (!p || e.touches.length !== 2 || busy) return; e.preventDefault();
  const [a, b] = [e.touches[0], e.touches[1]];
  update({ zoom: p.zoom * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / Math.max(1, p.distance), x: p.x + ((a.clientX + b.clientX) / 2 - p.cx) / scale, y: p.y + ((a.clientY + b.clientY) / 2 - p.cy) / scale });
 }
 return <dialog ref={dialog} className="crop-modal" aria-labelledby="crop-title" aria-describedby="crop-description" onCancel={e => { e.preventDefault(); if (!busy) onCancel(); }} onKeyDown={e => {
  if (busy || (e.target as HTMLElement).tagName === 'INPUT') return;
  const delta: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
  if (delta[e.key] && e.target === viewport.current) { e.preventDefault(); const [x, y] = delta[e.key]; update({ ...transform, x: transform.x + x, y: transform.y + y }); }
 }}>
 <div className="crop-heading"><div><div className="eyebrow"><Crop size={14}/> FIRST, FIND YOUR BEST ANGLE</div><h2 id="crop-title">Crop your photo</h2></div><button className="icon-button" type="button" aria-label="Cancel crop" disabled={busy} onClick={onCancel}><X size={21}/></button></div>
 <p id="crop-description">Drag to reposition and zoom to fit. Your confirmed photo will be <strong>1080 × 1080 px</strong>.</p>
 <div ref={viewport} className="crop-viewport" tabIndex={0} role="group" aria-label="Square crop area. Drag or use arrow keys to move your photo." onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={() => { pinch.current = null; }}>
 <Stage width={size} height={size} scaleX={scale} scaleY={scale} ref={stage}><Layer><KImage image={image} x={geometry.x} y={geometry.y} width={geometry.width} height={geometry.height} draggable={!busy} onDragMove={e => {
  if (pinch.current) { e.target.stopDrag(); return; }
  const next = { ...transform, x: e.target.x() - (1080 - geometry.width) / 2, y: e.target.y() - (1080 - geometry.height) / 2 };
  const g = photoGeometry(image, box, next); e.target.position({ x: g.x, y: g.y }); update(next);
 }}/></Layer></Stage><div className="crop-guides" aria-hidden="true"/><span className="crop-size" aria-hidden="true">1:1 · 1080 × 1080</span></div>
 <div className="zoom-controls"><button className="icon-button" type="button" aria-label="Crop zoom out" disabled={busy} onClick={() => update({ ...transform, zoom: transform.zoom - .1 })}><ZoomOut size={19}/></button><input aria-label="Crop photo zoom" type="range" min="1" max="4" step=".01" value={transform.zoom} disabled={busy} onChange={e => update({ ...transform, zoom: Number(e.target.value) })}/><button className="icon-button" type="button" aria-label="Crop zoom in" disabled={busy} onClick={() => update({ ...transform, zoom: transform.zoom + .1 })}><ZoomIn size={19}/></button><button className="reset-button" type="button" disabled={busy} onClick={() => setTransform(initialTransform)}><RotateCcw size={14}/> Reset</button></div>
 <p className="crop-instruction">On mobile, pinch to zoom. With a keyboard, focus the photo and use arrow keys.</p>
 {error && <p className="error" role="alert">{error}</p>}
 <div className="crop-actions"><button type="button" className="button secondary" disabled={busy} onClick={onCancel}>Cancel</button><button type="button" className="button primary" disabled={busy} onClick={apply}>{busy ? <LoaderCircle className="spin" size={18}/> : <Check size={18}/>} {busy ? 'Preparing crop…' : 'Use This Crop'}</button></div>
 </dialog>;
}
