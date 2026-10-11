import {logo,rect,text,type Element,type Member,type FrameLayout} from './types';
const gold='#B58A32',green='#123B2C',ivory='#FFF9EC';
const outline=(x:number,y:number,width:number,height:number,radius=0):Element=>({kind:'rect',x,y,width,height,radius,fill:'transparent',stroke:gold,strokeWidth:3});
const serif=(value:string,x:number,y:number,width:number,height:number,size:number,fill:string,align:'left'|'center'='center'):Element=>({...text(value,x,y,width,height,size,fill,align),fontFamily:'Cormorant Garamond, Noto Sans Bengali Variable, serif',italic:true} as Element);
export const HeritageGallery=(m:Member):FrameLayout=>({background:ivory,artwork:'gold',photo:{x:54,y:160,width:620,height:830},radius:12,elements:[
 outline(47,153,634,844,18),logo('oma',750,45,145,185),logo('anniversary',915,65,130,135),
 serif('Five years',720,310,305,100,71,green),text('ONE INCREDIBLE\nJOURNEY',720,424,310,96,31,green,'center','bold',2),
 rect(757,554,234,3,gold),text('2021 — 2026',720,587,310,40,27,'#856724','center'),
 rect(700,680,350,310,ivory,20),text(m.name,710,704,325,162,45,green,'center','bold',3),text(m.designation||'Proud Member',710,885,325,64,24,'#715D39','center','normal',2),text('BELIEVE YOU CAN',710,1008,325,25,17,green,'center')
]});
export const CameoPortrait=(m:Member):FrameLayout=>({background:'#FFF9EF',artwork:'pearl',photoShape:'ellipse',photo:{x:185,y:208,width:710,height:690},radius:0,elements:[
 logo('oma',54,33,142,168),logo('anniversary',875,43,160,157),serif('Five Years Together',215,53,650,83,57,green),text('ONE MAN ARMY • 2021–2026',220,149,640,28,21,'#856724','center'),
 {kind:'ellipse',x:177,y:200,width:726,height:706,fill:'transparent',stroke:gold,strokeWidth:8},
 {kind:'ellipse',x:164,y:187,width:752,height:732,fill:'transparent',stroke:'#CBBB91',strokeWidth:2},
 rect(120,930,840,116,'#FFF9EF',35),text(m.name,140,939,800,64,44,green,'center','bold',2),text(m.designation||'Proud Member',170,1017,740,29,23,'#715D39','center')
]});
export const MemoryMatte=(m:Member):FrameLayout=>({background:green,photo:{x:95,y:185,width:890,height:655},radius:3,elements:[
 rect(66,160,948,25,ivory),rect(66,185,29,655,ivory),rect(985,185,29,655,ivory),rect(66,840,948,47,ivory),outline(35,35,1010,1010,18),logo('oma',50,36,125,112),logo('anniversary',922,38,115,110),
 serif('The moments that make us',200,47,685,69,52,'#F4DA9D'),text('5TH ANNIVERSARY • 2021–2026',200,122,685,27,19,'#E5D3AB','center'),
 text('FIVE YEARS. COUNTLESS MEMORIES.',120,852,840,26,18,'#715D39','center'),
 text(m.name,85,925,910,70,48,ivory,'center','bold',2),text(m.designation||'Proud Member',135,1009,810,32,24,'#E5D3AB','center')
]});
export const HeritageSeal=(m:Member):FrameLayout=>({background:'#F5EEE1',artwork:'silk',photo:{x:110,y:145,width:860,height:697},radius:150,elements:[
 outline(100,135,880,717,160),outline(86,121,908,745,174),logo('oma',35,17,117,114),logo('anniversary',932,20,113,110),
 serif('A legacy of togetherness',175,32,730,70,55,green),rect(185,865,710,58,green,29),text('5 YEARS  |  2021–2026',205,878,670,32,24,'#FFF4D7','center','bold'),
 rect(75,929,930,135,ivory,22),text(m.name,85,942,910,65,45,green,'center','bold',2),text(m.designation||'Proud Member',150,1021,780,29,23,'#715D39','center')
]});
export const CelebrationPortrait=(m:Member):FrameLayout=>({background:ivory,photo:{x:35,y:35,width:1010,height:790},radius:18,elements:[
 outline(25,25,1030,810,24),rect(44,45,145,150,ivory,16),rect(891,45,145,150,ivory,16),logo('oma',57,53,119,132),logo('anniversary',903,60,120,121),
 rect(0,856,1080,224,green),rect(0,845,1080,6,gold),serif('Five years of impact',55,865,640,57,44,'#F4DA9D','left'),text('2021–2026',790,886,235,28,22,'#E5D3AB','center'),
 text(m.name,55,935,970,67,47,ivory,'left','bold',2),text(m.designation||'Proud Member',58,1017,964,32,23,'#E5D3AB')
]});
