const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 6, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// WHEELS
const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const wheel1 = new THREE.Mesh(wheelGeo, wheelMat);
const wheel2 = new THREE.Mesh(wheelGeo, wheelMat);

// Lay flat
wheel1.rotation.x = Math.PI / 2;
wheel2.rotation.x = Math.PI / 2;

// SEPARATE CLEARLY
wheel1.position.set(-0.8, 0.4, 0);
wheel2.position.set(0.8, 0.4, 0);

scene.add(wheel1);
scene.add(wheel2);

// INPUT
let targetX = 0;

function updateTarget(x) {
  targetX = (x / window.innerWidth - 0.5) * 4;
}

window.addEventListener("touchmove", e => updateTarget(e.touches[0].clientX));
window.addEventListener("mousemove", e => updateTarget(e.clientX));

// LOOP
function animate() {
  requestAnimationFrame(animate);

  wheel1.position.x += (targetX - wheel1.position.x) * 0.1;
  wheel2.position.x += (targetX - wheel2.position.x) * 0.1;

  const speed = Math.abs(targetX - wheel1.position.x);
  wheel1.rotation.z -= speed * 0.4;
  wheel2.rotation.z -= speed * 0.4;

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});renderer.setPixelRatio(window.devicePixelRatio);
