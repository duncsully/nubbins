# @nubbins/core

## 0.1.1

### Patch Changes

- a5c3ff2: Fixed bug where computed nubbins would recompute value after batch actions even if their dependencies didn't change.
- 7029802: Fixed bug where updating deeply nested nubbin dependencies wouldn't correctly update computed nubbin inside of an action (e.g. a -> b -> c, changing a wouldn't correctly update c)

## 0.1.0

### Minor Changes

- a8487ba: Initial release
