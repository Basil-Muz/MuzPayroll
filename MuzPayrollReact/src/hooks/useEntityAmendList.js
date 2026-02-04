import { useState, useCallback, useMemo } from "react";
import { handleApiError } from "../utils/errorToastResolver";
import { useLoader } from "../context/LoaderContext";
import { ensureMinDuration } from "../utils/loaderDelay";

export const useEntityAmendList = ({
  entity,
  getEntityAmendList,
  addingNewAmend,
  setAddingNewAmend,
}) => {
  const [amendments, setAmendments] = useState([]);
  const [selectedAmendment, setSelectedAmendment] = useState(null);
  const { showRailLoader, hideLoader } = useLoader();

  const fetchEntityAmendData = useCallback(
    async (entityId) => {
      const startTime = Date.now();
      showRailLoader("Fetching " + entity + "details…");

      try {
        const entityLogs = entity + "DtoLogs";
        const response = await getEntityAmendList(entityId);

        //const list = response.data[entityLogs] || [];// Use the amends data

        setAmendments(response.data[entityLogs] || []); // new reference

        // Select latest ENTRY amendment (or fallback)
        //const latest =
        // list.find((a) => a.authorizationStatus === false) ||
        // list[list.length - 1] ||
        // null;
        setSelectedAmendment(response.data);
        setAddingNewAmend(false);
        // setSelectedAmendment(latest); //data form master table
        // // delete response.data.companyDtoLogs;
        console.log("Amend response", response.data);
      } catch (error) {
        handleApiError(error, {
          operation: "fetch", //    Opration name
          entity: entity, //      Table name
        });
        console.error("Error fetching branch data:", error);
      } finally {
        await ensureMinDuration(startTime, 1200);
        hideLoader();
      }
    },
    [setSelectedAmendment, setAmendments, getEntityAmendList, entity],
  );
  const isVerifiedAmendment = useMemo(() => {
    // Read-only VERIFIED mode
    return selectedAmendment?.authorizationStatus === true && !addingNewAmend;
  }, [selectedAmendment, addingNewAmend]);
  return {
    fetchEntityAmendData,
    amendments,
    setAmendments,
    selectedAmendment,
    setSelectedAmendment,
    isVerifiedAmendment,
  };
};
