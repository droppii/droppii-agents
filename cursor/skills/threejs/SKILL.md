---
name: ck:threejs
description: "Build 3D web apps with Three.js (WebGL/WebGPU). 556 searchable examples, 60 API classes, 20 use cases. Actions: create 3D scene, load model, add animation, implement physics, build VR/XR. Topics: GLTF loader, PBR materials, particle effects, shadows, post-processing, compute shaders, TSL. Integrations: WebGPU, physics engines, spatial audio."
license: MIT
version: 3.0.0
argument-hint: "[3D scene or feature]"
---

# Three.js Development

Build high-performance 3D web applications using Three.js. Contains 556 searchable examples across 13 categories, 60 API classes, and 20 use-case templates.

## When to Use

- Building 3D scenes, games, or visualizations
- Loading 3D models (GLTF, FBX, OBJ)
- Implementing animations, physics, or VR/XR
- Creating particle effects or custom shaders
- Optimizing rendering performance

## Search Examples & API

Use the search CLI to find relevant examples and API references:

```bash
python3 .claude/skills/threejs/scripts/search.py "<query>" [--domain <domain>] [-n <max_results>]
```

### Search Domains

| Domain | Use For | Example Query |
|--------|---------|---------------|
| `examples` | Find code examples | `"particle effects gpu"` |
| `api` | Class/method reference | `"PerspectiveCamera"` |
| `use-cases` | Project recommendations | `"product configurator"` |
| `categories` | Browse categories | `"webgpu"` |

### Quick Examples

```bash
# Find particle/compute examples
python3 .claude/skills/threejs/scripts/search.py "particle compute webgpu"

# Search API for camera classes
python3 .claude/skills/threejs/scripts/search.py "camera" --domain api

# Get examples for a use case
python3 .claude/skills/threejs/scripts/search.py "product configurator" --use-case

# Filter by category
python3 .claude/skills/threejs/scripts/search.py --category webgpu -n 10

# Filter by complexity
python3 .claude/skills/threejs/scripts/search.py --complexity high -n 5
```

## Example Categories

| Category | Count | Description |
|----------|-------|-------------|
| `webgl` | 216 | Standard WebGL rendering |
| `webgpu (wip)` | 190 | Modern WebGPU + compute shaders |
| `webgl / advanced` | 48 | Low-level GPU, custom shaders |
| `webgl / postprocessing` | 27 | Bloom, SSAO, SSR, DOF |
| `webxr` | 26 | VR/AR experiences |
| `physics` | 13 | Physics simulation |

## Common Use Cases

| Use Case | Recommended | Complexity |
|----------|-------------|------------|
| Product Configurator | GLTF, PBR, EnvMaps | Medium |
| Game Development | Animation, Physics, Controls | High |
| Data Visualization | BufferGeometry, Points | Medium |
| 360 Panorama | Equirectangular, WebXR | Low |
| Architectural Viz | GLTF, HDR, CSM Shadows | High |

## Quick Start

```javascript
// 1. Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 2. Lighting
scene.add(new THREE.AmbientLight(0x404040));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// 3. Load GLTF Model
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
loader.load('model.glb', (gltf) => scene.add(gltf.scene));

// 4. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

## Progressive Reference Files

### Level 1: Fundamentals
- `references/00-fundamentals.md` - Core concepts, scene graph
- `references/01-getting-started.md` - Setup, basic rendering

### Level 2: Common Tasks
- `references/02-loaders.md` - GLTF, FBX, OBJ loaders
- `references/03-textures.md` - Texture types, mapping
- `references/04-cameras.md` - Camera types, controls
- `references/05-lights.md` - Light types, shadows
- `references/06-animations.md` - AnimationMixer, clips
- `references/11-materials.md` - PBR, standard materials
- `references/18-geometry.md` - BufferGeometry, primitives

### Level 3: Interactive
- `references/08-interaction.md` - Raycasting, picking
- `references/09-postprocessing.md` - Bloom, SSAO, SSR
- `references/10-controls.md` - OrbitControls, etc.

### Level 4: Advanced
- `references/12-performance.md` - Instancing, LOD, batching
- `references/13-node-materials.md` - TSL shader graphs
- `references/17-shader.md` - Custom GLSL shaders

### Level 5: Specialized
- `references/14-physics-vr.md` - Physics, WebXR
- `references/16-webgpu.md` - WebGPU, compute shaders

## External Resources

- Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Editor: https://threejs.org/editor/
- Discord: https://discord.gg/56GBJwAnUS


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### 00 fundamentals

# Three.js Fundamentals

## Overview

Three.js scene setup, cameras, renderer, Object3D hierarchy, coordinate systems. Use when setting up 3D scenes, creating cameras, configuring renderers, managing object hierarchies, or working with transforms.

## Quick Start

```javascript
import * as THREE from "three";

// Create scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Add a mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add light
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## Core Classes

### Scene

Container for all 3D objects, lights, and cameras.

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Solid color
scene.background = texture; // Skybox texture
scene.background = cubeTexture; // Cubemap
scene.environment = envMap; // Environment map for PBR
scene.fog = new THREE.Fog(0xffffff, 1, 100); // Linear fog
scene.fog = new THREE.FogExp2(0xffffff, 0.02); // Exponential fog
```

### Cameras

**PerspectiveCamera** - Most common, simulates human eye.

```javascript
// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
  75, // Field of view (degrees)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000, // Far clipping plane
);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix(); // Call after changing fov, aspect, near, far
```

**OrthographicCamera** - No perspective distortion, good for 2D/isometric.

```javascript
// OrthographicCamera(left, right, top, bottom, near, far)
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  1000,
);
```

**ArrayCamera** - Multiple viewports with sub-cameras.

```javascript
const cameras = [];
for (let i = 0; i < 4; i++) {
  const subcamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  subcamera.viewport = new THREE.Vector4(
    Math.floor(i % 2) * 0.5,
    Math.floor(i / 2) * 0.5,
    0.5,
    0.5,
  );
  cameras.push(subcamera);
}
const arrayCamera = new THREE.ArrayCamera(cameras);
```

**CubeCamera** - Renders environment maps for reflections.

```javascript
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
scene.add(cubeCamera);

// Use for reflections
material.envMap = cubeRenderTarget.texture;

// Update each frame (expensive!)
cubeCamera.position.copy(reflectiveMesh.position);
cubeCamera.update(renderer, scene);
```

### WebGLRenderer

```javascript
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"), // Optional existing canvas
  antialias: true, // Smooth edges
  alpha: true, // Transparent background
  powerPreference: "high-performance", // GPU hint
  preserveDrawingBuffer: true, // For screenshots
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Color space (Three.js r152+)
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Clear color
renderer.setClearColor(0x000000, 1);

// Render
renderer.render(scene, camera);
```

### Object3D

Base class for all 3D objects. Mesh, Group, Light, Camera all extend Object3D.

```javascript
const obj = new THREE.Object3D();

// Transform
obj.position.set(x, y, z);
obj.rotation.set(x, y, z); // Euler angles (radians)
obj.quaternion.set(x, y, z, w); // Quaternion rotation
obj.scale.set(x, y, z);

// Local vs World transforms
obj.getWorldPosition(targetVector);
obj.getWorldQuaternion(targetQuaternion);
obj.getWorldDirection(targetVector);

// Hierarchy
obj.add(child);
obj.remove(child);
obj.parent;
obj.children;

// Visibility
obj.visible = false;

// Layers (for selective rendering/raycasting)
obj.layers.set(1);
obj.layers.enable(2);
obj.layers.disable(0);

// Traverse hierarchy
obj.traverse((child) => {
  if (child.isMesh) child.material.color.set(0xff0000);
});

// Matrix updates
obj.matrixAutoUpdate = true; // Default: auto-update matrices
obj.updateMatrix(); // Manual matrix update
obj.updateMatrixWorld(true); // Update world matrix recursively
```

### Group

Empty container for organizing objects.

```javascript
const group = new THREE.Group();
group.add(mesh1);
group.add(mesh2);
scene.add(group);

// Transform entire group
group.position.x = 5;
group.rotation.y = Math.PI / 4;
```

### Mesh

Combines geometry and material.

```javascript
const mesh = new THREE.Mesh(geometry, material);

// Multiple materials (one per geometry group)
const mesh = new THREE.Mesh(geometry, [material1, material2]);

// Useful properties
mesh.geometry;
mesh.material;
mesh.castShadow = true;
mesh.receiveShadow = true;

// Frustum culling
mesh.frustumCulled = true; // Default: skip if outside camera view

// Render order
mesh.renderOrder = 10; // Higher = rendered later
```

## Coordinate System

Three.js uses a **right-handed coordinate system**:

- **+X** points right
- **+Y** points up
- **+Z** points toward viewer (out of screen)

```javascript
// Axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); // Red=X, Green=Y, Blue=Z
```

## Math Utilities

### Vector3

```javascript
const v = new THREE.Vector3(x, y, z);
v.set(x, y, z);
v.copy(otherVector);
v.clone();

// Operations (modify in place)
v.add(v2);
v.sub(v2);
v.multiply(v2);
v.multiplyScalar(2);
v.divideScalar(2);
v.normalize();
v.negate();
v.clamp(min, max);
v.lerp(target, alpha);

// Calculations (return new value)
v.length();
v.lengthSq(); // Faster than length()
v.distanceTo(v2);
v.dot(v2);
v.cross(v2); // Modifies v
v.angleTo(v2);

// Transform
v.applyMatrix4(matrix);
v.applyQuaternion(q);
v.project(camera); // World to NDC
v.unproject(camera); // NDC to world
```

### Matrix4

```javascript
const m = new THREE.Matrix4();
m.identity();
m.copy(other);
m.clone();

// Build transforms
m.makeTranslation(x, y, z);
m.makeRotationX(theta);
m.makeRotationY(theta);
m.makeRotationZ(theta);
m.makeRotationFromQuaternion(q);
m.makeScale(x, y, z);

// Compose/decompose
m.compose(position, quaternion, scale);
m.decompose(position, quaternion, scale);

// Operations
m.multiply(m2); // m = m * m2
m.premultiply(m2); // m = m2 * m
m.invert();
m.transpose();

// Camera matrices
m.makePerspective(left, right, top, bottom, near, far);
m.makeOrthographic(left, right, top, bottom, near, far);
m.lookAt(eye, target, up);
```

### Quaternion

```javascript
const q = new THREE.Quaternion();
q.setFromEuler(euler);
q.setFromAxisAngle(axis, angle);
q.setFromRotationMatrix(matrix);

q.multiply(q2);
q.slerp(target, t); // Spherical interpolation
q.normalize();
q.invert();
```

### Euler

```javascript
const euler = new THREE.Euler(x, y, z, "XYZ"); // Order matters!
euler.setFromQuaternion(q);
euler.setFromRotationMatrix(m);

// Rotation orders: 'XYZ', 'YXZ', 'ZXY', 'XZY', 'YZX', 'ZYX'
```

### Color

```javascript
const color = new THREE.Color(0xff0000);
const color = new THREE.Color("red");
const color = new THREE.Color("rgb(255, 0, 0)");
const color = new THREE.Color("#ff0000");

color.setHex(0x00ff00);
color.setRGB(r, g, b); // 0-1 range
color.setHSL(h, s, l); // 0-1 range

color.lerp(otherColor, alpha);
color.multiply(otherColor);
color.multiplyScalar(2);
```

### MathUtils

```javascript
THREE.MathUtils.clamp(value, min, max);
THREE.MathUtils.lerp(start, end, alpha);
THREE.MathUtils.mapLinear(value, inMin, inMax, outMin, outMax);
THREE.MathUtils.degToRad(degrees);
THREE.MathUtils.radToDeg(radians);
THREE.MathUtils.randFloat(min, max);
THREE.MathUtils.randInt(min, max);
THREE.MathUtils.smoothstep(x, min, max);
THREE.MathUtils.smootherstep(x, min, max);
```

## Common Patterns

### Proper Cleanup

```javascript
function dispose() {
  // Dispose geometries
  mesh.geometry.dispose();

  // Dispose materials
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((m) => m.dispose());
  } else {
    mesh.material.dispose();
  }

  // Dispose textures
  texture.dispose();

  // Remove from scene
  scene.remove(mesh);

  // Dispose renderer
  renderer.dispose();
}
```

### Clock for Animation

```javascript
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta(); // Time since last frame (seconds)
  const elapsed = clock.getElapsedTime(); // Total time (seconds)

  mesh.rotation.y += delta * 0.5; // Consistent speed regardless of framerate

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

### Responsive Canvas

```javascript
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener("resize", onWindowResize);
```

### Loading Manager

```javascript
const manager = new THREE.LoadingManager();

manager.onStart = (url, loaded, total) => console.log("Started loading");
manager.onLoad = () => console.log("All loaded");
manager.onProgress = (url, loaded, total) => console.log(`${loaded}/${total}`);
manager.onError = (url) => console.error(`Error loading ${url}`);

const textureLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);
```

## Performance Tips

1. **Limit draw calls**: Merge geometries, use instancing, atlas textures
2. **Frustum culling**: Enabled by default, ensure bounding boxes are correct
3. **LOD (Level of Detail)**: Use `THREE.LOD` for distance-based mesh switching
4. **Object pooling**: Reuse objects instead of creating/destroying
5. **Avoid `getWorldPosition` in loops**: Cache results

```javascript
// Merge static geometries
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
const merged = mergeGeometries([geo1, geo2, geo3]);

// LOD
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(medDetailMesh, 50);
lod.addLevel(lowDetailMesh, 100);
scene.add(lod);
```

## See Also

- `threejs-geometry` - Geometry creation and manipulation
- `threejs-materials` - Material types and properties
- `threejs-lighting` - Light types and shadows

### 01 getting started

# Getting Started with Three.js

Core concepts for building your first 3D scene.

## Essential Components

Every Three.js app needs 3 core elements:

### 1. Scene
Container for all 3D objects, lights, cameras.

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // black background
scene.fog = new THREE.Fog(0xffffff, 1, 5000); // distance fog
```

### 2. Camera
Viewpoint into the 3D scene.

**PerspectiveCamera** (realistic, most common):
```javascript
const camera = new THREE.PerspectiveCamera(
  75,  // fov - field of view in degrees
  window.innerWidth / window.innerHeight,  // aspect ratio
  0.1,  // near clipping plane
  1000  // far clipping plane
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);
```

**OrthographicCamera** (no perspective distortion):
```javascript
const camera = new THREE.OrthographicCamera(
  left, right, top, bottom, near, far
);
```

### 3. Renderer
Renders scene using camera perspective.

```javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
```

## Basic Geometries

Primitive shapes ready to use:

```javascript
// Box
new THREE.BoxGeometry(width, height, depth);

// Sphere
new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// Plane
new THREE.PlaneGeometry(width, height);

// Cylinder
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);

// Cone
new THREE.ConeGeometry(radius, height, radialSegments);

