/* ================= CARD ================= */

import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

export const ListCard = ({ item, status, handleDataToForm,name }) => {
  return (
    <div
      key={item.mstID}
      className={`advance-card ${status}`}
      onClick={() => handleDataToForm(item.mstID)}
    >
      {/* HEADER */}
      <div className="card-header">
        <span className="code">{item.code}</span>

        {status === "inactive" ? (
          <div className="status-stack">
            <div className="status-item active">
              <TiTick />
              <span>{item.activeDate}</span>
            </div>
            <div className="status-item inactive">
              <RxCross2 />
              <span>{item.inactiveDate}</span>
            </div>
          </div>
        ) : (
          <div className="status-item active">
            <TiTick />
            <span>{item.activeDate}</span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="card-title">{item.name}</div>
      <div className="card-shortname">{item.shortName}</div>
      <div
        className="card-description"
        // style={listView ? containerStyle : null}
      >
        {item.description}
      </div>
    </div>
  );
};
