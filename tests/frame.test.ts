import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import Konva from 'konva';
import {mkdirSync,writeFileSync,readdirSync,readFileSync} from 'node:fs';
import {templates} from '../src/templates/index';
import {FONT} from '../src/templates/types';
import {fitText,photoGeometry,contain} from '../src/utils/layout';
import {fileName} from '../src/utils/fileNames';
const output=process.env.QA_OUTPUT||'test-results';mkdirSync(output,{recursive:true});
const fonts='tests/fonts';
for(const file of readdirSync(fonts).filter(f=>f.endsWith('.ttf')))GlobalFonts.registerFromPath(fonts+'/'+file,file.startsWith('inter')?'Inter Variable':file.startsWith('cormorant')?'Cormorant Garamond':'Noto Sans Bengali Variable');
// Use Konva's production drawing engine with a native canvas for deterministic export QA.
Konva.Util.createCanvasElement=()=>{const c=createCanvas(1080,1080);Object.assign(c,{style:{}});return c as unknown as HTMLCanvasElement;};
const provided=await loadImage('public/templates/provided-design.png');
const artworks:Record<string,Awaited<ReturnType<typeof loadImage>>>={provided};
for(const id of ['silk','emerald','pearl','ruby','gold'])artworks[id]=await loadImage('public/templates/'+id+'.webp');
const oma=await loadImage('public/logos/OMA.png'),anniversary=await loadImage('public/logos/anniversary.png');
const portrait=createCanvas(800,1200),p=portrait.getContext('2d');p.fillStyle='#608b75';p.fillRect(0,0,800,1200);p.fillStyle='#edc3a7';p.beginPath();p.arc(400,420,180,0,Math.PI*2);p.fill();p.fillStyle='#224a39';p.fillRect(160,600,480,600); // Synthetic QA fixture only; never ships with app.
const measure=createCanvas(1,1).getContext('2d');
function render(id:number,name:string,designation:string){const layout=templates[id].build({name,designation});const layer=new Konva.Layer();layer.add(new Konva.Rect({width:1080,height:1080,fill:layout.background}));if(layout.artwork)layer.add(new Konva.Image({image:artworks[layout.artwork] as never,width:1080,height:1080}));const group=new Konva.Group({clipFunc:ctx=>{ctx.beginPath();if(layout.photoShape==='ellipse')ctx.ellipse(layout.photo.x+layout.photo.width/2,layout.photo.y+layout.photo.height/2,layout.photo.width/2,layout.photo.height/2,0,0,Math.PI*2);else ctx.roundRect(layout.photo.x,layout.photo.y,layout.photo.width,layout.photo.height,layout.radius);ctx.closePath();}});const g=photoGeometry(portrait,layout.photo,{zoom:1.5,x:25,y:-30});group.add(new Konva.Image({image:portrait as never,x:g.x,y:g.y,width:g.width,height:g.height}));layer.add(group);
 for(const e of layout.elements){if(e.kind==='ellipse')layer.add(new Konva.Ellipse({x:e.x+e.width/2,y:e.y+e.height/2,radiusX:e.width/2,radiusY:e.height/2,fill:e.fill,stroke:e.stroke,strokeWidth:e.strokeWidth}));else if(e.kind==='rect')layer.add(new Konva.Rect({...e,cornerRadius:e.radius}));else if(e.kind==='logo'){const image=e.logo==='oma'?oma:anniversary;layer.add(new Konva.Image({image:image as never,...contain(image,e)}));}else{const fitted=fitText(e.text,e.width,e.height,e.size,e.maxLines||1,(s,size)=>{measure.font=`${e.italic?'italic ':''}${e.weight==='bold'?'700':'400'} ${size}px ${e.fontFamily||FONT}`;return measure.measureText(s).width;});assert.ok(fitted.text.split('\n').length<=(e.maxLines||1));assert.ok(fitted.text.split('\n').length*fitted.size*1.3<=e.height);for(const line of fitted.text.split('\n')){measure.font=`${e.italic?'italic ':''}${e.weight==='bold'?'700':'400'} ${fitted.size}px ${e.fontFamily||FONT}`;assert.ok(measure.measureText(line).width<=e.width+.1);}layer.add(new Konva.Text({x:e.x,y:e.y,width:e.width,height:e.height,text:fitted.text,fontSize:fitted.size,fontFamily:e.fontFamily||FONT,fontStyle:[e.italic?'italic':'',e.weight||'normal'].filter(Boolean).join(' '),lineHeight:1.3,fill:e.fill,align:e.align,wrap:'none'}));}}
 const c=layer.toCanvas({x:0,y:0,width:1080,height:1080,pixelRatio:1}) as unknown as ReturnType<typeof createCanvas>;const buffer=c.toBuffer('image/png');layer.destroy();return buffer;}
