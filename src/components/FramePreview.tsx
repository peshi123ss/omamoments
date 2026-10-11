import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Stage, Layer, Rect, Text, Image as KImage, Group, Ellipse } from 'react-konva';
import type Konva from 'konva';
import type {BrandAssets} from '../hooks/useBrandAssets';
import { FONT, type Member, type TemplateId, type Element } from '../templates/types';
import { getTemplate } from '../templates';
import { contain, fitText, photoGeometry, type Transform } from '../utils/layout';
interface Props {id:TemplateId;member:Member;image:HTMLImageElement|null;assets:BrandAssets|null;transform:Transform;onTransform?:(t:Transform)=>void;stageRef?:RefObject<Konva.Stage|null>;fontsReady:boolean;compact?:boolean;}
let measurement:CanvasRenderingContext2D|null=null;
function FrameElement({element:e,assets}:{element:Element;assets:Props['assets']}){
 if(e.kind==='ellipse')return <Ellipse x={e.x+e.width/2} y={e.y+e.height/2} radiusX={e.width/2} radiusY={e.height/2} fill={e.fill} stroke={e.stroke} strokeWidth={e.strokeWidth} listening={false}/>;
 if(e.kind==='rect')return <Rect x={e.x} y={e.y} width={e.width} height={e.height} fill={e.fill} cornerRadius={e.radius} stroke={e.stroke} strokeWidth={e.strokeWidth} listening={false}/>;
 if(e.kind==='logo'){const img=assets?.[e.logo];return img?<KImage image={img} {...contain(img,e)} listening={false}/>:null;}
 if(e.kind!=='text')return null;
 measurement ||= document.createElement('canvas').getContext('2d');
 const fitted=fitText(e.text,e.width,e.height,e.size,e.maxLines||1,(s,size)=>{if(!measurement)return s.length*size;measurement.font=`${e.italic?'italic ':''}${e.weight==='bold'?'700':'400'} ${size}px ${e.fontFamily||FONT}`;return measurement.measureText(s).width;});
 return <Text x={e.x} y={e.y} width={e.width} height={e.height} text={fitted.text} fontSize={fitted.size} fontFamily={e.fontFamily||FONT} fontStyle={[e.italic?'italic':'',e.weight||'normal'].filter(Boolean).join(' ')} lineHeight={1.3} fill={e.fill} align={e.align} wrap="none" listening={false}/>;
}
export function FramePreview({id,member,image,assets,transform,onTransform,stageRef,fontsReady,compact}:Props){
 const container=useRef<HTMLDivElement>(null),[width,setWidth]=useState(400),pinch=useRef<{distance:number;zoom:number;x:number;y:number;cx:number;cy:number}|null>(null);
 const layout=useMemo(()=>getTemplate(id).build(member),[id,member.name,member.designation]);
 const geo=image?photoGeometry(image,layout.photo,transform):null;
 useEffect(()=>{const el=container.current;if(!el)return;const observer=new ResizeObserver(entries=>setWidth(Math.max(1,Math.floor(entries[0].contentRect.width))));observer.observe(el);return()=>observer.disconnect();},[]);
 const scale=width/1080;const darkPhoto=['emerald','ruby'].includes(id);
 function touchStart(e:React.TouchEvent){if(!onTransform||!image||e.touches.length!==2)return;e.preventDefault();const [a,b]=[e.touches[0],e.touches[1]];pinch.current={distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),zoom:transform.zoom,x:transform.x,y:transform.y,cx:(a.clientX+b.clientX)/2,cy:(a.clientY+b.clientY)/2};}
 function touchMove(e:React.TouchEvent){const p=pinch.current;if(!p||!image||!onTransform||e.touches.length!==2)return;e.preventDefault();const [a,b]=[e.touches[0],e.touches[1]];const zoom=Math.max(1,Math.min(4,p.zoom*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/p.distance));const next={zoom,x:p.x+((a.clientX+b.clientX)/2-p.cx)/scale,y:p.y+((a.clientY+b.clientY)/2-p.cy)/scale};const g=photoGeometry(image,layout.photo,next);onTransform({...next,x:g.offsetX,y:g.offsetY});}
 return <div ref={container} className={`canvas-wrap ${onTransform&&image?'editable':''}`} role="img" aria-label={`${getTemplate(id).name} frame preview${member.name?` for ${member.name}`:''}`} onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={()=>{pinch.current=null;}}>
 <Stage width={width} height={width} scaleX={scale} scaleY={scale} ref={stageRef}><Layer>
 <Rect width={1080} height={1080} fill={layout.background} listening={false}/>
 {layout.artwork&&assets?.artworks[layout.artwork]&&<KImage image={assets.artworks[layout.artwork]} x={0} y={0} width={1080} height={1080} listening={false}/>}
 <Group clipFunc={ctx=>{ctx.beginPath();if(layout.photoShape==='ellipse'){ctx.ellipse(layout.photo.x+layout.photo.width/2,layout.photo.y+layout.photo.height/2,layout.photo.width/2,layout.photo.height/2,0,0,Math.PI*2);}else ctx.roundRect(layout.photo.x,layout.photo.y,layout.photo.width,layout.photo.height,layout.radius);ctx.closePath();}}>
 {(!layout.artwork||image)&&<Rect {...layout.photo} fill={darkPhoto?'#263830':'#DDE8DB'} listening={false}/>} 
 {image&&geo?<KImage image={image} x={geo.x} y={geo.y} width={geo.width} height={geo.height} draggable={!!onTransform} onDragMove={e=>{if(pinch.current){e.target.stopDrag();return;}const next={...transform,x:e.target.x()-(layout.photo.x+(layout.photo.width-geo.width)/2),y:e.target.y()-(layout.photo.y+(layout.photo.height-geo.height)/2)};const g=photoGeometry(image,layout.photo,next);e.target.position({x:g.x,y:g.y});onTransform?.({...next,x:g.offsetX,y:g.offsetY});}}/>:<>
 <Text x={layout.photo.x} y={layout.photo.y+layout.photo.height*.43} width={layout.photo.width} text={compact?'YOUR PHOTO':'Your photo goes here'} fontFamily={FONT} fontSize={compact?38:36} fill={darkPhoto?'#F5D789':'#166534'} align="center" listening={false}/>
 {!compact&&<Text x={layout.photo.x} y={layout.photo.y+layout.photo.height*.53} width={layout.photo.width} text="Upload a photo to make it yours" fontFamily={FONT} fontSize={23} fill={darkPhoto?'#E6D29D':'#667085'} align="center" listening={false}/>}
 </>}
 </Group>
 {fontsReady&&layout.elements.map((e,i)=><FrameElement key={i} element={e} assets={assets}/>)}
 </Layer></Stage></div>;
}
