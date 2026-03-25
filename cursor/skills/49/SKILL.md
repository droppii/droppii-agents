---
name: ck:shader
description: "Write GLSL fragment shaders for procedural graphics. Topics: shapes (SDF), patterns, noise (Perlin/simplex/cellular), fBm, colors (HSB/RGB), matrices, gradients, animations. Use for generative art, textures, visual effects, WebGL, Three.js shaders."
version: 1.0.0
argument-hint: "[effect or pattern]"
---

# GLSL Fragment Shaders

Write GPU-accelerated fragment shaders for procedural graphics, textures, and visual effects.

## When to Use

- Creating procedural textures (wood, marble, clouds, terrain)
- Drawing shapes with distance fields (SDF)
- Generating patterns, noise, gradients
- Building visual effects and animations
- Writing custom shaders for Three.js, WebGL, Processing

## Core Concepts

Fragment shaders execute **simultaneously on every pixel**. Each thread:
- Receives pixel position via `gl_FragCoord`
- Returns color via `gl_FragColor` (vec4: RGBA 0.0-1.0)
- Cannot communicate with other threads (stateless)

## Standard Uniforms

```glsl
uniform float u_time;       // Elapsed seconds
uniform vec2 u_resolution;  // Canvas size (width, height)
uniform vec2 u_mouse;       // Mouse position in pixels
```

Normalize coordinates: `vec2 st = gl_FragCoord.xy / u_resolution;`

## Essential Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `mix(a,b,t)` | Linear interpolate | `mix(red, blue, 0.5)` |
| `step(edge,x)` | Hard threshold | `step(0.5, st.x)` |
| `smoothstep(e0,e1,x)` | Smooth threshold | `smoothstep(0.2, 0.8, st.x)` |
| `fract(x)` | Fractional part | `fract(st * 3.0)` for tiling |
| `mod(x,y)` | Modulo | `mod(st.x, 0.25)` |
| `clamp(x,min,max)` | Constrain value | `clamp(col, 0.0, 1.0)` |
| `length(v)` | Vector magnitude | `length(st - 0.5)` |
| `distance(a,b)` | Euclidean distance | `distance(st, center)` |
| `dot(a,b)` | Dot product | `dot(normal, lightDir)` |
| `normalize(v)` | Unit vector | `normalize(direction)` |
| `atan(y,x)` | Angle (radians) | `atan(st.y-0.5, st.x-0.5)` |
| `sin/cos/pow/abs` | Math | Hardware-accelerated |

## Quick Patterns

**Circle:**
```glsl
float d = distance(st, vec2(0.5));
float circle = 1.0 - smoothstep(0.2, 0.21, d);
```

**Rectangle:**
```glsl
vec2 bl = step(vec2(0.1), st);
vec2 tr = step(vec2(0.1), 1.0 - st);
float rect = bl.x * bl.y * tr.x * tr.y;
```

**Tiling:**
```glsl
st = fract(st * 4.0);  // 4x4 grid
```

**Animation:**
```glsl
float wave = sin(st.x * 10.0 + u_time) * 0.5 + 0.5;
```

## References (Progressive Disclosure)

### Fundamentals
- `references/glsl-fundamentals-data-types-vectors-precision-coordinates.md`
- `references/glsl-shaping-functions-step-smoothstep-curves-interpolation.md`

### Drawing
- `references/glsl-colors-rgb-hsb-gradients-mixing-color-spaces.md`
- `references/glsl-shapes-sdf-circles-rectangles-polar-distance-fields.md`
- `references/glsl-shapes-polygon-star-polar-sdf-combinations.md`

### Procedural
- `references/glsl-patterns-tiling-fract-matrices-transformations.md`
- `references/glsl-pattern-symmetry-truchet-domain-warping.md`
- `references/glsl-noise-random-perlin-simplex-cellular-voronoi.md`
- `references/glsl-cellular-voronoi-worley-noise-patterns.md`
- `references/glsl-fbm-fractional-brownian-motion-turbulence-octaves.md`
- `references/glsl-procedural-textures-clouds-marble-wood-terrain.md`

### API Reference
- `references/glsl-shader-builtin-functions-complete-api-reference.md`

## Tools

- **Online Editor:** editor.thebookofshaders.com
- **glslViewer:** CLI tool for running .frag files
- **glslCanvas:** HTML embed for live shaders
- **ShaderToy:** iTime, iResolution, iMouse uniforms

## External Resources

- The Book of Shaders: https://thebookofshaders.com
- LYGIA Library: https://lygia.xyz (reusable shader functions)
- ShaderToy: https://shadertoy.com
- Inigo Quilez Articles: https://iquilezles.org/articles/


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### glsl cellular voronoi worley noise patterns

# Cellular and Voronoi Noise

Distance-based noise for organic cell patterns. See `glsl-noise-random-perlin-simplex-cellular-voronoi.md` for random functions.

## Basic Cellular Noise

Distance to nearest feature point:

```glsl
float cellularNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float minDist = 1.0;

    // Check 3x3 neighborhood
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i + neighbor);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            minDist = min(minDist, dist);
        }
    }

    return minDist;
}
```

## Voronoi with Cell ID

