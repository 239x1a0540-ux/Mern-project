export default function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "16px 0",
      marginTop: "auto",
      borderTop: "1px solid #e5e7eb",
      color: "#6b7280",
      fontSize: "0.85rem",
      backgroundColor: "#ffffff"
    }}>
      <p>Vehicle Service Management Hub © {new Date().getFullYear()} · All rights reserved.</p>
    </footer>
  );
}
