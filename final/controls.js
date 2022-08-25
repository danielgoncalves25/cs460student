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
    update(sideCollision, topCollision, deathZone) {
      function jumpEvent() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Tween.get(controlObject.position)
          .to(
            { y: (Math.cos(velocity) + 0.5) * 25 },
            300,
            createjs.Ease.getPowInOut(3)
          )
          .wait(100)
          .to({ y: 10 }, 300, createjs.Ease.getPowInOut(3));
      }
      // console.log(topCollision);
      const controlObject = this.params.target;
      var velocity = this.clock.getDelta() * 30;
      var camera = this.params.camera;
      var jumpAudio = this.params.playJumpAudio;
      if (!deathZone && controlObject.position.y >= 10) {
        if (this.directions.forward && !sideCollision) {
          if (controlObject.position.y > 10) {
            controlObject.position.x += velocity + 0.15;
            camera.position.x += velocity + 0.15;
          } else {
            camera.position.x += velocity;
            controlObject.position.x += velocity;
          }
        }
        if (this.directions.backward && !sideCollision) {
          if (controlObject.position.y > 10) {
            controlObject.position.x -= velocity + 0.15;
            camera.position.x -= velocity + 0.15;
          } else {
            camera.position.x -= velocity;
            controlObject.position.x -= velocity;
          }
        }
        if (this.directions.up && controlObject.position.y == 10) {
          jumpAudio();
          jumpEvent();
          this.directions.up = false;
          this.directions.idle = true;
        }
        if (topCollision) createjs.Ticker.paused = true;
        else createjs.Ticker.paused = false;
      } else {
        // fall to death
        createjs.Tween.get(controlObject.position).to(
          { y: -100 },
          1500,
          createjs.Ease.quadIn()
        );
      }
    }
  }
  return {
    MarioControls: _MarioControls,
  };
})();
