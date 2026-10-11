import { logo, rect, text, type Element, type FrameLayout, type Member, type ArtworkId } from './types';
const GOLD = '#C89A36';
function border(x:number,y:number,width:number,height:number,radius:number,ellipse=false):Element {
 return {kind:ellipse?'ellipse':'rect',x,y,width,height,fill:'transparent',stroke:GOLD,strokeWidth:7,...(!ellipse?{radius}:{})};
}
function make(artwork:ArtworkId,m:Member,options:{dark?:boolean;photo:{x:number;y:number;width:number;height:number};radius:number;ellipse?:boolean;heading:string;tagline:string}):FrameLayout {
 const {photo,radius,dark,ellipse,heading,tagline}=options;
 const ink=dark?'#FFF6DE':'#0B3525', subtle=dark?'#E6D29D':'#715D39';
 const title=text('Celebrating',245,47,590,70,54,dark?'#F5D789':'#A87317','center','normal');
 if(title.kind==='text'){title.fontFamily='Cormorant Garamond, Noto Sans Bengali Variable, serif';title.italic=true;}
 return {background:dark?'#123B2C':'#FFFDF5',artwork,photo,radius,photoShape:ellipse?'ellipse':'rounded',elements:[
 logo('oma',65,26,150,190),logo('anniversary',870,28,170,175),
 title,text(heading,245,119,590,71,60,ink,'center','bold'),text('2021  —  2026',275,195,530,31,23,subtle,'center'),
 border(photo.x-5,photo.y-5,photo.width+10,photo.height+10,radius+5,ellipse),
 {kind:ellipse?'ellipse':'rect',x:photo.x-10,y:photo.y-10,width:photo.width+20,height:photo.height+20,fill:'transparent',stroke:dark?'#F2D994':'#EFDDAC',strokeWidth:2,...(!ellipse?{radius:radius+10}:{})},
 text(tagline,165,883,750,34,24,ink,'center','normal'),
 rect(115,926,850,124,dark?'#092A20':'#FFFBEF',42),
 {kind:'rect',x:115,y:926,width:850,height:124,fill:'transparent',radius:42,stroke:GOLD,strokeWidth:3},
 text(m.name,140,940,800,62,43,ink,'center','bold',2),
 text(m.designation||'Proud Member',165,1014,750,28,22,subtle,'center')
 ]};
}
export const SilkTemplate=(m:Member)=>make('silk',m,{photo:{x:165,y:257,width:750,height:607},radius:100,heading:'5 YEARS',tagline:'Together We Grow'});
export const EmeraldTemplate=(m:Member)=>make('emerald',m,{dark:true,photo:{x:195,y:254,width:690,height:620},radius:0,ellipse:true,heading:'5 YEARS',tagline:'Five Years of Making a Difference'});
export const PearlTemplate=(m:Member)=>make('pearl',m,{photo:{x:145,y:253,width:790,height:610},radius:28,heading:'5 YEARS',tagline:'One Community. One Incredible Journey.'});
export const RubyTemplate=(m:Member)=>make('ruby',m,{dark:true,photo:{x:150,y:256,width:780,height:608},radius:65,heading:'5 YEARS',tagline:'Stronger Together, Every Year'});
export const GoldTemplate=(m:Member)=>make('gold',m,{photo:{x:175,y:256,width:730,height:608},radius:24,heading:'5 YEARS',tagline:'Believe You Can. Together We Will.'});
