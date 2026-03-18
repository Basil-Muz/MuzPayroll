// src/components/error/ErrorBoundary.jsx
import { Component } from "react";
import { MdWarningAmber } from "react-icons/md";
import "./ErrorBoundary.css"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Payroll Error:", error, info);
  }

  handleDashboard = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  handleLogout = () => {
    localStorage.removeItem("loginData");
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-card">

            <div className="error-icon"><MdWarningAmber /></div>
            <p className="error-code">Payroll System Error</p>
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-desc">
              An unexpected error occurred while processing your request.
              Your data is safe — no changes were saved.
            </p>

            {this.state.error && (
              <div className="error-detail">
                {this.state.error.toString()}
              </div>
            )}

            <div className="btn-row">
              <button className="btn btn-primary" onClick={this.handleDashboard}>
                Go to Dashboard
              </button>
              <button className="btn btn-outline" onClick={this.handleLogout}>
                Logout
              </button>
            </div>

            <hr className="divider" />
            <p className="support-text">
              If this keeps happening, contact <span>your administrator</span>
            </p>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;