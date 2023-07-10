import Phaser from 'phaser';

class Level extends Phaser.Scene {
  debug;
  preload() {
    this.load.atlas(
      'ui',
      'assets/ui/nine-slice.png',
      'assets/ui/nine-slice.json'
    );
  }

  create() {
    // Create three vector buttons and three image buttons, all with different scale
    const vectorButton = this.createVectorButton(40, 25, 0.25);
    const imageButton = this.createImageButton(40, 50, 0.25);
    const vectorButton2 = this.createVectorButton(190, 50, 1);
    const imageButton2 = this.createImageButton(190, 150, 1);
    const vectorButton3 = this.createVectorButton(600, 100, 3); // crisp edge when we scale up
    const imageButton3 = this.createImageButton(600, 300, 3); // looks blurry when scaled up

    this.tweens.add({
      targets: [
        imageButton,
        vectorButton,
        vectorButton2,
        imageButton2,
        vectorButton3,
        imageButton3,
      ],
      rotation: [-0.2, 0.2],
      yoyo: true,
      repeat: -1,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      duration: 5000,
    });
  }

  createImageButton(x, y, scale) {
    const btn = this.add
      .image(x, y, 'ui', 'blue_button05')
      .setOrigin(0.5, 0.5)
      .setScale(scale);
    return btn;
  }

  createVectorButton(x, y, scale) {
    const graphics = this.add.graphics();
    const rect = new Phaser.Geom.Rectangle(0, 0, 190 * scale, 43 * scale);
    graphics.fillStyle(0x29b0e9, 1);
    graphics.lineStyle(2 * scale, 0x4a65ae, 1);
    graphics.translateCanvas(-rect.width / 2, -rect.height / 2);
    graphics.setPosition(x, y); // set origin to center
    rect.x -= rect.width / 2; // make up for the canvas translation
    rect.y -= rect.height / 2;
    graphics.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    graphics.fillRoundedRect(0, 0, rect.width, rect.height, 4 * scale);
    graphics.stroke();
    return graphics;
  }
}

const game = new Phaser.Game({
  canvas: document.getElementById('phaser-example'),
  type: Phaser.WEBGL,
  width: 900,
  height: 400,
  backgroundColor: '#2ed34a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  loader: {
    baseURL: 'https://labs.phaser.io',
    crossOrigin: 'anonymous',
  },
});

game.scene.add('Level', Level, true);
