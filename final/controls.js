export const mcontrols = (function () {
  class _MarioControls {
    constructor(target) {
      this.init(target);
    }

    async init(target) {
      console.log(target);
      this.target = await target;
      this.direction = null;
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
      console.log("pressing");
      switch (event.keyCode) {
        case 87: // w
          this.jump();
          this.update();
          break;
        case 32: // spacebar
          this.jump();
          this.update();
          d;
          break;
        case 65: // a
          this.moveBackward();
          this.update();
          break;
        case 68: // d
          this.moveForward();
          this.update();

          break;
        default:
          break;
      }
    }

    onKeyUp(_) {
      console.log("stop");
      this.stopMoving();
    }
    update() {
      const controlObject = this.target;
      switch (this.direction) {
        case "forward":
          controlObject.position.x += 1;
          break;
        case "backward":
          controlObject.position.x -= 1;
          break;
        case "jump":
          controlObject.position.y += 1;
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