// Torus
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
```

## Basic Materials

Materials define surface appearance:

**MeshBasicMaterial** - unlit, flat color:
```javascript
new THREE.MeshBasicMaterial({ color: 0xff0000 });
```

**MeshStandardMaterial** - PBR, responds to lights:
```javascript
new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.5
});
```

**MeshPhongMaterial** - specular highlights:
```javascript
new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  shininess: 100
});
```

## Creating Mesh

Combine geometry + material:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

## Basic Lights

Materials (except Basic) need lights to be visible:

```javascript
// Ambient - global illumination
const ambient = new THREE.AmbientLight(0x404040); // soft white
scene.add(ambient);

// Directional - sun-like, infinite distance
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 5, 5);
scene.add(directional);

// Point - lightbulb, radiates in all directions
const point = new THREE.PointLight(0xff0000, 1, 100);
point.position.set(0, 10, 0);
scene.add(point);
```

## Animation Loop

Continuously render and update scene:

```javascript
function animate() {
  requestAnimationFrame(animate);

  // Update objects
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render
  renderer.render(scene, camera);
}
animate();
```

## Handle Window Resize

Keep aspect ratio correct:

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## Object3D Hierarchy

Transform and group objects:

```javascript
const group = new THREE.Group();
group.add(cube1);
group.add(cube2);
scene.add(group);

// Transform
object.position.set(x, y, z);
object.rotation.set(x, y, z); // Euler angles
object.scale.set(x, y, z);

// Hierarchy transforms are relative to parent
```


### 02 loaders

# Asset Loading

Load 3D models, textures, and other assets.

## Loading Manager

Coordinate multiple loads, track progress:

```javascript
const manager = new THREE.LoadingManager();
manager.onStart = (url, loaded, total) => console.log('Loading:', url);
manager.onProgress = (url, loaded, total) => console.log(`${loaded}/${total}`);
manager.onLoad = () => console.log('Complete');
manager.onError = (url) => console.error('Error:', url);

const loader = new THREE.TextureLoader(manager);
```

## GLTF Loader (Recommended Format)

Industry standard, supports PBR materials, animations, bones:

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load(
  'model.gltf',
  (gltf) => {
    scene.add(gltf.scene);

    // Access animations
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error(error)
);
```

## FBX Loader

Autodesk format, common in game dev:

```javascript
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const loader = new FBXLoader();
loader.load('model.fbx', (object) => {
  scene.add(object);
});
```

## OBJ Loader

Simple geometry format:

```javascript
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new OBJLoader();
loader.load('model.obj', (object) => {
  scene.add(object);
});

// With MTL (material library)
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const mtlLoader = new MTLLoader();
mtlLoader.load('model.mtl', (materials) => {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('model.obj', (object) => scene.add(object));
});
```

## Texture Loader

Load images as textures:

```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('texture.jpg');

// Use in material
const material = new THREE.MeshStandardMaterial({ map: texture });

// Load with callback
textureLoader.load(
  'texture.jpg',
  (texture) => {
    material.map = texture;
    material.needsUpdate = true;
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error(error)
);
```

## Cube Texture Loader

Load environment maps (skybox):

```javascript
const cubeLoader = new THREE.CubeTextureLoader();
const envMap = cubeLoader.load([
  'px.jpg', 'nx.jpg',  // positive x, negative x
  'py.jpg', 'ny.jpg',  // positive y, negative y
  'pz.jpg', 'nz.jpg'   // positive z, negative z
]);

scene.background = envMap;
material.envMap = envMap;
```

## DRACO Compressed Models

Smaller file sizes for GLTF:

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('path/to/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load('compressed.gltf', (gltf) => scene.add(gltf.scene));
```

## KTX2 Compressed Textures

GPU-optimized texture compression:

```javascript
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('path/to/basis/');
ktx2Loader.detectSupport(renderer);
ktx2Loader.load('texture.ktx2', (texture) => {
  material.map = texture;
  material.needsUpdate = true;
});
```

## Common Other Loaders

```javascript
// STL (3D printing)
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// Collada (.dae)
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';

// 3DS Max
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js';
```

## Best Practices

- Use GLTF/GLB for web (best compression, features)
- Compress with DRACO for large models
- Use KTX2 for textures (GPU-friendly)
- Enable caching: `THREE.Cache.enabled = true;`
- Show loading progress to users
- Handle errors gracefully


### 03 textures

# Textures

Map images and data onto 3D surfaces.

## Texture Types

### Standard 2D Texture
```javascript
const texture = new THREE.Texture(image);
texture.needsUpdate = true; // required after manual creation

// Or use loader (auto-updates)
const texture = new THREE.TextureLoader().load('image.jpg');
```

### Canvas Texture
```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// Draw on canvas...
const texture = new THREE.CanvasTexture(canvas);
```

### Video Texture
```javascript
const video = document.createElement('video');
video.src = 'video.mp4';
video.play();
const texture = new THREE.VideoTexture(video);
```

### Data Texture
```javascript
const size = 512;
const data = new Uint8Array(size * size * 4);
// Fill data with RGBA values...
const texture = new THREE.DataTexture(data, size, size);
texture.needsUpdate = true;
```

### Cube Texture (Environment/Skybox)
```javascript
const loader = new THREE.CubeTextureLoader();
const texture = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
```

## Material Maps

Multiple texture types for different effects:

```javascript
const material = new THREE.MeshStandardMaterial({
  map: diffuseTexture,           // base color
  normalMap: normalTexture,       // surface detail
  roughnessMap: roughnessTexture, // surface roughness variation
  metalnessMap: metalnessTexture, // metallic areas
  aoMap: aoTexture,               // ambient occlusion
  emissiveMap: emissiveTexture,   // glow areas
  alphaMap: alphaTexture,         // transparency
  bumpMap: bumpTexture,           // height variation
  displacementMap: dispTexture    // vertex displacement
});

// AO map requires second UV set
geometry.setAttribute('uv2', geometry.attributes.uv);
```

## Wrapping Modes

Control texture repeat behavior:

```javascript
texture.wrapS = THREE.RepeatWrapping;      // horizontal
texture.wrapT = THREE.RepeatWrapping;      // vertical

// Options:
// THREE.RepeatWrapping - tile infinitely
// THREE.ClampToEdgeWrapping - stretch edge pixels
// THREE.MirroredRepeatWrapping - mirror on each repeat

// Set repeat count
texture.repeat.set(4, 4);

// Offset texture
texture.offset.set(0.5, 0.5);
```

## Filtering

Control texture sampling quality:

```javascript
// Magnification (when texel < pixel)
texture.magFilter = THREE.LinearFilter; // smooth
// or THREE.NearestFilter // pixelated

// Minification (when texel > pixel)
texture.minFilter = THREE.LinearMipmapLinearFilter; // best quality
// Options:
// THREE.NearestFilter
// THREE.LinearFilter
// THREE.NearestMipmapNearestFilter
// THREE.NearestMipmapLinearFilter
// THREE.LinearMipmapNearestFilter
// THREE.LinearMipmapLinearFilter

// Anisotropic filtering (better at angles)
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
```

## UV Mapping

Control how texture is mapped to geometry:

```javascript
// Flip texture vertically
texture.flipY = false;

// Rotate texture
texture.rotation = Math.PI / 4; // 45 degrees
texture.center.set(0.5, 0.5); // rotation center

// Transform UV coordinates
const uvAttribute = geometry.attributes.uv;
for (let i = 0; i < uvAttribute.count; i++) {
  let u = uvAttribute.getX(i);
  let v = uvAttribute.getY(i);
  uvAttribute.setXY(i, u * 2, v * 2); // scale UVs
}
uvAttribute.needsUpdate = true;
```

## Color Space

Handle color space correctly:

```javascript
// For color data (diffuse, emissive)
texture.colorSpace = THREE.SRGBColorSpace;

// For non-color data (normal, roughness, etc.)
texture.colorSpace = THREE.NoColorSpace; // or LinearSRGBColorSpace
```

## Performance Optimization

```javascript
// Use mipmaps (auto-generated by default)
texture.generateMipmaps = true;

// Dispose when done
texture.dispose();

// Compress textures (use KTX2Loader for .ktx2 files)
// Reduce resolution for distant objects
// Use texture atlases to reduce draw calls
```

## Advanced Textures

```javascript
// 3D Texture (volumetric)
const texture3d = new THREE.Data3DTexture(data, width, height, depth);

// Depth Texture (for advanced effects)
const depthTexture = new THREE.DepthTexture(width, height);

// Compressed Texture
const compressedTexture = new THREE.CompressedTexture(...);
```


### 04 cameras

# Cameras

Define viewpoint and projection for rendering.

## Perspective Camera

Realistic camera with field of view (most common):

```javascript
const camera = new THREE.PerspectiveCamera(
  fov,    // field of view in degrees (typically 45-75)
  aspect, // width / height
  near,   // near clipping plane (typically 0.1)
  far     // far clipping plane (typically 1000)
);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Update after changing parameters
camera.fov = 60;
camera.updateProjectionMatrix();
```

## Orthographic Camera

No perspective distortion (parallel projection):

```javascript
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2, // left
  frustumSize * aspect / 2,  // right
  frustumSize / 2,           // top
  frustumSize / -2,          // bottom
  0.1,                       // near
  1000                       // far
);

// Useful for: 2D games, CAD, isometric views
```

## Camera Controls (Addons)

### OrbitControls (Most Common)
```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;   // smooth motion
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2; // prevent going below ground

// In animation loop
function animate() {
  controls.update(); // required if enableDamping = true
  renderer.render(scene, camera);
}
```

### FirstPersonControls
```javascript
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.lookSpeed = 0.1;

const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}
```

### FlyControls
```javascript
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 24;
controls.dragToLook = true;
```

### TransformControls
```javascript
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const controls = new TransformControls(camera, renderer.domElement);
controls.attach(mesh);
scene.add(controls);

// Switch modes
controls.setMode('translate'); // or 'rotate', 'scale'

// Events
controls.addEventListener('change', () => renderer.render(scene, camera));
controls.addEventListener('dragging-changed', (event) => {
  orbitControls.enabled = !event.value;
});
```

## Camera Methods

```javascript
// Position and orientation
camera.position.set(x, y, z);
camera.lookAt(x, y, z); // or lookAt(vector3) or lookAt(object.position)
camera.up.set(0, 1, 0); // define "up" direction

// Get world direction
const direction = new THREE.Vector3();
camera.getWorldDirection(direction);

// Screen to world conversion
const mouse = new THREE.Vector2(x, y); // normalized device coords (-1 to 1)
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);

// World to screen
const vector = new THREE.Vector3(x, y, z);
vector.project(camera); // now in normalized device coords
```

## Layers

Selective rendering with layers:

```javascript
// Set object layers
mesh.layers.set(1);

// Set camera layers
camera.layers.enable(0); // render layer 0
camera.layers.enable(1); // render layer 1
camera.layers.disable(2); // don't render layer 2

// Objects on disabled layers won't be rendered
```

## Frustum Culling

Automatic optimization (objects outside view are not rendered):

```javascript
// Manually check if object is in view
const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4().multiplyMatrices(
  camera.projectionMatrix,
  camera.matrixWorldInverse
);
frustum.setFromProjectionMatrix(matrix);

if (frustum.containsPoint(object.position)) {
  // Object is visible
}
```

## Multiple Cameras

```javascript
const mainCamera = new THREE.PerspectiveCamera(...);
const minimapCamera = new THREE.OrthographicCamera(...);

// Render with different viewports
renderer.setViewport(0, 0, width, height);
renderer.render(scene, mainCamera);

renderer.setViewport(width - 200, height - 200, 200, 200);
renderer.render(scene, minimapCamera);
```

## Resize Handling

```javascript
window.addEventListener('resize', () => {
  // Perspective camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Orthographic camera
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
```


### 05 lights

# Lights

Illuminate 3D scenes with various light types.

## Ambient Light

Global illumination affecting all objects equally:

```javascript
const light = new THREE.AmbientLight(0x404040); // soft white
scene.add(light);

// Often used as base illumination with other lights
```

## Directional Light

Infinite distance light with parallel rays (sun-like):

```javascript
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 5);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target); // target must be in scene

// With shadows
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;

// Visualize shadow camera
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);
```

## Point Light

Omnidirectional light from a point (lightbulb-like):

```javascript
const light = new THREE.PointLight(0xff0000, 1, 100, 2);
// params: color, intensity, distance (0 = infinite), decay

light.position.set(0, 10, 0);
scene.add(light);

// With shadows
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
```

## Spot Light

Cone-shaped light (spotlight-like):

```javascript
const light = new THREE.SpotLight(0xffffff, 1);
light.position.set(0, 10, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);

// Cone parameters
light.angle = Math.PI / 6; // cone angle
light.penumbra = 0.1;      // edge softness (0-1)
light.decay = 2;           // light falloff
light.distance = 100;      // max range (0 = infinite)

// With shadows
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
```

## Hemisphere Light

Sky/ground two-color lighting:

```javascript
const light = new THREE.HemisphereLight(
  0x0000ff, // sky color (blue)
  0x00ff00, // ground color (green)
  0.6       // intensity
);
scene.add(light);

// Good for outdoor scenes
```

## RectArea Light (Addon)

Rectangular area light (realistic surface illumination):

```javascript
import { RectAreaLight } from 'three/addons/lights/RectAreaLight.js';

const light = new RectAreaLight(0xffffff, 5, 10, 10);
// params: color, intensity, width, height

light.position.set(0, 5, 0);
light.lookAt(0, 0, 0);
scene.add(light);

// Requires WebGL 2.0
```

## Shadow Configuration

Global renderer settings:

```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft shadows

// Shadow types:
// THREE.BasicShadowMap - fast, aliased
// THREE.PCFShadowMap - smoother
// THREE.PCFSoftShadowMap - softer (default)
// THREE.VSMShadowMap - variance shadow maps

// Objects must opt-in to shadows
mesh.castShadow = true;    // object casts shadows
mesh.receiveShadow = true; // object receives shadows
```

## Light Helpers

Visualize light positions and directions:

```javascript
// Directional light
const helper = new THREE.DirectionalLightHelper(light, 5);
scene.add(helper);

// Point light
const helper = new THREE.PointLightHelper(light, 1);
scene.add(helper);

// Spot light
const helper = new THREE.SpotLightHelper(light);
scene.add(helper);

// Hemisphere light
const helper = new THREE.HemisphereLightHelper(light, 5);
scene.add(helper);

// RectArea light
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
const helper = new RectAreaLightHelper(light);
light.add(helper);
```

## Light Intensity & Units

```javascript
// Intensity values depend on physically-based rendering:
// - Lower values (0.1-1) for ambient/hemisphere
// - Higher values (1-10) for directional/point/spot
// - Very high (10-100+) for small area lights

// Physical light units (optional)
renderer.physicallyCorrectLights = true; // deprecated in newer versions
// Use intensity in candelas (cd) for point/spot lights
```

## Performance Tips

- Limit number of lights (3-5 for good performance)
- Use ambient + 1-2 directional lights for outdoor scenes
- Bake lighting into textures for static scenes
- Use lightmaps for complex static lighting
- Shadows are expensive - use selectively
- Lower shadow map resolution for better performance


### 06 animations

# Animations

Animate objects, cameras, and imported models.

## Animation System

Three.js uses AnimationMixer for playback:

```javascript
// Create mixer for object
const mixer = new THREE.AnimationMixer(object);

