class Level extends Phaser.Scene {
  rope; // the rope that help us with drawing the mesh
  graphics;
  spineCurve; // the curve that goes from start to end, in the center of each bone
  graphics; // used to draw the spline (curve) that goes through the spine
  spinePoints;
  skeleton;

  preload() {
    this.load.image("example", "assets/sprites/phaser3-logo.png");
  }

  create() {
    this.createRope();
    this.createSkeleton();
    this.createSpine();
    this.createFloor();

    this.graphics = this.add.graphics();
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  update() {
    this.updateMesh();
    // this.renderRopeCenterLine();
  }

  // Use Phaser's built in Rope to create a mesh from the image.
  createRope() {
    this.rope = this.add.rope(0, 0, "example");
    this.rope.setPoints(40);
  }

  // Create the physics boxes
  createSkeleton() {
    this.skeleton = [];

    for (let i = 0; i < 18; i++) {
      const bone = this.matter.add.rectangle(180, 150, 20, 55, {
        friction: 1,
        restitution: 0.06,
      });
      this.skeleton.push(bone);
    }
  }

  // Connect the bones to form our skeleton (spine)
  createSpine() {
    const spinePoints = [];
    // connect each bone with a constraint to create a spine
    for (let i = 0; i < this.skeleton.length - 1; i++) {
      const boneA = this.skeleton[i];
      const boneB = this.skeleton[i + 1];
      const pointA = { x: 10, y: 0 };
      const pointB = { x: -10, y: 0 };
      this.matter.add.constraint(boneA, boneB, 0.1, 1, {
        pointA,
        pointB,
      });
      spinePoints.push(...[0, 0]);
    }
    // Creates a smooth line that goes through the center of our bones (physics rectangles)
    this.spineCurve = new Phaser.Curves.Spline([0, 0, ...spinePoints]);
  }

  updateMesh() {
    this.rope.setDirty();
    let ropePoints = this.rope.points;
    this.spinePoints = this.spineCurve.points;

    for (let i = 0; i < this.spinePoints.length; i++) {
      this.spinePoints[i].x = this.skeleton[i].position.x;
      this.spinePoints[i].y = this.skeleton[i].position.y;
    }
    const spinePoints = this.spineCurve.getPoints(ropePoints.length);
    for (let i = 0; i < ropePoints.length; i++) {
      ropePoints[i].x = spinePoints[i].x;
      ropePoints[i].y = spinePoints[i].y;
    }
  }

  createFloor() {
    const floor = this.matter.add.rectangle(0, 350, 900 * 2, 100, {
      isStatic: true,
    });
  }

  renderRopeCenterLine() {
    this.graphics.clear();
    this.graphics.lineStyle(8, 0xffffff, 1);
    this.graphics.fillStyle(0xffff00, 1);
    this.spineCurve.draw(this.graphics, 64);
  }
}
let game;
game = new Phaser.Game({
  type: Phaser.WEBGL,
  width: 900,
  height: 400,
  backgroundColor: "#ffffff",
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { x: 0, y: 2 },
    },
  },
  loader: {
    baseURL: "https://labs.phaser.io",
    crossOrigin: "anonymous",
  },
});

export const initGame = () => {
  if (game) return;
  game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 900,
    height: 400,
    backgroundColor: "#191919",
    scale: {
      mode: Phaser.Scale.FIT,
    },
    physics: {
      default: "matter",
      matter: {
        debug: false,
        gravity: { x: 0, y: 2 },
      },
    },
    loader: {
      baseURL: "https://labs.phaser.io",
      crossOrigin: "anonymous",
    },
  });
  /** used if embedded directly on a page */
  const gameParentEl = document.getElementById("phaser-example-parent");
  const gameCanvasEl = document.getElementById("phaser-example");
  if (gameCanvasEl) gameConfig.canvas = gameCanvasEl;
  if (gameParentEl) gameConfig.parent = gameParentEl;
  game = new Phaser.Game(gameConfig);
  game.scene.add("Level", Level, true);
  console.log("game loaded");
};
initGame();

game.scene.add("Level", Level, true);
