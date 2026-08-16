import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { CATEGORIES, LAYOUT, MAP_BOXES } from "./layout";
import { cssColorInt } from "./tokens";

// Toda cor da cena vem de um token CSS (ver o bloco --map-* em src/index.css).
// O getter adia a leitura para depois que a folha de estilo carregou.
const cor = (token) => ({ get: () => cssColorInt(token) });
const PALETTE = new Proxy(
  {
    blueWall: "--map-parede-azul",
    blueBand: "--map-faixa-azul",
    redColumn: "--map-coluna-vermelha",
    roofMetal: "--map-telha-metal",
    roofUnder: "--map-telha-sob",
    beam: "--map-viga",
    tile: "--map-ceramica",
    tileTop: "--map-ceramica-topo",
    mesh: "--map-tela-verde",
    floor: "--map-piso",
    forro: "--map-forro",
    vidro: "--map-vidro",
    gradeA: "--map-grade-a",
    gradeB: "--map-grade-b",
    branco: "--map-luz-branca",
    luzCeu: "--map-luz-ceu",
    luzChao: "--map-luz-chao",
    sol: "--map-luz-sol",
    preenchimento: "--map-luz-preenchimento",
    fundo: "--color-card",
    destaque: "--color-primary",
  },
  { get: (alvo, chave) => (chave in alvo ? cssColorInt(alvo[chave]) : undefined) }
);

