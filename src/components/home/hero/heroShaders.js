export const HERO_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  // Clip-space passthrough: the quad always covers the hero, so no resize math and no edge reveal.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Colors are authored and written in sRGB units, and the video texture is uploaded with
 * LinearSRGBColorSpace, so nothing is decoded on sample and nothing is re-encoded on output.
 */
export const HERO_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform sampler2D uMap;
uniform float uHasVideo;
uniform float uTime;
uniform float uScroll;
uniform float uOpacity;
uniform float uEdgeFx;
uniform vec2 uMouse;
uniform vec2 uCoverScale;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  // Slow breathing zoom; 1.0 is the exact cover fit.
  float zoom = 1.0 - 0.02 * (0.5 + 0.5 * sin(uTime * 0.09));
  vec2 uv = (vUv - 0.5) * uCoverScale * zoom + 0.5;
  uv += uMouse * 0.012 + vec2(0.0, uScroll * 0.05);

  vec3 color;

  if (uHasVideo > 0.5) {
    color = texture2D(uMap, uv).rgb;

    if (uEdgeFx > 0.5) {
      float edge = min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y));
      float split = smoothstep(0.3, 0.0, edge) * 0.0035;
      color.r = texture2D(uMap, uv + vec2(split, 0.0)).r;
      color.b = texture2D(uMap, uv - vec2(split, 0.0)).b;
      color *= 1.0 - 0.035 * step(0.5, fract(uv.y * 820.0));
    }

    // Grade toward the brand instead of leaving the reel neutral.
    color *= vec3(1.02, 0.99, 0.95);
    color = mix(color, color * color * 1.2, 0.12);
  } else {
    vec3 navyDark = vec3(0.0, 0.051, 0.168);
    vec3 navy = vec3(0.0, 0.075, 0.243);
    vec3 orange = vec3(0.996, 0.647, 0.0);
    color = mix(navyDark, navy, smoothstep(0.0, 1.0, uv.y));

    float sweep = sin(uv.x * 2.4 + uv.y * 1.3 + uTime * 0.12) * 0.5 + 0.5;
    color += orange * 0.05 * pow(sweep, 4.0);

    float beamX = 0.3 + 0.4 * sin(uTime * 0.05);
    float beam = smoothstep(0.45, 0.0, abs(uv.x - beamX));
    color += orange * 0.07 * beam * (1.0 - uv.y);

    float aperture = smoothstep(0.75, 0.15, length((uv - 0.5) * vec2(1.3, 1.0)));
    color += orange * 0.035 * aperture;
  }

  float d = length((vUv - 0.5) * vec2(1.25, 1.0));
  color *= mix(0.6, 1.0, 1.0 - smoothstep(0.2, 0.75, d));

  color += (hash21(vUv * 1200.0 + fract(uTime)) - 0.5) * 0.035;

  gl_FragColor = vec4(color, uOpacity);
}
`;

/**
 * Cover-fit as UV sampling, so the plane never needs re-tiling on resize.
 * A scale below 1 samples a sub-region of the source, which is what "cover" means here.
 */
export function computeCover(planeAspect, contentAspect) {
    if (!planeAspect || !contentAspect) return [1, 1];
    return contentAspect > planeAspect ? [planeAspect / contentAspect, 1] : [1, contentAspect / planeAspect];
}
