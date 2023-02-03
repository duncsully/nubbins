---
'@nubbins/core': patch
---

Fixed bug where updating deeply nested nubbin dependencies wouldn't correctly update computed nubbin inside of an action (e.g. a -> b -> c, changing a wouldn't correctly update c)
