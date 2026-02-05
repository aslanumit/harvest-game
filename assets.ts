
/**
 * 11 Unique Pixel Art Avatars as SVG Data URLs
 * Theme: Stardew Valley Neighbors & Animals
 * Each avatar has a distinct shape.
 */

const createPixelSVG = (pixels: { x: number, y: number, color: string }[], size: number = 8) => {
  const rects = pixels.map(p => `<rect x="${p.x}" y="${p.y}" width="1" height="1" fill="${p.color}"/>`).join('');
  const svg = `<svg width="64" height="64" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${rects}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const PREMADE_AVATARS: string[] = [
  // 1. Chicken
  createPixelSVG([
    {x:3,y:1,color:'#ff0000'},{x:4,y:1,color:'#ff0000'}, // Comb
    {x:2,y:2,color:'#ffffff'},{x:3,y:2,color:'#ffffff'},{x:4,y:2,color:'#ffffff'},{x:5,y:2,color:'#ffffff'},
    {x:2,y:3,color:'#ffffff'},{x:3,y:3,color:'#000000'},{x:4,y:3,color:'#ffffff'},{x:5,y:3,color:'#ffaa00'}, // Beak
    {x:1,y:4,color:'#ffffff'},{x:2,y:4,color:'#ffffff'},{x:3,y:4,color:'#ffffff'},{x:4,y:4,color:'#ffffff'},{x:5,y:4,color:'#ffffff'},
    {x:2,y:5,color:'#ffffff'},{x:3,y:5,color:'#ffffff'},{x:4,y:5,color:'#ffffff'},{x:5,y:5,color:'#ffffff'},
    {x:3,y:6,color:'#ffaa00'},{x:5,y:6,color:'#ffaa00'} // Feet
  ]),
  // 2. Cow
  createPixelSVG([
    {x:1,y:1,color:'#ffffff'},{x:2,y:1,color:'#000000'},{x:5,y:1,color:'#000000'},{x:6,y:1,color:'#ffffff'},
    {x:1,y:2,color:'#ffffff'},{x:2,y:2,color:'#ffffff'},{x:3,y:2,color:'#ffffff'},{x:4,y:2,color:'#ffffff'},{x:5,y:2,color:'#ffffff'},{x:6,y:2,color:'#ffffff'},
    {x:1,y:3,color:'#ffffff'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#ffffff'},{x:4,y:3,color:'#ffffff'},{x:5,y:3,color:'#000000'},{x:6,y:3,color:'#ffffff'},
    {x:1,y:4,color:'#ffffff'},{x:2,y:4,color:'#ffffff'},{x:3,y:4,color:'#ffaaaa'},{x:4,y:4,color:'#ffaaaa'},{x:5,y:4,color:'#ffffff'},{x:6,y:4,color:'#ffffff'},
    {x:1,y:5,color:'#ffffff'},{x:2,y:5,color:'#ffffff'},{x:3,y:5,color:'#ffffff'},{x:4,y:5,color:'#ffffff'},{x:5,y:5,color:'#ffffff'},{x:6,y:5,color:'#ffffff'},
    {x:2,y:6,color:'#5d3a1a'},{x:5,y:6,color:'#5d3a1a'}
  ]),
  // 3. Pig
  createPixelSVG([
    {x:2,y:2,color:'#ffb6c1'},{x:3,y:2,color:'#ffb6c1'},{x:4,y:2,color:'#ffb6c1'},{x:5,y:2,color:'#ffb6c1'},
    {x:1,y:3,color:'#ffb6c1'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#ffb6c1'},{x:4,y:3,color:'#ffb6c1'},{x:5,y:3,color:'#000000'},{x:6,y:3,color:'#ffb6c1'},
    {x:1,y:4,color:'#ffb6c1'},{x:2,y:4,color:'#ffb6c1'},{x:3,y:4,color:'#ff69b4'},{x:4,y:4,color:'#ff69b4'},{x:5,y:4,color:'#ffb6c1'},{x:6,y:4,color:'#ffb6c1'},
    {x:2,y:5,color:'#ffb6c1'},{x:3,y:5,color:'#ffb6c1'},{x:4,y:5,color:'#ffb6c1'},{x:5,y:5,color:'#ffb6c1'},
    {x:2,y:6,color:'#ff69b4'},{x:5,y:6,color:'#ff69b4'}
  ]),
  // 4. Cat
  createPixelSVG([
    {x:1,y:1,color:'#ffaa00'},{x:6,y:1,color:'#ffaa00'},
    {x:1,y:2,color:'#ffaa00'},{x:2,y:2,color:'#ffaa00'},{x:3,y:2,color:'#ffaa00'},{x:4,y:2,color:'#ffaa00'},{x:5,y:2,color:'#ffaa00'},{x:6,y:2,color:'#ffaa00'},
    {x:1,y:3,color:'#ffaa00'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#ffaa00'},{x:4,y:3,color:'#ffaa00'},{x:5,y:3,color:'#000000'},{x:6,y:3,color:'#ffaa00'},
    {x:2,y:4,color:'#ffaa00'},{x:3,y:4,color:'#ffaa00'},{x:4,y:4,color:'#ffaa00'},{x:5,y:4,color:'#ffaa00'},
    {x:3,y:5,color:'#ff69b4'},{x:4,y:5,color:'#ff69b4'},
    {x:2,y:6,color:'#ffaa00'},{x:5,y:6,color:'#ffaa00'}
  ]),
  // 5. Dog
  createPixelSVG([
    {x:1,y:1,color:'#8b4513'},{x:6,y:1,color:'#8b4513'},
    {x:1,y:2,color:'#8b4513'},{x:2,y:2,color:'#8b4513'},{x:3,y:2,color:'#8b4513'},{x:4,y:2,color:'#8b4513'},{x:5,y:2,color:'#8b4513'},{x:6,y:2,color:'#8b4513'},
    {x:1,y:3,color:'#8b4513'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#8b4513'},{x:4,y:3,color:'#8b4513'},{x:5,y:3,color:'#000000'},{x:6,y:3,color:'#8b4513'},
    {x:2,y:4,color:'#8b4513'},{x:3,y:4,color:'#000000'},{x:4,y:4,color:'#000000'},{x:5,y:4,color:'#8b4513'},
    {x:2,y:5,color:'#8b4513'},{x:3,y:5,color:'#8b4513'},{x:4,y:5,color:'#8b4513'},{x:5,y:5,color:'#8b4513'},
    {x:2,y:6,color:'#3e2723'},{x:5,y:6,color:'#3e2723'}
  ]),
  // 6. Farmer Hat
  createPixelSVG([
    {x:1,y:2,color:'#ffcc00'},{x:2,y:2,color:'#ffcc00'},{x:3,y:2,color:'#ffcc00'},{x:4,y:2,color:'#ffcc00'},{x:5,y:2,color:'#ffcc00'},{x:6,y:2,color:'#ffcc00'},
    {x:2,y:3,color:'#ffcc00'},{x:3,y:3,color:'#ffcc00'},{x:4,y:3,color:'#ffcc00'},{x:5,y:3,color:'#ffcc00'},
    {x:2,y:4,color:'#f4d29c'},{x:3,y:4,color:'#000000'},{x:4,y:4,color:'#000000'},{x:5,y:4,color:'#f4d29c'},
    {x:2,y:5,color:'#f4d29c'},{x:3,y:5,color:'#f4d29c'},{x:4,y:5,color:'#f4d29c'},{x:5,y:5,color:'#f4d29c'},
    {x:2,y:6,color:'#4a90e2'},{x:5,y:6,color:'#4a90e2'}
  ]),
  // 7. Sheep
  createPixelSVG([
    {x:2,y:1,color:'#ffffff'},{x:3,y:1,color:'#ffffff'},{x:4,y:1,color:'#ffffff'},{x:5,y:1,color:'#ffffff'},
    {x:1,y:2,color:'#ffffff'},{x:2,y:2,color:'#ffffff'},{x:3,y:2,color:'#ffffff'},{x:4,y:2,color:'#ffffff'},{x:5,y:2,color:'#ffffff'},{x:6,y:2,color:'#ffffff'},
    {x:1,y:3,color:'#ffffff'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#ffffff'},{x:4,y:3,color:'#ffffff'},{x:5,y:3,color:'#000000'},{x:6,y:3,color:'#ffffff'},
    {x:1,y:4,color:'#ffffff'},{x:2,y:4,color:'#ffffff'},{x:3,y:4,color:'#ffffff'},{x:4,y:4,color:'#ffffff'},{x:5,y:4,color:'#ffffff'},{x:6,y:4,color:'#ffffff'},
    {x:2,y:5,color:'#ffffff'},{x:3,y:5,color:'#ffffff'},{x:4,y:5,color:'#ffffff'},{x:5,y:5,color:'#ffffff'},
    {x:3,y:6,color:'#000000'},{x:4,y:6,color:'#000000'}
  ]),
  // 8. Junimo
  createPixelSVG([
    {x:3,y:0,color:'#00ff00'},
    {x:2,y:1,color:'#00ff00'},{x:3,y:1,color:'#00ff00'},{x:4,y:1,color:'#00ff00'},
    {x:1,y:2,color:'#00ff00'},{x:2,y:2,color:'#00ff00'},{x:3,y:2,color:'#00ff00'},{x:4,y:2,color:'#00ff00'},{x:5,y:2,color:'#00ff00'},
    {x:1,y:3,color:'#00ff00'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#00ff00'},{x:4,y:3,color:'#000000'},{x:5,y:3,color:'#00ff00'},
    {x:1,y:4,color:'#00ff00'},{x:2,y:4,color:'#00ff00'},{x:3,y:4,color:'#00ff00'},{x:4,y:4,color:'#00ff00'},{x:5,y:4,color:'#00ff00'},
    {x:2,y:5,color:'#00ff00'},{x:3,y:5,color:'#00ff00'},{x:4,y:5,color:'#00ff00'},
    {x:2,y:6,color:'#00ff00'},{x:4,y:6,color:'#00ff00'}
  ]),
  // 9. Wizard Hat
  createPixelSVG([
    {x:3,y:0,color:'#4b0082'},
    {x:2,y:1,color:'#4b0082'},{x:3,y:1,color:'#4b0082'},{x:4,y:1,color:'#4b0082'},
    {x:1,y:2,color:'#4b0082'},{x:2,y:2,color:'#4b0082'},{x:3,y:2,color:'#4b0082'},{x:4,y:2,color:'#4b0082'},{x:5,y:2,color:'#4b0082'},
    {x:2,y:3,color:'#f4d29c'},{x:3,y:3,color:'#000000'},{x:4,y:3,color:'#000000'},{x:5,y:3,color:'#f4d29c'},
    {x:2,y:4,color:'#ffffff'},{x:3,y:4,color:'#ffffff'},{x:4,y:4,color:'#ffffff'},{x:5,y:4,color:'#ffffff'},
    {x:3,y:5,color:'#ffffff'},{x:4,y:5,color:'#ffffff'}
  ]),
  // 10. Rabbit
  createPixelSVG([
    {x:2,y:0,color:'#ffcccc'},{x:5,y:0,color:'#ffcccc'},
    {x:2,y:1,color:'#ffcccc'},{x:5,y:1,color:'#ffcccc'},
    {x:2,y:2,color:'#ffcccc'},{x:3,y:2,color:'#ffcccc'},{x:4,y:2,color:'#ffcccc'},{x:5,y:2,color:'#ffcccc'},
    {x:1,y:3,color:'#ffcccc'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#ffcccc'},{x:4,y:3,color:'#000000'},{x:5,y:3,color:'#ffcccc'},
    {x:2,y:4,color:'#ffcccc'},{x:3,y:4,color:'#ffaaaa'},{x:4,y:4,color:'#ffaaaa'},{x:5,y:4,color:'#ffcccc'},
    {x:2,y:5,color:'#ffcccc'},{x:3,y:5,color:'#ffcccc'},{x:4,y:5,color:'#ffcccc'},{x:5,y:5,color:'#ffcccc'},
    {x:3,y:6,color:'#ffffff'},{x:4,y:6,color:'#ffffff'}
  ])
];

export const ELDER_AVATAR = createPixelSVG([
  {x:2,y:1,color:'#ffffff'},{x:3,y:1,color:'#ffffff'},{x:4,y:1,color:'#ffffff'},{x:5,y:1,color:'#ffffff'},
  {x:1,y:2,color:'#ffffff'},{x:2,y:2,color:'#f4d29c'},{x:3,y:2,color:'#f4d29c'},{x:4,y:2,color:'#f4d29c'},{x:5,y:2,color:'#f4d29c'},{x:6,y:2,color:'#ffffff'},
  {x:1,y:3,color:'#ffffff'},{x:2,y:3,color:'#000000'},{x:3,y:3,color:'#f4d29c'},{x:4,y:3,color:'#f4d29c'},{x:5,y:3,color:'#000000'},{x:6,y:3,color:'#ffffff'},
  {x:1,y:4,color:'#ffffff'},{x:2,y:4,color:'#ffffff'},{x:3,y:4,color:'#ffffff'},{x:4,y:4,color:'#ffffff'},{x:5,y:4,color:'#ffffff'},{x:6,y:4,color:'#ffffff'},
  {x:1,y:5,color:'#ffffff'},{x:2,y:5,color:'#ffffff'},{x:3,y:5,color:'#ffffff'},{x:4,y:5,color:'#ffffff'},{x:5,y:5,color:'#ffffff'},{x:6,y:5,color:'#ffffff'},
  {x:2,y:6,color:'#5d3a1a'},{x:3,y:6,color:'#5d3a1a'},{x:4,y:6,color:'#5d3a1a'},{x:5,y:6,color:'#5d3a1a'}
]);
