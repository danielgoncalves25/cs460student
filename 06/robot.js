class Robot {
  constructor(x, y, z) {
    this.movement = "";
    this.head = new THREE.Bone();
    this.head.position.x = x;
    this.head.position.y = y;
    this.head.position.z = z;

    //neck position is relative to the head
    this.neck = new THREE.Bone();
    this.neck.position.y = -10;
    this.head.add(this.neck);

    // Left Arm
    this.leftUpperArm = new THREE.Bone();
    this.leftUpperArm.position.x = 5;
    this.leftUpperArm.position.y = -5;
    this.neck.add(this.leftUpperArm);

    this.leftLowerArm = new THREE.Bone();
    this.leftLowerArm.position.x = 5;
    this.leftLowerArm.position.y = -15;
    this.leftUpperArm.add(this.leftLowerArm);

    this.leftHand = new THREE.Bone();
    this.leftHand.position.x = 5;
    this.leftHand.position.y = -5;
    this.leftLowerArm.add(this.leftHand);

    // Right Arm
    this.rightUpperArm = new THREE.Bone();
    this.rightUpperArm.position.x = -5;
    this.rightUpperArm.position.y = -5;
    this.neck.add(this.rightUpperArm);

    this.rightLowerArm = new THREE.Bone();
    this.rightLowerArm.position.x = -5;
    this.rightLowerArm.position.y = -15;
    this.rightUpperArm.add(this.rightLowerArm);

    this.rightHand = new THREE.Bone();
    this.rightHand.position.x = -5;
    this.rightHand.position.y = -5;
    this.rightLowerArm.add(this.rightHand);

    // Torso
    this.torso = new THREE.Bone();
    this.torso.position.y = -30;
    this.neck.add(this.torso);

    // Left Leg
    this.leftUpperLeg = new THREE.Bone();
    this.leftUpperLeg.position.x = 5;
    this.leftUpperLeg.position.y = -5;
    this.torso.add(this.leftUpperLeg);

    this.leftLowerLeg = new THREE.Bone();
    this.leftLowerLeg.position.x = 5;
    this.leftLowerLeg.position.y = -15;
    this.leftUpperLeg.add(this.leftLowerLeg);

    this.leftLeg = new THREE.Bone();
    this.leftLeg.position.x = 5;
    this.leftLeg.position.y = -5;
    this.leftLowerLeg.add(this.leftLeg);

    // Right Leg
    this.rightUpperLeg = new THREE.Bone();
    this.rightUpperLeg.position.x = -5;
    this.rightUpperLeg.position.y = -5;
    this.torso.add(this.rightUpperLeg);

    this.rightLowerLeg = new THREE.Bone();
    this.rightLowerLeg.position.x = -5;
    this.rightLowerLeg.position.y = -15;
    this.rightUpperLeg.add(this.rightLowerLeg);

    this.rightLeg = new THREE.Bone();
    this.rightLeg.position.x = -5;
    this.rightLeg.position.y = -5;
    this.rightLowerLeg.add(this.rightLeg);
  }
  show(scene) {
    var rGroup = new THREE.Group();
    rGroup.add(this.head);

    scene.add(rGroup);

    var helper = new THREE.SkeletonHelper(rGroup);
    scene.add(helper);
  }
  raiseLeftArm() {
    this.movement = "raiseLeftArm";
  }
  lowerLeftArm() {
    this.movement = "lowerLeftArm";
  }
  kick() {
    this.movement = "kick";
  }
  onKick() {
    if (this.rightUpperLeg.quaternion.w < 0.72) {
      this.movement = "kickDone";
    } else {
      var T = -Math.PI / 2;
      this.rightUpperLeg.quaternion.slerp(
        new THREE.Quaternion(Math.sin(T / 2), 0, 0, Math.cos(T / 2)),
        0.1
      );
    }
  }

  onAnimate() {
    switch (this.movement) {
      case "raiseLeftArm":
        animateHelper(this.leftUpperArm.quaternion, "raise");
        break;

      case "lowerLeftArm":
        animateHelper(this.leftUpperArm.quaternion, "lower");
        break;
      case "raiseRightArm":
        animateHelper(this.rightUpperArm.quaternion, "raise");
        break;

      case "lowerRightArm":
        animateHelper(this.rightUpperArm.quaternion, "lower");
        break;

      case "kick":
        // this.onKick();
        if (this.rightUpperLeg.quaternion.w < 0.72) {
          this.movement = "kickDone";
        } else {
          var T = -Math.PI / 2;
          this.rightUpperLeg.quaternion.slerp(
            new THREE.Quaternion(Math.sin(T / 2), 0, 0, Math.cos(T / 2)),
            0.1
          );
        }
        if (this.movement == "kick done")
          animateHelper(this.rightUpperArm.quaternion, "lower");
        break;
    }
  }
}

const animateHelper = (currentQ, type) => {
  var T = Math.PI;
  var x = Math.sin(T / 2);
  var y = 0;
  var z = 0;
  var w = Math.cos(T / 2);

  var q2 =
    type == "raise"
      ? new THREE.Quaternion(x, y, z, w)
      : new THREE.Quaternion(0, 0, 0, 1);

  currentQ.slerp(q2, 0.01);
  return;
};
