import * as THREE from "https://threejs.org/build/three.module.js";

export const mcontrols = (function () {
  class _MarioControls {
    constructor(params) {
      this.init(params);
    }

    async init(params) {
      this.params = await params;
      this.direction = null;
      this.controlsUpdate = this.update;
      this.clock = new THREE.Clock();

      document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
      document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
    }
    moveForward() {
      this.direction = "forward";
    }
    moveBackward() {
      this.direction = "backward";
    }
    jump() {
      this.direction = "jump";
    }
    stopMoving() {
      this.direction = "stop";
    }
    onKeyDown(event) {
      switch (event.keyCode) {
        case 87: // w
          this.jump();
          // this.update();
          break;
        case 32: // spacebar
          this.jump();
          // this.update();
          break;
        case 65: // a
          this.moveBackward();
          // this.update();
          break;
        case 68: // d
          this.moveForward();
          // this.update();
          break;
        default:
          break;
      }
    }

    onKeyUp(_) {
      this.stopMoving();
    }
    update() {
      const controlObject = this.params.target;
      var velocity = this.clock.getDelta() * 25;
      var camera = this.params.camera;
      switch (this.direction) {
        case "forward":
          controlObject.position.x += velocity;
          // controlObject.position.x += 1;
          // camera.position.x += velocity;
          break;
        case "backward":
          controlObject.position.x -= velocity;
          // camera.position.x -= velocity;
          break;
        case "jump":
          // controlObject.position.y += velocity;
          break;
        default:
          break;
      }
    }
  }
  return {
    MarioControls: _MarioControls,
  };
})();
