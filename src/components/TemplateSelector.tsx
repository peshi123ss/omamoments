import {Check, ArrowUpRight} from 'lucide-react';
import {templates} from '../templates';
import type {TemplateId} from '../templates/types';
import {FramePreview} from './FramePreview';
import type {useBrandAssets} from '../hooks/useBrandAssets';
export function TemplateSelector({selected,onSelect,brand}:{selected:TemplateId;onSelect:(id:TemplateId)=>void;brand:ReturnType<typeof useBrandAssets>}){
 return <div id="templates"><p className="collection-description">Eleven classic designs. Choose the one that feels like you.</p><div className="template-grid">{templates.map((t,i)=><button type="button" key={t.id} className={`template-card ${selected===t.id?'selected':''}`} aria-pressed={selected===t.id} onClick={()=>onSelect(t.id)}><div className="template-thumb"><FramePreview id={t.id} member={{name:'Your name',designation:'Proud Member'}} image={null} assets={brand.assets} fontsReady={brand.fontsReady} transform={{zoom:1,x:0,y:0}} compact/>{selected===t.id&&<span className="selected-check"><Check size={14}/></span>}</div><span className="template-name"><span className="template-number">{String(i+1).padStart(2,'0')}</span>{t.name}</span><span className="template-desc">{t.description}</span></button>)}</div><a className="button secondary view-frame-link" href="#live-preview">View My Frame <ArrowUpRight size={17}/></a></div>;
}