```glsl
vec3 voronoi(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float minDist = 1.0;
    vec2 minPoint;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i + neighbor);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            if (dist < minDist) {
                minDist = dist;
                minPoint = i + neighbor + point;
            }
        }
    }

    // Returns: distance, cell id x, cell id y
    return vec3(minDist, minPoint);
}

// Color cells by ID
vec3 voronoiColor(vec2 st, float scale) {
    vec3 v = voronoi(st * scale);
    return vec3(random(v.yz), random(v.yz + 1.0), random(v.yz + 2.0));
}
```

## Worley Noise (F1, F2)

```glsl
vec2 worleyNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float f1 = 1.0;  // Nearest
    float f2 = 1.0;  // Second nearest

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i + neighbor);
            float dist = length(neighbor + point - f);

            if (dist < f1) {
                f2 = f1;
                f1 = dist;
            } else if (dist < f2) {
                f2 = dist;
            }
        }
    }

    return vec2(f1, f2);
}
```

## Worley Variations

```glsl
float worleyF1(vec2 st) { return worleyNoise(st).x; }
float worleyEdges(vec2 st) { vec2 w = worleyNoise(st); return w.y - w.x; }
float worleyBlobs(vec2 st) { vec2 w = worleyNoise(st); return w.x * w.y; }
```

## Animated Voronoi

```glsl
float animatedVoronoi(vec2 st, float time) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float minDist = 1.0;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i + neighbor);
            // Animate point position
            point = 0.5 + 0.5 * sin(time + 6.2831 * point);
            float dist = length(neighbor + point - f);
            minDist = min(minDist, dist);
        }
    }

    return minDist;
}
```

## Distance Metrics

```glsl
float euclidean(vec2 v) { return length(v); }
float manhattan(vec2 v) { return abs(v.x) + abs(v.y); }
float chebyshev(vec2 v) { return max(abs(v.x), abs(v.y)); }
```

## Practical Applications

```glsl
// Cracked ground
vec3 crackedGround(vec2 st) {
    float edges = worleyEdges(st * 5.0);
    return mix(vec3(0.1), vec3(0.5, 0.4, 0.3), smoothstep(0.0, 0.05, edges));
}
```


### glsl colors rgb hsb gradients mixing color spaces

# Colors in GLSL

Color spaces, gradients, and color manipulation techniques.

## RGB Color Space

Colors as vec3/vec4 with channels 0.0-1.0:

```glsl
vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 white = vec3(1.0);
vec3 black = vec3(0.0);
vec3 gray = vec3(0.5);
```

## Hex to GLSL

Divide by 255: `#FF6600` = `vec3(1.0, 0.4, 0.0)`

```glsl
vec3 hexToRgb(int hex) {
    return vec3(
        float((hex >> 16) & 0xFF) / 255.0,
        float((hex >> 8) & 0xFF) / 255.0,
        float(hex & 0xFF) / 255.0
    );
}
```

## Color Mixing

```glsl
// Linear interpolation
vec3 color = mix(colorA, colorB, 0.5);

// Per-channel mixing
vec3 color = mix(colorA, colorB, vec3(0.2, 0.5, 0.8));

// Multiply (darken)
vec3 color = colorA * colorB;

// Screen (lighten)
vec3 color = 1.0 - (1.0 - colorA) * (1.0 - colorB);

// Add (glow)
vec3 color = colorA + colorB;
```

## Gradients

### Horizontal gradient
```glsl
vec3 color = mix(colorA, colorB, st.x);
```

### Vertical gradient
```glsl
vec3 color = mix(colorA, colorB, st.y);
```

### Radial gradient
```glsl
float d = distance(st, vec2(0.5));
vec3 color = mix(centerColor, edgeColor, d);
```

### Multi-stop gradient
```glsl
vec3 gradient(float t) {
    vec3 a = vec3(0.0, 0.0, 0.5);  // Dark blue
    vec3 b = vec3(0.0, 0.5, 1.0);  // Light blue
    vec3 c = vec3(1.0, 1.0, 0.0);  // Yellow
    vec3 d = vec3(1.0, 0.5, 0.0);  // Orange

    if (t < 0.33) return mix(a, b, t * 3.0);
    if (t < 0.66) return mix(b, c, (t - 0.33) * 3.0);
    return mix(c, d, (t - 0.66) * 3.0);
}
```

## HSB/HSV Color Space

More intuitive: Hue (color wheel), Saturation (intensity), Brightness.

### RGB to HSB
```glsl
vec3 rgb2hsb(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
```

### HSB to RGB
```glsl
vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
                     0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}
```

### HSB Usage
```glsl
// Rainbow across x-axis
vec3 color = hsb2rgb(vec3(st.x, 1.0, 1.0));

// Color wheel (polar coordinates)
vec2 toCenter = st - 0.5;
float angle = atan(toCenter.y, toCenter.x);
float hue = angle / TWO_PI + 0.5;  // Normalize to 0-1
float sat = length(toCenter) * 2.0;
vec3 color = hsb2rgb(vec3(hue, sat, 1.0));
```

## Animated Colors

