import { useParams } from "react-router";
import { NotFound } from "../pages/NotFound";
import { labPages } from "./registry";

/** /lab/:direction */
export function LabHome() {
  const { direction = "" } = useParams<{ direction: string }>();
  const page = labPages[direction];
  return page ? <page.Home /> : <NotFound />;
}

/** /lab/:direction/projects/:slug */
export function LabProject() {
  const { direction = "" } = useParams<{ direction: string }>();
  const page = labPages[direction];
  return page ? <page.Project /> : <NotFound />;
}
