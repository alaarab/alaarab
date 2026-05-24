import { Route, Routes } from "react-router";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Now } from "./pages/Now";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Projects } from "./pages/Projects";
import { Resume } from "./pages/Resume";

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
