// src/components/error/ContactAdminModal.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { handleApiError } from "../../utils/errorToastResolver";
import { AuthProvider } from "../../context/AuthProvider";
import { useAuth } from "../../context/AuthProvider";
import "./ContactAdminModel.css"
const ContactAdminModal = ({ onClose }) => {
  const location = useLocation();
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  // Auto-fill from localStorage
//   const user = JSON.parse(localStorage.getItem("loginData") || "{}");
    const {user } =useAuth() ;
    console.log("User",user)
  const handleSend = async () => {
    if (!issue) return alert("Please select an issue type");
    if (!message.trim()) return alert("Please enter a message");

    setStatus("sending");

    try {
      await fetch("http://localhost:8080/api/contact-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          username: user.userName,
          name: user.userName,
          pageAttempted: location.pathname + location.search,
          issueType: issue,
          message: message,
          timestamp: new Date().toISOString(),
        }),
      });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      handleApiError(err, { entity: "Admin Contact" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Contact Administrator</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal-sub">
          Your request will be sent to the system administrator.
        </p>

        {status === "success" ? (
          /* Success State */
          <div className="success-box">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Request Sent!</h3>
            <p className="success-desc">
              Your request has been sent to the administrator. You'll be
              notified once access is granted.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <>
            <div className="info-row">
              <div className="form-group">
                <label className="form-label">
                  Your Name <span className="auto-badge">auto</span>
                </label>
                <input
                  className="form-input"
                  disabled
                  value={user.userName || "-"}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  UserCode <span className="auto-badge">auto</span>
                </label>
                <input
                  className="form-input"
                  disabled
                  value={user.userCode || "-"}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Page Attempted <span className="auto-badge">auto</span>
              </label>
              <input
                className="form-input"
                disabled
                value={location.pathname + location.search}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue Type</label>
              <select
                className="form-input"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              >
                <option value="">Select an issue...</option>
                <option value="access">Need page access</option>
                <option value="wrong-redirect">Wrong page redirect</option>
                <option value="role">Incorrect role assigned</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                placeholder="Describe your issue..."
                maxLength={300}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="char-count">{message.length}/300</div>
            </div>

            {status === "error" && (
              <p style={{ color: "var(--danger)", fontSize: "12px" }}>
                Failed to send. Please try again.
              </p>
            )}

            <div className="btn-row">
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactAdminModal;