export function createMapScene(canvas, container, { onSelect } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.fundo);
  scene.fog = new THREE.Fog(PALETTE.fundo, 55, 130);

  const perspCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
  perspCamera.position.set(0, 20, 30);

  const orthoCamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
  orthoCamera.up.set(0, 0, -1);

  const centerZ = LAYOUT.originZ + LAYOUT.wingDepth / 2;
  orthoCamera.position.set(0, 80, centerZ);
  orthoCamera.lookAt(0, 0, centerZ);

  let activeCamera = orthoCamera;
  let mode = "2d";

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.inset = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  const controls3d = new OrbitControls(perspCamera, renderer.domElement);
  controls3d.enableDamping = true;
  controls3d.dampingFactor = 0.06;
  controls3d.maxPolarAngle = Math.PI / 2.15;
  controls3d.minDistance = 8;
  controls3d.maxDistance = 80;
  controls3d.target.set(0, 1, 0);
  controls3d.enabled = false;

  const controls2d = new OrbitControls(orthoCamera, renderer.domElement);
  controls2d.enableDamping = true;
  controls2d.dampingFactor = 0.1;
  controls2d.enableRotate = false;
  controls2d.screenSpacePanning = true;
  controls2d.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
  controls2d.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
  controls2d.target.set(0, 0, centerZ);
  controls2d.enabled = true;

  let activeControls = controls2d;

  const gRoof = new THREE.Group();
  const gColumns = new THREE.Group();
  const gWalls = new THREE.Group();
  scene.add(gRoof, gColumns, gWalls);
  gRoof.visible = false;

  const stalls = [];
  const labels = [];
  const boxMeshes = [];

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const highlightMat = new THREE.MeshStandardMaterial({
    color: PALETTE.branco,
    emissive: PALETTE.destaque,
    emissiveIntensity: 0.45,
    metalness: 0.1,
    roughness: 0.4,
  });

  let selectedGroup = null;
  let selectedOriginals = [];
  let filterSeg = null;
  let running = true;

  function setupLights() {
    scene.add(new THREE.AmbientLight(PALETTE.branco, 0.65));
    scene.add(new THREE.HemisphereLight(PALETTE.luzCeu, PALETTE.luzChao, 0.5));

    const sun = new THREE.DirectionalLight(PALETTE.sol, 1.0);
    sun.position.set(22, 34, 16);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -38;
    sun.shadow.camera.right = 38;
    sun.shadow.camera.top = 38;
    sun.shadow.camera.bottom = -38;
    sun.shadow.bias = -0.0002;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(PALETTE.preenchimento, 0.3);
    fill.position.set(-18, 12, -12);
    scene.add(fill);
  }

  function createFloor() {
    const { totalWidth, totalDepth } = LAYOUT;
    const pad = 5;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(totalWidth + pad * 2, totalDepth + pad * 2),
      new THREE.MeshStandardMaterial({ color: PALETTE.floor, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const span = Math.max(totalWidth, totalDepth) + pad * 2;
    const grid = new THREE.GridHelper(span, Math.ceil(span / 2), PALETTE.gradeA, PALETTE.gradeB);
    grid.position.y = 0.01;
    scene.add(grid);
  }

  function createStructure() {
    const { totalWidth, wingWidth, aisleW, originX, originZ, wingDepth } = LAYOUT;

    const pad = 1.4;
    const footW = totalWidth + pad * 2;
    const footD = wingDepth + pad * 2;
    const cz = originZ - pad + footD / 2;

    const wallMat = new THREE.MeshStandardMaterial({ color: PALETTE.blueWall, roughness: 0.7 });
    const bandMat = new THREE.MeshStandardMaterial({ color: PALETTE.blueBand, roughness: 0.7 });
    const wallH = 0.95;
    const bandH = 0.28;

    function wall(w, d, x, z) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), wallMat);
      base.position.set(x, wallH / 2, z);
      base.castShadow = true;
      base.receiveShadow = true;
      gWalls.add(base);

      const band = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, bandH, d + 0.02), bandMat);
      band.position.set(x, bandH / 2, z);
      gWalls.add(band);
    }

    wall(footW, 0.3, 0, cz - footD / 2);
    wall(footW, 0.3, 0, cz + footD / 2);
    wall(0.3, footD, -footW / 2, cz);
    wall(0.3, footD, footW / 2, cz);

    const colMat = new THREE.MeshStandardMaterial({ color: PALETTE.redColumn, roughness: 0.6 });
    const colH = 4.2;
    const linesX = [
      originX - 0.2,
      originX + wingWidth + 0.2,
      originX + wingWidth + aisleW - 0.2,
      originX + totalWidth + 0.2,
    ];
    const colRows = 6;
    linesX.forEach((cx) => {
      for (let i = 0; i <= colRows; i++) {
        const z = originZ + (i / colRows) * wingDepth;
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.4, colH, 0.4), colMat);
        col.position.set(cx, colH / 2, z);
        col.castShadow = true;
        gColumns.add(col);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.55), colMat);
        cap.position.set(cx, colH, z);
        gColumns.add(cap);
      }
    });

    const beamMat = new THREE.MeshStandardMaterial({
      color: PALETTE.beam,
      roughness: 0.7,
      metalness: 0.2,
    });
    for (let i = 0; i <= colRows; i++) {
      const z = originZ + (i / colRows) * wingDepth;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(footW, 0.18, 0.18), beamMat);
      beam.position.set(0, colH + 0.05, z);
      gRoof.add(beam);
    }

    const roofMat = new THREE.MeshStandardMaterial({
      color: PALETTE.roofMetal,
      roughness: 0.5,
      metalness: 0.45,
      side: THREE.DoubleSide,
    });
    const roofUnderMat = new THREE.MeshStandardMaterial({
      color: PALETTE.roofUnder,
      roughness: 0.7,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });

    const roofW = footW + 1.4;
    const roofD = footD + 1.4;

    const roof = new THREE.Mesh(new THREE.BoxGeometry(roofW, 0.12, roofD), roofMat);
    roof.position.set(0, colH + 0.9, cz);
    roof.rotation.z = 0.06;
    roof.castShadow = true;
    gRoof.add(roof);

    const roofUnder = new THREE.Mesh(
      new THREE.BoxGeometry(roofW - 0.1, 0.02, roofD - 0.1),
      roofUnderMat
    );
    roofUnder.position.set(0, colH + 0.83, cz);
    roofUnder.rotation.z = 0.06;
    gRoof.add(roofUnder);

    const ribMat = new THREE.MeshStandardMaterial({
      color: PALETTE.vidro,
      roughness: 0.45,
      metalness: 0.5,
    });
    const ribCount = 26;
    for (let i = 0; i < ribCount; i++) {
      const t = i / (ribCount - 1);
      const x = -roofW / 2 + t * roofW;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, roofD), ribMat);
      rib.position.set(x, colH + 0.97 + x * 0.06, cz);
      rib.rotation.z = 0.06;
      gRoof.add(rib);
    }

    const aisleCenterX = originX + wingWidth + aisleW / 2;
    const aisle = new THREE.Mesh(
      new THREE.PlaneGeometry(aisleW, wingDepth),
      new THREE.MeshStandardMaterial({
        color: PALETTE.blueBand,
        roughness: 0.6,
        transparent: true,
        opacity: 0.12,
      })
    );
    aisle.rotation.x = -Math.PI / 2;
    aisle.position.set(aisleCenterX, 0.02, originZ + wingDepth / 2);
    scene.add(aisle);

    createEntrance(0, cz + footD / 2, "Entrada · você está aqui");
  }

  function createEntrance(x, z, text) {
    const div = document.createElement("div");
    div.className = "map-label entrance";
    div.textContent = text;
    const obj = new CSS2DObject(div);
    obj.position.set(x, 2.6, z);
    scene.add(obj);
    labels.push(obj);
  }

  function createStall(box) {
    const group = new THREE.Group();
    const { w, d, h } = box.size;
    const cat = CATEGORIES[box.category];
    const counterH = 1.0;

    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(w, counterH, d),
      new THREE.MeshStandardMaterial({ color: PALETTE.tile, roughness: 0.55 })
    );
    counter.position.y = counterH / 2;
    counter.castShadow = true;
    counter.receiveShadow = true;
    group.add(counter);

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.06, 0.08, d + 0.06),
      new THREE.MeshStandardMaterial({ color: PALETTE.tileTop, roughness: 0.4 })
    );
    top.position.y = counterH + 0.04;
    top.castShadow = true;
    group.add(top);

    const shutter = new THREE.Mesh(
      new THREE.BoxGeometry(w, h - counterH, 0.08),
      new THREE.MeshStandardMaterial({ color: cat.color, roughness: 0.5, metalness: 0.15 })
    );
    shutter.position.set(0, counterH + (h - counterH) / 2, -d / 2 + 0.05);
    shutter.castShadow = true;
    group.add(shutter);

    const meshMat = new THREE.MeshStandardMaterial({
      color: PALETTE.mesh,
      roughness: 0.6,
      transparent: true,
      opacity: 0.55,
    });
    [-1, 1].forEach((side) => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.05, h - counterH, d), meshMat);
      panel.position.set(side * (w / 2 - 0.03), counterH + (h - counterH) / 2, 0);
      group.add(panel);
    });

    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.12, 0.04, 0.55),
      new THREE.MeshStandardMaterial({ color: PALETTE.forro, roughness: 0.6 })
    );
    awning.position.set(0, h - 0.1, d / 2 + 0.2);
    awning.rotation.x = -0.22;
    group.add(awning);

    group.position.set(box.position.x, 0, box.position.z);
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.box = box;
        child.userData.group = group;
        boxMeshes.push(child);
      }
    });
    group.userData.box = box;

    const labelDiv = document.createElement("div");
    labelDiv.className = "map-label";
    labelDiv.textContent = box.number;
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, h + 0.3, 0);
    group.add(label);
    labels.push(label);

    scene.add(group);
    stalls.push({ group, box, label });
  }

  function applyFilter() {
    stalls.forEach(({ group, box, label }) => {
      const on = !filterSeg || box.seg === filterSeg;
      group.visible = on;
      label.visible = on;
    });
  }

  function clearSelection() {
    if (selectedGroup) {
      selectedOriginals.forEach(({ mesh, material }) => {
        mesh.material = material;
      });
    }
    selectedGroup = null;
    selectedOriginals = [];
  }

  function selectGroup(group) {
    clearSelection();
    if (!group?.userData?.box || !group.visible) {
      onSelect?.(null);
      return;
    }

    selectedGroup = group;
    group.traverse((child) => {
      if (child.isMesh) {
        selectedOriginals.push({ mesh: child, material: child.material });
        child.material = highlightMat;
      }
    });
    onSelect?.(group.userData.box);
  }

  function fitOrtho() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    const aspect = w / h;
    const pad = 6;
    const needH = LAYOUT.totalDepth + pad;
    const needW = LAYOUT.totalWidth + pad;
    const viewSize = Math.max(needH, needW / aspect);
    const halfH = viewSize / 2;
    const halfW = halfH * aspect;
    orthoCamera.left = -halfW;
    orthoCamera.right = halfW;
    orthoCamera.top = halfH;
    orthoCamera.bottom = -halfH;
    orthoCamera.updateProjectionMatrix();
  }

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    perspCamera.aspect = w / h;
    perspCamera.updateProjectionMatrix();
    if (mode === "2d") fitOrtho();
    renderer.setSize(w, h, false);
    labelRenderer.setSize(w, h);
  }

  function setMode(next) {
    if (next === mode) return;
    mode = next;
    if (next === "2d") {
      activeCamera = orthoCamera;
      activeControls = controls2d;
      controls3d.enabled = false;
      controls2d.enabled = true;
      gRoof.visible = false;
      fitOrtho();
    } else {
      activeCamera = perspCamera;
      activeControls = controls3d;
      controls2d.enabled = false;
      controls3d.enabled = true;
      gRoof.visible = true;
    }
  }

  function setFilter(seg) {
    filterSeg = seg;
    applyFilter();
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  let down = null;
  function onPointerDown(e) {
    down = { x: e.clientX, y: e.clientY };
    setPointer(e);
  }
  function onPointerUp(e) {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    down = null;
    if (dx * dx + dy * dy > 36) return;
    setPointer(e);
    raycaster.setFromCamera(pointer, activeCamera);
    const hits = raycaster.intersectObjects(boxMeshes, false);
    if (hits.length > 0) selectGroup(hits[0].object.userData.group);
    else {
      clearSelection();
      onSelect?.(null);
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);

  const ro = new ResizeObserver(resize);

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    activeControls.update();
    renderer.render(scene, activeCamera);
    labelRenderer.render(scene, activeCamera);
  }

  setupLights();
  createFloor();
  createStructure();
  MAP_BOXES.forEach(createStall);
  resize();
  ro.observe(container);
  animate();

  function dispose() {
    running = false;
    ro.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    controls2d.dispose();
    controls3d.dispose();
    clearSelection();
    highlightMat.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
    labelRenderer.domElement.remove();
  }

  return { setMode, setFilter, resize, dispose };
}
