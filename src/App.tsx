import { Route, Routes } from "react-router";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Now } from "./pages/Now";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Projects } from "./pages/Projects";
import { Resume } from "./pages/Resume";
import { TransitHome } from "./lab/transit/Home";
import { TransitProject } from "./lab/transit/Project";
import { LabIndex } from "./lab/LabIndex";
import { LedgerHome } from "./lab/ledger/Home";
import { LedgerProject } from "./lab/ledger/Project";
import { RackHome } from "./lab/rack/Home";
import { RackProject } from "./lab/rack/Project";

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
        {/* Design-direction prototypes (dev server only, not prerendered). */}
        <Route path="/lab" element={<LabIndex />} />
        <Route path="/lab/rack" element={<RackHome />} />
        <Route path="/lab/rack/projects/:slug" element={<RackProject />} />
        <Route path="/lab/ledger" element={<LedgerHome />} />
        <Route path="/lab/ledger/projects/:slug" element={<LedgerProject />} />
        <Route path="/lab/transit" element={<TransitHome />} />
        <Route path="/lab/transit/projects/:slug" element={<TransitProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
