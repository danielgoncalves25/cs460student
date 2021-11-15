class Robot2 {
  constructor(x, y, z) {
    this.movement = "";

    var fromhelper = HELPER.cylinderSkeletonMesh(3, 5, "red");
    var geometry = fromhelper[0];
    var material = fromhelper[1];
    var bones = fromhelper[2];
    var mesh = new THREE.SkinnedMesh(geometry, material);
    var skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);

    this.root = bones[0];
    this.root.position.set(x, y, z);

    this.head = bones[1];
    this.head.position.y = 10;

    this.neck = bones[2];
    this.neck.position.y = -10;

    this.torso = bones[3];
    this.torso.position.y = -30;

    this.bodyMesh = mesh;

    // Left Arm
    var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "blue");
    var geometry = fromHelper[0];
    var material = fromHelper[1];
    var bones = fromHelper[2];
    var mesh = new THREE.SkinnedMesh(geometry, material);
    var skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    this.neck.add(bones[0]);

    this.leftUpperArm = bones[1];
    this.leftUpperArm.position.x = 5;
    this.leftUpperArm.position.y = -5;

    this.leftLowerArm = bones[2];
    this.leftLowerArm.position.x = 5;
    this.leftLowerArm.position.y = -15;

    this.leftHand = bones[3];
    this.leftHand.position.x = 5;
    this.leftHand.position.y = -5;

    this.leftArmMesh = mesh;

    // Right Arm
    var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "blue");
    var geometry = fromHelper[0];
    var material = fromHelper[1];
    var bones = fromHelper[2];
    var mesh = new THREE.SkinnedMesh(geometry, material);
    var skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    this.neck.add(bones[0]);

    this.rightUpperArm = bones[1];
    this.rightUpperArm.position.x = -5;
    this.rightUpperArm.position.y = -5;

    this.rightLowerArm = bones[2];
    this.rightLowerArm.position.x = -5;
    this.rightLowerArm.position.y = -15;

    this.rightHand = bones[3];
    this.rightHand.position.x = -5;
    this.rightHand.position.y = -5;

    this.rightArmMesh = mesh;

    // Left Leg
    var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "blue");
    var geometry = fromHelper[0];
    var material = fromHelper[1];
    var bones = fromHelper[2];
    var mesh = new THREE.SkinnedMesh(geometry, material);
    var skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    this.torso.add(bones[0]);

    this.leftUpperLeg = bones[1];
    this.leftUpperLeg.position.x = 5;
    this.leftUpperLeg.position.y = -5;

    this.leftLowerLeg = bones[2];
    this.leftLowerLeg.position.x = 5;
    this.leftLowerLeg.position.y = -15;

    this.leftLeg = bones[3];
    this.leftLeg.position.x = 5;
    this.leftLeg.position.y = -5;

    this.leftLegMesh = mesh;

    // Right Leg
    var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "blue");
    var geometry = fromHelper[0];
    var material = fromHelper[1];
    var bones = fromHelper[2];
    var mesh = new THREE.SkinnedMesh(geometry, material);
    var skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    this.torso.add(bones[0]);

    this.rightUpperLeg = bones[1];
    this.rightUpperLeg.position.x = -5;
    this.rightUpperLeg.position.y = -5;

    this.rightLowerLeg = bones[2];
    this.rightLowerLeg.position.x = -5;
    this.rightLowerLeg.position.y = -15;

    this.rightLeg = bones[3];
    this.rightLeg.position.x = -5;
    this.rightLeg.position.y = -5;

    this.rightLegMesh = mesh;
  }
  show(scene) {
    scene.add(this.bodyMesh);
    scene.add(this.leftArmMesh);
    scene.add(this.rightArmMesh);
    scene.add(this.leftLegMesh);
    scene.add(this.rightLegMesh);
  }
  raiseLeftArm() {
    this.movement = "raise left arm";
  }
  lowerLeftArm() {
    this.movement = "lower left arm";
  }
  kick() {
    this.movement = "kick";
  }
  dance() {
    this.movement = "dance";
  }
  walk() {
    this.movement = "walk";
  }
  walk2() {
    this.movement = "walk2";
  }
  onAnimate() {
    if (this.movement == "raise left arm") {
      var T = Math.PI;
      this.leftUpperArm.quaternion.slerp(
        new THREE.Quaternion(Math.sin(-T / 2), 0, 0, Math.cos(-T / 2)),
        0.1
      );
    } else if (this.movement == "lower left arm") {
      this.leftUpperArm.quaternion.slerp(new THREE.Quaternion(0, 0, 0, 1), 0.1);
    } else if (this.movement == "kick") {
      // check if slerp reached almost the end
      if (this.rightUpperLeg.quaternion.w < 0.72) {
        // signal that the kick is done and the leg should move back
        this.movement = "kick done";
      } else {
        var T = -Math.PI / 2;
        this.rightUpperLeg.quaternion.slerp(
          new THREE.Quaternion(
            Math.sin(T / 2), // x
            0, // y
            0, // z
            Math.cos(T / 2)
          ), // w
          0.1
        );
      }
    } else if (this.movement == "kick done") {
      // reset leg back to identity
      this.rightUpperLeg.quaternion.slerp(
        new THREE.Quaternion(0, 0, 0, 1),
        0.1
      );
    } else if (this.movement == "dance") {
      if (typeof this.dancer === "undefined") {
        this.dancer = setInterval(
          function () {
            //
            // some random translation
            //
            var shakehead = 3 * Math.random();
            if (Math.random() < 0.5) {
              shakehead *= -1;
            }

            var shakeneck = 3 * Math.random();
            if (Math.random() < 0.5) {
              shakeneck *= -1;
            }

            var shaketorso = 3 * Math.random();
            if (Math.random() < 0.5) {
              shaketorso *= -1;
            }

            this.head.position.x += shakehead;

            this.neck.position.x += shakeneck;

            this.torso.position.x += shaketorso;

            //
            // use actions
            //
            if (Math.random() < 0.3) {
              this.raiseLeftArm();
            }

            if (Math.random() < 0.3) {
              this.lowerLeftArm();
            }

            if (Math.random() < 0.3) {
              this.kick();
            }

            if (Math.random() < 0.3) {
              this.movement = "kick done";
            }
          }.bind(this),
          500
        );
      }
    } else if (this.movement == "walk") {
      const q = new THREE.Quaternion(
        Math.sin(Math.PI / 2 / 2),
        0,
        0,
        Math.cos(Math.PI / 2 / 2)
      );
      this.leftUpperLeg.quaternion.slerp(q, 0.1);
    } else if (this.movement == "walk2") {
      const q = new THREE.Quaternion(0, 0, 0, 1);
      this.leftUpperLeg.quaternion.slerp(q, 0.1);
    }
  }
}
