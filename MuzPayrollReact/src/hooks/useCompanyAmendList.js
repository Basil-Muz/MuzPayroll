import { useState, useCallback } from "react";

import { getCompanyAmendList } from "../services/company.service";
import { handleApiError } from "../utils/errorToastResolver";

export const useCompanyAmendList = () => {
  const [amendments, setAmendments] = useState([]);
  const [selectedAmendment, setSelectedAmendment] = useState(null);

  const fetchCompanyAmendData = useCallback(
    async (companyId) => {
      try {
        const response = await getCompanyAmendList(companyId);

        // setAmendments(response.data.companyDtoLogs || []); // Use the amends data
        // delete response.data.companyDtoLogs;
        
        const list = response.data.companyDtoLogs || [];

      setAmendments([...list]); // new reference

      // Select latest ENTRY amendment (or fallback)
      const latest =
        list.find(a => a.authorizationStatus === false) ||
        list[list.length - 1] ||
        null;

      setSelectedAmendment(latest); //data form master table
        // console.log("Amend response", selectedAmendment);
      } catch (error) {
        handleApiError(error, {
          operation: "fetch", //Opration name
          entity: "company", //Table name
        });
        console.error("Error fetching company data:", error);
      }
    },
    [setSelectedAmendment, setAmendments],
  );
  return { amendments, selectedAmendment, fetchCompanyAmendData, setSelectedAmendment};
};
