import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { CATEGORIES, LAYOUT, MAP_BOXES, MARCADOR } from "./layout";
import { cssColorInt } from "./tokens";

// Toda cor da cena vem de um token CSS (ver o bloco --mapa-* em src/index.css).
// O getter adia a leitura para depois que a folha de estilo carregou.
const PALETTE = new Proxy(
  {
    blueWall: "--mapa-parede-azul",
    blueBand: "--mapa-faixa-azul",
    redColumn: "--mapa-coluna-vermelha",
    roofMetal: "--mapa-telha-metal",
    roofUnder: "--mapa-telha-sob",
    beam: "--mapa-viga",
    tile: "--mapa-ceramica",
    tileTop: "--mapa-ceramica-topo",
    mesh: "--mapa-tela-verde",
    floor: "--mapa-piso",
    forro: "--mapa-forro",
    vidro: "--mapa-vidro",
    gradeA: "--mapa-grade-a",
    gradeB: "--mapa-grade-b",
    branco: "--mapa-luz-branca",
    luzCeu: "--mapa-luz-ceu",
    luzChao: "--mapa-luz-chao",
    sol: "--mapa-luz-sol",
    preenchimento: "--mapa-luz-preenchimento",
    fundo: "--color-card",
    // Laranja da etiqueta do logotipo. É a cor de "este aqui": não colide com o
    // azul da estrutura nem com o verde da tela, e nenhum setor a usa cheia.
    selecao: "--color-warning",
  },
  { get: (alvo, chave) => (chave in alvo ? cssColorInt(alvo[chave]) : undefined) }
);

