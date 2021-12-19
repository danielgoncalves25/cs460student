import * as THREE from "https://threejs.org/build/three.module.js";
import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";

import { mcontrols } from "./controls.js";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js";

class Game {
  constructor() {
    this.Initialize();
  }

  async Initialize() {
    this.raycaster = new THREE.Raycaster();
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
    this.scene.add(new THREE.AxesHelper(5));

    let light = new THREE.AmbientLight(0xffffff, 8);
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.gui = new GUI();
    this.jumpAudios = [];
    var cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.camera.position, "x", -50, 1500);
    cameraFolder.add(this.camera.position, "y", -200, 200);
    cameraFolder.add(this.camera.position, "z", -200, 200);
    cameraFolder.open();

    // var geometry = new THREE.BoxGeometry(9, 15, 12);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // this.cube = new THREE.Mesh(geometry, material);
    // this.scene.add(this.cube);

    this.clock = new THREE.Clock();
    this.collision = false;
    this.world = await this.getWorldModel();
    this.mario = await this.getMarioModel();
    this.pipes = this.createPipes();
    this.loadModelIntoScene();
    this.loadThemeAudio();
    const jumpAudioLoader = new THREE.AudioLoader();
    const jumpListener = new THREE.AudioListener();
    var jumpAudio = new THREE.Audio(jumpListener);
    jumpAudioLoader.load("./resources/jump.mp3", function (buffer) {
      jumpAudio.setBuffer(buffer);
      jumpAudio.setVolume(0.3);
    });
    this.movementControls = new mcontrols.MarioControls({
      target: this.mario,
      camera: this.camera,
      playJumpAudio: () => jumpAudio.play(),
    });
    this.RAF();
    return;
  }
  loadThemeAudio() {
    var themeAudioLoader = new THREE.AudioLoader();
    var themeListener = new THREE.AudioListener();
    var themeAudio = new THREE.Audio(themeListener);
    themeAudioLoader.load("./resources/themeSong.mp3", function (buffer) {
      themeAudio.setBuffer(buffer);
      themeAudio.autoplay = true;
      themeAudio.play();
    });
  }
  async getMarioModel() {
    const loader = new FBXLoader();
    loader.setPath("./resources/mario/");
    const anim = new FBXLoader();
    anim.setPath("./resources/mario/animations/");
    var [idle, run, jump] = await Promise.all([
      loader.loadAsync("Idle.fbx"),
      anim.loadAsync("Run.fbx"),
      anim.loadAsync("Jump.fbx"),
    ]);
    this.animations.push(
      idle.animations[0],
      run.animations[0],
      jump.animations[0]
    );
    this.currentMixer = new THREE.AnimationMixer(idle);
    this.animationAction = this.currentMixer.clipAction(this.animations[0]);
    this.animationAction.play();

    return idle;
  }

  async getWorldModel() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/world/");
    var [gltf] = await Promise.all([loader.loadAsync("scene.gltf")]);
    return gltf.scene;
  }

  loadModelIntoScene() {
    // Configure and load mario
    this.mario.scale.set(6, 6, 6);
    this.mario.position.set(-100, 10, 20);
    this.mario.rotation.y = 1.5;
    var marioFolder = this.gui.addFolder("mario");
    marioFolder.add(this.mario.position, "x", -1500, 1500);
    marioFolder.add(this.mario.position, "y", -20, 40);
    marioFolder.add(this.mario.position, "z", 0, 35);
    marioFolder.open();
    this.scene.add(this.mario);

    // Loads world
    this.world.position.set(200, 0, 0);
    this.world.scale.set(5, 5, 5);
    this.scene.add(this.world);
  }

  createPipes() {
    var geometry = new THREE.BoxGeometry(9, 15, 12);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var pipe1 = new THREE.Mesh(geometry, material);
    pipe1.position.set(18, 13, 20);
    pipe1.geometry.computeBoundingBox();
    pipe1.visible = false;

    var geometry = new THREE.BoxGeometry(9, 17, 12);
    var pipe2 = new THREE.Mesh(geometry, material);
    pipe2.position.set(69.5, 17, 20);
    pipe2.geometry.computeBoundingBox();
    pipe2.visible = false;

    var geometry = new THREE.BoxGeometry(9, 22, 12);
    var pipe3 = new THREE.Mesh(geometry, material);
    pipe3.position.set(111, 21, 20);
    pipe3.geometry.computeBoundingBox();
    pipe3.visible = false;

    var pipe4 = new THREE.Mesh(geometry, material);
    pipe4.position.set(168, 21, 20);
    pipe4.geometry.computeBoundingBox();
    pipe4.visible = false;

    this.scene.add(pipe1);
    this.scene.add(pipe2);
    this.scene.add(pipe3);
    this.scene.add(pipe4);
    return [pipe1, pipe2, pipe3, pipe4];
  }
  detectPipeCollision() {
    var marioBox = new THREE.Box3().setFromObject(this.mario);
    var marioBox = new THREE.Box3().setFromObject(this.mario);
    var pipeBox1 = new THREE.Box3().setFromObject(this.pipes[0]);
    var pipeBox2 = new THREE.Box3().setFromObject(this.pipes[1]);
    var pipeBox3 = new THREE.Box3().setFromObject(this.pipes[2]);
    var pipeBox4 = new THREE.Box3().setFromObject(this.pipes[3]);
    var collision1 = marioBox.intersectsBox(pipeBox1);
    var collision2 = marioBox.intersectsBox(pipeBox2);
    var collision3 = marioBox.intersectsBox(pipeBox3);
    var collision4 = marioBox.intersectsBox(pipeBox4);

    this.collision = collision1 || collision2 || collision3 || collision4;
  }
  idleAnimation() {
    this.animationAction.stop();
    this.animationAction = this.currentMixer.clipAction(this.animations[0]);
    this.animationAction.play();
  }
  runningForwardAnimation() {
    // this.animationAction.stop();
    this.mario.rotation.y = 1.5;
    this.animationAction = this.currentMixer.clipAction(this.animations[1]);
    this.animationAction.play();
  }
  runningBackwardAnimation() {
    // this.animationAction.stop();
    this.mario.rotation.y = -1.5;
    this.animationAction = this.currentMixer.clipAction(this.animations[1]);
    this.animationAction.play();
  }
  jumpingAnimation() {
    // this.animationAction.stop();
    // this.playJumpAudio();
    this.animationAction = this.currentMixer.clipAction(this.animations[2]);
    this.animationAction.play();
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

  updateAnimations() {
    if (this.movementControls.directions.forward) {
      this.runningForwardAnimation();
    }
    if (this.movementControls.directions.backward) {
      this.runningBackwardAnimation();
    }
    if (this.movementControls.directions.up) {
      this.jumpingAnimation();
    }
  }

  RAF() {
    requestAnimationFrame((_) => {
      var delta = Math.min(this.clock.getDelta(), 0.1);
      this.RAF();
      // console.log(this.collision);
      this.controls.target.set(this.mario.position.x, 0, 0);
      this.controls.update();
      this.updateAnimations();
      this.movementControls.controlsUpdate(this.collision);
      this.currentMixer.update(delta);
      this.detectPipeCollision();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

let APP = null;

window.onload = () => {
  APP = new Game();
};