// Play animation clip
const action = mixer.clipAction(animationClip);
action.play();

// Update in render loop
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## Loading Animations

From GLTF/FBX files:

```javascript
const loader = new GLTFLoader();
loader.load('model.gltf', (gltf) => {
  scene.add(gltf.scene);

  const mixer = new THREE.AnimationMixer(gltf.scene);

  // Play all animations
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  // Or play specific animation
  const clip = THREE.AnimationClip.findByName(gltf.animations, 'Walk');
  const action = mixer.clipAction(clip);
  action.play();
});
```

## Animation Actions

Control playback:

```javascript
const action = mixer.clipAction(clip);

// Playback control
action.play();
action.stop();
action.pause();
action.reset();

// Loop modes
action.setLoop(THREE.LoopRepeat, Infinity);    // loop forever
action.setLoop(THREE.LoopOnce, 1);             // play once, stop at end
action.setLoop(THREE.LoopPingPong, Infinity);  // reverse on each loop

// Speed control
action.timeScale = 1.5; // 1.5x speed
action.timeScale = -1;  // reverse

// Weight (for blending)
action.setEffectiveWeight(0.5); // 50% influence

// Enable/disable
action.enabled = true;
```

## Animation Blending

Smooth transitions between animations:

```javascript
// Crossfade between two actions
currentAction.crossFadeTo(nextAction, 0.5, true); // 0.5 second transition

// Or manually control weights
currentAction.fadeOut(0.5);
nextAction.reset().fadeIn(0.5).play();
```

## Creating Custom Animations

Using KeyframeTracks:

```javascript
// Position animation
const times = [0, 1, 2]; // keyframe times in seconds
const values = [0, 0, 0,  10, 0, 0,  0, 0, 0]; // x,y,z for each time

const positionKF = new THREE.VectorKeyframeTrack(
  '.position', // property path
  times,
  values
);

// Rotation animation (quaternions)
const quaternion1 = new THREE.Quaternion();
const quaternion2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
const rotationKF = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  [0, 1],
  [
    quaternion1.x, quaternion1.y, quaternion1.z, quaternion1.w,
    quaternion2.x, quaternion2.y, quaternion2.z, quaternion2.w
  ]
);

// Create clip from tracks
const clip = new THREE.AnimationClip('custom', 2, [positionKF, rotationKF]);

const mixer = new THREE.AnimationMixer(object);
mixer.clipAction(clip).play();
```

## Keyframe Track Types

```javascript
// Different track types for different properties
new THREE.VectorKeyframeTrack('.position', times, values);
new THREE.VectorKeyframeTrack('.scale', times, values);
new THREE.QuaternionKeyframeTrack('.quaternion', times, values);
new THREE.ColorKeyframeTrack('.material.color', times, values);
new THREE.NumberKeyframeTrack('.material.opacity', times, values);
new THREE.BooleanKeyframeTrack('.visible', times, values);
```

## Skeletal Animation

For rigged characters:

```javascript
// Object must be SkinnedMesh with skeleton
const mesh = gltf.scene.children.find(child => child.isSkinnedMesh);

// Access bones
const skeleton = mesh.skeleton;
const bones = skeleton.bones;

// Manually control bones
bones[0].rotation.x = Math.PI / 4;

// Use SkeletonHelper to visualize
const helper = new THREE.SkeletonHelper(mesh);
scene.add(helper);
```

## Morph Target Animation

Blend shapes:

```javascript
// Morph targets are defined in geometry
const mesh = new THREE.Mesh(geometry, material);

// Animate morph influences
mesh.morphTargetInfluences[0] = 0.5; // 50% of first morph target

// Create animation clip for morphs
const track = new THREE.NumberKeyframeTrack(
  '.morphTargetInfluences[0]',
  [0, 1, 2],
  [0, 1, 0]
);
const clip = new THREE.AnimationClip('morph', 2, [track]);
```

## Manual Animation

Simple transform animations:

```javascript
const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  // Rotate
  object.rotation.y = elapsed;

  // Oscillate position
  object.position.y = Math.sin(elapsed * 2) * 5;

  // Pulse scale
  const scale = 1 + Math.sin(elapsed * 3) * 0.1;
  object.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## Tween Libraries

For complex easing (use with external lib like GSAP):

```javascript
// With GSAP
gsap.to(object.position, {
  duration: 1,
  x: 10,
  ease: "power2.inOut"
});
```


### 07 math

# Math Utilities

Essential mathematical objects for 3D programming.

## Vector3

3D position, direction, or scale:

```javascript
const v = new THREE.Vector3(x, y, z);

// Operations
v.add(otherVector);
v.sub(otherVector);
v.multiply(otherVector);
v.multiplyScalar(scalar);
v.divide(otherVector);
v.divideScalar(scalar);

// Analysis
v.length();           // magnitude
v.lengthSq();         // magnitude squared (faster)
v.normalize();        // make length = 1
v.dot(otherVector);   // dot product
v.cross(otherVector); // cross product
v.distanceTo(otherVector);
v.angleTo(otherVector);

// Interpolation
v.lerp(targetVector, alpha); // linear interpolation
v.lerpVectors(v1, v2, alpha);

// Clamping
v.clamp(minVector, maxVector);
v.clampLength(minLength, maxLength);
```

## Vector2 & Vector4

Similar to Vector3 but 2D and 4D:

```javascript
const v2 = new THREE.Vector2(x, y);
const v4 = new THREE.Vector4(x, y, z, w);
```

## Quaternion

Rotation representation (avoids gimbal lock):

```javascript
const q = new THREE.Quaternion(x, y, z, w);

// From Euler angles
q.setFromEuler(new THREE.Euler(x, y, z, 'XYZ'));

// From axis-angle
const axis = new THREE.Vector3(0, 1, 0);
q.setFromAxisAngle(axis, Math.PI / 2);

// From rotation matrix
q.setFromRotationMatrix(matrix);

// Interpolation
q.slerp(targetQuaternion, alpha); // spherical linear interpolation

// Apply to vector
const v = new THREE.Vector3(1, 0, 0);
v.applyQuaternion(q);
```

## Euler

Rotation as XYZ angles (degrees):

```javascript
const euler = new THREE.Euler(x, y, z, 'XYZ');
// Order: 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'

// From quaternion
euler.setFromQuaternion(q);

// From rotation matrix
euler.setFromRotationMatrix(matrix);

// Apply to object
object.rotation.copy(euler);
```

## Matrix4

4x4 transformation matrix:

```javascript
const m = new THREE.Matrix4();

// Compose transformation
m.compose(position, quaternion, scale);

// Decompose
const pos = new THREE.Vector3();
const quat = new THREE.Quaternion();
const scale = new THREE.Vector3();
m.decompose(pos, quat, scale);

// Transform operations
m.makeTranslation(x, y, z);
m.makeRotationX(theta);
m.makeRotationY(theta);
m.makeRotationZ(theta);
m.makeScale(x, y, z);

// Combine matrices
m.multiply(otherMatrix);
m.premultiply(otherMatrix);

// Invert
m.invert();

// Apply to vector
const v = new THREE.Vector3(1, 2, 3);
v.applyMatrix4(m);
```

## Color

Color manipulation:

```javascript
const color = new THREE.Color(0xff0000); // hex
const color = new THREE.Color('red');    // CSS
const color = new THREE.Color(1, 0, 0);  // RGB 0-1

// Conversions
color.getHex();      // 0xff0000
color.getHexString(); // "ff0000"
color.getStyle();    // "rgb(255,0,0)"

// Color spaces
color.setHSL(h, s, l); // hue, saturation, lightness
const hsl = {};
color.getHSL(hsl); // fills hsl object

// Operations
color.add(otherColor);
color.multiply(otherColor);
color.lerp(targetColor, alpha);
```

## Raycaster

Ray intersection testing:

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Convert mouse to normalized device coordinates
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// Set ray from camera
raycaster.setFromCamera(mouse, camera);

// Find intersections
const intersects = raycaster.intersectObjects(scene.children, true);
// recursive = true to check children

if (intersects.length > 0) {
  const hit = intersects[0];
  console.log(hit.object);   // intersected object
  console.log(hit.point);    // intersection point (Vector3)
  console.log(hit.distance); // distance from camera
  console.log(hit.face);     // intersected face
}
```

## Box3

Axis-aligned bounding box:

```javascript
const box = new THREE.Box3();

// From object
box.setFromObject(mesh);

// From points
box.setFromPoints(arrayOfVector3);

// Properties
box.min; // Vector3
box.max; // Vector3
box.getCenter(target); // fills target Vector3
box.getSize(target);   // fills target Vector3

// Tests
box.containsPoint(point);
box.intersectsBox(otherBox);
```

## Sphere

Bounding sphere:

```javascript
const sphere = new THREE.Sphere(center, radius);

// From box
sphere.setFromPoints(arrayOfVector3);

// From object
const box = new THREE.Box3().setFromObject(mesh);
box.getBoundingSphere(sphere);

// Tests
sphere.containsPoint(point);
sphere.intersectsSphere(otherSphere);
```

## Plane

Infinite plane:

```javascript
const plane = new THREE.Plane(normal, constant);
// normal: Vector3, constant: distance from origin

// From coplanar points
plane.setFromCoplanarPoints(p1, p2, p3);

// Distance to point
plane.distanceToPoint(point);

// Project point onto plane
const projected = new THREE.Vector3();
plane.projectPoint(point, projected);
```

## Curves

Parametric curves:

```javascript
// Bezier curve
const curve = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(-5, 15, 0),
  new THREE.Vector3(20, 15, 0),
  new THREE.Vector3(10, 0, 0)
);

// Sample points
const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);

// Get point at t (0-1)
const point = curve.getPoint(0.5);
```


### 08 interaction

# Interaction & Picking

Handle user input and object interaction.

## Mouse/Touch Raycasting

Detect which object user clicked:

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clickableObjects = []; // array of meshes

function onPointerMove(event) {
  // Normalize mouse coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster
  raycaster.setFromCamera(mouse, camera);

  // Find intersections
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    // Hover effect
    intersects[0].object.material.emissive.setHex(0xff0000);
  }
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    console.log('Clicked:', object.name);
    console.log('Point:', intersects[0].point);
  }
}

renderer.domElement.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('click', onClick);
```

## DragControls (Addon)

Drag objects with mouse:

```javascript
import { DragControls } from 'three/addons/controls/DragControls.js';

const controls = new DragControls(objectsArray, camera, renderer.domElement);

// Events
controls.addEventListener('dragstart', (event) => {
  orbitControls.enabled = false; // disable camera controls during drag
  event.object.material.emissive.set(0xaaaaaa);
});

controls.addEventListener('drag', (event) => {
  console.log(event.object.position);
});

controls.addEventListener('dragend', (event) => {
  orbitControls.enabled = true;
  event.object.material.emissive.set(0x000000);
});
```

## TransformControls (Addon)

Interactive 3D gizmo for translate/rotate/scale:

```javascript
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

// Attach to object
transformControls.attach(mesh);

// Switch modes
transformControls.setMode('translate'); // or 'rotate', 'scale'

// Switch space
transformControls.setSpace('world'); // or 'local'

// Events
transformControls.addEventListener('change', () => {
  renderer.render(scene, camera);
});

transformControls.addEventListener('dragging-changed', (event) => {
  orbitControls.enabled = !event.value; // disable orbit during transform
});

// Keyboard shortcuts
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'g': transformControls.setMode('translate'); break;
    case 'r': transformControls.setMode('rotate'); break;
    case 's': transformControls.setMode('scale'); break;
    case 'x': transformControls.showX = !transformControls.showX; break;
    case 'Escape': transformControls.detach(); break;
  }
});
```

## Selection Box (Addon)

Box selection for multiple objects:

```javascript
import { SelectionBox } from 'three/addons/interactive/SelectionBox.js';
import { SelectionHelper } from 'three/addons/interactive/SelectionHelper.js';

const selectionBox = new SelectionBox(camera, scene);
const helper = new SelectionHelper(renderer, 'selectBox');

let isSelecting = false;

renderer.domElement.addEventListener('pointerdown', (event) => {
  isSelecting = true;
  selectionBox.startPoint.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (isSelecting) {
    selectionBox.endPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    const allSelected = selectionBox.select();
    console.log('Selected:', allSelected.length);
  }
});

renderer.domElement.addEventListener('pointerup', () => {
  isSelecting = false;
});
```

## Keyboard Input

Handle keyboard controls:

```javascript
const keysPressed = {};

window.addEventListener('keydown', (event) => {
  keysPressed[event.key] = true;
});

window.addEventListener('keyup', (event) => {
  keysPressed[event.key] = false;
});

// In animation loop
function animate() {
  const speed = 0.1;

  if (keysPressed['w']) object.position.z -= speed;
  if (keysPressed['s']) object.position.z += speed;
  if (keysPressed['a']) object.position.x -= speed;
  if (keysPressed['d']) object.position.x += speed;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## Pointer Lock (First Person)

Lock pointer for FPS controls:

```javascript
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const controls = new PointerLockControls(camera, renderer.domElement);

// Lock on click
renderer.domElement.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  console.log('Pointer locked');
});

controls.addEventListener('unlock', () => {
  console.log('Pointer unlocked');
});

// Movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function animate() {
  if (controls.isLocked) {
    // Apply movement
    controls.moveForward(velocity.z);
    controls.moveRight(velocity.x);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## Object Highlighting

Visual feedback on hover/selection:

```javascript
let hoveredObject = null;
const originalEmissive = new THREE.Color();

function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Reset previous
  if (hoveredObject) {
    hoveredObject.material.emissive.copy(originalEmissive);
    hoveredObject = null;
  }

  // Highlight new
  if (intersects.length > 0) {
    hoveredObject = intersects[0].object;
    originalEmissive.copy(hoveredObject.material.emissive);
    hoveredObject.material.emissive.setHex(0x555555);
  }

  renderer.domElement.style.cursor = hoveredObject ? 'pointer' : 'default';
}
```

## Tooltips & UI Overlays

Show HTML tooltip at 3D position:

```javascript
function updateTooltip(object3D, text) {
  const vector = object3D.position.clone();
  vector.project(camera);

  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
  tooltip.textContent = text;
}
```


### 09 postprocessing

# Post-Processing

Apply visual effects after rendering.

## EffectComposer Setup

Post-processing pipeline (addon):

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Create composer
const composer = new EffectComposer(renderer);

// Add render pass (required first pass)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add effect passes
// ... (see below)

// Add output pass (required last pass)
const outputPass = new OutputPass();
composer.addPass(outputPass);

// Render with composer instead of renderer
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}

// Handle resize
window.addEventListener('resize', () => {
  composer.setSize(window.innerWidth, window.innerHeight);
});
```

## Bloom Effect

Glow effect for bright areas:

```javascript
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // strength
  0.4,  // radius
  0.85  // threshold (brightness trigger)
);
composer.addPass(bloomPass);

// Adjust parameters
bloomPass.strength = 2.0;
bloomPass.radius = 1.0;
bloomPass.threshold = 0.5;
```

