export function ThemeNotFound() {
  return (
    <div style={{ fontFamily: "Arial", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "10vh" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "bold", paddingLeft: "10px" }}>Theme or view not found please check your theme folder.</h1>
      </div>
    </div>
  );
}
