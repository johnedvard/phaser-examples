const catGhost = 0b001;
const catPlayer = 0b010;
const catWall = 0b100;

const playerRadius = 10;
const ghostRadius = 15;
const wallLength = 300;
const wallHeight = 30;

class Level extends Phaser.Scene {
  wall;
  ghost;
  player;
  wallGraphics;
  ghostGraphics;
  playerGraphics;
  reverseGravityTimer = 0;
  isGravityUp = false;

  create() {
    this.createWall();
    this.createGhost();
    this.createPlayer();
    this.createFloor();
    this.createCeiling();
  }

  createWall() {
    this.wall = this.matter.add.rectangle(300, 150, wallLength, wallHeight, {
      isStatic: true,
      collisionFilter: { category: catWall, mask: catPlayer },
    });

    this.wallGraphics = this.add.graphics({
      fillStyle: { color: 0, alpha: 0.7 },
    });
  }

  createGhost() {
    this.ghost = this.matter.add.circle(400, 100, ghostRadius, {
      collisionFilter: { group: 1, category: catGhost },
    });
    this.ghostGraphics = this.add.graphics({
      fillStyle: { color: 0xffbf81, alpha: 0.5 },
    });
  }

  createPlayer() {
    this.player = this.matter.add.circle(200, 100, playerRadius, {
      collisionFilter: { group: 1, category: catPlayer, mask: catWall },
    });
    this.playerGraphics = this.add.graphics({
      fillStyle: { group: 1, color: 0x6e7bff, alpha: 1 },
    });
  }

  createCeiling() {
    const ceiling = this.matter.add.rectangle(0, 0, 900 * 2, 10, {
      isStatic: true,
      collisionFilter: { group: 1 },
    });
  }

  createFloor() {
    const floor = this.matter.add.rectangle(0, 400, 900 * 2, 100, {
      isStatic: true,
      collisionFilter: { group: 1 },
    });
  }

  reverseGravity(delta) {
    this.reverseGravityTimer += delta;
    if (this.reverseGravityTimer > 2000) {
      this.isGravityUp = !this.isGravityUp;

      this.reverseGravityTimer = 0;
      if (this.isGravityUp) {
        this.matter.world.setGravity(0, 1, 0.001);
      } else {
        this.matter.world.setGravity(0, 1, -0.001);
      }
    }
  }
  update(time, delta) {
    this.reverseGravity(delta);
    this.wallGraphics.clear();
    this.playerGraphics.clear();
    this.ghostGraphics.clear();
    this.ghostGraphics.fillCircle(
      this.ghost.position.x,
      this.ghost.position.y,
      ghostRadius
    );
    this.playerGraphics.fillCircle(
      this.player.position.x,
      this.player.position.y,
      playerRadius
    );
    this.wallGraphics.fillRect(
      this.wall.position.x - wallLength / 2,
      this.wall.position.y - wallHeight / 2,
      wallLength,
      wallHeight
    );
  }
}

let game;

export const initGame = () => {
  if (game) return;
  const gameConfig = {
    type: Phaser.WEBGL,
    width: 900,
    height: 400,
    backgroundColor: "#191919",
    physics: {
      default: "matter",
      matter: {
        debug: false,
        gravity: { x: 0, y: 2 },
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
    },
  };
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
