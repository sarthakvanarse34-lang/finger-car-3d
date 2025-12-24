// BASIC THREE SETUP
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5);
scene.add(light);

// WHEEL GEOMETRY
const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// LEFT WHEEL
const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
leftWheel.rotation.z = Math.PI / 2;
leftWheel.position.x = -0.6;

// RIGHT WHEEL
const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);
rightWheel.rotation.z = Math.PI / 2;
rightWheel.position.x = 0.6;

// GROUP (CAR)
const car = new THREE.Group();
car.add(leftWheel);
car.add(rightWheel);
scene.add(car);

// TOUCH CONTROL
window.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const x = (touch.clientX / window.innerWidth) * 2 - 1;
  const y = -(touch.clientY / window.innerHeight) * 2 + 1;

  car.position.x = x * 3;
  car.position.y = y * 2;
});

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  // wheels rotate = moving illusion
  leftWheel.rotation.x += 0.1;
  rightWheel.rotation.x += 0.1;

  renderer.render(scene, camera);
}

animate();
