export default function DocumentsTab() {
  return (
    <div className="documents-section">
    <div className="documents-card">
      <div className="doc-header">
        <h3 className="doc-title">Required Documents</h3>
        <div className="doc-actions">
          <button className="btn btn-add">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Document
          </button>
        </div>
      </div>
      
      <div className="doc-table-container">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Document Type</th>
               
              <th>Document No</th>
              <th>Expiry Date</th>
              <th>Upload</th>
              <th>Preview</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select className="form-control">
                  <option>Select document type</option>
                  <option>Business License</option>
                  <option>Tax Certificate</option>
                  <option>ID Proof</option>
                </select>
              </td>
              <td>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Document number"
                />
              </td>
              <td>
                <input 
                  type="date" 
                  className="form-control"
                />
              </td>
              <td>
                <button className="btn btn-upload">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
              </td>
              <td>
                <button className="btn btn-download">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </td>
              <td>
                <span className="status-badge pending">Pending</span>
              </td>
              <td>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Add remarks"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}
