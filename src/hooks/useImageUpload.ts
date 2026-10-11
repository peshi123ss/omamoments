import { useEffect, useRef, useState } from 'react';
import { validateImage } from '../utils/imageValidation';

/** New uploads remain drafts until the member confirms a square crop. */
export function useImageUpload() {
 const [image, setImage] = useState<HTMLImageElement | null>(null);
 const [pending, setPending] = useState<HTMLImageElement | null>(null);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const generation = useRef(0);
 const original = useRef<HTMLImageElement | null>(null);
 const draft = useRef<HTMLImageElement | null>(null);
 const current = useRef<HTMLImageElement | null>(null);
 const urls = useRef(new Set<string>());
 function release(img: HTMLImageElement | null) {
  if (img && urls.current.delete(img.src)) URL.revokeObjectURL(img.src);
 }
 async function decodeBlob(blob: Blob) {
  const next = new Image(); const url = URL.createObjectURL(blob);
  urls.current.add(url); next.src = url;
  try { await next.decode(); return next; } catch (e) { release(next); throw e; }
 }
 useEffect(() => () => {
  generation.current++;
  urls.current.forEach(url => URL.revokeObjectURL(url)); urls.current.clear();
 }, []);
 async function upload(file: File) {
  const validation = validateImage(file);
  if (validation) { setError(validation); return false; }
  const job = ++generation.current; setLoading(true); setError('');
  let bitmap: ImageBitmap | null = null;
  try {
   const decoded = new Image(); const source = URL.createObjectURL(file);
   try { decoded.src = source; await decoded.decode(); } finally { URL.revokeObjectURL(source); }
   if (!decoded.width || !decoded.height || decoded.width * decoded.height > 100_000_000)
    throw new Error('Please choose an image under 100 megapixels.');
   const scale = Math.min(1, 2560 / Math.max(decoded.width, decoded.height));
   const canvas = document.createElement('canvas');
   canvas.width = Math.round(decoded.width * scale); canvas.height = Math.round(decoded.height * scale);
   try { bitmap = await createImageBitmap(file, { imageOrientation: 'from-image', resizeWidth: canvas.width, resizeHeight: canvas.height, resizeQuality: 'high' }); } catch { /* Oriented HTML image fallback. */ }
   const context = canvas.getContext('2d'); if (!context) throw new Error('Image processing is unavailable.');
   context.drawImage(bitmap || decoded, 0, 0, canvas.width, canvas.height);
   const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Could not process photo.')), 'image/png'));
   const next = await decodeBlob(blob);
   if (job !== generation.current) { release(next); return false; }
   if (draft.current !== original.current) release(draft.current);
   draft.current = next; setPending(next); return true;
  } catch (e) {
   if (job === generation.current) setError(e instanceof Error ? e.message : 'Unable to open this image.');
   return false;
  } finally { bitmap?.close(); if (job === generation.current) setLoading(false); }
 }
 async function confirmCrop(blob: Blob) {
  const source = draft.current; if (!source) throw new Error('Choose a photo first.');
  const job = generation.current, cropped = await decodeBlob(blob);
  if (job !== generation.current || source !== draft.current) { release(cropped); return; }
  release(current.current);
  if (original.current !== source) release(original.current);
  original.current = source; current.current = cropped; draft.current = null;
  setImage(cropped); setPending(null); setError('');
 }
 function cancelCrop() {
  generation.current++;
  if (draft.current !== original.current) release(draft.current);
  draft.current = null; setPending(null); setLoading(false);
 }
 function recrop() { if (original.current) { draft.current = original.current; setPending(original.current); } }
 return { image, pending, error, loading, upload, confirmCrop, cancelCrop, recrop };
}
