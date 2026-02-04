import "./css/loading.css"
const InlineLoader = ({ size = 16 }) => {
  return (
    <span
      className="inline-spinner"
      style={{ width: size, height: size }}
    />
  );
};

export default InlineLoader;
