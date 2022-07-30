// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

const colors = {
  true: 0xe10040,
  false: 0x00eee1,
};

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
camera.position.z = 17;
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
const light2 = new THREE.PointLight(0xffffff, 0.55);
light1.position.y = 6;
light2.position.y = 10;
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

document.onmouseup = (e) => {
  // if (preventClickOnDrag) {
  let intersects;
  if ((intersects = raycaster.intersectObjects(scene.children).length > 0)) {
    intersects = raycaster.intersectObjects(scene.children);
  } else {
    intersects = raycaster.intersectObjects(scene.children[2].children);
  }
  console.log("Intersects", intersects, scene);
  if (intersects.length > 0) {
    if (
      !intersects[0].object.index ||
      (intersects[0].object.index <= 5 && !intersects[0].object.stacked)
    ) {
      intersects[0].object.stacked = true;
      createPlayerBlock(
        intersects[0].object.position,
        intersects[0].object.index,
        currentPlayer
      );
      currentPlayer = !currentPlayer;
    } else {
      if (intersects[0].object.index >= 5) {
        alert("Maximum of 5 blocks can be stacked.");
      }
    }
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
    scene.add(gltf.scene);
    scene.position.y = -1;
    scene.children[2].position.y = 0.5;
    gltf.animations;
    gltf.scene;
    gltf.scenes;
    gltf.cameras;
    gltf.asset;
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    if ((xhr.loaded / xhr.total) * 100 === 100) {
      document.getElementById("progressLoading").style.display = "none";
    }
  },

  function (error) {
    console.log("An error happened", error);
  }
);

//OBJECT
function createPlayerBlock(coords, blockIndex = 1, color) {
  const geometry = new THREE.CubeGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ color: colors[color] });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.index = blockIndex + 1;
  mesh.position.x = coords.x;
  mesh.position.y = coords.y + 1;
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
