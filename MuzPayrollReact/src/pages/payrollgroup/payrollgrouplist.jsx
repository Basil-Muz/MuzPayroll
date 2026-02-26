// import "./payrollgrouplist.css";

const PayrollGroupList = ({ data, view, searchText, onSelect }) => {

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={`card-grid  ${view}`}>
      {filteredData.map(item => (
        <div
          key={item.code}
          className="advance-card"
          onClick={() => onSelect(item)}
        >
          <div className="code">{item.code}</div>
          <div className="name">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default PayrollGroupList;
