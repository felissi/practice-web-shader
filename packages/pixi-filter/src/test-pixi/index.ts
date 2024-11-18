import { Application, Assets, Sprite } from "pixi.js";

const app = new Application();

await app.init({
  resizeTo: window,
});

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Load the bunny texture
const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

// Create a bunny Sprite
const bunny = new Sprite(texture);

// Center the sprite's anchor point
bunny.anchor.set(0.5);

// Move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((time) => {
  // Just for fun, let's rotate mr rabbit a little.
  // * Delta is 1 if running at 100% performance *
  // * Creates frame-independent transformation *
  bunny.rotation += 0.1 * time.deltaTime;
});
