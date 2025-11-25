export function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  
  const C = Math.sqrt(a * a + b_ * b_);
  const h = Math.atan2(b_, a) * 180 / Math.PI;
  
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${h.toFixed(3)})`;
}

export function oklchToHex(oklch: string): string {
  const matches = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!matches) return '#000000';
  
  const L = parseFloat(matches[1]);
  const C = parseFloat(matches[2]);
  const h = parseFloat(matches[3]) * Math.PI / 180;
  
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  
  const r = Math.round(Math.max(0, Math.min(255, (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) * 255)));
  const g = Math.round(Math.max(0, Math.min(255, (-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) * 255)));
  const b_ = Math.round(Math.max(0, Math.min(255, (-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s) * 255)));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b_.toString(16).padStart(2, '0')}`;
}
