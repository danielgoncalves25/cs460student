import * as THREE from "https://threejs.org/build/three.module.js";
// import { TWEEN } from "https://cdn.jsdelivr.net/npm/three@0.135.0/examples/jsm/libs/tween.module.min.js";

export const mcontrols = (function () {
  class _MarioControls {
    constructor(params) {
      this.init(params);
    }

    async init(params) {
      this.params = await params;
      this.directions = {
        idle: true,
        forward: false,
        backward: false,
        up: false,
      };
      this.controlsUpdate = this.update;
      this.clock = new THREE.Clock();

      document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
      document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event) {
      switch (event.keyCode) {
        case 87: // w
          this.directions.up = true;
          break;
        case 32: // spacebar
          this.directions.up = true;
          break;
        case 65: // a
          this.directions.backward = true;
          break;
        case 68: // d
          this.directions.forward = true;
          break;
        default:
          this.directions.idle = false;
          break;
      }
    }

    onKeyUp(event) {
      switch (event.keyCode) {
        case 87: // w
          this.directions.up = false;
          break;
        case 32: // spacebar
          this.directions.up = false;
          break;
        case 65: // a
          this.directions.backward = false;
          break;
        case 68: // d
          this.directions.forward = false;
          break;
        default:
          this.directions.idle = true;
          break;
      }
    }
    update() {
      const controlObject = this.params.target;
      var velocity = this.clock.getDelta() * 25;
      var camera = this.params.camera;
      var collision = this.params.collision;
      if (collision) {
        console.log("collison");
      }
      if (this.directions.forward) {
        controlObject.position.x += velocity;
        camera.position.x += velocity;
      }
      if (this.directions.backward) {
        controlObject.position.x -= velocity;
        camera.position.x -= velocity;
      }
      if (this.directions.up) {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Tween.get(controlObject.position)
          .to(
            { y: (Math.cos(velocity) + 0.5) * 25 },
            500,
            createjs.Ease.getPowInOut(3)
          )
          .wait(200)
          .to({ y: 10 }, 500, createjs.Ease.getPowInOut(3));
      }
    }
  }
  return {
    MarioControls: _MarioControls,
  };
})();
