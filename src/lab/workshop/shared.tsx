import { useEffect, useState } from "react";

/**
 * Bun's CSS modules rename @keyframes but not the name inside `animation:`,
 * so the two animations live here as global, prefixed keyframes.
 */
const KEYFRAMES = `
@keyframes ws-drift {
  0% { transform: translate(0, 0); opacity: 0.2; }
  40% { opacity: 0.85; }
  100% { transform: translate(28px, -36px); opacity: 0.3; }
}
@keyframes ws-sway {
  from { transform: skewX(-2.5deg); }
  to { transform: skewX(2.5deg); }
}`;

/** Lora for names and headings, Figtree for reading. React 19 hoists these. */
export function FontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap"
        precedence="default"
      />
      <style href="workshop-keyframes" precedence="default">{KEYFRAMES}</style>
    </>
  );
}

/** On phones the desk is a picture and the list under it does the navigating. */
export function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return phone;
}
