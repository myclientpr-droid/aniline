export const BACKDROP_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  // Clip-space passthrough: the quad always covers the card frame.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * A mesh gradient: two drifting gaussian blobs over a diagonal base gradient. The `uVariant`
 * permutation gives each member a different motion from the same field, so no two cards on a grid
 * read as the same clip.
 */
export const BACKDROP_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;
uniform float uTime;
uniform float uVariant;
uniform vec2 uPointer;

varying vec2 vUv;

vec2 permute(vec2 p, float v) {
  if (v < 0.5) return p;
  if (v < 1.5) return p.yx;
  if (v < 2.5) return vec2(p.y, -p.x);
  return -p;
}

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float variant = uVariant;
  float phase = variant * 1.7;

  // Base: the deep tone at the bottom-left, the light one at the top-right.
  vec3 color = mix(uColorD, uColorC, smoothstep(0.0, 1.0, uv.y * 0.6 + uv.x * 0.4));

  vec2 p1 = permute(uv - 0.5, variant);
  p1 += 0.26 * vec2(sin(t * 0.33 + phase), cos(t * 0.26 + phase));
  p1 += uPointer * 0.1;
  float blob1 = exp(-3.6 * dot(p1, p1));

  vec2 p2 = permute(uv, variant + 2.0) - 0.5;
  p2 += 0.22 * vec2(cos(t * 0.21 - phase), sin(t * 0.29 + phase));
  float blob2 = exp(-5.5 * dot(p2, p2));

  color = mix(color, uColorA, clamp(blob1, 0.0, 1.0));
  color = mix(color, uColorB, clamp(blob2 * 0.75, 0.0, 1.0));

  // Corner fall-off only: enough to hold the monogram without reading darker than the CSS frame
  // the shader replaces.
  vec2 q = (uv - 0.5) * vec2(1.15, 1.0);
  color *= mix(1.0, 0.9, smoothstep(0.35, 0.95, length(q)));

  gl_FragColor = vec4(color, 1.0);
}
`;
