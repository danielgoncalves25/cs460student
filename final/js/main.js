import * as THREE from "https://threejs.org/build/three.module.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { TrackballControls } from "https://threejs.org/examples/jsm/controls/TrackballControls.js";

// let scene,
//         camera,
//         renderer,
//         effect,
//         ambientLight,
//         directionalLight,
//         light,
//         mesh,
//         troll,
//         armadillo,
//         trollMesh,
//         toonMaterial,
//         lambertMaterial,
//         standardMatrial,
//         controls,
//         gui,
//         controller;

//       window.onload = function () {
//         scene = new THREE.Scene();

//         camera = new THREE.PerspectiveCamera(
//           60,
//           window.innerWidth / window.innerHeight,
//           1,
//           10000
//         );
//         camera.position.set(0, 0, -1000);

//         renderer = new THREE.WebGLRenderer({});
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(renderer.domElement);
//         console.log(renderer.domElement);

//         ambientLight = new THREE.AmbientLight();
//         scene.add(ambientLight);

//         directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
//         directionalLight.position.set(10, 100, -100);
//         scene.add(directionalLight);
//         const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//         const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
//         const cube = new THREE.Mesh( geometry, material );
//         scene.add( cube );

//         controls = new TrackballControls(camera, renderer.domElement);

//         animate();
//       };

//       function animate() {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       }

class Game {
  constructor() {
    this.initGame();
  }

  initGame() {
    this.scene = new THREE.Scene();
    this.scene.background = 0xed1212;

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(0, 0, -100);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    console.log(this.renderer);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    console.log(this.renderer.domElement);
    this.ambientLight = new THREE.AmbientLight();
    this.scene.add(this.ambientLight);

    // this.controls = new TrackballControls(camera, renderer.domElement);

    this.geometry = new THREE.BoxGeometry(100, 100, 100);
    this.material = new THREE.MeshBasicMaterial({ color: 0xed1212 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
    console.log(this.scene);
    this.RAF();
  }
  RAF() {
    requestAnimationFrame((t) => {
      this.RAF();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new Game();
});
