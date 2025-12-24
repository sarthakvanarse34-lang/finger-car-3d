// BASIC SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CAMERA (TOP-DOWN / SLIGHT ANGLE)
camera.position.set(0, 6, 6);
camera.lookAt(0, 0, 0);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// GROUND (REFERENCE)
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// WHEEL GEOMETRY
const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);

leftWheel.rotation.z = Math.PI / 2;
rightWheel.rotation.z = Math.PI / 2;

// POSITION (CENTERED)
leftWheel.position.set(-1, 0.5, 0);
rightWheel.position.set(1, 0.5, 0);

scene.add(leftWheel);
scene.add(rightWheel);

// FINGER CONTROL
let targetX = 0;

function updateTarget(x) {
  targetX = (x / window.innerWidth - 0.5) * 6;
}

window.addEventListener("touchmove", (e) => {
  updateTarget(e.touches[0].clientX);
});

window.addEventListener("mousemove", (e) => {
  updateTarget(e.clientX);
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  // SMOOTH FOLLOW
  leftWheel.position.x += (targetX - leftWheel.position.x) * 0.15;
  rightWheel.position.x += (targetX - rightWheel.position.x) * 0.15;

  // ROTATION BASED ON SPEED
  const speed = Math.abs(targetX - leftWheel.position.x);
  leftWheel.rotation.x -= speed * 0.3;
  rightWheel.rotation.x -= speed * 0.3;

  renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
