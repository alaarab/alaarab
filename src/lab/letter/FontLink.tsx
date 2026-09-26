/** Global, prefixed keyframes (Bun CSS modules rename @keyframes without updating `animation`). */
const KEYFRAMES = `
@keyframes letter-noteRoom {
  from {
    grid-template-rows: 0fr;
    margin-block: 0;
  }
}

@keyframes letter-unfold {
  from {
    transform: rotateX(-86deg);
    opacity: 0;
  }
  35% {
    opacity: 1;
  }
  to {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

@keyframes letter-lampBreath {
  to {
    opacity: 0.78;
  }
}
`;

/** Newsreader, the one hand the whole letter is written in (React 19 hoists this). */
export function FontLink() {
  return (
    <>
      <style href="letter-keyframes" precedence="default">
        {KEYFRAMES}
      </style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&display=swap"
        precedence="default"
      />
    </>
  );
}
