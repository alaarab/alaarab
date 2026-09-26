import { Route, Routes } from "react-router";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Now } from "./pages/Now";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Projects } from "./pages/Projects";
import { Resume } from "./pages/Resume";
import { LabIndex } from "./lab/LabIndex";
import { LabHome, LabProject } from "./lab/LabRoute";

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/now" element={<Now />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        {/* Design-direction prototypes, served by `bun run lab`; not prerendered. */}
        <Route path="/lab" element={<LabIndex />} />
        <Route path="/lab/:direction" element={<LabHome />} />
        <Route path="/lab/:direction/projects/:slug" element={<LabProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
