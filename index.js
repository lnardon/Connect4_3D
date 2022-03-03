// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

//SCENE
const scene = new THREE.Scene();

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setClearColor(0x070707);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.z = 250;
window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//LIGHTS
const light1 = new THREE.AmbientLight(0xffffff, 0.5);
const light2 = new THREE.PointLight(0xffffff, 1);
scene.add(light1);
scene.add(light2);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// RAYCASTER
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

let currentPlayer;

let preventClickOnDrag = false;
document.onmousedown = () => {
  preventClickOnDrag = true;
};
document.onmouseup = () => {
  if (preventClickOnDrag) {
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    if (intersects.length > 0) {
      let aux = squares.filter((sqr) => sqr.id === intersects[0].object.id);
      if (aux.length > 0) {
        if (!aux[0].inUse) {
          aux[0].inUse = true;
          aux[0].player = currentPlayer;
          if (currentPlayer) {
            aux[0].material.color = new THREE.Color(0xe10040);
          } else {
            aux[0].material.color = new THREE.Color(0x00eee1);
          }
          const allAvailable = squares.filter((sqr) => sqr.inUse === true);
          if (allAvailable.length === 9) {
            createGame();
            return;
          }
        }
      }
    }
  }
};
document.onmousemove = () => {
  preventClickOnDrag = false;
};
window.addEventListener("mousemove", onMouseMove, false);

//OBJECT
const geometry = new THREE.CubeGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Helpers
let squares = [];
function createGame() {
  requestAnimationFrame(render);
  squares = [];
  let x = 0;
  let z = -2;
  for (let i = 0; i < 25; i++) {
    const geometry = new THREE.BoxGeometry(20, 2, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0xfafafa });
    const square = new THREE.Mesh(geometry, material);
    if (i % 5 === 0) {
      x = -1;
      z++;
    }
    square.rotateX(Math.PI / 1);
    square.rotateY(Math.PI / 2);
    square.position.set(23 * x, -10, 23 * z);
    square.inUse = false;
    squares.push(square);
    scene.add(squares[i]);
    x++;
  }
}
createGame();

//RENDER LOOP
function render() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  squares.forEach((sqrt) =>
    sqrt.inUse === false
      ? (sqrt.material.color = new THREE.Color(0xe1e1e1))
      : null
  );
  if (intersects.length > 0) {
    let aux = squares.filter((sqr) => sqr.id === intersects[0].object.id);
    if (aux.length > 0) {
      aux[0].inUse
        ? null
        : currentPlayer
        ? (aux[0].material.color = new THREE.Color(0xda9dae))
        : (aux[0].material.color = new THREE.Color(0x9be5e2));
    }
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
