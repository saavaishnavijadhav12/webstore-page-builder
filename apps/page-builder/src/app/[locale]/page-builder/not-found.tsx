export default function NotFound() {
  return (
    <div
      style={{
        alignContent: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <h2>Not Found</h2>
      <p>Could not pass url params!..</p>
      <code>/page-builder?url=example&theme=base</code>
    </div>
  );
}
