import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
// import * as THREEx from "../resources/bower_components/threex.domevents/threex.domevents.js";

import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
// import { TransformControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/TransformControls.js";

// import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js";
// import * as ttc from "https://unpkg.com/three-to-cannon@4.0.2/dist/three-to-cannon.modern.js";
// import { threeToCannon, ShapeType } from "three-to-cannon";

// Hello GitHub, Are you updating???
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
    this.animations = [];
    this.currentMixer;

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

    // this.gui = new GUI();
    // var cameraFolder = this.gui.addFolder("Camera");
    // cameraFolder.add(this.camera.position, "x", -50, 1500);
    // cameraFolder.add(this.camera.position, "y", -200, 200);
    // cameraFolder.add(this.camera.position, "z", -200, 200);
    // cameraFolder.open();
    // this.Tcontrols = new TransformControls(
    //   this.camera,
    //   this.renderer.domElement
    // );
    // this.scene.add(this.Tcontrols);

    // Setup Cannon.js things
    // this.physicWorld = new CANNON.World();
    // const dt = 1.0 / 60.0;
    // const damping = 0.01;
    // this.physicWorld.broadphase = new CANNON.NaiveBroadphase();
    // this.physicWorld.gravity.set(0, -10, 0);
    // // this.helper = new CannonHelper(this.scene, this.physicWorld);
    // var groundShape = new CANNON.Plane();
    // var groundMaterial = new CANNON.Material();

    this.obj = {};
    // this.mario = await this.getMarioModel();
    this.world = await this.getWorldModel();
    this.loadModelIntoScene();

    this.RAF();
    return;
  }

  // async getMarioModel() {
  //   const loader = new FBXLoader();
  //   loader.setPath("./resources/mario/");
  //   const anim = new FBXLoader();
  //   anim.setPath("./resources/mario/animations/");
  //   var [idle, run, jump] = await Promise.all([
  //     loader.loadAsync("idle.fbx"),
  //     anim.loadAsync("run.fbx"),
  //     anim.loadAsync("jump.fbx"),
  //   ]);
  //   console.log(jump);
  //   this.animations.push(
  //     idle.animations[0],
  //     run.animations[0],
  //     jump.animations[0]
  //   );
  //   this.currentMixer = new THREE.AnimationMixer(idle);
  //   this.animationAction = this.currentMixer.clipAction(idle.animations[0]);
  //   this.animationAction.play();

  //   return idle;
  // }

  async getWorldModel() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/world/");
    var [gltf] = await Promise.all([loader.loadAsync("scene.gltf")]);
    return gltf.scene;
  }

  loadModelIntoScene() {
    // Configure and load mario
    // this.mario.scale.set(6, 6, 6);
    // this.mario.position.set(-100, 10, 20);
    // this.mario.rotation.y = 1.5;
    // this.scene.add(this.mario);

    // Loads world
    this.world.position.set(200, 0, 0);
    this.world.scale.set(5, 5, 5);
    var environment = [];
    this.world.traverse((node) => {
      if (node.isMesh) {
        environment.push(node);
      }
    });
    // Useless environments = 0,
    // this.Tcontrols.attach(environment[0]);
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
      // this.currentMixer.update(0.01);
      this.renderer.render(this.scene, this.camera);
    });
  }
}

let APP = null;

// window.addEventListener("DOMContentLoaded", () => {
//   APP = new Game();
// });
window.onload = () => {
  APP = new Game();
};
