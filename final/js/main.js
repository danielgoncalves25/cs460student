import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
// import * as THREEx from "../resources/bower_components/threex.domevents/threex.domevents.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js";

class Game {
  constructor() {
    this.Initialize();
  }

  async Initialize() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    console.log("Hello");
    console.log(CANNON);
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener(
      "resize",
      () => {
        this.OnWindowResize();
      },
      false
    );
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(-20, 37, 193);

    this.scene = new THREE.Scene();
    // var domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement);

    for (var i = -50; i < 1500; i += 300) {
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.lookAt(0, 0, 16);
      directionalLight.position.set(i, 100, 16);
      this.scene.add(directionalLight);
      let hemiLight = new THREE.HemisphereLight(0x99ccff, 0xffffff, 0.5);
      hemiLight.position.set(i, 70, 16);
      this.scene.add(hemiLight);
    }

    let light = new THREE.AmbientLight(0xffffff, 8);
    this.scene.add(light);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    this.gui = new GUI();
    var cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.camera.position, "x", -50, 1500);
    cameraFolder.add(this.camera.position, "y", -200, 200);
    cameraFolder.add(this.camera.position, "z", -200, 200);
    cameraFolder.open();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Setup Cannon.js things
    this.physicWorld = new CANNON.World();
    const dt = 1.0 / 60.0;
    const damping = 0.01;
    this.physicWorld.broadphase = new CANNON.NaiveBroadphase();
    this.physicWorld.gravity.set(0, -10, 0);
    // this.helper = new CannonHelper(this.scene, this.physicWorld);
    var groundShape = new CANNON.Plane();
    var groundMaterial = new CANNON.Material();

    this.obj = {};
    this.mario = await this.getMarioModel();
    this.world = await this.getWorldModel();

    this.loadModelIntoScene();

    this.RAF();
  }

  async getMarioModel() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/mario/");
    var [gltf] = await Promise.all([loader.loadAsync("scene.gltf")]);
    return gltf.scene;
  }
  async getWorldModel() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/world2/");
    var [gltf] = await Promise.all([loader.loadAsync("scene.gltf")]);
    return gltf.scene;
  }

  loadModelIntoScene() {
    // Configure and load mario
    this.mario.scale.set(0.2, 0.2, 0.2);
    this.mario.position.set(-100, 10, 20);
    var marioFolder = this.gui.addFolder("Mario");
    marioFolder.add(this.mario.position, "x", -250, 1500);
    marioFolder.add(this.mario.position, "y", -200, 200);
    marioFolder.add(this.mario.position, "z", -200, 200);
    marioFolder.open();
    this.mario.rotation.y = 1.5;
    this.scene.add(this.mario);

    // Loads world
    this.world.position.set(200, 0, 0);
    this.world.scale.set(5, 5, 5);
    var environment = [];
    this.world.traverse((node) => {
      if (node.isMesh) environment.push(node);
    });
    this.obj.worldEnv = environment;
    this.scene.add(this.world);
  }

  CreateCloud(x) {
    console.log("creating clouds at ", x);
    console.log(this.raycaster);
  }

  OnWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  RAF() {
    requestAnimationFrame((t) => {
      this.RAF();
      // this.camera.position.x += 0.3;
      // console.log(this.camera.position);
      this.renderer.render(this.scene, this.camera);
    });
  }
}

let APP = null;

window.addEventListener("DOMContentLoaded", () => {
  APP = new Game();
});
