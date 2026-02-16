import { useNavigate } from "react-router-dom";
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f5f7fa, #e4e7eb)",
    fontFamily: "Inter, sans-serif"
  },

  card: {
    background: "#fff",
    padding: "40px 48px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%"
  },

  icon: {
    fontSize: "48px",
    marginBottom: "8px"
  },

  code: {
    fontSize: "64px",
    margin: "0",
    color: "#d32f2f"
  },

  title: {
    fontSize: "22px",
    margin: "12px 0"
  },

  message: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "28px"
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px"
  },

  primaryBtn: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#1976d2",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500
  },

  secondaryBtn: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 500
  }
};

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🚫</div>

        <h1 style={styles.code}>403</h1>
        <h2 style={styles.title}>Unauthorized Access</h2>

        <p style={styles.message}>
          You do not have permission to view this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
