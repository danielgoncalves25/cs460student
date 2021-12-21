import * as THREE from "https://threejs.org/build/three.module.js";
import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
// import { InteractionManager } from "https://cdn.jsdelivr.net/npm/three.interactive@1.1.0/build/three.interactive.js";

import { mcontrols } from "./controls.js";

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
    this.camera.position.set(-98, 38, 178);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(5));

    let light = new THREE.AmbientLight(0xffffff, 8);
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.clock = new THREE.Clock();
    this.sideCollision = false;
    this.topCollision = false;
    this.world = await this.getWorldModel();
    this.mario = await this.getMarioModel();
    this.parts = this.createPipes();
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
    for (var i = -100; i < 1300; i += 100) {
      this.CreateCloud(i);
    }
    this.RAF();
    return;
  }

  loadThemeAudio() {
    var themeAudioLoader = new THREE.AudioLoader();
    var themeListener = new THREE.AudioListener();
    var themeAudio = new THREE.Audio(themeListener);
    themeAudioLoader.load("./resources/themeSong.mp3", function (buffer) {
      themeAudio.setBuffer(buffer);
      // themeAudio.autoplay = true;
      // themeAudio.play();
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
    this.scene.add(this.mario);
    // Loads world
    this.world.position.set(200, 0, 0);
    this.world.scale.set(5, 5, 5);
    this.scene.add(this.world);
  }

  createPipes() {
    var geometry = new THREE.BoxGeometry(9, 15, 12);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var sidePipe1 = new THREE.Mesh(geometry, material);
    sidePipe1.position.set(18, 10, 20);
    sidePipe1.geometry.computeBoundingBox();
    sidePipe1.visible = false;

    var geometry = new THREE.BoxGeometry(9, 17, 12);
    var sidePipe2 = new THREE.Mesh(geometry, material);
    sidePipe2.position.set(69.5, 14, 20);
    sidePipe2.geometry.computeBoundingBox();
    sidePipe2.visible = false;

    var geometry = new THREE.BoxGeometry(9, 22, 12);
    var sidePipe3 = new THREE.Mesh(geometry, material);
    sidePipe3.position.set(111, 19, 20);
    sidePipe3.geometry.computeBoundingBox();
    sidePipe3.visible = false;

    var sidePipe4 = new THREE.Mesh(geometry, material);
    sidePipe4.position.set(168, 18, 20);
    sidePipe4.geometry.computeBoundingBox();
    sidePipe4.visible = false;

    var geometry = new THREE.BoxGeometry(10, 0.1, 12);
    var topPipe1 = new THREE.Mesh(geometry, material);
    topPipe1.position.set(18, 23, 20);
    topPipe1.material.color.setHex(0xff0000);
    topPipe1.geometry.computeBoundingBox();
    // topPipe1.visible = false;

    var geometry = new THREE.BoxGeometry(10, 0.1, 12);
    var topPipe2 = new THREE.Mesh(geometry, material);
    topPipe2.position.set(69.5, 28, 20);
    topPipe2.material.color.setHex(0xff0000);
    topPipe2.geometry.computeBoundingBox();
    // topPipe2.visible = false;

    var geometry = new THREE.BoxGeometry(10, 0.1, 12);
    var topPipe3 = new THREE.Mesh(geometry, material);
    topPipe3.position.set(111, 32, 20);
    topPipe3.material.color.setHex(0xff0000);
    topPipe3.geometry.computeBoundingBox();
    // topPipe3.visible = false;

    var geometry = new THREE.BoxGeometry(10, 0.1, 12);
    var topPipe4 = new THREE.Mesh(geometry, material);
    topPipe4.position.set(168, 32, 20);
    topPipe4.material.color.setHex(0xff0000);
    topPipe4.geometry.computeBoundingBox();
    // topPipe4.visible = false;

    this.scene.add(sidePipe1);
    this.scene.add(sidePipe2);
    this.scene.add(sidePipe3);
    this.scene.add(sidePipe4);
    this.scene.add(topPipe1);
    this.scene.add(topPipe2);
    this.scene.add(topPipe3);
    this.scene.add(topPipe4);

    var collisonParts = {
      side: [sidePipe1, sidePipe2, sidePipe3, sidePipe4],
      top: [topPipe1, topPipe2, topPipe3, topPipe4],
    };
    return collisonParts;
  }
  detectPipeCollision() {
    var marioBox = new THREE.Box3().setFromObject(this.mario);
    var sidePipeBox1 = new THREE.Box3().setFromObject(this.parts["side"][0]);
    var sidePipeBox2 = new THREE.Box3().setFromObject(this.parts["side"][1]);
    var sidePipeBox3 = new THREE.Box3().setFromObject(this.parts["side"][2]);
    var sidePipeBox4 = new THREE.Box3().setFromObject(this.parts["side"][3]);
    var sidecollision1 = marioBox.intersectsBox(sidePipeBox1);
    var sidecollision2 = marioBox.intersectsBox(sidePipeBox2);
    var sidecollision3 = marioBox.intersectsBox(sidePipeBox3);
    var sidecollision4 = marioBox.intersectsBox(sidePipeBox4);

    var topPipeBox1 = new THREE.Box3().setFromObject(this.parts["top"][0]);
    var topPipeBox2 = new THREE.Box3().setFromObject(this.parts["top"][1]);
    var topPipeBox3 = new THREE.Box3().setFromObject(this.parts["top"][2]);
    var topPipeBox4 = new THREE.Box3().setFromObject(this.parts["top"][3]);
    var topcollision1 = marioBox.intersectsBox(topPipeBox1);
    var topcollision2 = marioBox.intersectsBox(topPipeBox2);
    var topcollision3 = marioBox.intersectsBox(topPipeBox3);
    var topcollision4 = marioBox.intersectsBox(topPipeBox4);

    this.sideCollision =
      sidecollision1 || sidecollision2 || sidecollision3 || sidecollision4;
    this.topCollision =
      topcollision1 || topcollision2 || topcollision3 || topcollision4;
    // if (this.topCollision && !this.movementControls.directions.up) {
    //   console.log("stay");
    //   this.mario.position.y = this.mario.position.y;
    // }
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
    this.animationAction = this.currentMixer.clipAction(this.animations[2]);
    this.animationAction.play();
  }

  CreateCloud(x) {
    const mat = new THREE.MeshPhongMaterial({
      color: "white",
      flatShading: true,
    });
    const tuft1 = new THREE.SphereGeometry(1.5, 7, 8);
    tuft1.translate(-2, 0, 0);
    var cloud1 = new THREE.Mesh(tuft1, mat);
    cloud1.position.set(x, 80, -120);
    cloud1.scale.set(3, 3, 3);

    const tuft2 = new THREE.SphereGeometry(1.5, 7, 8);
    tuft2.translate(2, 0, 0);
    var cloud2 = new THREE.Mesh(tuft2, mat);
    cloud2.position.set(x, 80, -120);
    cloud2.scale.set(3, 3, 3);

    const tuft3 = new THREE.SphereGeometry(2.0, 7, 8);
    tuft3.translate(0, 0, 0);
    var cloud3 = new THREE.Mesh(tuft3, mat);
    cloud3.position.set(x, 80, -120);
    cloud3.scale.set(3, 3, 3);
    this.scene.add(cloud1);
    this.scene.add(cloud2);
    this.scene.add(cloud3);
  }

  OnWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateAnimations() {
    if (this.movementControls.directions.idle) {
      // console.log(this.movementControls.directions.idle);
      this.idleAnimation();
    }
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
      // console.log(this.camera.position);
      this.controls.target.set(this.mario.position.x, 0, 0);
      this.controls.update();
      this.updateAnimations();
      this.movementControls.controlsUpdate(
        this.sideCollision,
        this.topCollision
      );
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
