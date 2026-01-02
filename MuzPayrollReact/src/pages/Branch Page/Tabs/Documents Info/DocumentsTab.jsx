import { useState } from "react";
import "../Documents Info/Documents.css";
import { IoIosRemoveCircleOutline } from "react-icons/io";

export default function DocumentsTab() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "",
      number: "",
      expiryDate: "",
      status: "pending",
      remarks: "",
      file: null,
      fileName: "",
      fileSize: ""
    }
  ]);

  const documentTypes = [
    { value: "", label: "Select document type" },
    { value: "business_license", label: "Business License", required: true },
    { value: "tax_certificate", label: "Tax Certificate", required: true },
    { value: "id_proof", label: "ID Proof", required: true },
    { value: "registration_certificate", label: "Registration Certificate", required: false },
    { value: "address_proof", label: "Address Proof", required: false },
  ];

  const addDocumentRow = () => {
    if (documents.length < 10) {
      const newDoc = {
        id: Date.now(),
        type: "",
        number: "",
        expiryDate: "",
        status: "pending",
        remarks: "",
        file: null,
        fileName: "",
        fileSize: ""
      };
      setDocuments([...documents, newDoc]);
    }
  };

  const handleDocumentChange = (id, field, value) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const handleFileUpload = (id, file) => {
    if (!file) return;
    
    const fileSize = formatFileSize(file.size);
    
    handleDocumentChange(id, "file", file);
    handleDocumentChange(id, "fileName", file.name);
    handleDocumentChange(id, "fileSize", fileSize);
    handleDocumentChange(id, "status", "uploaded");
  };

  const removeDocument = (id) => {
    // if (documents.length > 1) {
      setDocuments(documents.filter(doc => doc.id !== id));
    // }
  };

  const removeFile = (id) => {
    handleDocumentChange(id, "file", null);
    handleDocumentChange(id, "fileName", "");
    handleDocumentChange(id, "fileSize", "");
    handleDocumentChange(id, "status", "pending");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const previewFile = (id) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.file) {
      const fileURL = URL.createObjectURL(doc.file);
      window.open(fileURL, '_blank');
    }
  };

  return (
    <div className="documents-section">
      <div className="documents-header">
        <h3>Required Documents</h3>
        <button className="btn btn-add" onClick={addDocumentRow}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Document
        </button>
      </div>

      <div className="document-grid">
        {documents.map((doc, index) => (
          <div className="document-card" key={doc.id}>
            {/* Header */}
            <div className="card-header">
              <span className="doc-index">Document #{index + 1}</span>
              {/* <span className={`status-badge ${doc.status}`}>
                {doc.status}
              </span> */}
              <button
                  className="btn btn-remove"
                  onClick={() => removeDocument(doc.id)}
                  type="button"
                >
                  {/* <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> */}
                  <IoIosRemoveCircleOutline />
                  Remove
                </button>
              {/* )} */}
            
            </div>

            {/* Fields */}
            <div className="card-body">
              <div className="field">
                <label className={documentTypes.find(t => t.value === doc.type)?.required ? "required" : ""}>
                  Document Type
                </label>
                <select
                  value={doc.type}
                  onChange={(e) => handleDocumentChange(doc.id, "type", e.target.value)}
                  required={documentTypes.find(t => t.value === doc.type)?.required}
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} {type.required && " *"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="required">Document Number</label>
                <input
                  type="text"
                  value={doc.number}
                  onChange={(e) => handleDocumentChange(doc.id, "number", e.target.value)}
                  placeholder="Enter document number"
                  required
                />
              </div>

              <div className="field">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={doc.expiryDate}
                  onChange={(e) => handleDocumentChange(doc.id, "expiryDate", e.target.value)}
                />
              </div>
            </div>

            {/* Upload */}
            <div className="card-upload">
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id={`file-${doc.id}`}
                  className="file-input"
                  onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor={`file-${doc.id}`} className="btn btn-upload">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </label>

                {doc.fileName && (
                  <div className="file-info">
                    <span className="file-name" title={doc.fileName}>
                      {doc.fileName}
                    </span>
                    {doc.fileSize && (
                      <span className="file-size">{doc.fileSize}</span>
                    )}
                    <button
                      type="button"
                      className="btn-remove-file"
                      onClick={() => removeFile(doc.id)}
                      title="Remove file"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="card-footer">
              <button
                className="btn btn-preview"
                onClick={() => previewFile(doc.id)}
                disabled={!doc.file}
                type="button"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>

              {/* {documents.length > 1 && ( */}
                {/* <button
                  className="btn btn-remove"
                  onClick={() => removeDocument(doc.id)}
                  type="button"
                > */}
                  {/* <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> */}
                  {/* <IoIosRemoveCircleOutline />
                  Remove */}
                {/* </button> */}
              {/* )} */}
            </div>

            {/* Remarks */}
            <div className="card-remarks">
              <input
                type="text"
                placeholder="Remarks (optional)"
                value={doc.remarks}
                onChange={(e) => handleDocumentChange(doc.id, "remarks", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (optional) */}
      {documents.length === 0 && (
        <div className="empty-documents">
          <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4>No Documents Added</h4>
          <p>Click "Add Document" to upload required documents for branch registration.</p>
        </div>
      )}
    </div>
  );
}