import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./DocumentsInfo.css";
import { MdDelete } from "react-icons/md";
import { BiArrowFromTop } from "react-icons/bi";
import { BiArrowFromBottom } from "react-icons/bi";
const DocumentsInfo = forwardRef((props, ref) => {
  const documentTypeOptions = ["Insurance", "KYC", "PAN", "Aadhar"];
  const [rows, setRows] = useState([
    {
      documentType: "",
      document: "",
      documentNo: "",
      documentExpiry: "",
      file: null,
      remarks: "",
    },
  ]);
  const inputRefs = useRef([]);
  const focusInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const fileInputRefs = useRef([]);

  useImperativeHandle(ref, () => ({
    resetForm() {
      setRows([
        {
          documentType: "",
          document: "",
          documentNo: "",
          documentExpiry: "",
          file: null,
          remarks: "",
        },
      ]);
      fileInputRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
      fileInputRefs.current = [];
      setSelectedRowIndex(null);
    },
  }));

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleFileChange = (index, file) => {
    const newRows = [...rows];
    newRows[index].file = file;
    setRows(newRows);
  };

  const addRowAbove = () => {
    const index = selectedRowIndex !== null ? selectedRowIndex : rows.length;
    const newRow = {
      documentType: "",
      document: "",
      documentNo: "",
      documentExpiry: "",
      file: null,
      remarks: "",
    };

    const newRows = [...rows];
    newRows.splice(index, 0, newRow);
    setRows(newRows);
    setSelectedRowIndex(index);

    // Focus after short delay (state update)
    setTimeout(() => focusInput(index), 0);
  };

  const addRowBelow = () => {
    const index =
      selectedRowIndex !== null ? selectedRowIndex + 1 : rows.length;
    const newRow = {
      documentType: "",
      document: "",
      documentNo: "",
      documentExpiry: "",
      file: null,
      remarks: "",
    };

    const newRows = [...rows];
    newRows.splice(index, 0, newRow);
    setRows(newRows);
    setSelectedRowIndex(index);

    setTimeout(() => focusInput(index), 0);
  };

  // Delete selected row or last row if none selected
  const deleteSelectedRow = () => {
    if (rows.length === 0) return;

    const index =
      selectedRowIndex !== null ? selectedRowIndex : rows.length - 1;

    const newRows = [...rows];
    newRows.splice(index, 1);

    if (newRows.length === 0) {
      newRows.push({
        documentType: "",
        document: "",
        documentNo: "",
        documentExpiry: "",
        file: null,
        remarks: "",
      });
      setSelectedRowIndex(0);
    } else {
      if (selectedRowIndex !== null) {
        if (index === newRows.length) {
          setSelectedRowIndex(newRows.length - 1);
        } else {
          setSelectedRowIndex(index);
        }
      } else {
        setSelectedRowIndex(null);
      }
    }

    setRows(newRows);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    rows.forEach((row, index) => {
      formData.append(`documents[${index}][documentType]`, row.documentType);
      formData.append(`documents[${index}][document]`, row.document);
      formData.append(`documents[${index}][documentNo]`, row.documentNo);
      formData.append(
        `documents[${index}][documentExpiry]`,
        row.documentExpiry,
      );
      formData.append(`documents[${index}][remarks]`, row.remarks);
      if (row.file) {
        formData.append(`documents[${index}][file]`, row.file);
      }
    });

    try {
      const response = await fetch("https://your-backend-url.com/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Documents submitted successfully!");
        // Optionally reset form here
      } else {
        alert("Failed to submit documents.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during submission.");
    }
  };

  return (
    <div className="documents-info-container">
      <div className="head">
        <h3>Documents Info</h3>
      </div>

      <div className="maintb">
        <div className="documents-table-wrapper">
          <table className="documents-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Document Type</th>
                <th>Document</th>
                <th>Document No</th>
                <th>Document Expiry</th>
                <th>File Upload</th>
                <th>File Download</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedRowIndex(index)}
                  className={selectedRowIndex === index ? "selected-row" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>
                    <select
                      className="table-input"
                      value={row.documentType}
                      onChange={(e) =>
                        handleChange(index, "documentType", e.target.value)
                      }
                    >
                      <option value=""></option>
                      {documentTypeOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={row.document}
                      onChange={(e) =>
                        handleChange(index, "document", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={row.documentNo}
                      onChange={(e) =>
                        handleChange(index, "documentNo", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="table-input"
                      value={row.documentExpiry}
                      onChange={(e) =>
                        handleChange(index, "documentExpiry", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      onChange={(e) =>
                        handleFileChange(index, e.target.files[0])
                      }
                    />
                  </td>
                  <td>
                    {row.file ? (
                      <a
                        href={URL.createObjectURL(row.file)}
                        download={row.file.name}
                        rel="noreferrer"
                      >
                        Download File
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={row.remarks}
                      onChange={(e) =>
                        handleChange(index, "remarks", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row-action-buttons">
        <button onClick={addRowAbove}>
          <BiArrowFromBottom />
        </button>
        <button onClick={addRowBelow}>
          <BiArrowFromTop />
        </button>
        <button onClick={deleteSelectedRow} title="Delete Selected Row">
          <MdDelete />
        </button>
      </div>
    </div>
  );
});

export default DocumentsInfo;
