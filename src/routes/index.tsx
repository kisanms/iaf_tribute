import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const TRIBUTE_URL = "/tribute/index.html";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indian Air Force — Touch The Sky With Glory" },
      {
        name: "description",
        content:
          "A cinematic tribute to the Indian Air Force — guardians of India's skies since 1932.",
      },
      { property: "og:title", content: "Indian Air Force — Touch The Sky With Glory" },
      {
        property: "og:description",
        content:
          "Ninety-four years of courage, precision, and unmatched aerial supremacy.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#0a1628" },
    ],
  }),
  component: Index,
});

function Index() {
  // Replace history so the back button doesn't trap users on the redirect shim.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(TRIBUTE_URL);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#02060c",
        color: "#bccada",
        fontFamily:
          "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        letterSpacing: "0.2em",
        fontSize: 12,
      }}
    >
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${TRIBUTE_URL}`} />
        <a href={TRIBUTE_URL} style={{ color: "#ff9933" }}>
          ENTER TRIBUTE →
        </a>
      </noscript>
      INITIALIZING FLIGHT SYSTEMS…
    </div>
  );
}
