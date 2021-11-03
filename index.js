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
    const geometry = new THREE.BoxGeometry(20, 5, 20);
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
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.03;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
