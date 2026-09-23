# HYPERPERSONA — Who is your investor soulmate?

A personality quiz that matches you with one of six legendary investors and shows that investor's portfolio. This is the production build of the Claude Design prototype in `../project/Investor Soulmate Quiz.dc.html`.

Built with Vite, React 19 and TypeScript. It's a static site, so the output in `dist/` can be hosted anywhere (for example at hyperpersona.cc).

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
```

## Structure

- `src/data.ts`: personas, portfolios and the 8 questions. Each answer adds one point to a persona; the highest score wins, and ties go to the persona listed first.
- `src/App.tsx`: the screens (intro → quiz → loading → result → portfolio / share) and the adopt dialog.
- `src/modernist.css`: the Modernist design-system tokens and components, copied from the design bundle. Archivo is self-hosted through `@fontsource`.
- `src/app.css`: styles for each screen.
- `public/personas/`: character art (full body, used on the share card) and head crops (used on the result screen).

## Share card

"Download for Instagram Story" renders the card to a 1080×1920 PNG in the browser with `html-to-image`. "Copy Link" copies https://hyperpersona.cc/.

## Not wired up yet

"Adopt This Strategy & Link Bank" opens a dialog that says it's a prototype, as in the design. Hook up the wealth-manager handoff there.