```glsl
// Cycling hue
float hue = fract(u_time * 0.1);
vec3 color = hsb2rgb(vec3(hue, 1.0, 1.0));

// Pulsing brightness
float brightness = sin(u_time) * 0.5 + 0.5;
vec3 color = baseColor * brightness;

// Color oscillation
vec3 color = mix(colorA, colorB, sin(u_time) * 0.5 + 0.5);
```

## Color Correction

```glsl
vec3 gamma(vec3 c, float g) { return pow(c, vec3(1.0 / g)); }
vec3 contrast(vec3 c, float a) { return (c - 0.5) * a + 0.5; }
vec3 saturation(vec3 c, float a) { return mix(vec3(dot(c, vec3(0.299, 0.587, 0.114))), c, a); }
```


### glsl fbm fractional brownian motion turbulence octaves

# Fractional Brownian Motion (fBm)

Layer noise octaves for natural-looking textures like clouds, terrain, and wood.

## Basic fBm

```glsl
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    // 6 octaves
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;    // Lacunarity
        amplitude *= 0.5;    // Gain (persistence)
    }

    return value;
}
```

## fBm Parameters

| Parameter | Effect | Typical Value |
|-----------|--------|---------------|
| **Octaves** | Detail level | 4-8 |
| **Lacunarity** | Frequency multiplier | 2.0 |
| **Gain** | Amplitude multiplier | 0.5 |

```glsl
float fbm(vec2 st, int octaves, float lacunarity, float gain) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < octaves; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= lacunarity;
        amplitude *= gain;
    }

    return value;
}
```

## Turbulence

Use absolute value for sharper valleys:

```glsl
float turbulence(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 6; i++) {
        value += amplitude * abs(noise(st * frequency) * 2.0 - 1.0);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}
```

## Ridged Noise

Inverted turbulence for mountain ridges:

```glsl
float ridged(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    float prev = 1.0;

    for (int i = 0; i < 6; i++) {
        float n = abs(noise(st * frequency) * 2.0 - 1.0);
        n = 1.0 - n;           // Invert
        n = n * n;             // Sharpen
        n *= prev;             // Weight by previous
        prev = n;
        value += n * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}
```

## Warped fBm (Domain Warping)

Feed fBm into itself for organic distortion:

```glsl
float warpedFbm(vec2 st) {
    vec2 q = vec2(fbm(st), fbm(st + vec2(5.2, 1.3)));
    vec2 r = vec2(
        fbm(st + 4.0 * q + vec2(1.7, 9.2)),
        fbm(st + 4.0 * q + vec2(8.3, 2.8))
    );
    return fbm(st + 4.0 * r);
}
```

## Animated fBm

```glsl
float animatedFbm(vec2 st, float time) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 6; i++) {
        vec2 offset = vec2(time * 0.1 * float(i + 1));
        value += amplitude * noise(st * frequency + offset);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}
```

## Multifractal

Multiply instead of add for different character:

```glsl
float multifractal(vec2 st, float H, float lacunarity, int octaves) {
    float value = 1.0;
    float frequency = 1.0;

    for (int i = 0; i < octaves; i++) {
        value *= noise(st * frequency) * pow(frequency, -H) + 1.0;
        frequency *= lacunarity;
    }

    return value;
}
```

See also: `glsl-procedural-textures-clouds-marble-wood-terrain.md`


### glsl fundamentals data types vectors precision coordinates

# GLSL Fundamentals

Basic GLSL fragment shader structure, data types, and coordinate systems.

## Minimal Shader

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}
```

## Data Types

| Type | Description | Example |
|------|-------------|---------|
| `float` | Single decimal | `float x = 1.0;` |
| `vec2` | 2D vector | `vec2 pos = vec2(0.5, 0.5);` |
| `vec3` | 3D vector / RGB | `vec3 color = vec3(1.0, 0.0, 0.0);` |
| `vec4` | 4D vector / RGBA | `vec4 rgba = vec4(1.0, 0.0, 0.0, 1.0);` |
| `mat2/mat3/mat4` | Matrices | `mat2 rotation;` |
| `sampler2D` | 2D texture | `uniform sampler2D u_tex;` |

## Precision Qualifiers

```glsl
precision lowp float;    // Fast, low quality
precision mediump float; // Default, balanced
precision highp float;   // Slow, high quality
```

## Vector Swizzling

Access components via `.xyzw`, `.rgba`, or `.stpq`:

```glsl
vec4 color = vec4(1.0, 0.5, 0.0, 1.0);
vec3 rgb = color.rgb;      // (1.0, 0.5, 0.0)
vec2 rg = color.rg;        // (1.0, 0.5)
float r = color.r;         // 1.0
vec3 bgr = color.bgr;      // (0.0, 0.5, 1.0) - reorder
vec4 rrrr = color.rrrr;    // (1.0, 1.0, 1.0, 1.0) - repeat
```

## Vector Construction

```glsl
vec3 a = vec3(1.0);                    // (1.0, 1.0, 1.0)
vec3 b = vec3(1.0, 2.0, 3.0);          // (1.0, 2.0, 3.0)
vec4 c = vec4(a, 1.0);                 // (1.0, 1.0, 1.0, 1.0)
vec4 d = vec4(vec2(0.5), vec2(0.8));   // (0.5, 0.5, 0.8, 0.8)
```

## Type Casting

GLSL requires explicit types:

```glsl
float x = 1.0;      // Correct
float y = 1;        // May fail - use 1.0
int i = int(x);     // Explicit cast
float z = float(i); // Explicit cast
```

## Coordinate System

- `gl_FragCoord.xy` - Pixel coordinates (0 to resolution)
- Normalize to 0.0-1.0: `vec2 st = gl_FragCoord.xy / u_resolution;`
- Origin (0,0) is bottom-left

## Output

Assign final color to `gl_FragColor`:

```glsl
gl_FragColor = vec4(red, green, blue, alpha);
// Values clamped to 0.0-1.0
```

## Preprocessor

```glsl
#define PI 3.14159265359
#define TWO_PI 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif
```

## Common Mistakes

1. **Missing decimal**: `1` instead of `1.0`
2. **Integer division**: `1/2` = 0, use `1.0/2.0`
3. **Uninitialized uniforms**: Always check uniform availability
4. **Precision issues**: Use `highp` for complex math


### glsl noise random perlin simplex cellular voronoi

# Noise in GLSL

Generate pseudo-random and noise patterns for organic textures.

## Pseudo-Random Function

```glsl
// 1D random
float random(float x) {
    return fract(sin(x) * 43758.5453);
}

