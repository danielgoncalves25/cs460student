export const mcontrols = () => {
  class MarioControls {
    constructor(target) {
      this.init(target);
    }

    init(target) {
      console.log(target);
      this.target = target;
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
          break;
        case 32: // spacebar
          this.jump();
          break;
        case 65: // a
          this.moveBackward();
          break;
        case 68: // d
          this.moveForward();
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
      // var controlObjectPosition = controlObject
      // console.log("updating");
      // this.target.position += 0.01;
    }
  }
  return {
    MarioControls: MarioControls,
  };
};
