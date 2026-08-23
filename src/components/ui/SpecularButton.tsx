import {
  useEffect,
  useRef,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import "./SpecularButton.css";

const PAD = 20;
const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;
out vec4 fragColor;

float roundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float distanceToEdge = roundedRect(p, uHalfSize, uRadius);
  vec2 light = vec2(cos(uAngle), sin(uAngle));
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float angle = acos(clamp(abs(dot(normal, light)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade, angle);
  float line = exp(-1.35 * pow(distanceToEdge / (uThickness + 1e-6), 2.0));
  float edge = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(distanceToEdge));
  float highlight = line * rim * edge * uIntensity;
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(distanceToEdge))) * 0.45;
  fragColor = vec4(uBaseColor * base + uLineColor * highlight, clamp(base + highlight, 0.0, 1.0));
}
`;

type ButtonSize = "sm" | "md" | "lg";
type SpecularButtonProps = {
  children?: ReactNode;
  size?: ButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function SpecularButton({
  children = "Get Started",
  size = "lg",
  radius = 18,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const effectRef = useRef<HTMLSpanElement>(null);
  const propsRef = useRef({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  });
  useEffect(() => {
    propsRef.current = {
      radius,
      lineColor,
      baseColor,
      intensity,
      shineSize,
      shineFade,
      thickness,
      speed,
      followMouse,
      proximity,
      autoAnimate,
    };
  }, [
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  ]);

  useEffect(() => {
    const button = buttonRef.current;
    const effect = effectRef.current;
    if (!button || !effect) return;
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: renderer.dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.32, 0.32, 0.32] },
        uIntensity: { value: 1 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
        uBaseWidth: { value: renderer.dpr },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    effect.appendChild(gl.canvas);
    const size = { width: 1, height: 1 };
    const resize = () => {
      const rect = button.getBoundingClientRect();
      size.width = rect.width;
      size.height = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      program.uniforms.uCenter.value = [
        (PAD + rect.width / 2) * renderer.dpr,
        (PAD + rect.height / 2) * renderer.dpr,
      ];
      program.uniforms.uHalfSize.value = [
        (rect.width / 2) * renderer.dpr,
        (rect.height / 2) * renderer.dpr,
      ];
    };
    const observer = new ResizeObserver(resize);
    observer.observe(button);
    resize();
    let pointerAngle: number | null = null;
    let proximityAmount = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = Math.max(
        rect.left - event.clientX,
        0,
        event.clientX - rect.right,
      );
      const dy = Math.max(
        rect.top - event.clientY,
        0,
        event.clientY - rect.bottom,
      );
      const distance = Math.hypot(dx, dy);
      pointerAngle =
        distance === 0
          ? 2.4
          : Math.atan2(centerY - event.clientY, event.clientX - centerX);
      const normalized = Math.max(
        0,
        1 - distance / Math.max(propsRef.current.proximity, 1),
      );
      proximityAmount = normalized * normalized * (3 - 2 * normalized);
    };
    window.addEventListener("pointermove", onPointerMove);
    const lineColorValue = new Color();
    const baseColorValue = new Color();
    let angle = 2.4;
    let idleAngle = 2.4;
    let brightness = 0;
    let previous = performance.now();
    let frame = 0;
    const update = (now: number) => {
      frame = requestAnimationFrame(update);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const current = propsRef.current;
      idleAngle += current.speed * delta;
      const target =
        current.followMouse &&
        pointerAngle !== null &&
        (!current.autoAnimate || proximityAmount > 0)
          ? pointerAngle
          : idleAngle;
      const difference =
        ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += difference * (1 - Math.exp(-delta * 7));
      const targetBrightness = current.autoAnimate ? 1 : proximityAmount;
      brightness +=
        (targetBrightness - brightness) * (1 - Math.exp(-delta * 8));
      lineColorValue.set(current.lineColor);
      baseColorValue.set(current.baseColor);
      program.uniforms.uAngle.value = angle;
      program.uniforms.uRadius.value =
        Math.min(current.radius, Math.min(size.width, size.height) / 2) *
        renderer.dpr;
      program.uniforms.uLineColor.value = [
        lineColorValue.r,
        lineColorValue.g,
        lineColorValue.b,
      ];
      program.uniforms.uBaseColor.value = [
        baseColorValue.r,
        baseColorValue.g,
        baseColorValue.b,
      ];
      program.uniforms.uIntensity.value = current.intensity * brightness;
      program.uniforms.uShineSize.value = (current.shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value = (current.shineFade * Math.PI) / 180;
      program.uniforms.uThickness.value = current.thickness * renderer.dpr;
      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (gl.canvas.parentNode === effect) effect.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size} ${className}`.trim()}
      style={
        {
          "--sb-radius": `${radius}px`,
          "--sb-tint": tint,
          "--sb-tint-opacity": tintOpacity,
          "--sb-blur": `${blur}px`,
          "--sb-text-color": textColor,
        } as React.CSSProperties
      }
    >
      <span
        ref={effectRef}
        className="specular-button__fx"
        aria-hidden="true"
      />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}
