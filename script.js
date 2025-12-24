// BASIC SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// GROUND (invisible reference)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// WHEEL GEOMETRY
const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);

leftWheel.rotation.z = Math.PI / 2;
rightWheel.rotation.z = Math.PI / 2;

leftWheel.position.set(-0.7, 0.5, 0);
rightWheel.position.set(0.7, 0.5, 0);

scene.add(leftWheel, rightWheel);

// TARGET POSITION
let targetX = 0;

// TOUCH CONTROL
window.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  targetX = (touch.clientX / window.innerWidth - 0.5) * 10;
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  // MOVE
  leftWheel.position.x += (targetX - leftWheel.position.x) * 0.1;
  rightWheel.position.x += (targetX - rightWheel.position.x) * 0.1;

  // ROTATE
  leftWheel.rotation.x -= 0.2;
  rightWheel.rotation.x -= 0.2;

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
