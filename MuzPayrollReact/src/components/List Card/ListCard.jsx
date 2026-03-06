/* ================= CARD ================= */

import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

export const ListCard = ({ item, status, handleDataToForm, children }) => {
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

      {/* ===== CONDITIONAL RENDERING ===== */}

      {/* {cardType === "shiftType" ? (
        <div className="shift-details">
          <div>Shift Type: {item.shiftType}</div>
          <div>From: {item.timeFrom}</div>
          <div>To: {item.timeTo}</div>
        </div>
      ) : (
        <div className="card-description">
          {item.description}
        </div>
      )} */}
      {children}
    </div>
  );
};
