// Bun bundles imported images as URLs (the "file" loader).
declare module "*.jpg" {
  const url: string;
  export default url;
}
declare module "*.svg" {
  const url: string;
  export default url;
}
declare module "*.mp4" {
  const url: string;
  export default url;
}
