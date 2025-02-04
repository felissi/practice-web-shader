- Set the texture's color space manually [#](https://discourse.threejs.org/t/updates-to-color-management-in-three-js-r152/50791)

```typescript
(texture as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
```

- Call `.updateProjectionMatrix()` after changes camera config

```typescript
(camera as THREE.Camera).zoom = ...;
camera.updateProjectionMatrix();
```

- Multiple everything with delta time

```typescript
function render() {
  // ...

  // Fixed update (like moving, write-only update)
  material.uniforms.uPosition += Vector.right * SPEED * delta;

  // acceleration
  speed += acceleration * delta;
  uPosition += Vector.right * speed * delta;

  // lerp update
  uPositionX = lerp(uPositionX, SOME_VECTOR, correct(0.05, delta));
  function correct(speed: number, delta: number) {
    // where BASE_DELTA is like 0.016 (16ms)
    return 1 - Math.pow(1 - speed * 3.0, delta / BASE_DELTA);
  }
}
```
