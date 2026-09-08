import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Manifest, Part, SimState } from "./types";

type Props = {
  manifest: Manifest;
  explode?: number;
  selected?: Part | null;
  onSelect?: (part: Part | null) => void;
  simulation?: SimState | null;
  resetKey?: number;
  isolate?: boolean;
};

type Entry = {
  object: THREE.Mesh;
  part: Part;
  home: THREE.Vector3;
  offset: THREE.Vector3;
  color: THREE.Color;
};

export default function RobotViewer(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reset = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!host.current || !props.manifest.parts.length) return;
    const el = host.current;
    let alive = true;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      setError(
        "WebGL is unavailable. Download the CAD pack or open the assembly drawings below.",
      );
      setLoading(false);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive Microduck assembly from original CAD geometry",
    );
    renderer.domElement.setAttribute("role", "img");
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#202426");
    scene.fog = new THREE.Fog("#202426", 800, 1700);
    const camera = new THREE.PerspectiveCamera(34, 1, 1, 2500);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 130;
    controls.maxDistance = 1200;
    controls.maxPolarAngle = Math.PI * 0.85;
    const resetCamera = () => {
      camera.position.set(440, 220, 340);
      controls.target.set(0, 145, 0);
      controls.update();
    };
    reset.current = resetCamera;
    resetCamera();
    scene.add(new THREE.HemisphereLight("#e8eee4", "#606365", 1.8));
    const key = new THREE.DirectionalLight("#fff5e1", 2.8);
    key.position.set(280, 520, 400);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -360;
    key.shadow.camera.right = 360;
    key.shadow.camera.top = 360;
    key.shadow.camera.bottom = -360;
    key.shadow.camera.near = 10;
    key.shadow.camera.far = 1100;
    key.shadow.normalBias = 0.35;
    key.target.position.y = 110;
    scene.add(key, key.target);
    const rim = new THREE.DirectionalLight("#b8d9ff", 2.3);
    rim.position.set(-250, 220, -250);
    scene.add(rim);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(2400, 2400),
      new THREE.MeshStandardMaterial({ color: "#252b2c", roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -1;
    scene.add(floor);
    const grid = new THREE.GridHelper(1600, 64, "#52605c", "#3e4947");
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    scene.add(grid);
    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    scene.add(root);
    const entries: Entry[] = [];
    const bodyObjects = new Map<string, THREE.Object3D>();
    const bodyHomes = new Map<
      string,
      { position: THREE.Vector3; quaternion: THREE.Quaternion }
    >();
    const partMap = new Map(props.manifest.parts.map((p) => [p.id, p]));
    const allBodies = new Set(
      props.manifest.bodies.map((b) => `body_${b.name}`),
    );
    const loader = new GLTFLoader();
    let loadedScene: THREE.Group | null = null;
    loader.load(
      "/models/microduck.glb",
      (gltf) => {
        if (!alive) {
          dispose(gltf.scene);
          return;
        }
        loadedScene = gltf.scene;
        root.add(gltf.scene);
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((object) => {
          if (allBodies.has(object.name)) {
            const name = object.name.slice(5);
            bodyObjects.set(name, object);
            bodyHomes.set(name, {
              position: object.position.clone(),
              quaternion: object.quaternion.clone(),
            });
          }
          if (!(object instanceof THREE.Mesh)) return;
          let node: THREE.Object3D | null = object;
          while (node && !partMap.has(node.name)) node = node.parent;
          const part = node && partMap.get(node.name);
          if (!part) return;
          const material = (
            Array.isArray(object.material)
              ? object.material[0]
              : object.material
          ).clone() as THREE.MeshStandardMaterial;
          material.roughness = part.kind === "Hardware" ? 0.38 : 0.64;
          material.metalness = part.kind === "Hardware" ? 0.45 : 0.04;
          object.material = material;
          object.castShadow = true;
          object.receiveShadow = true;
          object.userData.part = part;
          // Explosion is a visual transform only; derive it from each instance's actual centre.
          const centre = new THREE.Vector3(...part.center);
          const direction = centre.clone().sub(new THREE.Vector3(0, 0, 140));
          if (direction.lengthSq() < 0.001) direction.set(1, 0, 0);
          direction.normalize().multiplyScalar(58);
          if (part.group === "Head & neck") direction.z += 38;
          if (part.group === "Left leg") {
            direction.y += 48;
            direction.z -= 10;
          }
          if (part.group === "Right leg") {
            direction.y -= 48;
            direction.z -= 10;
          }
          const parentRotation = new THREE.Quaternion();
          object.parent!.getWorldQuaternion(parentRotation);
          direction
            .applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
            .applyQuaternion(parentRotation.invert());
          entries.push({
            object,
            part,
            home: object.position.clone(),
            offset: direction,
            color: material.color.clone(),
          });
        });
        setLoading(false);
      },
      undefined,
      () => {
        if (alive) {
          setLoading(false);
          setError(
            "The CAD model could not be loaded. Rebuild it with scripts/export_models.py.",
          );
        }
      },
    );

    const resize = () => {
      if (!el.clientWidth || !el.clientHeight) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const mouseDown = new THREE.Vector2();
    const down = (event: PointerEvent) =>
      mouseDown.set(event.clientX, event.clientY);
    const up = (event: PointerEvent) => {
      if (
        mouseDown.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) >
        5
      )
        return;
      const box = renderer.domElement.getBoundingClientRect();
      const cursor = new THREE.Vector2(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        1 - ((event.clientY - box.top) / box.height) * 2,
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(cursor, camera);
      const hits = ray.intersectObjects(
        entries.filter((x) => x.object.visible).map((x) => x.object),
        false,
      );
      latest.current.onSelect?.(hits[0]?.object.userData.part ?? null);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    let frame = 0;
    let previousBase = new THREE.Vector3();
    let simulationActive = false;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const { explode = 0, selected, simulation, isolate } = latest.current;
      const sim = simulation && simulation.bodies.length ? simulation : null;
      if (sim) {
        sim.bodies.forEach((name, i) => {
          const body = bodyObjects.get(name);
          if (!body) return;
          body.position.set(
            ...(sim.positions[i].map((v) => v * 1000) as [
              number,
              number,
              number,
            ]),
          );
          const q = sim.quaternions[i];
          body.quaternion.set(q[1], q[2], q[3], q[0]);
        });
        const base = new THREE.Vector3(
          sim.basePosition[0] * 1000,
          0,
          -sim.basePosition[1] * 1000,
        );
        const delta = base.clone().sub(previousBase);
        camera.position.add(delta);
        controls.target.add(delta);
        previousBase.copy(base);
        floor.position.x = base.x;
        floor.position.z = base.z;
        grid.position.x = Math.round(base.x / 25) * 25;
        grid.position.z = Math.round(base.z / 25) * 25;
        key.position.set(base.x + 280, 520, base.z + 400);
        key.target.position.set(base.x, 110, base.z);
        simulationActive = true;
      } else if (simulationActive) {
        bodyHomes.forEach((home, name) => {
          bodyObjects.get(name)!.position.copy(home.position);
          bodyObjects.get(name)!.quaternion.copy(home.quaternion);
        });
        camera.position.sub(previousBase);
        controls.target.sub(previousBase);
        previousBase.set(0, 0, 0);
        simulationActive = false;
      }
      for (const entry of entries) {
        entry.object.position
          .copy(entry.home)
          .addScaledVector(entry.offset, sim ? 0 : explode);
        const material = entry.object.material as THREE.MeshStandardMaterial;
        const active = selected?.id === entry.part.id;
        material.emissive.set(active ? "#95bc4f" : "#000000");
        material.emissiveIntensity = active ? 0.45 : 0;
        entry.object.visible = !isolate || !selected || active;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    loop();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      if (loadedScene) dispose(loadedScene);
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
      reset.current = null;
    };
  }, [props.manifest]);
  useEffect(() => {
    reset.current?.();
  }, [props.resetKey]);

  return (
    <div className="assembly-canvas" ref={host} data-testid="robot-viewer">
      <div className="canvas-label top-left">
        <span className="status-dot" />{" "}
        {props.simulation
          ? "MUJOCO / LIVE PHYSICS"
          : "ORIGINAL GEOMETRY / HOME POSE"}
      </div>
      {loading && !error && (
        <div className="model-loading">
          <span className="loading-spinner" /> Loading 70 source parts…
        </div>
      )}
      {error && (
        <div className="model-error" role="alert">
          {error}
          <a href="/reference/assembly-hero.png">Open assembly drawing ↗</a>
        </div>
      )}
      <div className="canvas-label bottom-right">
        DRAG TO ORBIT · SCROLL TO ZOOM
      </div>
      <div className="axis">
        <span>Z</span>
        <i />
        <span>Y</span>
        <i />
        <span>X</span>
      </div>
    </div>
  );
}

function dispose(root: THREE.Object3D) {
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).forEach((m) => m.dispose());
    }
  });
}
