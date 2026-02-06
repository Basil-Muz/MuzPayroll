import { useMemo, useState } from "react";

// Components
import { LocationGroupMultiSelect } from "../../components/multiSelectHeader/LocationGroupMultiSelect";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

// Utils(Helpers)
import {handleApiError} from "../../utils/errorToastResolver";

// Styles
import "./LocationGroupRightsMapping.css";

/* =========================================
   Main Page
========================================= */
const GROUPS = [
  { id: 1002, name: "ALAPPUZHA" },
  { id: 1003, name: "CALICUT" },
  { id: 1004, name: "ERNAKULAM" },
  { id: 1005, name: "IDUKKI" },
  { id: 1007, name: "KANNUR" },
  { id: 1012, name: "KASARAGOD" },
  { id: 1016, name: "KOCHI" },
  { id: 1022, name: "KOLLAM" },
  { id: 1023, name: "KOTTAYAM" },
  { id: 1042, name: "MALAPPURAM" },
  { id: 1025, name: "PALAKKAD" },
  { id: 1019, name: "PATHANAMTHITTA" },
  { id: 1018, name: "THRISSUR" },
  { id: 1028, name: "TRIVANDRUM" },
  { id: 1027, name: "WAYANAD" },
];

const PAGE_SIZE = 8;

