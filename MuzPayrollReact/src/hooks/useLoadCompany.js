import { useCallback, useState } from "react";
import { fetchCompany } from "../services/company.service";
import { handleApiError } from "../utils/errorToastResolver";

export const useLoadCompany = () => {
  const [companyList, setCompanyList] = useState([]); //fetch companys

  const loadCompany = useCallback(async (userId) => {
    try {
      if (!userId) return;

      const companyResponse = await fetchCompany(userId);

      const company = companyResponse.data;
      // console.log("Company Listdasfgwsdrg:", company.companyMstID);
      const companyobj = {
        value: company.companyMstID,
        label: company.company,
      };
      setCompanyList([companyobj]);

      // setCompanyList([company]);
      // setInitialCompanyId(company.companyMstID); // store it
    } catch (error) {
      // toast.error("Failed to load company:", error);
      handleApiError(error);
    }
  }, []);
  return { loadCompany, companyList };
};
