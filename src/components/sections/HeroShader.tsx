'use client';

import { useEffect, useRef } from 'react';

/**
 * WebGL "dot-grid plasma" shader for the hero background.
 *
 * - A warm sand base with teal + coral halos confined to the right third,
 *   keeping the hero text legible on the left.
 * - Dot grid displaces toward the mouse; clicks emit concentric rings.
 * - Falls back silently if WebGL is unavailable (canvas is hidden).
 * - Skips entirely for users who prefer reduced motion.
 */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_click;
uniform float u_intensity;

const vec3 SAND    = vec3(0.980, 0.969, 0.949);
const vec3 SAND2   = vec3(0.956, 0.945, 0.918);
const vec3 TEAL_L  = vec3(0.063, 0.725, 0.506);
const vec3 TEAL    = vec3(0.051, 0.420, 0.345);
const vec3 TEAL_S  = vec3(0.909, 0.960, 0.941);
const vec3 CORAL   = vec3(0.910, 0.388, 0.290);
const vec3 CORAL_S = vec3(0.988, 0.917, 0.902);

float hash21(vec2 p){ p = fract(p*vec2(234.34,435.345)); p += dot(p, p+34.23); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash21(i), b = hash21(i+vec2(1,0));
  float c = hash21(i+vec2(0,1)), d = hash21(i+vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float glow(vec2 p, vec2 c, float r){
  float d = length(p - c);
  return exp(-d*d / (r*r));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  float t = u_time * 0.14;

  vec3 col = mix(SAND, SAND2, vnoise(uv*3.0 + t*0.2)*0.5 + 0.25);

  float rightMask = smoothstep(0.68, 0.98, uv.x);

  vec2 tealC = vec2(0.92, 0.45) + 0.03 * vec2(sin(t*0.8), cos(t*0.6));
  tealC = mix(tealC, u_mouse, 0.18);
  float halo = glow(uv, tealC, 0.16);
  col = mix(col, TEAL_S, halo * 0.60 * rightMask);
  col = mix(col, TEAL_L, halo*halo * 0.18 * rightMask);

  vec2 coralC = vec2(0.88, 0.82) + 0.025 * vec2(cos(t*1.2), sin(t*0.9));
  coralC = mix(coralC, u_mouse, 0.08);
  float ch = glow(uv, coralC, 0.10);
  col = mix(col, CORAL_S, ch * 0.45 * rightMask);
  col = mix(col, CORAL, ch*ch * 0.15 * rightMask);

  vec2 gridUv = uv;
  vec2 md = uv - u_mouse;
  float push = exp(-dot(md,md) / 0.028) * (0.020 + 0.020*u_click);
  gridUv -= normalize(md + 1e-4) * push;
  vec2 cell = fract(gridUv * vec2(48.0, 48.0/aspect)) - 0.5;
  float dotR = 0.12;
  float dots = smoothstep(dotR, dotR-0.05, length(cell));
  vec3 dotCol = mix(TEAL, CORAL, smoothstep(0.15, 0.6, ch));
  col = mix(col, mix(col, dotCol, 0.22), dots * rightMask * (0.45 + 0.35*u_click));

  float rd = length(uv - u_mouse);
  float ring = smoothstep(0.010, 0.0, abs(rd - 0.08*u_click))
             + smoothstep(0.008, 0.0, abs(rd - 0.16*u_click));
  col = mix(col, TEAL, ring * u_click * 0.5);

  float topFade = smoothstep(0.92, 1.0, uv.y) * 0.45;
  col = mix(col, SAND, topFade);

  float vign = smoothstep(1.15, 0.40, distance(uv, vec2(0.5)));
  col *= mix(0.97, 1.01, vign);
  col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.014;

  col = mix(SAND, col, u_intensity);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: true });
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    function compile(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }

    const prog = gl.createProgram();
    if (!prog) { canvas.style.display = 'none'; return; }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = 'none';
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uClick = gl.getUniformLocation(prog, 'u_click');
    const uInt = gl.getUniformLocation(prog, 'u_intensity');

    const mouse = { x: 0.5, y: 0.5 };
    const tgt = { x: 0.5, y: 0.5 };
    let click = 0;
    const intensity = 1.0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const host = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      if (!host) return;
      const r = host.getBoundingClientRect();
      tgt.x = (e.clientX - r.left) / r.width;
      tgt.y = 1 - (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { tgt.x = 0.5; tgt.y = 0.5; };
    const onClick = (e: MouseEvent) => {
      if (!host) return;
      const r = host.getBoundingClientRect();
      tgt.x = (e.clientX - r.left) / r.width;
      tgt.y = 1 - (e.clientY - r.top) / r.height;
      click = 1;
    };
    const onTouch = (e: TouchEvent) => {
      if (!host || !e.touches[0]) return;
      const r = host.getBoundingClientRect();
      tgt.x = (e.touches[0].clientX - r.left) / r.width;
      tgt.y = 1 - (e.touches[0].clientY - r.top) / r.height;
    };
    host?.addEventListener('mousemove', onMove);
    host?.addEventListener('mouseleave', onLeave);
    host?.addEventListener('click', onClick);
    host?.addEventListener('touchmove', onTouch, { passive: true });

    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      mouse.x += (tgt.x - mouse.x) * 0.08;
      mouse.y += (tgt.y - mouse.y) * 0.08;
      click *= 0.93;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uClick, click);
      gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      host?.removeEventListener('mousemove', onMove);
      host?.removeEventListener('mouseleave', onLeave);
      host?.removeEventListener('click', onClick);
      host?.removeEventListener('touchmove', onTouch);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto absolute inset-0 z-0"
      style={{ cursor: 'crosshair' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
    </div>
  );
}
