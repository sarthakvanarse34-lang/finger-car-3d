const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CAMERA — FRONT VIEW
camera.position.set(0, 2, 6);
camera.lookAt(0, 0.5, 0);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// WHEEL GEOMETRY (LAYING FLAT)
const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);

// ROTATE TO FACE CAMERA
leftWheel.rotation.x = Math.PI / 2;
rightWheel.rotation.x = Math.PI / 2;

// IMPORTANT: Z AXIS SEPARATION
leftWheel.position.set(0, 0.5, -0.8);
rightWheel.position.set(0, 0.5, 0.8);

scene.add(leftWheel);
scene.add(rightWheel);

// INPUT
let targetX = 0;

function setTarget(x) {
  targetX = (x / window.innerWidth - 0.5) * 4;
}

window.addEventListener("touchmove", e => setTarget(e.touches[0].clientX));
window.addEventListener("mousemove", e => setTarget(e.clientX));

// LOOP
function animate() {
  requestAnimationFrame(animate);

  leftWheel.position.x += (targetX - leftWheel.position.x) * 0.15;
  rightWheel.position.x += (targetX - rightWheel.position.x) * 0.15;

  const speed = Math.abs(targetX - leftWheel.position.x);
  leftWheel.rotation.z -= speed * 0.3;
  rightWheel.rotation.z -= speed * 0.3;

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