for(let i=0;i<templates.length;i++)test(`${templates[i].name}: 1080 PNG and text fit in English, Bangla and long names`,async()=>{for(const [tag,name,designation] of [['english','Towhidul Islam','Proud Member'],['bangla','তৌহিদুল ইসলাম','ইনস্টিটিউট লিডার'],['long','Mohammed Abdullah Al Mamun Chowdhury — Celebrating Our Shared Journey Together','Executive Member'],['bangla-long','মোহাম্মদ আবদুল্লাহ আল মামুন চৌধুরী আমাদের একসাথে পথচলার সুন্দর গল্প','সাধারণ সম্পাদক']]){const buffer=render(i,name,designation);const image=await loadImage(buffer);assert.equal(image.width,1080);assert.equal(image.height,1080);writeFileSync(`${output}/${templates[i].id}-${tag}.png`,buffer);}});
test('Cropping never exposes empty edges at extreme pan and zoom',()=>{for(const t of templates)for(const [width,height] of [[600,1400],[1800,600],[1080,1080]])for(const zoom of [1,2,4])for(const [x,y] of [[0,0],[99999,99999],[-99999,-99999]]){const box=t.build({name:'',designation:''}).photo;const g=photoGeometry({width,height},box,{zoom,x,y});assert.ok(g.x<=box.x+.001);assert.ok(g.y<=box.y+.001);assert.ok(g.x+g.width>=box.x+box.width-.001);assert.ok(g.y+g.height>=box.y+box.height-.001);assert.ok(Math.abs(g.width/g.height-width/height)<.001);}});
test('Logo contain preserves original aspect ratio',()=>{for(const image of [oma,anniversary]){const g=contain(image,{x:20,y:20,width:180,height:120});assert.ok(Math.abs(g.width/g.height-image.width/image.height)<.0001);assert.ok(g.width<=180&&g.height<=120);}});
test('Filename preserves Bengali and removes path characters',()=>{assert.equal(fileName('তৌহিদুল ইসলাম'),'OMA_5th_Anniversary_তৌহিদুল_ইসলাম.png');assert.equal(fileName('A / B'),'OMA_5th_Anniversary_A_B.png');});
test('Provided design preserves artwork pixels outside the photo and name areas',async()=>{
 const id=templates.findIndex(t=>t.id==='provided'), result=await loadImage(render(id,'Towhidul Islam','Volunteer'));
 const source=createCanvas(1080,1080),actual=createCanvas(1080,1080);
 source.getContext('2d').drawImage(provided,0,0,1080,1080);actual.getContext('2d').drawImage(result,0,0);
 for(const [x,y] of [[20,20],[900,50],[450,160],[600,930],[550,1000],[1050,600]])
  assert.deepEqual([...actual.getContext('2d').getImageData(x,y,1,1).data],[...source.getContext('2d').getImageData(x,y,1,1).data]);
});
test('Square photo crops fill a 1080 canvas at desktop and mobile preview scales',async()=>{
 for(const width of [280,320,360,390,420])for(const zoom of [1,2,4]){
  const layer=new Konva.Layer(),scale=width/1080,g=photoGeometry(portrait,{x:0,y:0,width:1080,height:1080},{zoom,x:99999,y:-99999});
  const group=new Konva.Group({scaleX:scale,scaleY:scale});group.add(new Konva.Image({image:portrait as never,x:g.x,y:g.y,width:g.width,height:g.height}));layer.add(group);
  const c=layer.toCanvas({x:0,y:0,width,height:width,pixelRatio:1/scale}) as unknown as ReturnType<typeof createCanvas>;
  assert.equal(c.width,1080);assert.equal(c.height,1080);
  const ctx=c.getContext('2d');for(const [x,y] of [[0,0],[1079,0],[0,1079],[1079,1079]])assert.equal(ctx.getImageData(x,y,1,1).data[3],255);
  layer.destroy();
 }
});
