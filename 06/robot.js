class Robot {
  constructor(x, y, z) {
    console.log("New Robot");

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

    this.leftHand = new THREE.Bone();
    this.leftHand.position.x = 5;
    this.leftHand.position.y = -5;
    this.leftLowerLeg.add(this.leftHand);

    // Right Leg
    this.rightUpperLeg = new THREE.Bone();
    this.rightUpperLeg.position.x = -5;
    this.rightUpperLeg.position.y = -5;
    this.torso.add(this.rightUpperLeg);

    this.rightLowerLeg = new THREE.Bone();
    this.rightLowerLeg.position.x = -5;
    this.rightLowerLeg.position.y = -15;
    this.rightUpperLeg.add(this.rightLowerLeg);

    this.rightHand = new THREE.Bone();
    this.rightHand.position.x = -5;
    this.rightHand.position.y = -5;
    this.rightLowerLeg.add(this.rightHand);
  }
  show(scene) {
    console.log(this.neck.position);
    var rGroup = new THREE.Group();
    rGroup.add(this.head);

    scene.add(rGroup);

    var helper = new THREE.SkeletonHelper(rGroup);
    scene.add(helper);
  }
}