## SSAO (Screen Space Ambient Occlusion)

Realistic shadowing in crevices:

```javascript
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';

const ssaoPass = new SSAOPass(scene, camera, width, height);
ssaoPass.kernelRadius = 16;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);
```

## SSR (Screen Space Reflections)

Real-time reflections:

```javascript
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';

const ssrPass = new SSRPass({
  renderer,
  scene,
  camera,
  width: window.innerWidth,
  height: window.innerHeight
});

ssrPass.opacity = 0.5;
ssrPass.maxDistance = 0.1;
composer.addPass(ssrPass);
```

## Depth of Field (Bokeh)

Blur based on depth:

```javascript
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

const bokehPass = new BokehPass(scene, camera, {
  focus: 10.0,      // focal distance
  aperture: 0.025,  // blur amount
  maxblur: 0.01     // max blur size
});
composer.addPass(bokehPass);
```

## FXAA (Anti-Aliasing)

Smooth jagged edges:

```javascript
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.x = 1 / window.innerWidth;
fxaaPass.material.uniforms['resolution'].value.y = 1 / window.innerHeight;
composer.addPass(fxaaPass);
```

## Outline Pass

Highlight selected objects:

```javascript
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);

outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 0.5;
outlinePass.edgeThickness = 1;
outlinePass.visibleEdgeColor.set('#ffffff');
outlinePass.hiddenEdgeColor.set('#190a05');

// Set objects to outline
outlinePass.selectedObjects = [mesh1, mesh2];

composer.addPass(outlinePass);
```

## Film/Grain Effect

Add film grain and scanlines:

```javascript
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';

const filmPass = new FilmPass(
  0.35,  // noise intensity
  0.5,   // scanline intensity
  648,   // scanline count
  false  // grayscale
);
composer.addPass(filmPass);
```

## Glitch Effect

Digital glitch distortion:

```javascript
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);
```

## Custom Shader Pass

Create custom effects:

```javascript
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const customShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      // Apply custom effect
      color.r *= amount;
      gl_FragColor = color;
    }
  `
};

const customPass = new ShaderPass(customShader);
customPass.material.uniforms.amount.value = 1.5;
composer.addPass(customPass);
```

## Common Pass Patterns

```javascript
// Combine multiple effects
composer.addPass(renderPass);
composer.addPass(ssaoPass);
composer.addPass(bloomPass);
composer.addPass(fxaaPass);
composer.addPass(outputPass);

// Selective rendering
bloomPass.renderToScreen = false; // render to texture, not screen

// Clear pass
import { ClearPass } from 'three/addons/postprocessing/ClearPass.js';
const clearPass = new ClearPass();
composer.addPass(clearPass);
```

## Performance Tips

- Post-processing is GPU-intensive
- Use lower resolution for expensive effects (SSAO, SSR)
- Limit number of passes (3-5 for good performance)
- Disable passes when not needed
- Use FXAA instead of MSAA (cheaper)
- Test on target devices


### 10 controls

# Camera Controls (Addons)

Interactive camera navigation systems.

## OrbitControls (Most Common)

Orbit camera around a target:

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);

// Target point
controls.target.set(0, 0, 0);

// Damping (smooth motion)
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Zoom limits
controls.minDistance = 5;
controls.maxDistance = 50;

// Rotation limits
controls.minPolarAngle = 0;                // radians
controls.maxPolarAngle = Math.PI / 2;      // prevent going below ground
controls.minAzimuthAngle = -Math.PI / 4;   // horizontal limit
controls.maxAzimuthAngle = Math.PI / 4;

// Behavior
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

// Mouse buttons
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};

// In animation loop (required if damping enabled)
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Events
controls.addEventListener('change', () => {
  renderer.render(scene, camera);
});
```

## MapControls

Bird's-eye map navigation (like OrbitControls but different mouse behavior):

```javascript
import { MapControls } from 'three/addons/controls/MapControls.js';

const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Mouse buttons
controls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE
};
```

## FirstPersonControls

FPS-style camera movement:

```javascript
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

const controls = new FirstPersonControls(camera, renderer.domElement);

controls.movementSpeed = 10;
controls.lookSpeed = 0.1;
controls.lookVertical = true;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;

// Requires delta time
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## FlyControls

Free-form flying navigation:

```javascript
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const controls = new FlyControls(camera, renderer.domElement);

controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;

const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## PointerLockControls

Locked pointer FPS controls:

```javascript
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const controls = new PointerLockControls(camera, renderer.domElement);

// Lock pointer on click
renderer.domElement.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  console.log('Locked');
});

controls.addEventListener('unlock', () => {
  console.log('Unlocked');
});

// Movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
  }
});

function animate() {
  if (controls.isLocked) {
    // Calculate movement
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    controls.moveForward(direction.z * 10);
    controls.moveRight(direction.x * 10);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## TrackballControls

Intuitive rotation (no gimbal lock):

```javascript
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const controls = new TrackballControls(camera, renderer.domElement);

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## ArcballControls

3D rotation with virtual ball metaphor:

```javascript
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

const controls = new ArcballControls(camera, renderer.domElement, scene);

controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.cursorZoom = true;

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## Controls Comparison

**OrbitControls**: Product viewers, 3D models, general use
**MapControls**: Top-down maps, strategy games
**FirstPersonControls**: Architectural walkthroughs
**FlyControls**: Space navigation, creative tools
**PointerLockControls**: FPS games
**TrackballControls**: CAD applications
**ArcballControls**: Scientific visualization

## Common Patterns

```javascript
// Disable controls during UI interaction
transformControls.addEventListener('dragging-changed', (event) => {
  orbitControls.enabled = !event.value;
});

// Reset camera position
function resetCamera() {
  controls.reset();
}

// Animate camera to position
function moveCameraTo(position, target) {
  gsap.to(camera.position, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
    onUpdate: () => controls.update()
  });
  gsap.to(controls.target, {
    duration: 1,
    x: target.x,
    y: target.y,
    z: target.z
  });
}
```


### 11 materials advanced

# Three.js - Advanced Materials

PBR materials and custom shaders.

## MeshStandardMaterial (PBR)

Physically-based rendering with metallic/roughness workflow:

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,     // 0 = dielectric, 1 = metal
  roughness: 0.5,     // 0 = smooth/shiny, 1 = rough/matte

  map: colorTexture,          // base color
  normalMap: normalTexture,   // surface detail
  roughnessMap: roughnessTexture,
  metalnessMap: metalnessTexture,
  aoMap: aoTexture,           // ambient occlusion
  emissive: 0xff0000,         // glow color
  emissiveMap: emissiveTexture,
  emissiveIntensity: 1.0,

  envMap: environmentMap,     // reflections
  envMapIntensity: 1.0,

  alphaMap: alphaTexture,     // transparency control
  transparent: true,
  opacity: 1.0,

  side: THREE.DoubleSide,     // render both sides
  flatShading: false          // smooth normals
});
```

## MeshPhysicalMaterial (Enhanced PBR)

Extended PBR with clearcoat, transmission, sheen:

```javascript
const material = new THREE.MeshPhysicalMaterial({
  // All MeshStandardMaterial properties plus:

  // Clearcoat (protective layer)
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  clearcoatMap: clearcoatTexture,
  clearcoatRoughnessMap: clearcoatRoughTexture,
  clearcoatNormalMap: clearcoatNormalTexture,

  // Transmission (transparency with refraction)
  transmission: 1.0,          // 0-1, glass-like
  thickness: 0.5,             // volumetric thickness
  ior: 1.5,                   // index of refraction (glass = 1.5)

  // Sheen (fabric-like edge glow)
  sheen: 1.0,
  sheenRoughness: 0.5,
  sheenColor: new THREE.Color(0xffffff),

  // Iridescence (rainbow effect)
  iridescence: 1.0,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],

  // Anisotropy (directional reflections)
  anisotropy: 1.0,
  anisotropyRotation: 0
});
```

## ShaderMaterial (Custom Shaders)

Full control over vertex and fragment shaders:

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    color: { value: new THREE.Color(0xff0000) },
    texture1: { value: texture }
  },

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform sampler2D texture1;

    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vec4 texColor = texture2D(texture1, vUv);
      vec3 light = vec3(0.5, 0.2, 1.0);
      float dProd = max(0.0, dot(vNormal, light));

      gl_FragColor = vec4(color * dProd * texColor.rgb, 1.0);
    }
  `,

  transparent: true,
  side: THREE.DoubleSide
});

// Update uniform in animation loop
material.uniforms.time.value += 0.01;
```

## RawShaderMaterial

Like ShaderMaterial but without Three.js shader injection:

```javascript
const material = new THREE.RawShaderMaterial({
  uniforms: {
    // ...
  },
  vertexShader: `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
  `
});
```

## Common Shader Patterns

### Fresnel Effect
```glsl
// In fragment shader
float fresnel = pow(1.0 - dot(vNormal, vViewDirection), 3.0);
gl_FragColor = vec4(mix(baseColor, edgeColor, fresnel), 1.0);
```

### Noise/Distortion
```glsl
// Simple noise function
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// UV distortion
vec2 distortedUV = vUv + vec2(
  noise(vUv + time) * 0.1,
  noise(vUv.yx + time) * 0.1
);
```

### Scrolling Texture
```glsl
uniform float time;
varying vec2 vUv;

vec2 scrollUV = vUv + vec2(time * 0.1, 0.0);
vec4 color = texture2D(map, scrollUV);
```

## Material Blending

```javascript
material.blending = THREE.AdditiveBlending;
// Options:
// THREE.NoBlending
// THREE.NormalBlending (default)
// THREE.AdditiveBlending (glow/light effects)
// THREE.SubtractiveBlending
// THREE.MultiplyBlending

// Custom blending
material.blending = THREE.CustomBlending;
material.blendEquation = THREE.AddEquation;
material.blendSrc = THREE.SrcAlphaFactor;
material.blendDst = THREE.OneMinusSrcAlphaFactor;
```

## Depth & Stencil

```javascript
// Depth testing
material.depthTest = true;
material.depthWrite = true;
material.depthFunc = THREE.LessEqualDepth;

// Alpha testing (discard transparent pixels)
material.alphaTest = 0.5;

// Render order
mesh.renderOrder = 1; // higher renders later

// Polygonoffset (prevent z-fighting)
material.polygonOffset = true;
material.polygonOffsetFactor = 1;
material.polygonOffsetUnits = 1;
```

## Material Cloning & Disposal

```javascript
// Clone material
const material2 = material.clone();

// Dispose when done (free GPU memory)
material.dispose();
texture.dispose();
geometry.dispose();
```

## Common Built-in Uniforms

Available in ShaderMaterial (automatic):

```glsl
// Matrices
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

// Camera
uniform vec3 cameraPosition;

// Attributes (vertex shader)
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
```

## Performance Tips

- Use MeshStandardMaterial for most cases (good balance)
- MeshPhysicalMaterial is expensive (use sparingly)
- ShaderMaterial requires GPU knowledge
- Avoid transparent materials when possible
- Use alphaTest instead of transparency for cutouts
- Minimize uniform updates
- Share materials between meshes


### 11 materials

# Three.js Materials

## Overview

Three.js materials - PBR, basic, phong, shader materials, material properties. Use when styling meshes, working with textures, creating custom shaders, or optimizing material performance.

## Quick Start

```javascript
import * as THREE from "three";

// PBR material (recommended for realistic rendering)
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.5,
  metalness: 0.5,
});

const mesh = new THREE.Mesh(geometry, material);
```

## Material Types Overview

| Material             | Use Case                              | Lighting           |
| -------------------- | ------------------------------------- | ------------------ |
| MeshBasicMaterial    | Unlit, flat colors, wireframes        | No                 |
| MeshLambertMaterial  | Matte surfaces, performance           | Yes (diffuse only) |
| MeshPhongMaterial    | Shiny surfaces, specular highlights   | Yes                |
| MeshStandardMaterial | PBR, realistic materials              | Yes (PBR)          |
| MeshPhysicalMaterial | Advanced PBR, clearcoat, transmission | Yes (PBR+)         |
| MeshToonMaterial     | Cel-shaded, cartoon look              | Yes (toon)         |
| MeshNormalMaterial   | Debug normals                         | No                 |
| MeshDepthMaterial    | Depth visualization                   | No                 |
| ShaderMaterial       | Custom GLSL shaders                   | Custom             |
| RawShaderMaterial    | Full shader control                   | Custom             |

## MeshBasicMaterial

No lighting calculations. Fast, always visible.

```javascript
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide, // FrontSide, BackSide, DoubleSide
  wireframe: false,
  map: texture, // Color/diffuse texture
  alphaMap: alphaTexture, // Transparency texture
  envMap: envTexture, // Reflection texture
  reflectivity: 1, // Env map intensity
  fog: true, // Affected by scene fog
});
```

## MeshLambertMaterial

Diffuse-only lighting. Fast, no specular highlights.

```javascript
const material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  emissive: 0x111111, // Self-illumination color
  emissiveIntensity: 1,
  map: texture,
  emissiveMap: emissiveTexture,
  envMap: envTexture,
  reflectivity: 0.5,
});
```

## MeshPhongMaterial

Specular highlights. Good for shiny, plastic-like surfaces.

```javascript
const material = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  specular: 0xffffff, // Highlight color
  shininess: 100, // Highlight sharpness (0-1000)
  emissive: 0x000000,
  flatShading: false, // Flat vs smooth shading
  map: texture,
  specularMap: specTexture, // Per-pixel shininess
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  bumpMap: bumpTexture,
  bumpScale: 1,
  displacementMap: dispTexture,
  displacementScale: 1,
});
```

## MeshStandardMaterial (PBR)

Physically-based rendering. Recommended for realistic results.

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5, // 0 = mirror, 1 = diffuse
  metalness: 0.0, // 0 = dielectric, 1 = metal

  // Textures
  map: colorTexture, // Albedo/base color
  roughnessMap: roughTexture, // Per-pixel roughness
  metalnessMap: metalTexture, // Per-pixel metalness
  normalMap: normalTexture, // Surface detail
  normalScale: new THREE.Vector2(1, 1),
  aoMap: aoTexture, // Ambient occlusion (uses uv2!)
  aoMapIntensity: 1,
  displacementMap: dispTexture, // Vertex displacement
  displacementScale: 0.1,
  displacementBias: 0,

  // Emissive
  emissive: 0x000000,
  emissiveIntensity: 1,
  emissiveMap: emissiveTexture,

  // Environment
  envMap: envTexture,
  envMapIntensity: 1,

  // Other
  flatShading: false,
  wireframe: false,
  fog: true,
});

