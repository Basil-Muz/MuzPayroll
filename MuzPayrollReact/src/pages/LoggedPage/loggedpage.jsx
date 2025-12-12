import React from 'react';
import './loggedpage.css';
import muzLogo from "../../assets/muzlogo.jpg";

function LoggedPage() {
  return (
<div className="logo-homesection">

  <div className="left-section">
    <h2 className="home-heading">Home</h2>
    <img src={muzLogo} alt="logo" className="home-logo" />
  </div>

  <div className="logged-container">
    <div className="logged-box">
      <h2 className="logged-heading">Login Credentials</h2>

      <div className="logged-details">
        <label>Company</label>
        <input type="text" />
      </div>

      <div className="logged-details">
        <label>Login Date</label>
        <input type="date" />
      </div>

      <div className="logged-details">
        <label>FinYear</label>
        <input type="text" />
      </div>

      <div className="logged-details">
        <label>Branch</label>
        <input type="text" />
      </div>

      <div className="logged-details">
        <label>Location</label>
        <input type="text" />
      </div>

      <div style={{ textAlign: "center", marginTop: "2px" }}>
        <button className="logged-btn">OK</button>
        <button className="logged-btn">Change Credentials</button>
      </div>
    </div>
  </div>
</div>
  );
}

export default LoggedPage;
