import index from "./index.html";

const isProd = process.env.NODE_ENV === "production";

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  development: isProd ? false : { hmr: true, console: true },
  // Every path resolves to the SPA shell. React Router takes it from there,
  // so deep links like /projects/phren survive a hard refresh.
  routes: {
    "/*": index,
  },
});

console.log(`alaarab portfolio running at ${server.url}`);