// Note: aoMap requires second UV channel
geometry.setAttribute("uv2", geometry.attributes.uv);
```

## MeshPhysicalMaterial (Advanced PBR)

Extends MeshStandardMaterial with advanced features.

```javascript
const material = new THREE.MeshPhysicalMaterial({
  // All MeshStandardMaterial properties plus:

  // Clearcoat (car paint, lacquer)
  clearcoat: 1.0, // 0-1 clearcoat layer strength
  clearcoatRoughness: 0.1,
  clearcoatMap: ccTexture,
  clearcoatRoughnessMap: ccrTexture,
  clearcoatNormalMap: ccnTexture,
  clearcoatNormalScale: new THREE.Vector2(1, 1),

  // Transmission (glass, water)
  transmission: 1.0, // 0 = opaque, 1 = fully transparent
  transmissionMap: transTexture,
  thickness: 0.5, // Volume thickness for refraction
  thicknessMap: thickTexture,
  attenuationDistance: 1, // Absorption distance
  attenuationColor: new THREE.Color(0xffffff),

  // Refraction
  ior: 1.5, // Index of refraction (1-2.333)

  // Sheen (fabric, velvet)
  sheen: 1.0,
  sheenRoughness: 0.5,
  sheenColor: new THREE.Color(0xffffff),
  sheenColorMap: sheenTexture,
  sheenRoughnessMap: sheenRoughTexture,

  // Iridescence (soap bubbles, oil slicks)
  iridescence: 1.0,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
  iridescenceMap: iridTexture,
  iridescenceThicknessMap: iridThickTexture,

  // Anisotropy (brushed metal)
  anisotropy: 1.0,
  anisotropyRotation: 0,
  anisotropyMap: anisoTexture,

  // Specular
  specularIntensity: 1,
  specularColor: new THREE.Color(0xffffff),
  specularIntensityMap: specIntTexture,
  specularColorMap: specColorTexture,
});
```

### Glass Material Example

```javascript
const glass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  thickness: 0.5,
  ior: 1.5,
  envMapIntensity: 1,
});
```

### Car Paint Example

```javascript
const carPaint = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 0.9,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});
```

## MeshToonMaterial

Cel-shaded cartoon look.

```javascript
const material = new THREE.MeshToonMaterial({
  color: 0x00ff00,
  gradientMap: gradientTexture, // Optional: custom shading gradient
});

// Create step gradient texture
const colors = new Uint8Array([0, 128, 255]);
const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.needsUpdate = true;
```

## MeshNormalMaterial

Visualize surface normals. Useful for debugging.

```javascript
const material = new THREE.MeshNormalMaterial({
  flatShading: false,
  wireframe: false,
});
```

## MeshDepthMaterial

Render depth values. Used for shadow maps, DOF effects.

```javascript
const material = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});
```

## PointsMaterial

For point clouds.

```javascript
const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
  sizeAttenuation: true, // Scale with distance
  map: pointTexture,
  alphaMap: alphaTexture,
  transparent: true,
  alphaTest: 0.5, // Discard pixels below threshold
  vertexColors: true, // Use per-vertex colors
});

const points = new THREE.Points(geometry, material);
```

## LineBasicMaterial & LineDashedMaterial

```javascript
// Solid lines
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1, // Note: >1 only works on some systems
  linecap: "round",
  linejoin: "round",
});

// Dashed lines
const dashedMaterial = new THREE.LineDashedMaterial({
  color: 0xffffff,
  dashSize: 0.5,
  gapSize: 0.25,
  scale: 1,
});

// Required for dashed lines
const line = new THREE.Line(geometry, dashedMaterial);
line.computeLineDistances();
```

## ShaderMaterial

Custom GLSL shaders with Three.js uniforms.

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) },
    texture1: { value: texture },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float time;

    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 10.0 + time) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color;
    uniform sampler2D texture1;

    void main() {
      // Use texture2D() for GLSL 1.0, texture() for GLSL 3.0 (glslVersion: THREE.GLSL3)
      vec4 texColor = texture2D(texture1, vUv);
      gl_FragColor = vec4(color * texColor.rgb, 1.0);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

// Update uniform in animation loop
material.uniforms.time.value = clock.getElapsedTime();
```

### Built-in Uniforms (auto-provided)

```glsl
// Vertex shader
uniform mat4 modelMatrix;         // Object to world
uniform mat4 modelViewMatrix;     // Object to camera
uniform mat4 projectionMatrix;    // Camera projection
uniform mat4 viewMatrix;          // World to camera
uniform mat3 normalMatrix;        // For transforming normals
uniform vec3 cameraPosition;      // Camera world position

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
```

## RawShaderMaterial

Full control - no built-in uniforms/attributes.

```javascript
const material = new THREE.RawShaderMaterial({
  uniforms: {
    projectionMatrix: { value: camera.projectionMatrix },
    modelViewMatrix: { value: new THREE.Matrix4() },
  },
  vertexShader: `
    precision highp float;
    attribute vec3 position;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
```

## Common Material Properties

All materials share these base properties:

```javascript
// Visibility
material.visible = true;
material.transparent = false;
material.opacity = 1.0;
material.alphaTest = 0; // Discard pixels with alpha < value

// Rendering
material.side = THREE.FrontSide; // FrontSide, BackSide, DoubleSide
material.depthTest = true;
material.depthWrite = true;
material.colorWrite = true;

// Blending
material.blending = THREE.NormalBlending;
// NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, CustomBlending

// Stencil
material.stencilWrite = false;
material.stencilFunc = THREE.AlwaysStencilFunc;
material.stencilRef = 0;
material.stencilMask = 0xff;

// Polygon offset (z-fighting fix)
material.polygonOffset = false;
material.polygonOffsetFactor = 0;
material.polygonOffsetUnits = 0;

// Misc
material.dithering = false;
material.toneMapped = true;
```

## Multiple Materials

```javascript
// Assign different materials to geometry groups
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left
  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom
  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // front
  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // back
];
const mesh = new THREE.Mesh(geometry, materials);

// Custom groups
geometry.clearGroups();
geometry.addGroup(0, 6, 0); // start, count, materialIndex
geometry.addGroup(6, 6, 1);
```

## Environment Maps

```javascript
// Load cube texture
const cubeLoader = new THREE.CubeTextureLoader();
const envMap = cubeLoader.load([
  "px.jpg",
  "nx.jpg", // positive/negative X
  "py.jpg",
  "ny.jpg", // positive/negative Y
  "pz.jpg",
  "nz.jpg", // positive/negative Z
]);

// Apply to material
material.envMap = envMap;
material.envMapIntensity = 1;

// Or set as scene environment (affects all PBR materials)
scene.environment = envMap;

// HDR environment (recommended)
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const rgbeLoader = new RGBELoader();
rgbeLoader.load("environment.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});
```

## Material Cloning and Modification

```javascript
// Clone material
const clone = material.clone();
clone.color.set(0x00ff00);

// Modify at runtime
material.color.set(0xff0000);
material.needsUpdate = true; // Only needed for some changes

// When needsUpdate is required:
// - Changing flat shading
// - Changing texture
// - Changing transparent
// - Custom shader code changes
```

## Performance Tips

1. **Reuse materials**: Same material = batched draw calls
2. **Avoid transparent when possible**: Transparent materials require sorting
3. **Use alphaTest instead of transparency**: When applicable, faster
4. **Choose simpler materials**: Basic > Lambert > Phong > Standard > Physical
5. **Limit active lights**: Each light adds shader complexity

```javascript
// Material pooling
const materialCache = new Map();
function getMaterial(color) {
  const key = color.toString(16);
  if (!materialCache.has(key)) {
    materialCache.set(key, new THREE.MeshStandardMaterial({ color }));
  }
  return materialCache.get(key);
}

// Dispose when done
material.dispose();
```

## See Also

- `threejs-textures` - Texture loading and configuration
- `threejs-shaders` - Custom shader development
- `threejs-lighting` - Light interaction with materials

### 12 performance

# Performance Optimization

Techniques for fast, smooth 3D experiences.

## Instancing

Render many copies of same geometry efficiently:

```javascript
// Instead of creating 10,000 individual meshes
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, 10000);

// Set transforms for each instance
const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const rotation = new THREE.Euler();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3(1, 1, 1);

for (let i = 0; i < 10000; i++) {
  position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );

  rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );

  quaternion.setFromEuler(rotation);
  matrix.compose(position, quaternion, scale);
  mesh.setMatrixAt(i, matrix);
}

mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);

// Per-instance colors
mesh.instanceColor = new THREE.InstancedBufferAttribute(
  new Float32Array(10000 * 3),
  3
);

for (let i = 0; i < 10000; i++) {
  mesh.setColorAt(i, new THREE.Color(Math.random(), Math.random(), Math.random()));
}
```

## Level of Detail (LOD)

Switch between detail levels based on distance:

```javascript
const lod = new THREE.LOD();

// High detail (close)
const geometryHigh = new THREE.IcosahedronGeometry(10, 4);
const meshHigh = new THREE.Mesh(geometryHigh, material);
lod.addLevel(meshHigh, 0);

// Medium detail
const geometryMed = new THREE.IcosahedronGeometry(10, 2);
const meshMed = new THREE.Mesh(geometryMed, material);
lod.addLevel(meshMed, 50);

// Low detail (far)
const geometryLow = new THREE.IcosahedronGeometry(10, 0);
const meshLow = new THREE.Mesh(geometryLow, material);
lod.addLevel(meshLow, 100);

scene.add(lod);

