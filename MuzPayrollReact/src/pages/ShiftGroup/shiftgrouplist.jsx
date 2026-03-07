import "./shiftgrouplist.css";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const ShiftGroupList = ({
  data,
  view,
  searchText,
  onSelect,
  handleDataToForm,
}) => {
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={`card-grid ${view}`}>
      {filteredData.map((item) => (
        <div
          className={`advance-card ${item.inactiveDate ? "inactive" : "active"}`}
          key={item.mstID}
        >
          {/* HEADER */}
          <div className="card-header">
            <span
              className="code"
              onClick={() => handleDataToForm(item.mstID)}
            >
              {item.code}
            </span>

            <div className="status">
              {item.inactiveDate ? (
                <div className="status-stack inactive">
                  <div className="status-item inactive">
                    <RxCross2 className="check-icon" />
                    <span className="status-text">Inactive</span>
                    <span className="date">{item.inactiveDate}</span>
                  </div>

                  <div className="status-sub">
                    <TiTick className="check-icon muted" />
                    <span className="status-text muted">Active from</span>
                    <span className="date muted">{item.activeDate}</span>
                  </div>
                </div>
              ) : (
                <div className="status-item active">
                  <TiTick className="check-icon" />
                  <span className="status-text">Active</span>
                  <span className="date">{item.activeDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* BODY */}
          <div
            className="card-title"
            onClick={() => handleDataToForm(item.mstID)}
          >
            {item.name}
          </div>

          <div className="card-shortname">{item.shortName}</div>
          <div className="card-description">{item.description}</div>
          <div className="card-description">{item.timeFrom} - {item.timeTo}</div>
          <div className="card-description">{item.shiftType}</div>
        </div>
      ))}
    </div>
  );
};

export default ShiftGroupList;