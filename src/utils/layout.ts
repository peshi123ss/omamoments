import type { Box } from '../templates/types';
export interface Transform { zoom: number; x: number; y: number }
export const initialTransform:Transform = {zoom:1,x:0,y:0};
export function photoGeometry(image:{width:number;height:number},box:Box,t:Transform) {
 const scale=Math.max(box.width/image.width,box.height/image.height)*t.zoom;
 const width=image.width*scale,height=image.height*scale;
 const maxX=(width-box.width)/2,maxY=(height-box.height)/2;
 const x=Math.min(maxX,Math.max(-maxX,t.x)), y=Math.min(maxY,Math.max(-maxY,t.y));
 return {width,height,x:box.x+(box.width-width)/2+x,y:box.y+(box.height-height)/2+y,offsetX:x,offsetY:y};
}
export function contain(image:{width:number;height:number},box:Box):Box {const s=Math.min(box.width/image.width,box.height/image.height); return {x:box.x+(box.width-image.width*s)/2,y:box.y+(box.height-image.height*s)/2,width:image.width*s,height:image.height*s};}
/** Fit by measured glyph width, including Bengali shaping. Never split a grapheme. */
export function fitText(value:string,width:number,height:number,maxSize:number,maxLines:number,measure:(s:string,size:number)=>number):{size:number;text:string} {
 const safe=value.trim();
 const graphemes=(s:string) => [...new Intl.Segmenter('bn',{granularity:'grapheme'}).segment(s)].map(g=>g.segment);
 function wrap(size:number) {
  const lines:string[]=[];
  for(const paragraph of safe.split('\n')) {
   let line='';
   for(const word of paragraph.split(/\s+/)) {
    if(measure(line?line+' '+word:word,size)<=width) {line=line?line+' '+word:word;continue;}
    if(line){lines.push(line);line='';}
    if(measure(word,size)<=width){line=word;continue;}
    for(const char of graphemes(word)){if(line&&measure(line+char,size)>width){lines.push(line);line=char;}else line+=char;}
   }
   lines.push(line);
  }
  return lines;
 }
 for(let size=maxSize;size>=8;size--){const lines=wrap(size);if(lines.length<=maxLines&&lines.length*size*1.3<=height)return {size,text:lines.join('\n')};}
 return {size:8,text:wrap(8).join('\n')};
}
