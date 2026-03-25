import { useState, useEffect } from "react";
import { LocationGroupMultiSelect } from "../multiSelectHeader/LocationGroupMultiSelect";
import "./CompanyAllocationModel.css"
export default function CompanyAllocationModal({
  user,
  companies,
  groupOptions,
  locationOptions,
  onClose,
  onSave,
}) {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(companies || []);
  }, [companies]);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) =>
        r.companyId === id ? { ...r, [field]: value } : r
      )
    );
  };

  const handleSave = () => {
    const enabledRows = rows.filter((r) => r.enabled);
    onSave(enabledRows);
  };

  return (
    <div className="company-allocation-backdrop">
      <div className="company-allocation-modal">

        <div className="company-allocation-header">
          <div className="company-allocation-title">
            Company Allocation – {user.name} ({user.code})
          </div>

          <button className="company-allocation-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="company-allocation-body">
          <table className="company-allocation-table">

            <thead>
              <tr>
                <th className="company-col">Company</th>
                <th className="group-col">User Groups</th>
                <th className="location-col">Locations</th>
                <th className="enable-col">Enable</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.companyId} className="company-row">

                  <td className="company-name">
                    {row.companyName}
                  </td>

                  <td className="company-ms">
                    <LocationGroupMultiSelect
                      options={groupOptions}
                      value={row.groups || []}
                      disabled={!row.enabled}
                      onChange={(val) =>
                        updateRow(row.companyId, "groups", val)
                      }
                      placeholder="Select groups"
                    />
                  </td>

                  <td className="company-ms">
                    <LocationGroupMultiSelect
                      options={locationOptions}
                      value={row.locations || []}
                      disabled={!row.enabled}
                      onChange={(val) =>
                        updateRow(row.companyId, "locations", val)
                      }
                      placeholder="Select locations"
                    />
                  </td>

                  <td className="company-enable">
                    <input
                      type="checkbox"
                      checked={row.enabled || false}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        updateRow(row.companyId, "enabled", checked);

                        if (!checked) {
                          updateRow(row.companyId, "groups", []);
                          updateRow(row.companyId, "locations", []);
                        }
                      }}
                    />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="company-allocation-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}