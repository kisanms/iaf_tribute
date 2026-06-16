import { useEffect } from "react";

const TRIBUTE_URL = "/tribute/index.html";

export default function App() {
  useEffect(() => {
    window.location.replace(TRIBUTE_URL);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1628", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <noscript>
        <a href={TRIBUTE_URL} style={{ color: "#fff" }}>Enter the tribute →</a>
      </noscript>
      <p>Loading tribute…</p>
    </div>
  );
}
