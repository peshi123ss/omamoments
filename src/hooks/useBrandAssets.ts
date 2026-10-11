import {useEffect,useState} from 'react';
import type {ArtworkId} from '../templates/types';
export interface BrandAssets {oma:HTMLImageElement;anniversary:HTMLImageElement;provided?:HTMLImageElement;artworks:Partial<Record<ArtworkId,HTMLImageElement>>}
const paths = ['logos/OMA.png','logos/anniversary.png','templates/provided-design.png','templates/silk.webp','templates/emerald.webp','templates/pearl.webp','templates/ruby.webp','templates/gold.webp'];
export function useBrandAssets(){
 const [assets,setAssets]=useState<BrandAssets|null>(null),[error,setError]=useState(''),[fontsReady,setFontsReady]=useState(false);
 useEffect(()=>{
  let active=true;
  Promise.all(paths.map(async path=>{const image=new Image();image.src=import.meta.env.BASE_URL+path;await image.decode();return image;})).then(([oma,anniversary,provided,silk,emerald,pearl,ruby,gold])=>{if(active)setAssets({oma,anniversary,provided,artworks:{provided,silk,emerald,pearl,ruby,gold}});}).catch(()=>{if(active)setError('Frame artwork could not load. Please refresh the page. Downloads wait until all originals and backgrounds are ready.');});
  Promise.all([document.fonts.load('italic 400 48px "Cormorant Garamond"','Celebrating'),document.fonts.load('400 48px "Inter Variable"'),document.fonts.load('700 48px "Inter Variable"'),document.fonts.load('400 48px "Noto Sans Bengali Variable"','বাংলা সদস্য'),document.fonts.load('700 48px "Noto Sans Bengali Variable"','বাংলা সদস্য'),document.fonts.ready]).then(()=>{if(active)setFontsReady(true);}).catch(()=>{if(active)setError('Fonts could not load. Refresh the page before downloading.');});
  return()=>{active=false;};
 },[]);
 return {assets,error,fontsReady};
}