// Update LOD in animation loop
function animate() {
  lod.update(camera);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## Frustum Culling

Automatic - objects outside camera view aren't rendered.

```javascript
// Force disable for specific object
object.frustumCulled = false;

// Manually test if in view
const frustum = new THREE.Frustum();
const cameraViewProjectionMatrix = new THREE.Matrix4();
cameraViewProjectionMatrix.multiplyMatrices(
  camera.projectionMatrix,
  camera.matrixWorldInverse
);
frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

if (frustum.intersectsObject(object)) {
  // Object is visible
}
```

## Geometry Optimization

```javascript
// Merge geometries (reduce draw calls)
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const geometries = [geom1, geom2, geom3];
const mergedGeometry = mergeGeometries(geometries);
const mesh = new THREE.Mesh(mergedGeometry, material);

// Dispose old geometries
geometries.forEach(g => g.dispose());

// Simplify geometry
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';

const modifier = new SimplifyModifier();
const simplified = modifier.modify(geometry, Math.floor(geometry.attributes.position.count * 0.5));
```

## Texture Optimization

```javascript
// Use appropriate sizes (power of 2)
// 512x512, 1024x1024, 2048x2048

// Compress textures
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

// Use mipmaps (auto-generated by default)
texture.generateMipmaps = true;

// Appropriate filtering
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// Anisotropic filtering (balance quality/performance)
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Dispose unused textures
texture.dispose();
```

## Material Sharing

```javascript
// Share materials between meshes (reduce memory)
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);
const mesh3 = new THREE.Mesh(geometry3, sharedMaterial);
```

## Shadow Optimization

```javascript
// Reduce shadow map resolution
light.shadow.mapSize.width = 1024;  // instead of 2048
light.shadow.mapSize.height = 1024;

// Limit shadow camera frustum
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;  // only cast shadows within this range
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;

// Use fewer shadow-casting objects
object.castShadow = false; // for distant/small objects
object.receiveShadow = false; // for objects that don't need shadows

// Cheaper shadow type
renderer.shadowMap.type = THREE.PCFShadowMap; // instead of PCFSoftShadowMap
```

## Render Target Optimization

```javascript
// Lower resolution for post-processing
const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth * 0.5,  // half resolution
  window.innerHeight * 0.5
);

// Appropriate pixel format
renderTarget.texture.format = THREE.RGBAFormat;
renderTarget.texture.type = THREE.UnsignedByteType;

// Dispose when done
renderTarget.dispose();
```

## Object Pooling

```javascript
// Reuse objects instead of creating/destroying
class ObjectPool {
  constructor(factory, initialSize) {
    this.factory = factory;
    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  get() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory();
  }

  release(obj) {
    this.pool.push(obj);
  }
}

const bulletPool = new ObjectPool(() => {
  return new THREE.Mesh(bulletGeometry, bulletMaterial);
}, 100);

// Use
const bullet = bulletPool.get();
scene.add(bullet);

// Return when done
scene.remove(bullet);
bulletPool.release(bullet);
```

## Monitoring Performance

```javascript
// FPS counter
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // ... rendering
  stats.end();
  requestAnimationFrame(animate);
}

// Renderer info
console.log(renderer.info);
// Shows: geometries, textures, programs, calls, triangles, points, lines

// GPU timing
const query = renderer.extensions.get('EXT_disjoint_timer_query_webgl2');
```

## General Best Practices

- Limit draw calls (merge geometries, use instancing)
- Reduce polygon count (LOD, simplification)
- Optimize textures (compression, appropriate sizes)
- Share materials and geometries
- Use frustum culling
- Limit number of lights (3-5 max)
- Avoid transparent materials when possible
- Use object pooling for frequently created/destroyed objects
- Profile with browser DevTools
- Test on target devices
- Use WebGL 2 features when available


### 13 node materials

# Node Materials (TSL - Three Shading Language)

Modern node-based material system for creating custom shaders visually.

## What is TSL?

Three Shading Language (TSL) is a node-based system for creating materials and shaders:
- Functional approach to shader composition
- Type-safe node graph
- Unified GLSL/WGSL output (WebGL & WebGPU)
- No manual shader code required

## Basic Node Material

```javascript
import * as THREE from 'three/webgpu';
import { color, texture, normalMap, MeshStandardNodeMaterial } from 'three/nodes';

const material = new MeshStandardNodeMaterial();

// Set base color node
material.colorNode = color(0xff0000);

// Or use texture
material.colorNode = texture(colorTexture);

// Combine nodes
material.colorNode = texture(colorTexture).mul(color(0xffffff));

// Normal mapping
material.normalNode = normalMap(normalTexture);
```

## Node Types

### Input Nodes

```javascript
import {
  attribute,
  uniform,
  texture,
  cubeTexture,
  instancedArray,
  storage
} from 'three/nodes';

// Geometry attributes
const positionNode = attribute('position');
const normalNode = attribute('normal');
const uvNode = attribute('uv');

// Uniforms
const timeNode = uniform(0); // value

// Textures
const colorNode = texture(diffuseTexture);
const envNode = cubeTexture(cubeMapTexture);

// Instanced data
const instanceColorNode = instancedArray('instanceColor');

// Storage buffers (compute)
const storageNode = storage(buffer, 'vec4', count);
```

### Math Nodes

```javascript
import { add, sub, mul, div, pow, sin, cos, length, normalize } from 'three/nodes';

// Basic operations
const result = add(a, b);     // a + b
const result = sub(a, b);     // a - b
const result = mul(a, b);     // a * b
const result = div(a, b);     // a / b

// Trigonometry
const result = sin(angle);
const result = cos(angle);

// Vector operations
const result = length(vector);
const result = normalize(vector);

// Chaining
const result = mul(texture(tex), color(0xff0000));
```

### Procedural Nodes

```javascript
import { checker, dots, noise, voronoi } from 'three/nodes';

// Checker pattern
material.colorNode = checker(uvNode.mul(10));

// Noise
material.colorNode = noise(uvNode.mul(5));

// Voronoi cells
material.colorNode = voronoi(uvNode.mul(3));
```

## Custom Shader Function

```javascript
import { Fn, vec3, float } from 'three/nodes';

// Define custom function
const customColor = Fn(([uv, time]) => {
  const r = sin(uv.x.mul(10).add(time));
  const g = cos(uv.y.mul(10).add(time));
  const b = float(0.5);
  return vec3(r, g, b);
});

// Use in material
material.colorNode = customColor(uvNode, timeNode);
```

## Animation with Nodes

```javascript
import { uniform, oscSine, timerLocal } from 'three/nodes';

// Oscillating value
const oscillator = oscSine(timerLocal(0.5)); // frequency = 0.5

// Pulsing color
material.colorNode = color(0xff0000).mul(oscillator.add(0.5));

// Rotating UV
const rotatedUV = uvNode.rotateUV(timerLocal());
material.colorNode = texture(tex, rotatedUV);
```

## Advanced Effects

### Fresnel Effect

```javascript
import { normalView, positionView, dot, pow } from 'three/nodes';

const fresnel = pow(
  float(1).sub(dot(normalView, positionView.normalize())),
  3
);

material.colorNode = mix(baseColor, edgeColor, fresnel);
```

### Vertex Displacement

```javascript
import { positionLocal, normalLocal, timerLocal, sin } from 'three/nodes';

// Displace vertices along normal
const displacement = sin(positionLocal.y.add(timerLocal())).mul(0.5);
material.positionNode = positionLocal.add(normalLocal.mul(displacement));
```

### Custom Normal Mapping

```javascript
import { normalMap, normalView, TBNViewMatrix } from 'three/nodes';

const normalMapNode = normalMap(normalTexture);
const transformedNormal = TBNViewMatrix.mul(normalMapNode);
material.normalNode = transformedNormal;
```

## Compute Shaders (WebGPU)

```javascript
import { compute, uniform, storage, Fn } from 'three/nodes';

// Define compute shader
const computeShader = Fn(() => {
  const storageBuffer = storage(buffer, 'vec4', count);
  const index = instanceIndex; // built-in

  // Modify buffer
  const value = storageBuffer.element(index);
  storageBuffer.element(index).assign(value.mul(2));
})();

// Create compute node
const computeNode = compute(computeShader, 256); // workgroup size

// Execute
renderer.compute(computeNode);
```

## Node Material Types

```javascript
import {
  MeshStandardNodeMaterial,
  MeshPhysicalNodeMaterial,
  MeshBasicNodeMaterial,
  PointsNodeMaterial,
  LineBasicNodeMaterial,
  SpriteNodeMaterial
} from 'three/nodes';

// Standard PBR
const material = new MeshStandardNodeMaterial();
material.colorNode = colorNode;
material.roughnessNode = roughnessNode;
material.metalnessNode = metalnessNode;

// Physical (clearcoat, transmission, etc.)
const material = new MeshPhysicalNodeMaterial();
material.clearcoatNode = clearcoatNode;
material.transmissionNode = transmissionNode;
```

## Post-Processing with Nodes

```javascript
import { pass, PassNode } from 'three/nodes';

// Custom post-processing pass
const customPass = new PassNode('customPass', (input, output) => {
  // input: previous pass texture
  // output: render target

  // Apply effect
  const modifiedColor = input.mul(color(1, 0.5, 0.5));
  output.assign(modifiedColor);
});

// Add to post-processing chain
postProcessing.addPass(customPass);
```

## Practical Example: Animated Material

```javascript
import * as THREE from 'three/webgpu';
import {
  MeshStandardNodeMaterial,
  texture,
  uniform,
  timerLocal,
  sin,
  cos,
  vec2
} from 'three/nodes';

const material = new MeshStandardNodeMaterial();

// Animated UV scroll
const time = timerLocal();
const scrollSpeed = uniform(0.1);
const uvOffset = vec2(
  time.mul(scrollSpeed),
  sin(time).mul(0.1)
);
const scrolledUV = uv().add(uvOffset);

// Apply to color
material.colorNode = texture(diffuseTexture, scrolledUV);

// Animated emission
const pulseSpeed = uniform(2);
const emission = sin(time.mul(pulseSpeed)).mul(0.5).add(0.5);
material.emissiveNode = color(1, 0.5, 0).mul(emission);
```

## Migration from ShaderMaterial

```javascript
// Old way (ShaderMaterial)
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `...`,
  fragmentShader: `...`
});

// New way (Node Material)
const material = new MeshStandardNodeMaterial();
material.colorNode = customFunction(timerLocal());
// Much cleaner, type-safe, and reusable
```

## When to Use Node Materials

- Creating complex procedural materials
- Need both WebGL and WebGPU support
- Want visual/functional shader composition
- Reusable shader components
- Compute shader integration (WebGPU only)

**Note**: Node materials require WebGPU renderer for full features. Some features work with WebGL backend but compute shaders require WebGPU.


### 14 physics vr

# Physics & VR/XR

Integrate physics simulations and virtual reality.

## Physics Integration

Three.js doesn't include physics - use external libraries:

### Rapier Physics (Recommended)

Rust-based, high-performance:

```javascript
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';

// Initialize
const physics = await RapierPhysics();

// Create physics body
const box = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial()
);
scene.add(box);

// Add physics (mass > 0 = dynamic)
physics.addMesh(box, 1); // mass = 1

// Static ground
const ground = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.5, 10),
  new THREE.MeshStandardMaterial()
);
ground.position.y = -2;
scene.add(ground);
physics.addMesh(ground); // no mass = static

// Update in animation loop
function animate() {
  physics.step();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

### Ammo Physics

Port of Bullet physics engine:

```javascript
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js';

const physics = await AmmoPhysics();

// Same API as Rapier
physics.addMesh(mesh, mass);

function animate() {
  physics.step();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

### Jolt Physics

High-performance alternative:

```javascript
import { JoltPhysics } from 'three/addons/physics/JoltPhysics.js';

const physics = await JoltPhysics();
physics.addMesh(mesh, mass);
```

### Physics Constraints

```javascript
// After initialization
const physics = await RapierPhysics();

// Point-to-point constraint
physics.addConstraint(meshA, meshB, 'fixed');
physics.addConstraint(meshA, meshB, 'spring', { stiffness: 100 });

// Remove constraint
physics.removeConstraint(constraint);
```

## VR/XR Setup

### Basic WebXR

```javascript
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Enable XR
renderer.xr.enabled = true;

// Add VR button to page
document.body.appendChild(VRButton.createButton(renderer));

// Animation loop for VR
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});

// Stop using requestAnimationFrame, use setAnimationLoop instead
```

### AR Mode

```javascript
import { ARButton } from 'three/addons/webxr/ARButton.js';

renderer.xr.enabled = true;
document.body.appendChild(ARButton.createButton(renderer));

// AR-specific features
const session = renderer.xr.getSession();
session.requestHitTestSource({ space: viewerSpace }).then((hitTestSource) => {
  // Use hit testing for placing objects
});
```

### VR Controllers

```javascript
// Get controllers
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);

scene.add(controller1);
scene.add(controller2);

// Controller events
controller1.addEventListener('selectstart', () => {
  console.log('Trigger pressed');
});

controller1.addEventListener('selectend', () => {
  console.log('Trigger released');
});

// Add visual controller models
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

const controllerModelFactory = new XRControllerModelFactory();

const grip1 = renderer.xr.getControllerGrip(0);
grip1.add(controllerModelFactory.createControllerModel(grip1));
scene.add(grip1);

const grip2 = renderer.xr.getControllerGrip(1);
grip2.add(controllerModelFactory.createControllerModel(grip2));
scene.add(grip2);
```

### Hand Tracking

```javascript
import { OculusHandModel } from 'three/addons/webxr/OculusHandModel.js';

const hand1 = renderer.xr.getHand(0);
const handModel1 = new OculusHandModel(hand1);
hand1.add(handModel1);
scene.add(hand1);

const hand2 = renderer.xr.getHand(1);
const handModel2 = new OculusHandModel(hand2);
hand2.add(handModel2);
scene.add(hand2);
```

### Teleportation

```javascript
const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();

function handleController(controller) {
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];

    // Teleport on button release
    controller.addEventListener('selectend', () => {
      const offset = intersection.point.y;
      camera.position.y += offset;
    });
  }
}

function getIntersections(controller) {
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
  return raycaster.intersectObjects(scene.children, true);
}
```

### Spatial Audio for VR

```javascript
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.PositionalAudio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('sound.ogg', (buffer) => {
  sound.setBuffer(buffer);
  sound.setRefDistance(1);
  sound.setLoop(true);
  sound.play();
});

// Attach to object
object.add(sound);

// Update listener in VR
renderer.setAnimationLoop(() => {
  // Listener automatically updates with camera in VR
  renderer.render(scene, camera);
});
```

### Room-Scale VR

```javascript
// Request room-scale experience
navigator.xr.requestSession('immersive-vr', {
  requiredFeatures: ['local-floor']
}).then((session) => {
  // Session setup
});

// Get play area bounds
session.requestReferenceSpace('bounded-floor').then((space) => {
  const bounds = space.boundsGeometry;
  // Create visual boundary
});
```

### Performance Tips for VR

- Target 90 FPS (11.1ms per frame)
- Use lower polygon counts
- Reduce shadow quality
- Limit post-processing
- Use instancing for repeated objects
- Enable foveated rendering if available
- Test on actual VR hardware

```javascript
// Foveated rendering (Quest 2+)
const gl = renderer.getContext();
const ext = gl.getExtension('WEBGL_foveated_rendering');
if (ext) {
  ext.foveatedRenderingModeWEBGL(gl.FOVEATED_RENDERING_MODE_ENABLE_WEBGL);
}
```

## Mixed Reality (MR)

```javascript
import { XRButton } from 'three/addons/webxr/XRButton.js';

// Request MR features
document.body.appendChild(
  XRButton.createButton(renderer, {
    requiredFeatures: ['hand-tracking', 'layers'],
    optionalFeatures: ['local-floor', 'bounded-floor']
  })
);

// Passthrough mode (Quest Pro, etc.)
const session = renderer.xr.getSession();
const baseLayer = session.renderState.baseLayer;
baseLayer.compositionDisabled = true; // enable passthrough
```

## Common VR Patterns

```javascript
// Detect if in VR
if (renderer.xr.isPresenting) {
  // In VR mode
}

// Get VR camera (for raycasting)
const vrCamera = renderer.xr.getCamera(camera);

// Different behavior for VR vs desktop
renderer.setAnimationLoop(() => {
  if (renderer.xr.isPresenting) {
    // VR rendering logic
  } else {
    // Desktop rendering logic
  }
  renderer.render(scene, camera);
});
```


### 15 specialized loaders

# Specialized Loaders

Domain-specific file format loaders.

## SVG Loader

Load and extrude SVG paths:

```javascript
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

const loader = new SVGLoader();
loader.load('image.svg', (data) => {
  const paths = data.paths;
  const group = new THREE.Group();

  paths.forEach((path) => {
    const material = new THREE.MeshBasicMaterial({
      color: path.color,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const shapes = SVGLoader.createShapes(path);
    shapes.forEach((shape) => {
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    });
  });

  // Extrude SVG
  paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path);
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 10,
      bevelEnabled: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
  });

  scene.add(group);
});
```

## Collada (.dae) Loader

XML-based format from Blender, SketchUp:

```javascript
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';

const loader = new ColladaLoader();
loader.load('model.dae', (collada) => {
  const model = collada.scene;
  scene.add(model);

  // Access animations
  const animations = collada.animations;
  const mixer = new THREE.AnimationMixer(model);
  animations.forEach(clip => mixer.clipAction(clip).play());
});
```

## STL Loader

3D printing format:

```javascript
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

const loader = new STLLoader();
loader.load('model.stl', (geometry) => {
  const material = new THREE.MeshPhongMaterial({ color: 0xff5533 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // STL doesn't include normals, compute them
  geometry.computeVertexNormals();
});
```

## 3MF Loader

Modern 3D printing format:

```javascript
import { 3MFLoader } from 'three/addons/loaders/3MFLoader.js';

const loader = new 3MFLoader();
loader.load('model.3mf', (object) => {
  scene.add(object);
});
```

## VRML/X3D Loader

Virtual Reality Modeling Language:

```javascript
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js';

const loader = new VRMLLoader();
loader.load('model.wrl', (object) => {
  scene.add(object);
});
```

## PDB Loader

Protein Data Bank (chemistry/molecular):

```javascript
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';

const loader = new PDBLoader();
loader.load('molecule.pdb', (pdb) => {
  const geometryAtoms = pdb.geometryAtoms;
  const geometryBonds = pdb.geometryBonds;
  const json = pdb.json;

  // Render atoms as spheres
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const atoms = new THREE.Mesh(geometryAtoms, material);
  scene.add(atoms);

  // Render bonds as cylinders
  const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const bonds = new THREE.Mesh(geometryBonds, bondMaterial);
  scene.add(bonds);
});
```

## LDraw Loader

LEGO models:

```javascript
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';

const loader = new LDrawLoader();
loader.setPath('ldraw/');

loader.load('model.mpd', (group) => {
  scene.add(group);

  // Smooth LEGO bricks
  group.traverse((child) => {
    if (child.isMesh) {
      child.material.flatShading = false;
    }
  });
});
```

## VTK Loader

Visualization Toolkit (scientific data):

```javascript
import { VTKLoader } from 'three/addons/loaders/VTKLoader.js';

const loader = new VTKLoader();
loader.load('model.vtk', (geometry) => {
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

## PLY Loader

Polygon file format (scanned 3D data):

```javascript
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const loader = new PLYLoader();
loader.load('model.ply', (geometry) => {
  geometry.computeVertexNormals();

  // Check if has vertex colors
  const material = geometry.attributes.color ?
    new THREE.MeshStandardMaterial({ vertexColors: true }) :
    new THREE.MeshStandardMaterial({ color: 0x888888 });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

## 3DS Loader

3DS Max format:

```javascript
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js';

const loader = new TDSLoader();
loader.load('model.3ds', (object) => {
  scene.add(object);
});
```

## USDZ Loader/Exporter

Apple's AR format:

```javascript
// Export to USDZ (for iOS AR)
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';

const exporter = new USDZExporter();
const arraybuffer = await exporter.parse(scene);
const blob = new Blob([arraybuffer], { type: 'application/octet-stream' });

// Download or serve for AR Quick Look
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'model.usdz';
link.click();
```

## Font Loader (Text)

Load fonts for 3D text:

```javascript
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const geometry = new TextGeometry('Hello World', {
    font: font,
    size: 80,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelSegments: 5
  });

  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

## EXR Loader

High dynamic range images:

```javascript
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

const loader = new EXRLoader();
loader.load('env.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;
});
```

## RGBE/HDR Loader

HDR environment maps:

```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const loader = new RGBELoader();
loader.load('env.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;

  // Use with PMREM generator for better quality
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  texture.dispose();
  pmremGenerator.dispose();
});
```

## Basis/KTX2 Texture Loader

GPU-optimized texture compression:

```javascript
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const loader = new KTX2Loader();
loader.setTranscoderPath('basis/');
loader.detectSupport(renderer);

loader.load('texture.ktx2', (texture) => {
  material.map = texture;
  material.needsUpdate = true;
});
```

## Common Patterns

```javascript
// Load with progress
loader.load(
  'file.ext',
  (result) => { /* success */ },
  (xhr) => {
    const percent = (xhr.loaded / xhr.total * 100);
    console.log(`${percent}% loaded`);
  },
  (error) => { /* error */ }
);

// Center imported model
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());
model.position.sub(center);

// Scale to fit
const size = box.getSize(new THREE.Vector3());
const maxDim = Math.max(size.x, size.y, size.z);
const scale = 10 / maxDim;
model.scale.setScalar(scale);
```


### 16 webgpu

# WebGPU Rendering

Modern GPU API for next-generation graphics.

## WebGPU Renderer

Next-generation rendering backend:

```javascript
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

// Check support
if (WebGPU.isAvailable()) {
  const renderer = new WebGPURenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Use setAnimationLoop (not requestAnimationFrame)
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
} else {
  const warning = WebGPU.getErrorMessage();
  document.body.appendChild(warning);
}
```

## Benefits of WebGPU

- Better performance (lower CPU overhead)
- Compute shaders
- Modern GPU features
- Unified shading language (WGSL)
- Better multi-threading support
- More predictable behavior

## Compute Shaders

GPU-accelerated computation:

```javascript
import { storageBuffer, uniform, Fn } from 'three/nodes';
import { StorageBufferAttribute } from 'three/addons/renderers/common/StorageBufferAttribute.js';

// Create storage buffer
const particleCount = 10000;
const positionBuffer = new StorageBufferAttribute(particleCount * 3, 3);

// Fill initial positions
for (let i = 0; i < particleCount; i++) {
  positionBuffer.setXYZ(
    i,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
}

// Create compute shader
const computeParticles = Fn(() => {
  const position = storageBuffer(positionBuffer);
  const time = uniform('time', 0);
  const index = instanceIndex;

  // Update position
  const pos = position.element(index);
  pos.y.addAssign(sin(time.add(index)).mul(0.01));

  // Wrap around
  If(pos.y.greaterThan(5), () => {
    pos.y.assign(-5);
  });
})();

// Create compute node
const computeNode = computeParticles.compute(particleCount);

// Execute in render loop
renderer.setAnimationLoop(() => {
  renderer.compute(computeNode);
  renderer.render(scene, camera);
});
```

## Storage Buffers

GPU-accessible memory:

```javascript
import { storage, Fn, vec3, float } from 'three/nodes';

// Define storage buffer structure
const particleData = storage(
  new THREE.StorageBufferAttribute(count * 7, 7), // 7 floats per particle
  'vec3', // position
  'vec3', // velocity
  'float' // life
);

// Access in compute shader
const updateParticle = Fn(() => {
  const data = particleData.element(instanceIndex);
  const position = data.xyz;
  const velocity = data.toVec3(3); // offset 3
  const life = data.element(6);

  // Update
  position.addAssign(velocity.mul(deltaTime));
  life.subAssign(deltaTime);
})();
```

## WebGPU Node Materials

Use TSL (Three Shading Language) with WebGPU:

```javascript
import { MeshStandardNodeMaterial, texture, normalMap } from 'three/nodes';

const material = new MeshStandardNodeMaterial();

// Node-based material definition
material.colorNode = texture(diffuseTexture);
material.normalNode = normalMap(normalTexture);
material.roughnessNode = float(0.5);
material.metalnessNode = float(0.8);

// Works with both WebGL and WebGPU automatically
```

## Indirect Drawing

Efficient rendering with compute-generated draw calls:

```javascript
import { IndirectStorageBufferAttribute } from 'three/addons/renderers/common/IndirectStorageBufferAttribute.js';

// Create indirect buffer
const indirectBuffer = new IndirectStorageBufferAttribute(count, 5);
// 5 elements: count, instanceCount, first, baseInstance, (padding)

// Update with compute shader
const updateIndirect = Fn(() => {
  const indirect = storage(indirectBuffer);
  // Compute visibility and update instance count
  const visible = computeVisibility();
  If(visible, () => {
    indirect.element(1).addAssign(1); // increment instanceCount
  });
})();

// Render using indirect buffer
renderer.drawIndirect(mesh, indirectBuffer);
```

## Multi-Render-Target (MRT)

Render to multiple textures simultaneously:

```javascript
import { WebGPURenderTarget } from 'three/addons/renderers/webgpu/WebGPURenderTarget.js';

const renderTarget = new WebGPURenderTarget(width, height, {
  count: 3, // number of render targets
  format: THREE.RGBAFormat
});

// Access individual textures
const albedoTexture = renderTarget.textures[0];
const normalTexture = renderTarget.textures[1];
const depthTexture = renderTarget.textures[2];

// Use in deferred rendering pipeline
renderer.setRenderTarget(renderTarget);
renderer.render(scene, camera);
```

## Async Shader Compilation

Avoid frame drops:

```javascript
// Compile materials ahead of time
await renderer.compileAsync(scene, camera);

// Start rendering after compilation
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
```

## Performance Monitoring

GPU timestamp queries:

```javascript
// Query GPU timing
const timestampQuery = renderer.getTimestampQuery();

timestampQuery.begin();
renderer.render(scene, camera);
timestampQuery.end();

timestampQuery.getResult().then((duration) => {
  console.log(`GPU time: ${duration}ms`);
});
```

## WebGPU-Specific Features

### Texture Compression

```javascript
// BC7 compression (higher quality)
const texture = new THREE.CompressedTexture(
  mipmaps,
  width,
  height,
  THREE.RGBA_BPTC_Format
);
```

### Depth Textures

```javascript
const depthTexture = new THREE.DepthTexture(width, height);
depthTexture.type = THREE.FloatType; // 32-bit depth
depthTexture.format = THREE.DepthFormat;
```

### Storage Textures

```javascript
import { storageTexture } from 'three/nodes';

// Read-write texture in compute shader
const writeableTexture = storageTexture(texture);

const computeShader = Fn(() => {
  const coord = vec2(instanceIndex % width, instanceIndex / width);
  const color = vec4(1, 0, 0, 1);
  writeableTexture.store(coord, color);
})();
```

## Migration from WebGL

Most Three.js code works with both:

```javascript
// WebGL
const renderer = new THREE.WebGLRenderer();

// WebGPU (drop-in replacement for most cases)
const renderer = new WebGPURenderer();

// Exceptions:
// - Custom shaders: need to use Node materials or WGSL
// - Some extensions not available
// - Compute shaders only in WebGPU
```

## WGSL (WebGPU Shading Language)

Native shader language for WebGPU:

```wgsl
@group(0) @binding(0) var<storage, read_write> positions: array<vec3f>;
@group(0) @binding(1) var<uniform> time: f32;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  let index = global_id.x;
  if (index >= arrayLength(&positions)) {
    return;
  }

  var pos = positions[index];
  pos.y += sin(time + f32(index)) * 0.01;
  positions[index] = pos;
}
```

## Browser Support

As of 2025:
- ✅ Chrome 113+
- ✅ Edge 113+
- ✅ Safari 18+ (macOS/iOS)
- ❌ Firefox (in development)

Check support: `WebGPU.isAvailable()`

## Best Practices

- Use compute shaders for particle systems, physics
- Leverage storage buffers for large datasets
- Async compile before rendering
- Use Node materials instead of custom GLSL
- Test on both WebGL and WebGPU
- Provide WebGL fallback for unsupported browsers


### 17 shader

# Three.js Shaders

## Overview

Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. Use when creating custom visual effects, modifying vertices, writing fragment shaders, or extending built-in materials.

## Quick Start

```javascript
import * as THREE from "three";

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) },
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;

    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