export default function LocationGroupRightsMapping() {
  const [rows, setRows] = useState([
    {
      id: 1,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "1002",
        name: "ALAPPUZHA",
      },
      group: [{ id: 1027, name: "WAYANAD" }],
      // _original: [],
      _dirty: false,
    },
    {
      id: 7,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "1002",
        name: "ALAPPUZHA",
      },
      group: [{ id: 1027, name: "WAYANAD" }],
      // _original: [],
      _dirty: false,
    },
    {
      id: 2,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "103",
        name: "CALICUT",
      },
      group: [
        { id: 1022, name: "KOLLAM" },
        { id: 1004, name: "ERNAKULAM" },
      ],

      // _original: [],
      _dirty: false,
    },
    {
      id: 3,
      branch: {
        id: 2,
        name: "Norms Tech Solutions",
      },
      location: {
        id: "201",
        name: "BANGALORE",
      },
      group: [{ id: 1003, name: "CALICUT" }],
      // _original: [],
      _dirty: false,
    },
    {
      id: 4,
      branch: {
        id: 2,
        name: "Norms Tech Solutions",
      },
      location: {
        id: "202",
        name: "MYSORE",
      },
      group: [
        { id: 1019, name: "PATHANAMTHITTA" },
        { id: 1018, name: "THRISSUR" },
      ],
      // _original: [],
      _dirty: false,
    },
    {
      id: 10,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "1002",
        name: "ALAPPUZHA",
      },
      group: [{ id: 1027, name: "WAYANAD" }],
      // _original: [],
      _dirty: false,
    },
    {
      id: 18,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "1002",
        name: "ALAPPUZHA",
      },
      group: [{ id: 1027, name: "WAYANAD" }],
      // _original: [],
      _dirty: false,
    },
    {
      id: 16,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "1002",
        name: "ALAPPUZHA",
      },
      group: [{ id: 1027, name: "WAYANAD" }],
      // _original: [],
      _dirty: false,
    },

    {
      id: 12,
      branch: {
        id: 1,
        name: "Norms Management Pvt Ltd",
      },
      location: {
        id: "1002",
        name: "ALAPPUZHA",
      },
      group: [{ id: 1027, name: "WAYANAD" }],
      // _original: [],
      _dirty: false,
    },
  ]);

  const [setSelection, setSetSelection] = useState(new Set());
  const [saveSelection, setSaveSelection] = useState(new Set());
  const [originalMap, setOriginalMap] = useState(new Map()); // Capture the first state before edit

  const [bulkGroup, setBulkGroup] = useState([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const toggleSet = (id) => {
    setSetSelection((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const selectAllOnPage = () => {
    setSetSelection((prev) => {
      const next = new Set(prev);
      pageRows.forEach((r) => next.add(r.id));
      return next;
    });
  };
  const selectAllAcrossPages = () => {
    setSetSelection(() => new Set(rows.map((r) => r.id)));
  };

  const clearSelection = () => {
    setSetSelection(new Set());
    setBulkGroup([]);
  };

  const applyBulk = () => {
    if (!bulkGroup.length || !setSelection.size) return;

    setRows((prev) =>
      prev.map((row) => {
        if (!setSelection.has(row.id)) return row;

        // capture original ONLY once
        if (!row._dirty) {
          setOriginalMap((m) => {
            const next = new Map(m);
            next.set(row.id, [...row.group]); // defensive copy
            return next;
          });
        }

        return {
          ...row,
          group: bulkGroup,
          _dirty: true,
        };
      }),
    );

    // mark rows as pending save
    setSaveSelection((prev) => {
      const next = new Set(prev);
      setSelection.forEach((id) => next.add(id));
      return next;
    });
  };

  // const undoRow = (id) => {
  //   setRows((prev) =>
  //     prev.map((r) =>
  //       r.id === id ? { ...r, group: r._original, _dirty: false } : r,
  //     ),
  //   );
  //   setSaveSelection((prev) => {
  //     const n = new Set(prev);
  //     n.delete(id);
  //     return n;
  //   });
  // };

  const handleSave = async () => {
    if (!saveSelection.size) return;

    // collect dirty rows
    const dirtyRows = rows.filter((r) => saveSelection.has(r.id));

    // build payload
    const payload = dirtyRows.map((r) => ({
      branchId: r.branch.id,
      locationId: r.location.id,
      groupIds: r.group.map((g) => g.id),
    }));

    try {
      console.log("Saving payload:", payload);

      // API call
      // await saveLocationGroupMapping(payload);

      // Commit state on success
      setRows((prev) =>
        prev.map((row) =>
          saveSelection.has(row.id)
            ? {
                ...row,
                _dirty: false,
              }
            : row,
        ),
      );

      // cleanup control state
      setSaveSelection(new Set());
      setSetSelection(new Set());
      setBulkGroup([]);
      setOriginalMap(new Map());
    } catch (err) {
      handleApiError(err);
      console.error("Save failed", err);
      // TODO: show toast / banner
    }
  };

  return (
    <>
      <div className="lgr-layout">
        <div className="lgr-main">
          {/* Header */}
          <Header backendError={[]} />
          <div className="lgr-header">
            <div>
              <h2>Location Group Mapping</h2>
              <p>Assign and manage location groups across branches</p>
            </div>
            <div
              className={`save-indicator ${saveSelection.size ? "active" : ""}`}
              aria-live="polite"
            >
              {/* {saveSelection.size > 0 ? ( */}
              <>
                <span className="dot" />
                {saveSelection.size} row{saveSelection.size > 1 ? "s" : ""}{" "}
                changed
              </>
              {/* ) : (
                "No pending chnages"
              )} */}
            </div>
          </div>

          {/* Bulk Panel */}
          {/* {setSelection.size === 0 && (
            <div className="bulk-hint" role="status" aria-live="polite">
              Select one or more rows to enable bulk actions
            </div>
          )} */}

          {/* ===== Bulk Context Bar ===== */}
          {/* {setSelection.size > 0 && ( */}
          <div
            className="bulk-bar"
            role="region"
            aria-label="Bulk assignment controls"
            aria-live="polite"
          >
            <div className="bulk-info">
              <strong>{setSelection.size}</strong>
              <span>locations selected for bulk assignment</span>
            </div>

            <div
              className="bulk-actions"
              role="group"
              aria-label="Bulk selection actions"
            >
              <button className="link" onClick={selectAllOnPage}>
                Select all on page
              </button>

              <button className="link" onClick={selectAllAcrossPages}>
                Select all across pages
              </button>

              <button className="link danger" onClick={clearSelection}>
                Clear selection
              </button>
            </div>

            <div className="bulk-assign">
              <LocationGroupMultiSelect
                options={GROUPS}
                value={bulkGroup}
                onChange={setBulkGroup}
                placeholder="Assign location groups"
              />
              <button
                className="btn"
                disabled={!bulkGroup.length}
                onClick={applyBulk}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <table className="grid">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Branch</th>
                  <th>Location</th>
                  <th className="group-fixed">Location Groups</th>
                  <th className="assign-fixed">Assign</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.id} className={r._dirty ? "dirty" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={setSelection.has(r.id)}
                        onChange={() => toggleSet(r.id)}
                      />
                    </td>
                    <td>{r.branch.name}</td>
                    <td>{r.location.name}</td>
                    <td className="muted">
                      {r.group.length
                        ? r.group.map((g) => g.name).join(", ")
                        : "Not assigned"}
                    </td>
                    <td>
                      <LocationGroupMultiSelect
                        options={GROUPS}
                        value={r.group}
                        onChange={(value) => {
                          setSetSelection((p) => new Set(p).add(r.id));

                          setRows((prev) =>
                            prev.map((row) => {
                              if (row.id !== r.id) return row;

                              if (!row._dirty) {
                                setOriginalMap((m) => {
                                  const next = new Map(m);
                                  next.set(r.id, row.group);
                                  return next;
                                });
                              }

                              return {
                                ...row,
                                group: value,
                                _dirty: true,
                              };
                            }),
                          );

                          setSaveSelection((p) => new Set(p).add(r.id));
                        }}
                        onCancel={() => {
                          setRows((prev) =>
                            prev.map((row) =>
                              row.id === r.id
                                ? {
                                    ...row,
                                    group: originalMap.get(r.id) ?? row.group,
                                    _dirty: false,
                                  }
                                : row,
                            ),
                          );

                          setSaveSelection((prev) => {
                            const next = new Set(prev);
                            next.delete(r.id);
                            return next;
                          });

                          setOriginalMap((m) => {
                            const next = new Map(m);
                            next.delete(r.id);
                            return next;
                          });
                        }}
                      />
                      {/* {r._dirty && (
                        <button className="link" onClick={() => undoRow(r.id)}>
                          Undo
                        </button>
                      )} */}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        disabled={!r._dirty}
                        checked={saveSelection.has(r.id)}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pager">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>

        <aside className="lgr-actions">
          <FloatingActionBar
            actions={{
              save: {
                onClick: handleSave,
                disabled: !saveSelection.size,
                // disabled: isViewMode || isSubmitted
              },
              search: {
                //onClick: handleSearch,
                disabled: true,
              },
              clear: {
                //onClick: handleClear,
                // disabled:true,
              },
              delete: {
                //onClick: handleDelete,
                // disabled: !hasDeletePermission
                disabled: true,
              },

              // print: {
              //   onClick: handlePrint,
              //   // disabled: isNewRecord
              //   disabled: true,
              // },
              // new: {
              //    onClick: toggleForm, //to toggle the designation form
              // },
              refresh: {
                //   onClick: () => window.location.reload(),  // Refresh the page
              },
            }}
          />
        </aside>
      </div>
    </>
  );
}
