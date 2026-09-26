import { Route, Routes } from "react-router";
import { ScrollToTop } from "./components/ScrollToTop";
import { NotFound } from "./pages/NotFound";
import { Now } from "./pages/Now";
import { Projects } from "./pages/Projects";
import { Resume } from "./pages/Resume";
import { EmbroideryHome } from "./site/Home";
import { EmbroideryProject } from "./site/Project";

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<EmbroideryHome />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/now" element={<Now />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<EmbroideryProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
