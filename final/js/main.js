import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";

class Game {
  constructor() {
    this.Initialize();
  }

  Initialize() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
    this.objects = {};

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
    // this.camera.position.set(-20, 37, 193);
    this.camera.position.set(-20, 37, 193);

    this.scene = new THREE.Scene();
    // let directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    // directionalLight.position.set(20, 100, 13);
    // const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // this.scene.add(directionalLight);
    // this.scene.add(helper);

    // let directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    // directionalLight2.position.set(240, 100, 13);
    // const helper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
    // this.scene.add(directionalLight2);
    // this.scene.add(helper2);

    for (var i = -50; i < 1500; i += 300) {
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.lookAt(0, 0, 16);
      directionalLight.position.set(i, 100, 16);
      this.scene.add(directionalLight);
      let hemiLight = new THREE.HemisphereLight(0x99ccff, 0xffffff, 0.5);
      hemiLight.position.set(i, 70, 16);
      this.scene.add(hemiLight);
      // const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
      // this.scene.add(helper);
      // const helper2 = new THREE.HemisphereLightHelper(hemiLight, 5);
      // this.scene.add(helper2);
    }

    let light = new THREE.AmbientLight(0xffffff, 8);
    this.scene.add(light);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    this.gui = new GUI();
    // var directionalFolder = this.gui.addFolder("Directional Light");
    // directionalFolder.add(directionalLight.position, "x", -200, 700);
    // directionalFolder.add(directionalLight.position, "y", -200, 200);
    // directionalFolder.add(directionalLight.position, "z", -200, 200);
    // directionalFolder.open();
    // var directionalFolder2 = this.gui.addFolder("Directional Light 2");
    // directionalFolder2.add(directionalLight2.position, "x", -200, 700);
    // directionalFolder2.add(directionalLight2.position, "y", -200, 200);
    // directionalFolder2.add(directionalLight2.position, "z", -200, 200);
    // directionalFolder2.open();
    var cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.camera.position, "x", -50, 1500);
    cameraFolder.add(this.camera.position, "y", -200, 200);
    cameraFolder.add(this.camera.position, "z", -200, 200);
    cameraFolder.open();

    this.LoadMarioModel();
    this.LoadWorldModel();
    this.RAF();
  }

  LoadMarioModel() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/mario/");
    loader.load("scene.gltf", (gltf) => {
      // console.log(gltf);
      var mario = gltf.scene;
      mario.scale.set(0.3, 0.3, 0.3);
      this.objects.mario = mario;
      this.scene.add(mario);
    });
  }
  LoadWorldModel() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/world/");
    loader.load("scene.gltf", (gltf) => {
      var world = gltf.scene;
      var poles =
        world.children[0].children[0].children[0].children[0].children[0]
          .children[0];

      var unknown =
        world.children[0].children[0].children[0].children[0].children[0]
          .children[5];
      unknown.material.color.setHex(0xffc0cb);
      console.log(unknown);
      // world.children[0].children[0].children[0].children[0].children[0].children[0].visible = false;
      // console.log(
      //   world.children[0].children[0].children[0].children[0].children[0]
      //     .children[0]
      // );
      world.position.set(0, 0, 0);
      world.scale.set(0.01, 0.01, 0.01);
      this.objects.world = {
        poles: poles,
      };
      this.scene.add(world);
    });
  }

  CreateCloud(x) {
    console.log("creating clouds at ", x);
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
