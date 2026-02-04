import { useLoader } from "../../context/LoaderContext";
import StepProcessLoader from "./StepProcessLoader";
import RailLoader from "./RailLoader";
import "./css/loading.css"

const LoaderRenderer = () => {
  const { loader } = useLoader();

  if (!loader.type) return null;

  if (loader.type === "step") {
    return <StepProcessLoader {...loader} />;
  }

  if (loader.type === "rail") {
    return <RailLoader message={loader.message} />;
  }

  return null;
};

export default LoaderRenderer;
