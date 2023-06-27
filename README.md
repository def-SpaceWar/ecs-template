# ECS Game Template

The `src/main.ts` is not to be touched unless you know what you are doing.
`src/game.ts` is where you define all the scenes and the settings for the game.
In the future more documentation is going to be made.

# Goal

To make a template that is easily usable and with components that are minimal.

## TODO

- "requireComponent" for behaviors and components
- implement zIndex for drawing
- Trigger colliders (they dont cause any collision, and only activate on COLLIDERS, not other triggers)
- Images sprites + spritesheet + animator.
- UI Elements that interact with mouse (Input.mouseX, Input.mouseY, Input.isMouseDown, Input.isMouseUp) support + Buttons
- Add "Friction" component, so rolling can be implemented!

- \[Performance\] Change all the `map` and `forEach` and the other functional things to common for loops for better performance!

## FUTURE

- WASM (probably Rust) for the pure math (collisions, intensive vector math)
