import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/carrito", "/api/"],
      },
    ],
    sitemap: "https://peptigene.demo/sitemap.xml",
  };
}
