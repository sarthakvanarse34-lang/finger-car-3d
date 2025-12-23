// ================= SETUP =================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 6, -6);
camera.lookAt(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dLight = new THREE.DirectionalLight(0x00ffff, 1);
dLight.position.set(0, 10, 5);
scene.add(dLight);

// ================= ROAD =================
const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

const road1 = new THREE.Mesh(new THREE.PlaneGeometry(6, 100), roadMat);
road1.rotation.x = -Math.PI / 2;
scene.add(road1);

const road2 = road1.clone();
road2.position.z = 100;
scene.add(road2);

// ================= PLAYER =================
const player = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 16, 16),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.6
  })
);
player.position.y = 0.3;
scene.add(player);

// ================= GAME VARS =================
let speed = 0.35;
let score = 0;
let started = false;
let gameOver = false;
let obstacles = [];

// ================= 3D UI GROUP =================
const uiGroup = new THREE.Group();
scene.add(uiGroup);

// ---- SCORE BOARD ----
const scoreCanvas = document.createElement("canvas");
scoreCanvas.width = 256;
scoreCanvas.height = 128;
const sctx = scoreCanvas.getContext("2d");
sctx.fillStyle = "#00ffff";
sctx.font = "bold 48px Arial";
sctx.textAlign = "center";

const scoreTex = new THREE.CanvasTexture(scoreCanvas);
const scoreText = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 0.6),
  new THREE.MeshBasicMaterial({ map: scoreTex, transparent: true })
);
scoreText.position.set(0, 3.2, 2);
uiGroup.add(scoreText);

// ---- START PANEL ----
const startPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 1.5),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x00ffff,
    emissiveIntensity: 0.6
  })
);
startPanel.position.set(0, 2, 4);
scene.add(startPanel);

const startCanvas = document.createElement("canvas");
startCanvas.width = 512;
startCanvas.height = 256;
const stx = startCanvas.getContext("2d");
stx.fillStyle = "#00ffff";
stx.font = "bold 64px Arial";
stx.textAlign = "center";
stx.fillText("TAP TO START", 256, 150);

const startTex = new THREE.CanvasTexture(startCanvas);
const startText = new THREE.Mesh(
  new THREE.PlaneGeometry(3.5, 1),
  new THREE.MeshBasicMaterial({ map: startTex, transparent: true })
);
startText.position.set(0, 2, 4.01);
scene.add(startText);

// ================= INPUT =================
window.addEventListener("touchmove", e => {
  if (!started) return;
  const x = (e.touches[0].clientX / window.innerWidth) * 6 - 3;
  player.position.x = Math.max(-2.5, Math.min(2.5, x));
}, { passive: true });

window.addEventListener("touchstart", () => {
  if (!started) {
    started = true;
    scene.remove(startPanel);
    scene.remove(startText);
  }
});

// ================= OBSTACLES =================
function spawnObstacle() {
  const o = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshStandardMaterial({
      color: 0xff3333,
      emissive: 0xff0000,
      emissiveIntensity: 0.4
    })
  );
  o.position.set(Math.random() * 5 - 2.5, 0.3, 30);
  scene.add(o);
  obstacles.push(o);
}
setInterval(spawnObstacle, 1200);

// ================= GAME LOOP =================
function animate() {
  requestAnimationFrame(animate);
  if (!started || gameOver) {
    renderer.render(scene, camera);
    return;
  }

  speed += 0.00025;

  road1.position.z -= speed;
  road2.position.z -= speed;
  if (road1.position.z <= -100) road1.position.z = 100;
  if (road2.position.z <= -100) road2.position.z = 100;

  obstacles.forEach(o => {
    o.position.z -= speed;
    const d = o.position.distanceTo(player.position);

    if (d < 0.4) {
      gameOver = true;
      showGameOver();
    }
    if (d < 0.9 && d > 0.5) score += 3;
  });

  score++;
  sctx.clearRect(0, 0, 256, 128);
  sctx.fillText(score.toString(), 128, 70);
  scoreTex.needsUpdate = true;

  camera.position.x += (player.position.x - camera.position.x) * 0.1;

  renderer.render(scene, camera);
}
animate();

// ================= GAME OVER UI =================
function showGameOver() {
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 1.5),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xff0000,
      emissiveIntensity: 0.6
    })
  );
  panel.position.set(0, 2, 4);
  scene.add(panel);
}

// ================= RESIZE =================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