// 2D random
float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D random returning vec2
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return fract(sin(st) * 43758.5453123);
}
```

## Value Noise

Interpolate between random values at grid points:

```glsl
float valueNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
```

## Gradient Noise (Perlin-like)

```glsl
vec2 grad(vec2 i) {
    float a = random(i) * TWO_PI;
    return vec2(cos(a), sin(a));
}

float gradientNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = dot(grad(i), f);
    float b = dot(grad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(grad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(grad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

    // Quintic interpolation
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}
```

## Simplex Noise (2D)

More efficient, fewer artifacts:

```glsl
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float simplexNoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
```

## Animated Noise

```glsl
float animatedNoise(vec2 st, float time) {
    return valueNoise(st + vec2(time * 0.1));
}

float flowingNoise(vec2 st, float time) {
    vec2 offset = vec2(sin(time * 0.5), cos(time * 0.3)) * 2.0;
    return valueNoise(st + offset);
}
```

See also: `glsl-cellular-voronoi-worley-noise-patterns.md`


### glsl pattern symmetry truchet domain warping

# Pattern Symmetry & Advanced Techniques

Advanced pattern generation including symmetry, Truchet tiles, and domain warping.

## Mirror/Reflection

```glsl
// Mirror horizontally
vec2 mirrorX(vec2 st) {
    return vec2(abs(st.x - 0.5) + 0.5, st.y);
}

// Mirror vertically
vec2 mirrorY(vec2 st) {
    return vec2(st.x, abs(st.y - 0.5) + 0.5);
}

// Kaleidoscope (4-fold symmetry)
vec2 kaleidoscope(vec2 st) {
    st -= 0.5;
    st = abs(st);
    return st + 0.5;
}
```

## N-fold Radial Symmetry

```glsl
vec2 radialSymmetry(vec2 st, float n) {
    st -= 0.5;
    float angle = atan(st.y, st.x);
    float segment = TWO_PI / n;
    angle = mod(angle, segment);
    float r = length(st);
    return vec2(cos(angle), sin(angle)) * r + 0.5;
}

// Usage: 6-fold snowflake symmetry
vec2 sym = radialSymmetry(st, 6.0);
```

## Truchet Tiles

Random orientation per cell:

```glsl
float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

float truchet(vec2 st, float n) {
    st *= n;
    vec2 idx = floor(st);
    vec2 local = fract(st);

    // Random rotation per cell (0, 90, 180, 270 degrees)
    float r = random(idx);
    if (r < 0.25) local = local;
    else if (r < 0.5) local = vec2(1.0 - local.y, local.x);
    else if (r < 0.75) local = 1.0 - local;
    else local = vec2(local.y, 1.0 - local.x);

    // Draw quarter circles
    float d1 = length(local);
    float d2 = length(local - 1.0);
    return min(abs(d1 - 0.5), abs(d2 - 0.5));
}

// Usage
float pattern = 1.0 - smoothstep(0.0, 0.05, truchet(st, 8.0));
```

## Truchet Variations

```glsl
// Line-based Truchet
float truchetLines(vec2 st, float n) {
    st *= n;
    vec2 idx = floor(st);
    vec2 local = fract(st);

    float r = random(idx);
    if (r > 0.5) local = vec2(local.y, local.x);  // Flip diagonal

    // Diagonal line
    return abs(local.x - local.y);
}

// Maze pattern
float truchetMaze(vec2 st, float n) {
    st *= n;
    vec2 idx = floor(st);
    vec2 local = fract(st) - 0.5;

    float r = random(idx);
    if (r > 0.5) local.x = -local.x;

    return smoothstep(0.0, 0.1, abs(local.x + local.y));
}
```

## Domain Warping

```glsl
vec2 warp(vec2 st, float a) {
    return st + vec2(sin(st.y * 10.0), sin(st.x * 10.0)) * a;
}

vec2 animatedWarp(vec2 st, float t, float a) {
    return st + vec2(sin(st.y * 5.0 + t), cos(st.x * 5.0 + t * 1.3)) * a;
}
```

## Iterative Domain Warping

```glsl
vec2 iterativeWarp(vec2 st, int iterations) {
    for (int i = 0; i < iterations; i++) {
        st = vec2(valueNoise(st), valueNoise(st + 5.0)) * 2.0 - 1.0 + st;
    }
    return st;
}
```

## Practical Pattern Examples

```glsl
// Islamic-style pattern
float islamicPattern(vec2 st, float n) {
    st = radialSymmetry(st, 8.0);
    st = tile(st, n);
    return smoothstep(0.4, 0.41, length(st - 0.5));
}
```


### glsl patterns tiling fract matrices transformations

# Patterns in GLSL

Create repeating patterns using tiling and coordinate transformations.

## Basic Tiling with fract()

```glsl
// Tile space into grid
vec2 tile(vec2 st, float n) {
    return fract(st * n);
}

// Usage: 4x4 grid
vec2 tiled = tile(st, 4.0);
```

## Grid with Cell Index

```glsl
// Get both cell index and position within cell
vec2 grid(vec2 st, float n, out vec2 cellIndex) {
    st *= n;
    cellIndex = floor(st);
    return fract(st);
}

// Usage
vec2 idx;
vec2 local = grid(st, 4.0, idx);
```

## Brick Pattern (Offset Rows)

```glsl
vec2 brickTile(vec2 st, float n) {
    st *= n;
    float row = floor(st.y);
    st.x += mod(row, 2.0) * 0.5;  // Offset odd rows
    return fract(st);
}
```

## Hex Grid

```glsl
vec2 hexGrid(vec2 st, float scale) {
    st *= scale;
    vec2 r = vec2(1.0, 1.73205);  // sqrt(3)
    vec2 h = r * 0.5;
    vec2 a = mod(st, r) - h;
    vec2 b = mod(st - h, r) - h;
    return dot(a, a) < dot(b, b) ? a : b;
}
```

## 2D Rotation Matrix

```glsl
mat2 rotate2d(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

// Rotate around center
vec2 rotateAround(vec2 st, vec2 center, float angle) {
    return rotate2d(angle) * (st - center) + center;
}
```

## Scale Matrix

```glsl
mat2 scale2d(vec2 scale) {
    return mat2(scale.x, 0.0, 0.0, scale.y);
}

vec2 scaleFrom(vec2 st, vec2 center, vec2 s) {
    return scale2d(s) * (st - center) + center;
}
```

## Checkerboard

```glsl
float checker(vec2 st, float n) {
    st *= n;
    vec2 idx = floor(st);
    return mod(idx.x + idx.y, 2.0);
}
```

## Stripes

```glsl
// Horizontal stripes
float stripes(float y, float n) {
    return step(0.5, fract(y * n));
}

// Diagonal stripes
float diagonalStripes(vec2 st, float n, float angle) {
    vec2 rotated = rotate2d(angle) * st;
    return step(0.5, fract(rotated.x * n));
}
```

## Polar Patterns

```glsl
// Convert to polar for radial patterns
vec2 toPolar(vec2 st) {
    vec2 pos = st - 0.5;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    return vec2(r, a);
}

// Repeat around center
float radialRepeat(vec2 st, float n) {
    vec2 polar = toPolar(st);
    polar.y = fract(polar.y * n / TWO_PI);
    return polar.y;
}

// Spiral
float spiral(vec2 st, float turns) {
    vec2 polar = toPolar(st);
    return fract(polar.x - polar.y * turns / TWO_PI);
}
```

See also: `glsl-pattern-symmetry-truchet-domain-warping.md`


### glsl procedural textures clouds marble wood terrain

# Procedural Textures

Practical texture recipes using fBm and noise. See `glsl-fbm-fractional-brownian-motion-turbulence-octaves.md` for core functions.

## Clouds

```glsl
vec3 clouds(vec2 st, float time) {
    float n = fbm(st * 3.0 + vec2(time * 0.1, 0.0));
    n = smoothstep(0.4, 0.6, n);
    return mix(vec3(0.4, 0.6, 0.9), vec3(1.0), n);
}
```

## Marble

```glsl
float marble(vec2 st) {
    float n = fbm(st * 4.0);
    return sin(st.x * 10.0 + n * 20.0) * 0.5 + 0.5;
}

vec3 marbleColor(vec2 st) {
    float v = marble(st);
    vec3 white = vec3(0.95);
    vec3 gray = vec3(0.3);
    return mix(gray, white, v);
}
```

## Wood Grain

```glsl
float wood(vec2 st) {
    float n = fbm(st * 2.0);
    float grain = sin((st.x + n * 0.5) * 50.0) * 0.5 + 0.5;
    return mix(0.3, 0.6, grain);
}

vec3 woodColor(vec2 st) {
    float v = wood(st);
    vec3 light = vec3(0.76, 0.60, 0.42);
    vec3 dark = vec3(0.44, 0.30, 0.18);
    return mix(dark, light, v);
}
```

## Terrain Height

```glsl
float terrain(vec2 st) {
    float h = fbm(st * 2.0);
    h += ridged(st * 4.0) * 0.5;
    return h;
}

vec3 terrainColor(vec2 st) {
    float h = terrain(st);
    vec3 water = vec3(0.1, 0.3, 0.5);
    vec3 sand = vec3(0.76, 0.70, 0.50);
    vec3 grass = vec3(0.2, 0.5, 0.2);
    vec3 rock = vec3(0.5, 0.5, 0.5);
    vec3 snow = vec3(1.0);

    if (h < 0.3) return mix(water, sand, h / 0.3);
    if (h < 0.5) return mix(sand, grass, (h - 0.3) / 0.2);
    if (h < 0.7) return mix(grass, rock, (h - 0.5) / 0.2);
    return mix(rock, snow, (h - 0.7) / 0.3);
}
```

## Fire / Smoke

```glsl
vec3 fire(vec2 st, float time) {
    vec2 q = st;
    q.y -= time * 0.5;  // Rise

    float n = turbulence(q * 3.0);
    n *= smoothstep(1.0, 0.0, st.y);  // Fade at top

    vec3 col = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), n);
    return col * n;
}

vec3 smoke(vec2 st, float time) {
    vec2 q = st;
    q.y -= time * 0.2;

    float n = fbm(q * 4.0);
    n *= smoothstep(1.0, 0.0, st.y);

    return vec3(0.3 + n * 0.3) * n;
}
```

## Water Caustics

```glsl
float caustics(vec2 st, float time) {
    vec2 p = st * 8.0;
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
        float t = time * (0.5 + float(i) * 0.1);
        c += abs(sin(p.x + sin(p.y + t)) * sin(p.y + sin(p.x + t * 1.3)));
        p *= 1.5;
    }
    return c / 3.0;
}
```

## Lava

```glsl
vec3 lava(vec2 st, float time) {
    float n = warpedFbm(st + vec2(time * 0.05));
    vec3 cold = vec3(0.1, 0.0, 0.0);
    vec3 hot = vec3(1.0, 0.3, 0.0);
    vec3 bright = vec3(1.0, 0.9, 0.3);
    return mix(cold, mix(hot, bright, n), smoothstep(0.3, 0.7, n));
}
```

## Grass/Fur

```glsl
float grass(vec2 st) {
    float n = fbm(st * 20.0);
    float blade = smoothstep(0.3, 0.5, n);
    return blade * (0.8 + fbm(st * 5.0) * 0.2);
}
```

## Stone/Rock

```glsl
vec3 stone(vec2 st) {
    float n1 = fbm(st * 4.0);
    float n2 = fbm(st * 8.0 + 5.0) * 0.5;
    float crack = smoothstep(0.48, 0.52, n1);
    vec3 base = vec3(0.5 + n2 * 0.2);
    return mix(base * 0.7, base, crack);
}
```


### glsl shader builtin functions complete api reference

# GLSL Built-in Functions Reference

Complete reference for GLSL ES 1.0 / WebGL functions.

## Trigonometric Functions

| Function | Description | Range |
|----------|-------------|-------|
| `sin(x)` | Sine | [-1, 1] |
| `cos(x)` | Cosine | [-1, 1] |
| `tan(x)` | Tangent | unbounded |
| `asin(x)` | Arc sine | [-PI/2, PI/2] |
| `acos(x)` | Arc cosine | [0, PI] |
| `atan(y, x)` | Arc tangent (quadrant-aware) | [-PI, PI] |
| `atan(y_over_x)` | Arc tangent | [-PI/2, PI/2] |

All accept float, vec2, vec3, vec4. Input in radians.

## Exponential Functions

| Function | Description |
|----------|-------------|
| `pow(x, y)` | x raised to power y |
| `exp(x)` / `exp2(x)` | e^x / 2^x |
| `log(x)` / `log2(x)` | Natural / Base-2 logarithm |
| `sqrt(x)` / `inversesqrt(x)` | Square root / 1/sqrt(x) |

## Common Functions

| Function | Description |
|----------|-------------|
| `abs(x)` / `sign(x)` | Absolute value / -1, 0, or 1 |
| `floor(x)` / `ceil(x)` | Round down / up |
| `fract(x)` | x - floor(x) |
| `mod(x, y)` | x - y * floor(x/y) |
| `min(x, y)` / `max(x, y)` | Minimum / Maximum |
| `clamp(x, min, max)` | Constrain to range |
| `mix(a, b, t)` | Linear interpolation: a*(1-t) + b*t |
| `step(edge, x)` | 0.0 if x < edge, else 1.0 |
| `smoothstep(e0, e1, x)` | Hermite interpolation |

## Geometric Functions

| Function | Description |
|----------|-------------|
| `length(v)` / `distance(a, b)` | Magnitude / Distance |
| `dot(a, b)` / `cross(a, b)` | Dot / Cross product |
| `normalize(v)` | Unit vector |
| `reflect(i, n)` / `refract(i, n, eta)` | Reflection / Refraction |

## Vector Relational Functions

`lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `equal`, `notEqual` - Return bvec.
`any(bvec)`, `all(bvec)`, `not(bvec)` - Boolean operations.

