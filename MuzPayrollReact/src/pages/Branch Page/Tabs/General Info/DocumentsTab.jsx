// import { useState } from "react";
import "../../css/Documents.css";
import { toast } from "react-hot-toast";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
export default function DocumentsTab({
  fields,
  append,
  remove,
  register,
  errors,
  watchDocuments,
  // watch,
  setValue,
  trigger,
  // setError,
  // control,
  // disabled = false,
  // requiredMap = {},
}) {
  // const doc = watch("documnets");
  // console.log("Douments: ", doc);
  const documentTypes = [
    { value: "", label: "Select document type" },
    { value: "business_license", label: "Business License", required: true },
    { value: "tax_certificate", label: "Tax Certificate", required: true },
    { value: "id_proof", label: "ID Proof", required: true },
    {
      value: "registration_certificate",
      label: "Registration Certificate",
      required: false,
    },
    { value: "address_proof", label: "Address Proof", required: false },
  ];
  // const hasDocumentErrors = !!errors?.documents;
  const addDocumentRow = async () => {
    await trigger("documents"); //  validate all docs
    if (errors?.documents) {
      toast.error("Please complete the document details");
      return;
    }
    append({
      type: "",
      number: "",
      expiryDate: "",
      file: null,
      remarks: "",
    });
    // toast.success("New document row added");
  };

  const removeDocumentRow = (index) => {
    remove(index);
    // toast.success("Document row removed");
  };

  //   const handleDocumentChange = (id, updates) => {
  //   setDocuments(prevDocs =>
  //     prevDocs.map(doc =>
  //       doc.id === id ? { ...doc, ...updates } : doc
  //     )
  //   );
  // };

  // const handleFileUpload = (id, file) => {
  //   if (!file) return;

  //   const fileSize = formatFileSize(file.size);
  //   console.log("Selected file:", {
  //   name: file.name,
  //   size: file.size,
  //   type: file.type,
  //   id
  // });
  // handleDocumentChange(id, {
  //   file,
  //   fileName: file.name,
  //   fileSize,
  //   status: "uploaded"
  // });

  // const removeFile = (id) => {

  //   handleDocumentChange(id, {
  //   file:null,
  //   fileName: "",
  //   fileSize: "",
  //   status: "pending"
  // });
  // };

  // const formatFileSize = (bytes) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  // const previewFile = (id) => {
  //   const doc = documents.find(d => d.id === id);
  //   if (!doc?.file) return;

  //   const url = URL.createObjectURL(doc.file);
  //   window.open(url, "_blank", "noopener");

  //   setTimeout(() => URL.revokeObjectURL(url), 1000);
  // };

  return (
    <div className="documents-section">
      <div className="documents-header">
        <h3>Required Documents</h3>
        <div className="btn-add" onClick={addDocumentRow}>
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Document
        </div>
      </div>

      <div className="document-grid">
        {fields.map((field, index) => {
          const file = watchDocuments?.[index]?.file?.[0];
          return (
            <div key={field.id} className="document-card">
              {/* Header */}
              <div className="card-header">
                <span className="doc-index">Document #{index + 1}</span>
                {/* <span className={`status-badge ${doc.status}`}>
                {doc.status}
              </span> */}
                <button
                  className=" doc-btn-remove"
                  onClick={() => removeDocumentRow(index)}
                  title="Remove row"
                  type="button"
                >
                  {/* <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> */}
                  <MdDelete size={18} />
                </button>
                {/* )} */}
              </div>

              {/* Fields */}
              <div className="card-body">
                <div className="field">
                  <label>Document Type</label>
                  <select
                    // className={`form-control ${errors.documentType ? "error" : ""}`}
                    placeholder="Enter document type"
                    className={`form-control ${errors?.documents?.[index]?.type ? "doc-error" : ""}`}
                    {...register(`documents.${index}.type`, {
                      required: "Document type is required",
                    })}
                  >
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.required && " *"}
                      </option>
                    ))}
                  </select>
                  {errors?.documents?.[index]?.type && (
                    <span className="error-message">
                      {errors.documents[index].type.message}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label className="required">Document Number</label>
                  <input
                    type="text"
                    className={`form-control ${errors?.documents?.[index]?.number ? "doc-error" : ""}`}
                    // value={doc.number}
                    placeholder="Enter document number"
                    {...register(`documents.${index}.number`, {
                      required: "Document number is required",
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: "Only alphanumeric allowed",
                      },
                    })}
                  />
                  {errors?.documents?.[index]?.number && (
                    <span className="error-message">
                      {errors.documents[index].number.message}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label>Expiry Date</label>
                  <input
                    className={`form-control ${errors?.documents?.[index]?.expiryDate ? "doc-error" : ""}`}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register(`documents.${index}.expiryDate`)}
                  />
                </div>
              </div>

              {/* Upload */}
              <div className="card-upload">
                <div className="file-upload-wrapper">
                  <input
                    id={`file-${index}`}
                    type="file"
                    className="file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    {...register(`documents.${index}.file`, {
                      required: "Document file is required",
                      validate: {
                        notEmpty: (files) =>
                          (files && files.length > 0) || "Please select a file",

                        validType: (files) => {
                          if (!files || files.length === 0) return true;
                          const allowedTypes = [
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                          ];
                          return (
                            allowedTypes.includes(files[0].type) ||
                            "Only PDF, JPG, PNG files are allowed"
                          );
                        },

                        notFolder: (files) => {
                          if (!files || files.length === 0) return true;
                          return (
                            files[0].type !== "" ||
                            "Folder upload is not allowed"
                          );
                        },
                      },
                    })}
                  />

                  <label htmlFor={`file-${index}`} className="btn btn-upload">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Document
                  </label>

                  {file && (
                    <div className="file-info">
                      <span className="doc-file-name">{file.name}</span>
                      <span className="doc-file-size">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}
                </div>
                {errors?.documents?.[index]?.file && (
                  <span className="error-message">
                    {errors.documents[index].file.message}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="card-footer">
                <button
                  className="btn-preview"
                  onClick={() => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    window.open(url, "_blank", "noopener");
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }}
                  disabled={!file}
                  type="button"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview
                </button>

                <button
                  type="button"
                  className="btn-remove-file"
                  disabled={!file}
                  onClick={() => setValue(`documents.${index}.file`, null)}
                  title="Remove file"
                >
                  <IoRemoveCircleOutline size={14} />
                  Remove
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
                  placeholder="Remarks (Optional)"
                  className={`form-control ${errors?.documents?.[index]?.remarks ? "doc-error" : ""}`}
                  {...register(`documents.${index}.remarks`, {
                    maxLength: {
                      value: 150,
                      message: "Max 150 characters",
                    },
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (optional) */}
      {fields.length === 0 && (
        <div className="empty-documents">
          <svg
            width="64"
            height="64"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h4>No Documents Added</h4>
          <p>
            Click "Add Document" to upload required documents for branch
            registration.
          </p>
        </div>
      )}
    </div>
  );
}
