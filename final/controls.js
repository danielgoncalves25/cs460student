import * as THREE from "https://threejs.org/build/three.module.js";

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
          this.directions.idle = false;
          break;
        case 32: // spacebar
          this.directions.up = true;
          this.directions.idle = false;
          break;
        case 65: // a
          this.directions.backward = true;
          this.directions.idle = false;
          break;
        case 68: // d
          this.directions.forward = true;
          this.directions.idle = false;
          break;
        default:
          this.directions.idle = false;
          break;
      }
    }

    onKeyUp(event) {
      switch (event.keyCode) {
        // case 87: // w
        //   this.directions.up = false;
        //   this.directions.idle = true;
        //   break;
        // case 32: // spacebar
        //   this.directions.up = false;
        //   this.directions.idle = true;
        //   break;
        case 65: // a
          this.directions.backward = false;
          this.directions.idle = true;
          break;
        case 68: // d
          this.directions.forward = false;
          this.directions.idle = true;
          break;
        default:
          this.directions.idle = false;
          break;
      }
    }
    update(isCollision) {
      // console.log(this.directions);
      const controlObject = this.params.target;
      var velocity = this.clock.getDelta() * 17;
      var camera = this.params.camera;
      var jumpAudio = this.params.playJumpAudio;
      // if (isCollision) {
      //   console.log("collison from controls upadte");
      // }
      if (this.directions.forward) {
        if (controlObject.position.y > 10) {
          controlObject.position.x += velocity + 0.1;
          camera.position.x += velocity + 0.1;
        } else {
          camera.position.x += velocity;
          controlObject.position.x += velocity;
        }
      }
      if (this.directions.backward) {
        controlObject.position.x -= velocity;
        camera.position.x -= velocity;
      }
      if (this.directions.up && controlObject.position.y == 10) {
        jumpAudio();
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Tween.get(controlObject.position)
          .to(
            { y: (Math.cos(velocity) + 0.5) * 25 },
            400,
            createjs.Ease.getPowInOut(3)
          )
          .wait(100)
          .to({ y: 10 }, 400, createjs.Ease.getPowInOut(3));
        this.directions.up = false;
        this.directions.idle = true;
      }
    }
  }
  return {
    MarioControls: _MarioControls,
  };
})();