## Texture Functions

| Function | Description |
|----------|-------------|
| `texture2D(sampler, coord)` | Sample 2D texture |
| `textureCube(sampler, coord)` | Sample cube map |

## Constants

```glsl
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define HALF_PI 1.57079632679
```

## Type Constructors

```glsl
vec2(x), vec2(x, y)
vec3(x), vec3(xy, z), vec3(x, y, z)
vec4(x), vec4(xyz, w), vec4(xy, zw)
mat2(a, b, c, d), mat3(...), mat4(...)
```

## Operators

```glsl
+  -  *  /           // Arithmetic (component-wise)
<  >  <=  >=  ==  != // Comparison
&&  ||  !            // Logical
mat * mat            // Matrix multiply
mat * vec            // Transform vector
```

## Qualifiers

```glsl
attribute  // Vertex input
uniform    // Constant across draw
varying    // Interpolated vertex->fragment
lowp / mediump / highp  // Precision
in / out / inout / const // Parameters
```

## Built-in Variables

```glsl
// Fragment Shader
vec4 gl_FragCoord;   // Window coordinates
vec4 gl_FragColor;   // Output color (write only)
bool gl_FrontFacing; // Front face?
vec2 gl_PointCoord;  // Point sprite [0,1]

// Vertex Shader
vec4 gl_Position;    // Clip-space position
float gl_PointSize;  // Point size
```


