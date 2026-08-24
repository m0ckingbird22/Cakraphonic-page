import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float grain(vec2 p) {
    return hash(p * 1.37 + vec2(17.2, 9.8));
  }

  float smoke(vec2 p) {
    float value = 0.0;
    float weight = 0.5;
    for (int i = 0; i < 5; i++) {
      value += noise(p) * weight;
      p = p * 2.02 + vec2(8.1, 4.7);
      weight *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = ((gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y)) * 2.0;
    float radius = abs(p.x) + abs(p.y);
    float angle = atan(p.y, p.x);
    float movement = u_time * 0.03;
    float cloud = smoke(vec2(angle * 0.8, radius * 3.4 - movement));
    cloud += smoke(p * 3.2 + vec2(-movement, movement * 0.7)) * 0.45;
    float shape = radius + (cloud - 0.62) * 0.28;
    float core = 1.0 - smoothstep(0.32, 0.83, shape);
    float glow = exp(-abs(shape - 0.72) * 7.0);
    float shimmer = smoothstep(0.28, 0.9, cloud);
    vec3 ink = vec3(0.018, 0.006, 0.004);
    vec3 ruby = vec3(0.52, 0.012, 0.065);
    vec3 amber = vec3(1.0, 0.43, 0.015);
    vec3 pearl = vec3(1.0, 0.97, 0.86);
    vec3 color = mix(ink, ruby, shimmer * core);
    color = mix(color, amber, glow * 0.9);
    color = mix(color, pearl, pow(glow, 4.0) * 0.9);
    color += (grain(gl_FragCoord.xy + u_time * 0.4) - 0.5) * 0.065 * (0.35 + core * 0.65);
    float vignette = 1.0 - smoothstep(0.35, 1.0, length(uv - 0.5) * 1.35);
    gl_FragColor = vec4(color * (0.65 + vignette * 1.2), 1.0);
  }
`;

export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false });
    if (!canvas || !gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!vertexShader || !fragmentShader || !program || !buffer) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let animationFrame = 0;
    let disposed = false;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    const render = (now: number) => {
      if (disposed) return;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, now / 100);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(render);
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
