import { Route, Routes } from "react-router";
import { WriteEditor, WriteHome } from "./admin/Write";
import { ScrollToTop } from "./components/ScrollToTop";
import { NotFound } from "./pages/NotFound";
import { Now } from "./pages/Now";
import { Projects } from "./pages/Projects";
import { Resume } from "./pages/Resume";
import { BlogIndex, BlogPost } from "./site/Blog";
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
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/write" element={<WriteHome />} />
        <Route path="/write/new" element={<WriteEditor />} />
        <Route path="/write/:slug" element={<WriteEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