### glsl shapes polygon star polar sdf combinations

# Advanced Shapes & SDF Combinations

Polygons, stars, polar shapes, and combining multiple SDFs.

## Regular Polygon (N sides)

```glsl
float polygonSDF(vec2 st, vec2 center, float radius, int sides) {
    st -= center;
    float a = atan(st.y, st.x) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(st);
    return d - radius;
}

// Usage: hexagon
float hex = polygonSDF(st, vec2(0.5), 0.3, 6);
```

## Star Shape

```glsl
float starSDF(vec2 st, vec2 center, float r1, float r2, int points) {
    st -= center;
    float a = atan(st.y, st.x);
    float seg = TWO_PI / float(points);
    a = mod(a, seg) - seg * 0.5;
    float r = length(st);
    float inner = r2 / cos(seg * 0.5);
    float d = mix(r1, inner, step(0.0, a) * 2.0 - 1.0);
    return r - d;
}
```

## Polar Shapes

```glsl
// Convert to polar coordinates
vec2 toPolar(vec2 st) {
    vec2 pos = st - 0.5;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    return vec2(r, a);
}

// Polar flower
float flowerSDF(vec2 st, int petals, float amplitude) {
    vec2 polar = toPolar(st);
    float shape = 0.5 + amplitude * cos(float(petals) * polar.y);
    return polar.x - shape;
}

// Gear shape
float gearSDF(vec2 st, int teeth, float innerR, float outerR) {
    vec2 polar = toPolar(st);
    float tooth = step(0.5, fract(polar.y * float(teeth) / TWO_PI));
    float radius = mix(innerR, outerR, tooth);
    return polar.x - radius;
}

// Heart
float heartSDF(vec2 st) {
    st -= vec2(0.5, 0.4);
    st.x *= 0.8;
    float a = atan(st.x, st.y) / PI;
    float r = length(st);
    float h = abs(a);
    float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);
    return r - d * 0.3;
}
```