// Update in animation loop
material.uniforms.time.value = clock.getElapsedTime();
```

## ShaderMaterial vs RawShaderMaterial

### ShaderMaterial

Three.js provides built-in uniforms and attributes.

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    // Built-in uniforms available:
    // uniform mat4 modelMatrix;
    // uniform mat4 modelViewMatrix;
    // uniform mat4 projectionMatrix;
    // uniform mat4 viewMatrix;
    // uniform mat3 normalMatrix;
    // uniform vec3 cameraPosition;

    // Built-in attributes available:
    // attribute vec3 position;
    // attribute vec3 normal;
    // attribute vec2 uv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
```

### RawShaderMaterial

Full control - you define everything.

```javascript
const material = new THREE.RawShaderMaterial({
  uniforms: {
    projectionMatrix: { value: camera.projectionMatrix },
    modelViewMatrix: { value: new THREE.Matrix4() },
  },
  vertexShader: `
    precision highp float;

    attribute vec3 position;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
```

## Uniforms

### Uniform Types

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    // Numbers
    floatValue: { value: 1.5 },
    intValue: { value: 1 },

    // Vectors
    vec2Value: { value: new THREE.Vector2(1, 2) },
    vec3Value: { value: new THREE.Vector3(1, 2, 3) },
    vec4Value: { value: new THREE.Vector4(1, 2, 3, 4) },

    // Colors (converted to vec3)
    colorValue: { value: new THREE.Color(0xff0000) },

    // Matrices
    mat3Value: { value: new THREE.Matrix3() },
    mat4Value: { value: new THREE.Matrix4() },

    // Textures
    textureValue: { value: texture },
    cubeTextureValue: { value: cubeTexture },

    // Arrays
    floatArray: { value: [1.0, 2.0, 3.0] },
    vec3Array: {
      value: [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)],
    },
  },
});
```

### GLSL Declarations

```glsl
// In shader
uniform float floatValue;
uniform int intValue;
uniform vec2 vec2Value;
uniform vec3 vec3Value;
uniform vec3 colorValue;    // Color becomes vec3
uniform vec4 vec4Value;
uniform mat3 mat3Value;
uniform mat4 mat4Value;
uniform sampler2D textureValue;
uniform samplerCube cubeTextureValue;
uniform float floatArray[3];
uniform vec3 vec3Array[2];
```

### Updating Uniforms

```javascript
// Direct assignment
material.uniforms.time.value = clock.getElapsedTime();

// Vector/Color updates
material.uniforms.position.value.set(x, y, z);
material.uniforms.color.value.setHSL(hue, 1, 0.5);

// Matrix updates
material.uniforms.matrix.value.copy(mesh.matrixWorld);
```

## Varyings

Pass data from vertex to fragment shader.

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Use interpolated values
      gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
    }
  `,
});
```

## Common Shader Patterns

### Texture Sampling

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    map: { value: texture },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(map, vUv);
      gl_FragColor = texColor;
    }
  `,
});
```

### Vertex Displacement

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    amplitude: { value: 0.5 },
  },
  vertexShader: `
    uniform float time;
    uniform float amplitude;

    void main() {
      vec3 pos = position;

      // Wave displacement
      pos.z += sin(pos.x * 5.0 + time) * amplitude;
      pos.z += sin(pos.y * 5.0 + time) * amplitude;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
    }
  `,
});
```

### Fresnel Effect

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      // cameraPosition is auto-provided by ShaderMaterial
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);

      vec3 baseColor = vec3(0.0, 0.0, 0.5);
      vec3 fresnelColor = vec3(0.5, 0.8, 1.0);

      gl_FragColor = vec4(mix(baseColor, fresnelColor, fresnel), 1.0);
    }
  `,
});
```

### Noise-Based Effects

```glsl
// Simple noise function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Value noise
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Usage
float n = noise(vUv * 10.0 + time);
```

### Gradient

```glsl
// Linear gradient
vec3 color = mix(colorA, colorB, vUv.y);

// Radial gradient
float dist = distance(vUv, vec2(0.5));
vec3 color = mix(centerColor, edgeColor, dist * 2.0);

// Smooth gradient with custom curve
float t = smoothstep(0.0, 1.0, vUv.y);
vec3 color = mix(colorA, colorB, t);
```

### Rim Lighting

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 viewDir = normalize(-vViewPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
      rim = pow(rim, 4.0);

      vec3 baseColor = vec3(0.2, 0.2, 0.8);
      vec3 rimColor = vec3(1.0, 0.5, 0.0);

      gl_FragColor = vec4(baseColor + rimColor * rim, 1.0);
    }
  `,
});
```

### Dissolve Effect

```glsl
uniform float progress;
uniform sampler2D noiseMap;

void main() {
  float noise = texture2D(noiseMap, vUv).r;

  if (noise < progress) {
    discard;
  }

  // Edge glow
  float edge = smoothstep(progress, progress + 0.1, noise);
  vec3 edgeColor = vec3(1.0, 0.5, 0.0);
  vec3 baseColor = vec3(0.5);

  gl_FragColor = vec4(mix(edgeColor, baseColor, edge), 1.0);
}
```

## Extending Built-in Materials

### onBeforeCompile

Modify existing material shaders.

```javascript
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

material.onBeforeCompile = (shader) => {
  // Add custom uniform
  shader.uniforms.time = { value: 0 };

  // Store reference for updates
  material.userData.shader = shader;

  // Modify vertex shader
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    transformed.y += sin(position.x * 10.0 + time) * 0.1;
    `,
  );

  // Add uniform declaration
  shader.vertexShader = "uniform float time;\n" + shader.vertexShader;
};

// Update in animation loop
if (material.userData.shader) {
  material.userData.shader.uniforms.time.value = clock.getElapsedTime();
}
```

### Common Injection Points

```javascript
// Vertex shader chunks
"#include <begin_vertex>"; // After position is calculated
"#include <project_vertex>"; // After gl_Position
"#include <beginnormal_vertex>"; // Normal calculation start

// Fragment shader chunks
"#include <color_fragment>"; // After diffuse color
"#include <output_fragment>"; // Final output
"#include <fog_fragment>"; // After fog applied
```

## GLSL Built-in Functions

### Math Functions

```glsl
// Basic
abs(x), sign(x), floor(x), ceil(x), fract(x)
mod(x, y), min(x, y), max(x, y), clamp(x, min, max)
mix(a, b, t), step(edge, x), smoothstep(edge0, edge1, x)

// Trigonometry
sin(x), cos(x), tan(x)
asin(x), acos(x), atan(y, x), atan(x)
radians(degrees), degrees(radians)

// Exponential
pow(x, y), exp(x), log(x), exp2(x), log2(x)
sqrt(x), inversesqrt(x)
```

### Vector Functions

```glsl
// Length and distance
length(v), distance(p0, p1), dot(x, y), cross(x, y)

// Normalization
normalize(v)

// Reflection and refraction
reflect(I, N), refract(I, N, eta)

// Component-wise
lessThan(x, y), lessThanEqual(x, y)
greaterThan(x, y), greaterThanEqual(x, y)
equal(x, y), notEqual(x, y)
any(bvec), all(bvec)
```

### Texture Functions

```glsl
// GLSL 1.0 (default) - use texture2D/textureCube
texture2D(sampler, coord)
texture2D(sampler, coord, bias)
textureCube(sampler, coord)

// GLSL 3.0 (glslVersion: THREE.GLSL3) - use texture()
// texture(sampler, coord) replaces texture2D/textureCube
// Also use: out vec4 fragColor instead of gl_FragColor

// Texture size (GLSL 1.30+)
textureSize(sampler, lod)
```

## Common Material Properties

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    /* ... */
  },
  vertexShader: "/* ... */",
  fragmentShader: "/* ... */",

  // Rendering
  transparent: true,
  opacity: 1.0,
  side: THREE.DoubleSide,
  depthTest: true,
  depthWrite: true,

  // Blending
  blending: THREE.NormalBlending,
  // AdditiveBlending, SubtractiveBlending, MultiplyBlending

  // Wireframe
  wireframe: false,
  wireframeLinewidth: 1, // Note: >1 has no effect on most platforms (WebGL limitation)

  // Extensions
  extensions: {
    derivatives: true, // For fwidth, dFdx, dFdy
    fragDepth: true, // gl_FragDepth
    drawBuffers: true, // Multiple render targets
    shaderTextureLOD: true, // texture2DLod
  },

  // GLSL version
  glslVersion: THREE.GLSL3, // For WebGL2 features
});
```

## Shader Includes

### Using Three.js Shader Chunks

```javascript
import { ShaderChunk } from "three";

