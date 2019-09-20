# Frontend Test for Marfeel

## Installing

`npm run build`

Preserve the `index.html` in `/dist` (see issues below)

## Known issues

ISSUE: total container width is set fixed in px (350px) which may lead to non-ideal results on older mobile screens

ISSUE: webpack is not yet configured to build `index.html` from `/src`, thus it is necessary to preserve it in the `/dist` folder when building