export function createMapScene(canvas, container, { onSelect } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.fundo);
  scene.fog = new THREE.Fog(PALETTE.fundo, 55, 130);

  // A planta tem 40 m de frente por 13 de fundo numa tela em pé: enquadrar as
  // duas alas inteiras jogaria a câmera a 56 m e os boxes viram pontos. A vista
  // inicial é a de quem acabou de entrar — meia praça, no tamanho em que dá para
  // ler o número. O resto se alcança girando, com zoom, ou clicando na lista.
  const perspCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
  perspCamera.position.set(-24, 16, 21);

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

  /**
   * Marcadores de seleção e de passagem do cursor.
   *
   * A versão anterior trocava o material do box inteiro por um branco emissivo:
   * o box selecionado perdia a cor do setor, a porta e a tela, e virava um
   * bloco branco indistinguível — justamente o oposto de "dá pra ver onde
   * cliquei". Aqui o box continua intacto e o destaque vem de fora: um anel
   * desenhado no chão, um brilho por baixo e um pino acima. `MeshBasicMaterial`
   * porque marcador não deve receber sombra nem escurecer no fundo do galpão.
   */
  const { boxW, boxD, boxH } = LAYOUT;

  // Anel retangular assentado no vão entre os boxes. Círculo não serve nesta
  // planta: com 2,6 × 2,4 e vão de 0,35, o círculo que envolvesse o box
  // invadiria os vizinhos, e o que coubesse no vão ficaria escondido embaixo da
  // bancada. O retângulo acompanha a forma do box e cabe no vão.
  function anelGeo(esp) {
    const x = boxW / 2 + esp;
    const z = boxD / 2 + esp;
    const forma = new THREE.Shape();
    forma.moveTo(-x, -z);
    forma.lineTo(x, -z);
    forma.lineTo(x, z);
    forma.lineTo(-x, z);
    const furo = new THREE.Path();
    furo.moveTo(-boxW / 2, -boxD / 2);
    furo.lineTo(boxW / 2, -boxD / 2);
    furo.lineTo(boxW / 2, boxD / 2);
    furo.lineTo(-boxW / 2, boxD / 2);
    forma.holes.push(furo);
    return new THREE.ShapeGeometry(forma);
  }

  function marcador(geo, opacity) {
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: PALETTE.selecao,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    m.renderOrder = 2;
    m.visible = false;
    scene.add(m);
    return m;
  }

  const selRing = marcador(anelGeo(MARCADOR.espessura), 0.95);
  const hoverRing = marcador(anelGeo(MARCADOR.espessura * 0.6), 0.5);
  selRing.rotation.x = -Math.PI / 2;
  hoverRing.rotation.x = -Math.PI / 2;

  // Coluna translúcida sobre o box. É ela que carrega a vista 2D: de cima o
  // anel é um fio, mas a coluna pinta o box inteiro de laranja.
  const ALTURA_COLUNA = boxH + 0.6;
  const selShaft = marcador(new THREE.BoxGeometry(boxW, ALTURA_COLUNA, boxD), 0.22);

  // Pino: cone de ponta para baixo, apontando o box. Só na 3D — visto de cima
  // na 2D ele vira um ponto em cima do anel e não acrescenta nada.
  const pin = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.5, 20),
    new THREE.MeshBasicMaterial({ color: PALETTE.selecao, transparent: true, opacity: 0.9 })
  );
  pin.rotation.x = Math.PI;
  pin.visible = false;
  scene.add(pin);

  let selected = null;
  let hovered = null;
  let filterSeg = null;
  let running = true;

  // Foco de câmera na 3D: alvo e posição perseguidos por lerp no animate().
  const focoAlvo = new THREE.Vector3();
  const focoCam = new THREE.Vector3();
  let focando = false;

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

    /**
     * A cobertura inteira fica translúcida e sem sombra.
     *
     * Opaca, ela resolvia a 3D em uma laje cinza: de cima tapava os 70 boxes, e
     * de dentro as vigas riscavam a planta. A sombra era o outro lado do mesmo
     * problema — uma cobertura de ponta a ponta jogava o galpão na penumbra e
     * nenhuma cor de setor se distinguia. Translúcida ela ainda dá o volume do
     * barracão, que é o que a vista 3D tem a acrescentar sobre a 2D.
     */
    gRoof.traverse((o) => {
      if (!o.isMesh) return;
      o.material.transparent = true;
      o.material.opacity = Math.min(o.material.opacity, 0.32);
      o.material.depthWrite = false;
      o.castShadow = false;
    });

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
    const counterH = 1.0;

    // Box sem loja não tem setor: a categoria dele é só um resto de divisão em
    // layout.js. Pintar de cinza diz "vago" em vez de mentir um setor.
    const vago = box.status === "Vago";
    const corSetor = vago ? PALETTE.tileTop : CATEGORIES[box.category].color;

    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(w, counterH, d),
      new THREE.MeshStandardMaterial({ color: PALETTE.tile, roughness: 0.55 })
    );
    counter.position.y = counterH / 2;
    counter.castShadow = true;
    counter.receiveShadow = true;
    group.add(counter);

    // A cor do setor também vai no tampo. Vista de cima, a 2D só enxerga esta
    // face: com o tampo neutro os 70 boxes ficavam idênticos e a legenda de
    // setores embaixo não servia para nada.
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.06, 0.08, d + 0.06),
      new THREE.MeshStandardMaterial({ color: corSetor, roughness: 0.4 })
    );
    top.position.y = counterH + 0.04;
    top.castShadow = true;
    group.add(top);

    const shutter = new THREE.Mesh(
      new THREE.BoxGeometry(w, h - counterH, 0.08),
      new THREE.MeshStandardMaterial({ color: corSetor, roughness: 0.5, metalness: 0.15 })
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
    group.userData.box = box;

    const labelDiv = document.createElement("div");
    labelDiv.className = "map-label";
    labelDiv.textContent = box.number;
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, h + 0.3, 0);
    group.add(label);
    labels.push(label);

    // O filtro apaga o que não casa em vez de sumir com ele, então guardamos a
    // opacidade de origem de cada peça (a tela lateral já nasce em 0.55).
    const rec = { group, box, label, meshes: [] };
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.stall = rec;
        rec.meshes.push({ mesh: child, opacity: child.material.opacity });
        boxMeshes.push(child);
      }
    });

    scene.add(group);
    stalls.push(rec);
  }

  function applyFilter() {
    stalls.forEach((s) => {
      const on = !filterSeg || s.box.seg === filterSeg;
      s.group.userData.dim = !on;
      s.meshes.forEach(({ mesh, opacity }) => {
        mesh.material.transparent = !on || opacity < 1;
        mesh.material.opacity = on ? opacity : opacity * 0.12;
        mesh.material.depthWrite = on;
      });
      s.label.element.classList.toggle("is-dim", !on);
    });
    if (selected?.group.userData.dim) {
      clearSelection();
      onSelect?.(null);
    }
  }

  function clearSelection() {
    if (selected) {
      selected.label.element.classList.remove("is-selected");
      selected.group.position.y = 0;
    }
    selected = null;
    focando = false;
    selRing.visible = selShaft.visible = pin.visible = false;
  }

  function selectStall(stall) {
    const alvo = stall && !stall.group.userData.dim ? stall : null;

    // Já selecionado: sai antes de refazer o marcador e reiniciar o voo da
    // câmera. Sem isto, a seleção que volta da tela reacende a que veio dela.
    if (alvo === selected) {
      onSelect?.(alvo?.box ?? null);
      return;
    }

    clearSelection();
    if (!alvo) {
      onSelect?.(null);
      return;
    }
    stall = alvo;
    selected = stall;
    stall.label.element.classList.add("is-selected");

    const { x, z } = stall.box.position;
    selRing.position.set(x, 0.05, z);
    selShaft.position.set(x, ALTURA_COLUNA / 2, z);
    pin.position.set(x, boxH + 1.15, z);
    selRing.visible = selShaft.visible = true;
    pin.visible = mode === "3d";

    if (mode === "3d") aproximar(stall);
    onSelect?.(stall.box);
  }

  /**
   * Leva a órbita da 3D até o box escolhido, sempre pelo mesmo ângulo: de cima
   * e de frente, acima da linha do telhado. Preservar a direção em que a câmera
   * já estava parecia mais educado, mas descia a câmera para dentro do galpão
   * quando o giro estava baixo, e aí a viga entrava na frente do box. Um ângulo
   * fixo é previsível: o box escolhido aparece no mesmo lugar toda vez.
   */
  function aproximar(stall) {
    focoAlvo.set(stall.box.position.x, 1, stall.box.position.z);
    focoCam.set(focoAlvo.x, focoAlvo.y + 12, focoAlvo.z + 16);
    focando = true;
  }

  /** Box mais próximo sob o cursor, ignorando os apagados pelo filtro. */
  function pick() {
    raycaster.setFromCamera(pointer, activeCamera);
    for (const hit of raycaster.intersectObjects(boxMeshes, false)) {
      const stall = hit.object.userData.stall;
      if (stall && !stall.group.userData.dim) return stall;
    }
    return null;
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
      if (selected) aproximar(selected);
    }
    pin.visible = !!selected && next === "3d";
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
  let hoverPendente = false;

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
    selectStall(pick());
  }

  // O totem é touch: lá não existe "passar por cima", e o anel ficaria preso no
  // último box tocado. O hover é só para mouse, e o raycast roda no máximo uma
  // vez por quadro em vez de uma vez por evento de movimento.
  function onPointerMove(e) {
    if (e.pointerType === "touch") return;
    setPointer(e);
    hoverPendente = true;
  }
  function onPointerLeave() {
    hovered = null;
    hoverPendente = false;
    canvas.style.cursor = "";
  }

  function atualizarHover() {
    hoverPendente = false;
    hovered = down ? null : pick();
    canvas.style.cursor = hovered ? "pointer" : "";
    if (hovered) {
      hoverRing.position.set(hovered.box.position.x, 0.045, hovered.box.position.z);
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);

  const ro = new ResizeObserver(resize);

  const relogio = new THREE.Clock();
  let tempo = 0;

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    // Clamp porque a aba em segundo plano devolve um dt gigante no primeiro
    // quadro de volta, e aí todo lerp salta o passo inteiro de uma vez.
    const dt = Math.min(relogio.getDelta(), 0.1);
    tempo += dt;

    if (hoverPendente) atualizarHover();
    hoverRing.visible = !!hovered && hovered !== selected;

    if (selected) {
      // Pulsação lenta: o marcador respira, então o olho acha a seleção mesmo
      // num mapa de 70 boxes parados. Pulsa opacidade, não escala — crescer
      // faria o anel encostar no vizinho e desfazer o que o vão garante.
      const onda = Math.sin(tempo * 3.2);
      selRing.material.opacity = 0.8 + onda * 0.2;
      selShaft.material.opacity = 0.34 + onda * 0.1;

      const alvoY = mode === "3d" ? 0.32 : 0;
      selected.group.position.y += (alvoY - selected.group.position.y) * Math.min(1, dt * 9);
      pin.position.y = boxH + 1.15 + alvoY + onda * 0.09;
    }

    if (focando) {
      const passo = Math.min(1, dt * 3.5);
      controls3d.target.lerp(focoAlvo, passo);
      perspCamera.position.lerp(focoCam, passo);
      if (controls3d.target.distanceTo(focoAlvo) < 0.05) focando = false;
    }

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
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.style.cursor = "";
    controls2d.dispose();
    controls3d.dispose();
    clearSelection();
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

  /** Seleciona pelo id do box, ou limpa com null. É por aqui que a tela devolve
   *  ao mapa o que ela mudou — fechar o painel da loja, por exemplo. */
  function selectById(id) {
    selectStall(id == null ? null : stalls.find((s) => s.box.id === id) ?? null);
  }

  return { setMode, setFilter, select: selectById, resize, dispose };
}
