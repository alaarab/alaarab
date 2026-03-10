import "@/styles/globals.css";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${displayFont.variable} ${monoFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
