import { text, type FrameLayout, type Member } from './types';
/** Original 1254px artwork, rendered intact at the 1080px design size.
 * Only the empty photo opening is covered; the built-in badge stays intact. */
export function ProvidedTemplate(m: Member): FrameLayout {
 const scale = 1080 / 1254;
 return {
  background: '#FFFFFF', artwork: 'provided',
  photo: { x: 212 * scale, y: 281 * scale, width: 820 * scale, height: 754 * scale },
  radius: 125 * scale,
  elements: [text(m.name, 160, 1048, 760, 27, 20, '#0A3624', 'center', 'bold')],
 };
}