const fragmentShader = `
  ${ShaderChunk.common}
  ${ShaderChunk.packing}

  uniform sampler2D depthTexture;
  varying vec2 vUv;

  void main() {
    float depth = texture2D(depthTexture, vUv).r;
    float linearDepth = perspectiveDepthToViewZ(depth, 0.1, 1000.0);
    gl_FragColor = vec4(vec3(-linearDepth / 100.0), 1.0);
  }
`;
```

### External Shader Files

```javascript
// With vite/webpack
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
});
```

## Instanced Shaders

```javascript
// Instanced attribute
const offsets = new Float32Array(instanceCount * 3);
// Fill offsets...
geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));

const material = new THREE.ShaderMaterial({
  vertexShader: `
    attribute vec3 offset;

    void main() {
      vec3 pos = position + offset;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
```

## Debugging Shaders

```javascript
// Check for compile errors
material.onBeforeCompile = (shader) => {
  console.log("Vertex Shader:", shader.vertexShader);
  console.log("Fragment Shader:", shader.fragmentShader);
};

// Visual debugging
fragmentShader: `
  void main() {
    // Debug UV
    gl_FragColor = vec4(vUv, 0.0, 1.0);

    // Debug normals
    gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);

    // Debug position
    gl_FragColor = vec4(vPosition * 0.1 + 0.5, 1.0);
  }
`;

// Check WebGL errors
renderer.debug.checkShaderErrors = true;
```

## Performance Tips

1. **Minimize uniforms**: Group related values into vectors
2. **Avoid conditionals**: Use mix/step instead of if/else
3. **Precalculate**: Move calculations to JS when possible
4. **Use textures**: For complex functions, use lookup tables
5. **Limit overdraw**: Avoid transparent objects when possible

```glsl
// Instead of:
if (value > 0.5) {
  color = colorA;
} else {
  color = colorB;
}

// Use:
color = mix(colorB, colorA, step(0.5, value));
```

## See Also

- `threejs-materials` - Built-in material types
- `threejs-postprocessing` - Full-screen shader effects
- `threejs-textures` - Texture sampling in shaders

### 18 geometry

# Three.js Geometry

## Overview

Three.js geometry creation - built-in shapes, BufferGeometry, custom geometry, instancing. Use when creating 3D shapes, working with vertices, building custom meshes, or optimizing with instanced rendering.

## Quick Start

```javascript
import * as THREE from "three";

// Built-in geometry
const box = new THREE.BoxGeometry(1, 1, 1);
const sphere = new THREE.SphereGeometry(0.5, 32, 32);
const plane = new THREE.PlaneGeometry(10, 10);

// Create mesh
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(box, material);
scene.add(mesh);
```

## Built-in Geometries

### Basic Shapes

```javascript
// Box - width, height, depth, widthSegments, heightSegments, depthSegments
new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

// Sphere - radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
new THREE.SphereGeometry(1, 32, 32);
new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI); // Full sphere
new THREE.SphereGeometry(1, 32, 32, 0, Math.PI); // Hemisphere

// Plane - width, height, widthSegments, heightSegments
new THREE.PlaneGeometry(10, 10, 1, 1);

// Circle - radius, segments, thetaStart, thetaLength
new THREE.CircleGeometry(1, 32);
new THREE.CircleGeometry(1, 32, 0, Math.PI); // Semicircle

// Cylinder - radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded
new THREE.CylinderGeometry(1, 1, 2, 32, 1, false);
new THREE.CylinderGeometry(0, 1, 2, 32); // Cone
new THREE.CylinderGeometry(1, 1, 2, 6); // Hexagonal prism

// Cone - radius, height, radialSegments, heightSegments, openEnded
new THREE.ConeGeometry(1, 2, 32, 1, false);

// Torus - radius, tube, radialSegments, tubularSegments, arc
new THREE.TorusGeometry(1, 0.4, 16, 100);

// TorusKnot - radius, tube, tubularSegments, radialSegments, p, q
new THREE.TorusKnotGeometry(1, 0.4, 100, 16, 2, 3);

// Ring - innerRadius, outerRadius, thetaSegments, phiSegments
new THREE.RingGeometry(0.5, 1, 32, 1);
```

### Advanced Shapes

```javascript
// Capsule - radius, length, capSegments, radialSegments
new THREE.CapsuleGeometry(0.5, 1, 4, 8);

// Dodecahedron - radius, detail
new THREE.DodecahedronGeometry(1, 0);

// Icosahedron - radius, detail (0 = 20 faces, higher = smoother)
new THREE.IcosahedronGeometry(1, 0);

// Octahedron - radius, detail
new THREE.OctahedronGeometry(1, 0);

// Tetrahedron - radius, detail
new THREE.TetrahedronGeometry(1, 0);

// Polyhedron - vertices, indices, radius, detail
const vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];
const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
new THREE.PolyhedronGeometry(vertices, indices, 1, 0);
```

### Path-Based Shapes

```javascript
// Lathe - points[], segments, phiStart, phiLength
const points = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.5, 0),
  new THREE.Vector2(0.5, 1),
  new THREE.Vector2(0, 1),
];
new THREE.LatheGeometry(points, 32);

// Extrude - shape, options
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(1, 0);
shape.lineTo(1, 1);
shape.lineTo(0, 1);
shape.lineTo(0, 0);

const extrudeSettings = {
  steps: 2,
  depth: 1,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.1,
  bevelSegments: 3,
};
new THREE.ExtrudeGeometry(shape, extrudeSettings);

// Tube - path, tubularSegments, radius, radialSegments, closed
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(1, 0, 0),
]);
new THREE.TubeGeometry(curve, 64, 0.2, 8, false);
```

### Text Geometry

```javascript
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const loader = new FontLoader();
loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const geometry = new TextGeometry("Hello", {
    font: font,
    size: 1,
    depth: 0.2, // Was 'height' in older versions
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5,
  });

  // Center text
  geometry.computeBoundingBox();
  geometry.center();

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

## BufferGeometry

The base class for all geometries. Stores data as typed arrays for GPU efficiency.

### Custom BufferGeometry

```javascript
const geometry = new THREE.BufferGeometry();

// Vertices (3 floats per vertex: x, y, z)
const vertices = new Float32Array([
  -1,
  -1,
  0, // vertex 0
  1,
  -1,
  0, // vertex 1
  1,
  1,
  0, // vertex 2
  -1,
  1,
  0, // vertex 3
]);
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// Indices (for indexed geometry - reuse vertices)
const indices = new Uint16Array([
  0,
  1,
  2, // triangle 1
  0,
  2,
  3, // triangle 2
]);
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// Normals (required for lighting)
const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

// UVs (for texturing)
const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

// Colors (per-vertex colors)
const colors = new Float32Array([
  1,
  0,
  0, // red
  0,
  1,
  0, // green
  0,
  0,
  1, // blue
  1,
  1,
  0, // yellow
]);
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
// Use with: material.vertexColors = true
```

### BufferAttribute Types

```javascript
// Common attribute types
new THREE.BufferAttribute(array, itemSize);

// Typed array options
new Float32Array(count * itemSize); // Positions, normals, UVs
new Uint16Array(count); // Indices (up to 65535 vertices)
new Uint32Array(count); // Indices (larger meshes)
new Uint8Array(count * itemSize); // Colors (0-255 range)

// Item sizes
// Position: 3 (x, y, z)
// Normal: 3 (x, y, z)
// UV: 2 (u, v)
// Color: 3 (r, g, b) or 4 (r, g, b, a)
// Index: 1
```

### Modifying BufferGeometry

```javascript
const positions = geometry.attributes.position;

// Modify vertex
positions.setXYZ(index, x, y, z);

// Access vertex
const x = positions.getX(index);
const y = positions.getY(index);
const z = positions.getZ(index);

// Flag for GPU update
positions.needsUpdate = true;

// Recompute normals after position changes
geometry.computeVertexNormals();

// Recompute bounding box/sphere after changes
geometry.computeBoundingBox();
geometry.computeBoundingSphere();
```

### Interleaved Buffers (Advanced)

```javascript
// More efficient memory layout for large meshes
const interleavedBuffer = new THREE.InterleavedBuffer(
  new Float32Array([
    // pos.x, pos.y, pos.z, uv.u, uv.v (repeated per vertex)
    -1, -1, 0, 0, 0, 1, -1, 0, 1, 0, 1, 1, 0, 1, 1, -1, 1, 0, 0, 1,
  ]),
  5, // stride (floats per vertex)
);

geometry.setAttribute(
  "position",
  new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0),
); // size 3, offset 0
geometry.setAttribute(
  "uv",
  new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3),
); // size 2, offset 3
```

## EdgesGeometry & WireframeGeometry

```javascript
// Edge lines (only hard edges)
const edges = new THREE.EdgesGeometry(boxGeometry, 15); // 15 = threshold angle
const edgeMesh = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff }),
);

// Wireframe (all triangles)
const wireframe = new THREE.WireframeGeometry(boxGeometry);
const wireMesh = new THREE.LineSegments(
  wireframe,
  new THREE.LineBasicMaterial({ color: 0xffffff }),
);
```

## Points

```javascript
// Create point cloud
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(1000 * 3);

for (let i = 0; i < 1000; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // Size decreases with distance
  color: 0xffffff,
});

const points = new THREE.Points(geometry, material);
scene.add(points);
```

## Lines

```javascript
// Line (connected points)
const points = [
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(1, 0, 0),
];
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(
  geometry,
  new THREE.LineBasicMaterial({ color: 0xff0000 }),
);

// LineLoop (closed loop)
const loop = new THREE.LineLoop(geometry, material);

// LineSegments (pairs of points)
const segmentsGeometry = new THREE.BufferGeometry();
segmentsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    new Float32Array([
      -1,
      0,
      0,
      0,
      1,
      0, // segment 1
      0,
      1,
      0,
      1,
      0,
      0, // segment 2
    ]),
    3,
  ),
);
const segments = new THREE.LineSegments(segmentsGeometry, material);
```

## InstancedMesh

Efficiently render many copies of the same geometry.

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const count = 1000;

const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// Set transforms for each instance
const dummy = new THREE.Object3D();
const matrix = new THREE.Matrix4();

for (let i = 0; i < count; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
  );
  dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  dummy.scale.setScalar(0.5 + Math.random());
  dummy.updateMatrix();

  instancedMesh.setMatrixAt(i, dummy.matrix);
}

// Flag for GPU update
instancedMesh.instanceMatrix.needsUpdate = true;

// Optional: per-instance colors
instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(
  new Float32Array(count * 3),
  3,
);
for (let i = 0; i < count; i++) {
  instancedMesh.setColorAt(
    i,
    new THREE.Color(Math.random(), Math.random(), Math.random()),
  );
}
instancedMesh.instanceColor.needsUpdate = true;

scene.add(instancedMesh);
```

### Update Instance at Runtime

```javascript
// Update single instance
const matrix = new THREE.Matrix4();
instancedMesh.getMatrixAt(index, matrix);
// Modify matrix...
instancedMesh.setMatrixAt(index, matrix);
instancedMesh.instanceMatrix.needsUpdate = true;

// Raycasting with instanced mesh
const intersects = raycaster.intersectObject(instancedMesh);
if (intersects.length > 0) {
  const instanceId = intersects[0].instanceId;
}
```

## InstancedBufferGeometry (Advanced)

For custom per-instance attributes beyond transform/color.

```javascript
const geometry = new THREE.InstancedBufferGeometry();
geometry.copy(new THREE.BoxGeometry(1, 1, 1));

// Add per-instance attribute
const offsets = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  offsets[i * 3] = Math.random() * 10;
  offsets[i * 3 + 1] = Math.random() * 10;
  offsets[i * 3 + 2] = Math.random() * 10;
}
geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));

// Use in shader
// attribute vec3 offset;
// vec3 transformed = position + offset;
```

## Geometry Utilities

```javascript
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Merge geometries (must have same attributes)
const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2, geo3]);

// Merge with groups (for multi-material)
const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2], true);

// Compute tangents (required for normal maps)
BufferGeometryUtils.computeTangents(geometry);

// Interleave attributes for better performance
const interleaved = BufferGeometryUtils.interleaveAttributes([
  geometry.attributes.position,
  geometry.attributes.normal,
  geometry.attributes.uv,
]);
```

## Common Patterns

### Center Geometry

```javascript
geometry.computeBoundingBox();
geometry.center(); // Move vertices so center is at origin
```

### Scale to Fit

```javascript
geometry.computeBoundingBox();
const size = new THREE.Vector3();
geometry.boundingBox.getSize(size);
const maxDim = Math.max(size.x, size.y, size.z);
geometry.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
```

### Clone and Transform

```javascript
const clone = geometry.clone();
clone.rotateX(Math.PI / 2);
clone.translate(0, 1, 0);
clone.scale(2, 2, 2);
```

### Morph Targets

```javascript
// Base geometry
const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

// Create morph target
const morphPositions = geometry.attributes.position.array.slice();
for (let i = 0; i < morphPositions.length; i += 3) {
  morphPositions[i] *= 2; // Scale X
  morphPositions[i + 1] *= 0.5; // Squash Y
}

geometry.morphAttributes.position = [
  new THREE.BufferAttribute(new Float32Array(morphPositions), 3),
];

const mesh = new THREE.Mesh(geometry, material);
mesh.morphTargetInfluences[0] = 0.5; // 50% blend
```

## Performance Tips

1. **Use indexed geometry**: Reuse vertices with indices
2. **Merge static meshes**: Reduce draw calls with `mergeGeometries`
3. **Use InstancedMesh**: For many identical objects
4. **Choose appropriate segment counts**: More segments = smoother but slower
5. **Dispose unused geometry**: `geometry.dispose()`

```javascript
// Good segment counts for common uses
new THREE.SphereGeometry(1, 32, 32); // Good quality
new THREE.SphereGeometry(1, 64, 64); // High quality
new THREE.SphereGeometry(1, 16, 16); // Performance mode

// Dispose when done
geometry.dispose();
```

## See Also

- `threejs-fundamentals` - Scene setup and Object3D
- `threejs-materials` - Material types for meshes
- `threejs-shaders` - Custom vertex manipulation



> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
