export function fileName(name:string){return `OMA_5th_Anniversary_${name.normalize('NFC').trim().replace(/[^\p{L}\p{N}\p{M}_ -]/gu,'').replace(/\s+/g,'_').slice(0,100)||'Member'}.png`;}
