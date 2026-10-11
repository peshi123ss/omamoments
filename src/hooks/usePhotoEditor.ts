import { useState } from 'react';
import { initialTransform, type Transform } from '../utils/layout';
import type { TemplateId } from '../templates/types';
export function usePhotoEditor(){const [transforms,setTransforms]=useState<Partial<Record<TemplateId,Transform>>>({});return {get:(id:TemplateId)=>transforms[id]||initialTransform,set:(id:TemplateId,t:Transform)=>setTransforms(v=>({...v,[id]:t})),reset:(id?:TemplateId)=>setTransforms(v=>id?{...v,[id]:initialTransform}:{})};}
