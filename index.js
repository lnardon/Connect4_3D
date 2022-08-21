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
camera.position.y = 9;
camera.position.z = 12;

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

// BOARD
const loader = new GLTFLoader();
loader.load(
  "boardDev.glb",
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
function createPlayerBlock(coords, blockLevel, color, idx) {
  const geometry = new THREE.CubeGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ color: colors[color] });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.level = blockLevel;
  mesh.name = idx + 25;
  mesh.index = Math.floor(idx / 25);
  mesh.position.x = coords.x;
  mesh.position.y = coords.y + 1;
  mesh.position.z = coords.z;
  scene.add(mesh);
  checkWinner(
    Math.floor(Math.floor(idx % 25) % 5),
    Math.floor(Math.floor(idx % 25) / 5)
  );
  document.getElementsByClassName("player")[0].innerText = `Current Player: ${
    colors[!color] === 0xe10040 ? "Red" : "Blue"
  }`;
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

let board = [
  [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
  [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
  [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
  [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
  [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
];
let currentPlayer = false;
let preventClickOnDrag = false;
let isModalOpen = false;
const colors = {
  true: 0xe10040,
  false: 0x00eee1,
};
let mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  preventClickOnDrag = false;
}

function verifyY(row) {
  let count = 0;
  for (let h = 0; h < 5; h++) {
    for (let i = 0; i < 5; i++) {
      if (board[h][row][i] === currentPlayer) count++;
      else count = 0;
      if (count >= 4) return 1;
    }
  }
  return 0;
}

function verifyX(col) {
  let count = 0;
  for (let h = 0; h < 5; h++) {
    for (let i = 0; i < 5; i++) {
      if (board[h][i][col] === currentPlayer) count++;
      else count = 0;
      if (count >= 4) return 1;
    }
  }
  return 0;
}

function checkWinner(x, y) {
  const checkX = verifyX(x);
  const checkY = verifyY(y);
  if (checkX || checkY) {
    alert(
      `Game Over. Player ${
        colors[currentPlayer] === 0xe10040 ? "Red" : "Blue"
      } won.`
    );
  }
}

document.onmousedown = (e) => {
  preventClickOnDrag = true;
};
document.addEventListener("mousemove", onMouseMove, false);

document.onclick = (e) => {
  if (preventClickOnDrag && !isModalOpen) {
    let intersects;
    if ((intersects = raycaster.intersectObjects(scene.children).length > 0)) {
      intersects = raycaster.intersectObjects(scene.children);
    } else {
      intersects = raycaster.intersectObjects(scene.children[2].children);
    }
    if (intersects.length > 0) {
      if (
        intersects[0].object.index === undefined ||
        (intersects[0].object.index < 4 && !intersects[0].object.stacked)
      ) {
        let globalId = parseInt(intersects[0].object.name);
        board[Math.floor(globalId / 25)][
          Math.floor(Math.floor(globalId % 25) / 5)
        ][Math.floor(Math.floor(globalId % 25) % 5)] = currentPlayer;
        intersects[0].object.stacked = true;
        createPlayerBlock(
          intersects[0].object.position,
          intersects[0].object.level || 0,
          currentPlayer,
          globalId
        );
        currentPlayer = !currentPlayer;
      } else {
        if (intersects[0].object.index >= 4) {
          alert("Maximum of 5 blocks can be stacked.");
        }
      }
    }
  }
};

document.getElementsByClassName("rulesBtn")[0].addEventListener("click", () => {
  isModalOpen = true;
  document.getElementsByClassName("modal")[0].style.display = "flex";
});
document.getElementsByClassName("closeBtn")[0].addEventListener("click", () => {
  document.getElementsByClassName("modal")[0].style.display = "none";
  isModalOpen = false;
});

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//RENDER LOOP
function render() {
  raycaster.setFromCamera(mouse, camera);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