## Combining SDFs

```glsl
// Union (OR) - combine shapes
float sdfUnion(float d1, float d2) {
    return min(d1, d2);
}

// Intersection (AND) - overlap only
float sdfIntersect(float d1, float d2) {
    return max(d1, d2);
}

// Subtraction - cut out
float sdfSubtract(float d1, float d2) {
    return max(d1, -d2);
}

// XOR - either but not both
float sdfXor(float d1, float d2) {
    return max(min(d1, d2), -max(d1, d2));
}
```

## Smooth Boolean Operations

```glsl
// Smooth union (blended edges)
float sdfSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

// Smooth subtraction
float sdfSmoothSubtract(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return mix(d1, -d2, h) + k * h * (1.0 - h);
}

// Smooth intersection
float sdfSmoothIntersect(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) + k * h * (1.0 - h);
}
```

## SDF Modifications

```glsl
float ring(float d, float thickness) { return abs(d) - thickness; }
float roundSDF(float d, float r) { return d - r; }
```


### glsl shapes sdf circles rectangles polar distance fields

# Shapes in GLSL

Drawing shapes using Signed Distance Fields (SDF) and distance calculations.

## Distance Fields Concept

SDF returns distance from any point to shape edge:
- **Negative**: Inside shape
- **Zero**: On edge
- **Positive**: Outside shape

## Circle

```glsl
// Basic circle
float circle(vec2 st, vec2 center, float radius) {
    float d = distance(st, center);
    return 1.0 - step(radius, d);
}

// Smooth edge circle
float circleSDF(vec2 st, vec2 center, float radius) {
    return length(st - center) - radius;
}

// Usage
float d = circleSDF(st, vec2(0.5), 0.3);
vec3 color = vec3(1.0 - smoothstep(0.0, 0.01, d));
```

## Rectangle

