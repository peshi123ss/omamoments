import {HeritageGallery,CameoPortrait,MemoryMatte,HeritageSeal,CelebrationPortrait} from './ClassicCollection';
import { SilkTemplate, EmeraldTemplate, PearlTemplate, RubyTemplate, GoldTemplate } from './LuxuryTemplates';
import { ProvidedTemplate } from './ProvidedTemplate';
import type { TemplateId } from './types';
export const templates = [
 {id:'provided',name:'Your Original Design',description:'Original artwork, preserved',color:'#FAF4E5',build:ProvidedTemplate},
 {id:'silk',name:'Signature Silk',description:'Ivory, silk & flowing gold',color:'#FFF9ED',build:SilkTemplate},
 {id:'emerald',name:'Emerald Heritage',description:'Velvet green & gold',color:'#123B2C',build:EmeraldTemplate},
 {id:'pearl',name:'Pearl Celebration',description:'Pearlescent & luminous',color:'#FFFDF5',build:PearlTemplate},
 {id:'ruby',name:'Royal Ruby',description:'Crimson satin & gold',color:'#5C1424',build:RubyTemplate},
 {id:'gold',name:'Golden Togetherness',description:'Regal golden flourishes',color:'#FFFBEF',build:GoldTemplate},
 {id:'gallery',name:'Heritage Gallery',description:'Tall portrait & editorial name panel',color:'#FFF9EC',build:HeritageGallery},
 {id:'cameo',name:'Pearl Cameo',description:'Oval portrait & delicate double gold',color:'#FFF9EF',build:CameoPortrait},
 {id:'matte',name:'Memory Matte',description:'Gallery matte on deep forest green',color:'#123B2C',build:MemoryMatte},
 {id:'seal',name:'Heritage Embrace',description:'Soft curves & anniversary seal',color:'#F5EEE1',build:HeritageSeal},
 {id:'portrait',name:'Portrait of Impact',description:'Expansive portrait & signature footer',color:'#123B2C',build:CelebrationPortrait},
] as const;
export const getTemplate = (id:TemplateId) => templates.find(t=>t.id===id)!;
