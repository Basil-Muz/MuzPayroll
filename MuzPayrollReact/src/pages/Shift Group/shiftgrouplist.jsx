import "./shiftgrouplist.css";

const ShiftGroupList = ({ data, view, searchText, onSelect }) => {

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={`shift-group-container ${view}`}>
      {filteredData.map(item => (
        <div
          key={item.code}
          className="shift-group-card"
          onClick={() => onSelect(item)}
        >
          <div className="code">{item.code}</div>
          <div className="name">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default ShiftGroupList;
