import { useCallback, useState } from "react";
import { fetchCompany } from "../services/company.service";
import { handleApiError } from "../utils/errorToastResolver";

export const useLoadCompany = () => {
  const [companyList, setCompanyList] = useState([]); //fetch companys

  const loadCompany = useCallback(async (userId) => {
    try {
      if (!userId) return;

      const companyResponse = await fetchCompany(userId);
      const companies = companyResponse.data;

      const companyList = Array.isArray(companies)
        ? companies.map((c) => ({
            value: c.entityHierarchyId,
            label: c.entityName,
          }))
        : [
            {
              value: companies.entityHierarchyId,
              label: companies.entityName,
            },
          ];

      setCompanyList(companyList);

      console.log("Company List:", companyList);
      // setCompanyList([company]);
      // setInitialCompanyId(company.companyMstID); // store it
    } catch (error) {
      // toast.error("Failed to load company:", error);
      handleApiError(error);
    }
  }, []);
  return { loadCompany, companyList };
};
