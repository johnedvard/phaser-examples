function createUniqueSortedVertices(vertices) {
  const seen = {};
  // we need to remove verticies with the same coordinates to make sure we map the bodies in the cloth correctly (and don't pick the "same" vertex)
  const tmp = [...vertices].filter((item) => {
    if (seen.hasOwnProperty(item.u + "-" + item.v)) return false;
    seen[item.u + "-" + item.v] = true;
    return true;
  });

  // sort based on UV map. UV coordinate 0,0 first, and 1,1 last
  tmp.sort((a, b) => {
    if (a.v < b.v) return -1;
    if (a.v > b.v) return 1;
    if (a.u < b.u) return -1;
    if (a.u > b.u) return 1;
    return 0;
  });
  return tmp;
}

// We need to move all vertices that share the same vertex
function getSharedVerteces(v1, vertices) {
  const shared = [];
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    if (v.x === v1.x && v.y === v1.y) shared.push(v);
  }
  return shared;
}

class Level extends Phaser.Scene {
  debug;
  mesh;
  uniqueVertiesSortedByUV;

  preload() {
    this.load.image("example", "assets/sprites/phaser3-logo.png");
  }

  create() {
    const mesh = this.add.mesh(300, 300, "example");
    this.mesh = mesh;

    this.matter.world.setBounds();
    this.matter.add.mouseSpring(); // Try to drag the cloth with the mouse

    const group = this.matter.world.nextGroup(true);

    const particleOptions = {
      friction: 0.00001,
      collisionFilter: { group: group },
      render: { visible: false },
    };

    const constraintOptions = { stiffness: 0.06 };
    this.cloth = this.matter.add.softBody(
      700 / 2 - (60 * 4) / 2,
      400 / 2 - 25 * 4,
      6,
      3,
      65,
      35,
      false,
      8,
      particleOptions,
      constraintOptions
    );
    // Prevent the cloth from collapsing
    this.cloth.bodies[0].isStatic = true;
    this.cloth.bodies[5].isStatic = true;

    Phaser.Geom.Mesh.GenerateGridVerts({
      width: 412, // width of image
      height: 93, // height of image
      texture: "example",
      mesh,
      widthSegments: 5,
      heightSegments: 2,
    });
    mesh.panZ(1); // need to call it once to make setOrtho work for some reason
    mesh.setOrtho(mesh.width, mesh.height); // make the mesh visible in the scene

    this.debug = this.add.graphics(); // create graphics that we can use for bugging
    mesh.setDebug(this.debug);

    this.uniqueVertiesSortedByUV = createUniqueSortedVertices(mesh.vertices);
  }

  getClosestVertex(i) {
    return this.uniqueVertiesSortedByUV[i];
  }

  updateMesh() {
    if (!this.mesh) return;
    this.mesh.ignoreDirtyCache = true; // need to set this flag and call preUpdate to update the mesh
    // map each body in the cloth to a vertex in the mesh and update the mesh position based on body position
    for (let i = 0; i < this.cloth.bodies.length; i++) {
      const body1 = this.cloth.bodies[i];
      const shareVertices = getSharedVerteces(
        this.getClosestVertex(i),
        this.mesh.vertices
      );
      shareVertices.forEach((v) => {
        v.x =
          body1.position.x / this.mesh.scaleX - this.mesh.x / this.mesh.scaleX; // make up for position offset and scale
        v.y =
          -body1.position.y / this.mesh.scaleY + this.mesh.y / this.mesh.scaleY;
      });
    }

    this.mesh.preUpdate();
    this.mesh.ignoreDirtyCache = false;
  }

  update() {
    // draw the mesh triangles
    this.debug.clear();
    this.debug.lineStyle(1, 0x00ff00);
    this.updateMesh();
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
    loader: {
      baseURL: "https://labs.phaser.io",
      crossOrigin: "anonymous",
    },
    physics: {
      default: "matter",
      matter: {
        debug: true,
      },
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
