"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Cert = {
  eyebrow: string;
  title: string;
  subtitle: string;
  year: string;
  seal: string;
  tint: [number, number, number];
};

const CERTS: Cert[] = [
  {
    eyebrow: "Nocturne · Original Edition",
    title: "Under Construction",
    subtitle: "Portfolio in flight",
    year: "MMXXVI",
    seal: "N",
    tint: [0.94, 0.93, 0.88],
  },
  {
    eyebrow: "Site of the Year",
    title: "Editorial Craft",
    subtitle: "Awarded for restraint",
    year: "2026",
    seal: "★",
    tint: [0.98, 0.96, 0.9],
  },
  {
    eyebrow: "日本認識 · Recognition",
    title: "静けさ",
    subtitle: "Quiet interface, loud intent",
    year: "令和八年",
    seal: "印",
    tint: [0.96, 0.94, 0.92],
  },
  {
    eyebrow: "Certificate of Merit",
    title: "Megh Gupta",
    subtitle: "For shipping calm 0→1 fintech",
    year: "2026",
    seal: "M",
    tint: [0.99, 0.97, 0.92],
  },
];

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

    gl_FragColor = vec4(base, alpha);
  }
`;

function drawCertTexture(cert: Cert, size = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = Math.round(size * 1.4);
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const W = c.width;
  const H = c.height;

  // Paper base
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "rgba(250,250,247,1)");
  grd.addColorStop(1, "rgba(240,238,230,1)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Deckle-edge hairline border
  ctx.strokeStyle = "rgba(31,77,58,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeStyle = "rgba(31,77,58,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  // Eyebrow (mono, uppercase)
  ctx.fillStyle = "#1F4D3A";
  ctx.font = "600 26px 'JetBrains Mono', ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(cert.eyebrow.toUpperCase(), W / 2, 140);

  // Title (serif)
  ctx.fillStyle = "#111111";
  ctx.font = "72px 'Instrument Serif', 'Times New Roman', serif";
  ctx.fillText(cert.title, W / 2, 240);

  // Rule line
  ctx.strokeStyle = "rgba(17,17,17,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 120, 380);
  ctx.lineTo(W / 2 + 120, 380);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = "#555555";
  ctx.font = "italic 32px 'Instrument Serif', serif";
  ctx.fillText(cert.subtitle, W / 2, 420);

  // Seal — accent circle with glyph
  const seal = { x: W / 2, y: H * 0.66, r: 110 };
  ctx.beginPath();
  ctx.arc(seal.x, seal.y, seal.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(31,77,58,0.92)";
  ctx.fill();
  ctx.strokeStyle = "rgba(31,77,58,1)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(seal.x, seal.y, seal.r + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#FAFAF7";
  ctx.font = "96px 'Instrument Serif', serif";
  ctx.textBaseline = "middle";
  ctx.fillText(cert.seal, seal.x, seal.y + 4);

  // Footer meta
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#111111";
  ctx.font = "500 22px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText(cert.year, 120, H - 130);
  ctx.textAlign = "right";
  ctx.fillText("MEGH · GUPTA", W - 120, H - 130);

  // Signature line
  ctx.strokeStyle = "rgba(17,17,17,0.4)";
  ctx.beginPath();
  ctx.moveTo(120, H - 180);
  ctx.lineTo(W - 120, H - 180);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function ThreeDPaper({ className }: { className?: string }) {
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

    const positions: [number, number, number][] = [
      [-1.55, 0.55, 0.0],
      [1.55, 0.35, -0.2],
      [-1.35, -0.75, -0.1],
      [1.35, -0.55, 0.15],
    ];
    const rotations: [number, number, number][] = [
      [-0.05, 0.35, -0.08],
      [0.05, -0.35, 0.1],
      [-0.02, 0.28, 0.05],
      [0.03, -0.28, -0.07],
    ];

    CERTS.forEach((cert, i) => {
      const tex = drawCertTexture(cert);
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
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
