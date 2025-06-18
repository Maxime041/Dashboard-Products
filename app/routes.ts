import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/new", "routes/products/new.tsx"),
  route("products/:id/edit", "routes/products/edit.tsx"),
  route("sites", "routes/sites.tsx"),
  route("sites/new", "routes/sites/new.tsx"),
] satisfies RouteConfig;