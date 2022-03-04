// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js";
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

let currentPlayer = false;

let preventClickOnDrag = false;
document.onmousedown = () => {
  preventClickOnDrag = true;
};
document.onmouseup = () => {
  // if (preventClickOnDrag) {
  const intersects = raycaster.intersectObjects(scene.children);
  console.log("Intersects", scene);
  if (intersects.length > 0) {
    // aux[aux.length].inUse = true;
    intersects[0].index
      ? (intersects[0].index = intersects[0].index++)
      : (intersects[0].index = 1);
    intersects[0].player = currentPlayer;
    createPlayerBlock(
      intersects[0].object.position,
      intersects[0].object.index !== undefined
        ? intersects[0].object.index + 1
        : 0,
      currentPlayer
    );
    const allAvailable = squares.filter((sqr) => sqr.inUse === true);
    if (allAvailable.length === 25) {
      createGame();
      return;
    }

    currentPlayer = !currentPlayer;
  }
  // }
};
document.onmousemove = () => {
  preventClickOnDrag = false;
};
window.addEventListener("mousemove", onMouseMove, false);

const loader = new GLTFLoader();
loader.load(
  "Board.glb",
  function (gltf) {
    // scene.position.y = -10;
    gltf.scene.scale.set(20, 20, 20);
    scene.add(gltf.scene);
    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    console.log(gltf);
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  function (error) {
    console.log("An error happened", error);
  }
);

//OBJECT
function createPlayerBlock(coords, blockIndex, color) {
  console.log(blockIndex);
  const colors = {
    true: 0xe10040,
    false: 0x00eee1,
  };

  const geometry = new THREE.CubeGeometry(20, 20, 20);
  const material = new THREE.MeshLambertMaterial({ color: colors[color] });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = coords.x;
  mesh.index = blockIndex;
  blockIndex === 0
    ? (mesh.position.y = coords.y + 11)
    : (mesh.position.y = coords.y + 20);
  mesh.position.z = coords.z;

  scene.add(mesh);
}

// Load Manager
const manager = new THREE.LoadingManager();
manager.onStart = (url, itemsLoaded, itemsTotal) => {
  document.getElementById("progressLoading").innerText = "Loading Files ...";
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  document.getElementById(
    "progressLoading"
  ).innerText = `Loading Files ... ${itemsLoaded}/${itemsTotal}`;
};

manager.onLoad = () => {
  document.getElementById("progressLoading").style.display = "none";
};

manager.onError = function (url) {
  console.log("There was an error loading " + url);
  document.getElementById(
    "progressLoading"
  ).innerText = `Error loading the file ${url}`;
};

//RENDER LOOP
function render() {
  raycaster.setFromCamera(mouse, camera);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
