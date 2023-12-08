class Level extends Phaser.Scene {
  segments = 4;
  controlPoints = [];
  graphics;
  pointsGraphics;
  segmentsText;

  preload() {
    this.load.spritesheet("dragcircle", "assets/sprites/dragcircle.png", {
      frameWidth: 16,
    });
  }

  create() {
    this.graphics = this.add.graphics();
    this.pointsGraphics = this.add.graphics();
    this.segmentsText = this.add
      .text(850, 30, "Segments: " + this.segments, {
        fontFamily: "Arial",
        fontStyle: "bold",
        fontSize: 32,
        color: "#fefefe",
        align: "center",
      })
      .setOrigin(1, 0.5)
      .setPadding(10);
    this.createControlPoints();
    this.createPlusMinusButtons();
  }

  update() {
    const points = this.getPointsOnCurve(this.segments);
    this.drawCurve(points);
    this.drawControlPointLines();
  }

  drawControlPointLines() {
    this.graphics.save();
    this.graphics.beginPath();
    this.graphics.lineStyle(1, 0x00ff00, 1);
    const cp1 = this.controlPoints[0];
    const cp2 = this.controlPoints[1];
    const cp3 = this.controlPoints[2];
    const cp4 = this.controlPoints[3];
    this.drawLine(cp1, cp2);
    this.drawLine(cp3, cp4);
    this.graphics.closePath();
    this.graphics.restore();
  }

  createControlPoints() {
    const p1 = new Phaser.Math.Vector2(100, 100);
    const p2 = new Phaser.Math.Vector2(150, 50);
    const p3 = new Phaser.Math.Vector2(250, 50);
    const p4 = new Phaser.Math.Vector2(300, 200);
    this.controlPoints.push(p1, p2, p3, p4);
    const point1 = this.add.image(p1.x, p1.y, "dragcircle", 1).setInteractive();
    const point2 = this.add.image(p2.x, p2.y, "dragcircle", 1).setInteractive();
    const point3 = this.add.image(p3.x, p3.y, "dragcircle", 1).setInteractive();
    const point4 = this.add.image(p4.x, p4.y, "dragcircle", 1).setInteractive();
    point1.setData("vector", p1);
    point2.setData("vector", p2);
    point3.setData("vector", p3);
    point4.setData("vector", p4);

    this.input.setDraggable([point1, point2, point3, point4]);

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;

      // update the position of the control points
      gameObject.data.get("vector").set(dragX, dragY);
    });
  }

  getPointsOnCurve(segments) {
    const points = [];

    for (let i = 0; i < segments; i++) {
      const cp1 = this.controlPoints[0];
      const cp2 = this.controlPoints[1];
      const cp3 = this.controlPoints[2];
      const cp4 = this.controlPoints[3];
      points.push(this.getPointOnCurve(cp1, cp2, cp3, cp4, i / segments));
    }
    points.push(this.controlPoints[3]);

    return points;
  }

  getPointOnCurve(p1, p2, p3, p4, u) {
    const s1 = new Phaser.Math.Vector2(
      p1.x + (p2.x - p1.x) * u,
      p1.y + (p2.y - p1.y) * u
    );
    const s2 = new Phaser.Math.Vector2(
      p2.x + (p3.x - p2.x) * u,
      p2.y + (p3.y - p2.y) * u
    );
    const s3 = new Phaser.Math.Vector2(
      p3.x + (p4.x - p3.x) * u,
      p3.y + (p4.y - p3.y) * u
    );

    const s4 = new Phaser.Math.Vector2(
      s1.x + (s2.x - s1.x) * u,
      s1.y + (s2.y - s1.y) * u
    );
    const s5 = new Phaser.Math.Vector2(
      s2.x + (s3.x - s2.x) * u,
      s2.y + (s3.y - s2.y) * u
    );
    const s6 = new Phaser.Math.Vector2(
      s4.x + (s5.x - s4.x) * u,
      s4.y + (s5.y - s4.y) * u
    );
    return s6;
  }

  drawCurve(points) {
    this.graphics.clear();
    this.graphics.save();
    this.graphics.lineStyle(5, 0xfefefe, 1.0);
    this.graphics.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      this.drawLine(p1, p2);
    }
    this.graphics.closePath();
    this.graphics.restore();
  }

  drawLine(p1, p2) {
    this.graphics.moveTo(p1.x, p1.y);
    this.graphics.lineTo(p2.x, p2.y);
    this.graphics.strokePath();
  }

  setNumberOfSegments(segments) {
    this.segments = segments;
  }

  createPlusMinusButtons() {
    const minusBtn = this.add.graphics();

    minusBtn.fillStyle(0xffffff, 1);
    minusBtn.fillRoundedRect(732, 70, 50, 50, 15);
    minusBtn.setInteractive(
      new Phaser.Geom.Rectangle(732, 70, 50, 50),
      Phaser.Geom.Rectangle.Contains
    );

    const plusBtn = this.add.graphics();
    plusBtn.fillStyle(0xffffff, 1);
    plusBtn.fillRoundedRect(800, 70, 50, 50, 15);
    plusBtn.setInteractive(
      new Phaser.Geom.Rectangle(800, 70, 50, 50),
      Phaser.Geom.Rectangle.Contains
    );

    plusBtn.on("pointerup", () => {
      this.segments++;
      this.segmentsText.setText("Segments: " + this.segments);
    });
    minusBtn.on("pointerup", () => {
      this.segments--;
      if (this.segments < 1) this.segments = 1;
      this.segmentsText.setText("Segments: " + this.segments);
    });
    const minusTxt = this.add
      .text(757, 90, "-", {
        fontFamily: "Arial",
        fontSize: 64,
        color: "#191919",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setPadding(10);
    const plusTxt = this.add
      .text(825, 97, "+", {
        fontFamily: "Arial",
        fontSize: 54,
        color: "#191919",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setPadding(10);
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