```glsl
// Basic rectangle
float rect(vec2 st, vec2 pos, vec2 size) {
    vec2 bl = step(pos, st);
    vec2 tr = step(1.0 - pos - size, 1.0 - st);
    return bl.x * bl.y * tr.x * tr.y;
}

// Rectangle SDF
float rectSDF(vec2 st, vec2 center, vec2 size) {
    vec2 d = abs(st - center) - size * 0.5;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Rounded rectangle SDF
float roundedRectSDF(vec2 st, vec2 center, vec2 size, float radius) {
    vec2 d = abs(st - center) - size * 0.5 + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
```

## Line

```glsl
// Line segment SDF
float lineSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

// Draw line with thickness
float line(vec2 st, vec2 a, vec2 b, float thickness) {
    float d = lineSDF(st, a, b);
    return 1.0 - smoothstep(0.0, thickness, d);
}
```

## Shape Outlines

```glsl
// Outline only
float outline(float d, float thickness) {
    return 1.0 - smoothstep(0.0, thickness, abs(d));
}

// Fill with outline
vec3 fillWithOutline(float d, vec3 fill, vec3 stroke, float thick) {
    float fillMask = 1.0 - smoothstep(0.0, 0.01, d);
    float edge = 1.0 - smoothstep(0.0, thick, abs(d));
    return mix(fill * fillMask, stroke, edge * (1.0 - fillMask));
}
```

## 2D Transformations

```glsl
// Rotate point around center
vec2 rotate(vec2 st, vec2 center, float angle) {
    st -= center;
    float c = cos(angle);
    float s = sin(angle);
    st = mat2(c, -s, s, c) * st;
    return st + center;
}

// Scale from center
vec2 scale(vec2 st, vec2 center, vec2 s) {
    return (st - center) / s + center;
}
```

See also: `glsl-shapes-polygon-star-polar-sdf-combinations.md`


### glsl shaping functions step smoothstep curves interpolation

# Shaping Functions

Control value interpolation for smooth transitions and effects.

## Core Functions

### step(edge, x)
Hard threshold - returns 0.0 if x < edge, else 1.0.

```glsl
float y = step(0.5, st.x);  // Black left, white right
```

### smoothstep(edge0, edge1, x)
Smooth Hermite interpolation between edges.

```glsl
float y = smoothstep(0.2, 0.8, st.x);  // Gradual transition
```

Internally: `t = clamp((x-edge0)/(edge1-edge0), 0.0, 1.0); return t*t*(3.0-2.0*t);`

### mix(a, b, t)
Linear interpolation: `a*(1-t) + b*t`

```glsl
vec3 color = mix(colorA, colorB, st.x);  // Gradient
```

## Power Functions

```glsl
float y = pow(st.x, 5.0);     // Exponential curve
float y = sqrt(st.x);         // Square root
float y = exp(st.x);          // Natural exponential
float y = log(st.x);          // Natural logarithm
```

Exponent controls curve shape:
- `pow(x, n)` where n > 1: Slow start, fast end
- `pow(x, n)` where n < 1: Fast start, slow end

## Trigonometric Functions

```glsl
float y = sin(st.x * PI);           // Wave (0 to 1 to 0)
float y = cos(st.x * TWO_PI);       // Full cycle
float y = sin(st.x * 10.0 + u_time); // Animated wave
```

Normalize sin/cos from [-1,1] to [0,1]:
```glsl
float y = sin(x) * 0.5 + 0.5;
```

## Fractional & Modulo

```glsl
float y = fract(st.x * 5.0);  // Sawtooth wave (0 to 1 repeating)
float y = mod(st.x, 0.2);     // Modulo, repeats every 0.2
float y = floor(st.x * 5.0);  // Integer part (0,1,2,3,4...)
float y = ceil(st.x * 5.0);   // Round up
```

## Absolute & Sign

```glsl
float y = abs(st.x - 0.5);    // V-shape centered at 0.5
float y = sign(st.x - 0.5);   // -1.0, 0.0, or 1.0
```

## Clamping

```glsl
float y = clamp(x, 0.0, 1.0);         // Constrain range
float y = min(a, b);                   // Smaller value
float y = max(a, b);                   // Larger value
```

## Custom Shaping Curves

### Polynomial smoothstep (quintic)
```glsl
float smootherStep(float x) {
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}
```

### Exponential impulse
```glsl
float impulse(float k, float x) {
    float h = k * x;
    return h * exp(1.0 - h);
}
```

### Parabola
```glsl
float parabola(float x, float k) {
    return pow(4.0 * x * (1.0 - x), k);
}
```

### Cubic pulse
```glsl
float cubicPulse(float c, float w, float x) {
    x = abs(x - c);
    if (x > w) return 0.0;
    x /= w;
    return 1.0 - x * x * (3.0 - 2.0 * x);
}
```

## Combining Functions

Create band with two smoothsteps:
```glsl
float y = smoothstep(0.2, 0.4, st.x) - smoothstep(0.6, 0.8, st.x);
```

Smooth edges on shapes:
```glsl
float edge = 0.01;
float circle = smoothstep(radius + edge, radius - edge, dist);
```

## Animation Patterns

```glsl
// Oscillate 0-1
float t = sin(u_time) * 0.5 + 0.5;

// Sawtooth
float t = fract(u_time);

// Triangle wave
float t = abs(fract(u_time) * 2.0 - 1.0);

// Ping-pong
float t = abs(mod(u_time, 2.0) - 1.0);
```


