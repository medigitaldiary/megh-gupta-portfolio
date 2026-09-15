"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CERTS, drawCertToCanvas } from "@/lib/paper-art";

const VERTEX = /* glsl */ `
  uniform float uBend;
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  // Arc-length-conserving bend around the y-axis: map planar x to angle.
  void main() {
    vUv = uv;
    vec3 p = position;

    float k = uBend;                       // curvature (1/m); 0 = flat
    float breathe = sin(uTime * 0.6 + p.y * 1.4) * 0.008 * (1.0 - uHover * 0.5);
    p.z += breathe;

    if (abs(k) > 1e-4) {
      float r = 1.0 / k;                   // bend radius
      float a = p.x * k;                   // angle from arc length
      float x = sin(a) * r;
      float z = (1.0 - cos(a)) * r + p.z;
      p = vec3(x, p.y, z);
    }

    // Rebuild normal from the analytical bend (points outward from cylinder axis).
    vec3 n;
    if (abs(k) > 1e-4) {
      float a = position.x * k;
      n = normalize(vec3(sin(a), 0.0, cos(a)));
    } else {
      n = vec3(0.0, 0.0, 1.0);
    }

    vec4 wp = modelMatrix * vec4(p, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * n);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform vec3 uTint;
  uniform float uHover;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vec4 art = texture2D(uMap, vUv);

    // Fresnel — bright rim, translucent center
    float fres = pow(1.0 - clamp(dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0), 2.2);

    // Paper fiber grain
    float grain = fract(sin(dot(vUv * 900.0, vec2(12.9898, 78.233))) * 43758.5453);
    grain = (grain - 0.5) * 0.04;

    // Soft directional sheen that shifts with time + hover
    vec2 sheenUv = vUv - 0.5;
    float sheen = smoothstep(0.5, 0.0, abs(sheenUv.x + sheenUv.y * 0.4 + sin(uTime * 0.4) * 0.15));
    sheen *= 0.18 + uHover * 0.25;

    vec3 base = mix(uTint, art.rgb, art.a);
    base += grain;
    base += vec3(sheen);
    base += vec3(fres) * 0.35;

    // Translucent alpha: rim opaque, center a touch see-through
    float alpha = mix(0.82, 0.98, fres);
    alpha = max(alpha, art.a * 0.98);
    alpha *= uOpacity;

    gl_FragColor = vec4(base, alpha);
  }
`;

function certTexture(cert: (typeof CERTS)[number]): THREE.CanvasTexture {
  const c = drawCertToCanvas(cert);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function ThreeDPaper({
  className,
  background = false,
}: {
  className?: string;
  background?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";

    const geometry = new THREE.PlaneGeometry(1.4, 1.96, 64, 64);
    const group = new THREE.Group();
    scene.add(group);

    const meshes: THREE.Mesh[] = [];
    const textures: THREE.CanvasTexture[] = [];

    // Background mode: spread wider so the middle stays clear for headline text.
    const spread = background ? 1.55 : 1.0;
    const positions: [number, number, number][] = [
      [-1.55 * spread, 0.55, 0.0],
      [1.55 * spread, 0.35, -0.2],
      [-1.35 * spread, -0.75, -0.1],
      [1.35 * spread, -0.55, 0.15],
    ];
    const rotations: [number, number, number][] = [
      [-0.05, 0.35, -0.08],
      [0.05, -0.35, 0.1],
      [-0.02, 0.28, 0.05],
      [0.03, -0.28, -0.07],
    ];

    CERTS.forEach((cert, i) => {
      const tex = certTexture(cert);
      textures.push(tex);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uMap: { value: tex },
          uTint: { value: new THREE.Vector3(...cert.tint) },
          uBend: { value: 0.55 + Math.random() * 0.25 },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uOpacity: { value: background ? 0.72 : 1.0 },
        },
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...positions[i]);
      mesh.rotation.set(...rotations[i]);
      mesh.userData = {
        homePos: mesh.position.clone(),
        homeRot: mesh.rotation.clone(),
        vel: new THREE.Vector2(0, 0),
      };
      group.add(mesh);
      meshes.push(mesh);
    });

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let hoveredIndex = -1;
    let draggingIndex = -1;
    const dragLast = new THREE.Vector2(0, 0);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Scale group so all four cards fit on narrow viewports.
      const scale = Math.min(1, w / 900);
      group.scale.setScalar(0.9 * scale + 0.1);
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointerTarget.set(nx, ny);

      if (draggingIndex >= 0) {
        const dx = nx - dragLast.x;
        const dy = ny - dragLast.y;
        const mesh = meshes[draggingIndex];
        (mesh.userData.vel as THREE.Vector2).set(dx * 6, dy * 6);
        mesh.rotation.y += dx * 2.4;
        mesh.rotation.x += -dy * 2.0;
        dragLast.set(nx, ny);
        return;
      }

      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      hoveredIndex = hit ? meshes.indexOf(hit.object as THREE.Mesh) : -1;
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      if (hit) {
        draggingIndex = meshes.indexOf(hit.object as THREE.Mesh);
        dragLast.set(nx, ny);
        renderer.domElement.setPointerCapture(e.pointerId);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (draggingIndex >= 0) {
        try {
          renderer.domElement.releasePointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
        draggingIndex = -1;
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    // Visibility-aware pause
    const io = new IntersectionObserver(
      (entries) => {
        running = entries.some((e) => e.isIntersecting);
        if (running) {
          clock.start();
          loop();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(host);

    const loop = () => {
      if (!running) return;
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta() + 1 / 60, 0.05);

      // Ease pointer
      pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.08);

      // Group parallax
      const targetY = reduceMotion ? 0 : pointer.x * 0.35;
      const targetX = reduceMotion ? 0 : -pointer.y * 0.18;
      group.rotation.y += (targetY - group.rotation.y) * 0.06;
      group.rotation.x += (targetX - group.rotation.x) * 0.06;

      meshes.forEach((mesh, i) => {
        const u = mesh.material as THREE.ShaderMaterial;
        u.uniforms.uTime.value = t;

        // Hover lift
        const wantHover = hoveredIndex === i || draggingIndex === i ? 1 : 0;
        u.uniforms.uHover.value +=
          (wantHover - u.uniforms.uHover.value) * (reduceMotion ? 1 : 0.15);

        // Inertial settling back to home rotation when not dragging
        if (draggingIndex !== i) {
          const home = mesh.userData.homeRot as THREE.Euler;
          mesh.rotation.x += (home.x - mesh.rotation.x) * 0.04;
          mesh.rotation.y += (home.y - mesh.rotation.y) * 0.04;
          mesh.rotation.z += (home.z - mesh.rotation.z) * 0.04;

          // Bleed off inertial velocity (accumulated during drag) into rotation
          const vel = mesh.userData.vel as THREE.Vector2;
          mesh.rotation.y += vel.x * dt;
          mesh.rotation.x += -vel.y * dt;
          vel.multiplyScalar(0.92);
        }

        // Subtle idle float
        if (!reduceMotion) {
          const home = mesh.userData.homePos as THREE.Vector3;
          mesh.position.y = home.y + Math.sin(t * 0.7 + i * 1.3) * 0.03;
          mesh.position.z = home.z + Math.sin(t * 0.5 + i * 0.7) * 0.04;
        }
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Context loss handling
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };
    const onRestored = () => {
      for (const t of textures) {
        t.needsUpdate = true;
      }
      loop();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      io.disconnect();
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onRestored,
      );
      for (const t of textures) {
        t.dispose();
      }
      for (const m of meshes) {
        (m.material as THREE.ShaderMaterial).dispose();
      }
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [background]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
