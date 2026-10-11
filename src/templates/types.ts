export type TemplateId = 'provided' | 'silk' | 'emerald' | 'pearl' | 'ruby' | 'gold' | 'gallery' | 'cameo' | 'matte' | 'seal' | 'portrait';
export type ArtworkId = 'provided' | 'silk' | 'emerald' | 'pearl' | 'ruby' | 'gold';
export interface Box { x: number; y: number; width: number; height: number }
export type Element =
 | ({ kind: 'rect' | 'ellipse'; fill: string; radius?: number; stroke?: string; strokeWidth?: number } & Box)
 | ({ kind: 'text'; text: string; fill: string; size: number; weight?: 'bold' | 'normal'; align?: 'left' | 'center' | 'right'; maxLines?: number; fontFamily?: string; italic?: boolean } & Box)
 | ({ kind: 'logo'; logo: 'oma' | 'anniversary' } & Box);
export interface FrameLayout { background: string; artwork?: ArtworkId; photoShape?: 'rounded' | 'ellipse'; photo: Box; radius: number; elements: Element[] }
export interface Member { name: string; designation: string }
export const FONT = 'Inter Variable, Noto Sans Bengali Variable, sans-serif';
export const text = (value: string, x: number, y: number, width: number, height: number, size: number, fill: string, align: 'left' | 'center' | 'right' = 'left', weight: 'bold' | 'normal' = 'normal', maxLines = 1): Element => ({kind:'text',text:value,x,y,width,height,size,fill,align,weight,maxLines});
export const rect = (x:number,y:number,width:number,height:number,fill:string,radius=0):Element => ({kind:'rect',x,y,width,height,fill,radius});
export const logo = (kind:'oma'|'anniversary', x:number,y:number,width:number,height:number):Element => ({kind:'logo',logo:kind,x,y,width,height});
