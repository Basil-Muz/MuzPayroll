import { useCallback, useState } from "react";
import { fetchBranchesByCompany } from "../services/branch.service";
import { handleApiError } from "../utils/errorToastResolver";

export const useLoadBranch = () => {
  const [branchList, setBranchList] = useState([]);

  const loadBranches = useCallback(async (companyId) => {
    if (!companyId) return;

    try {
      const res = await fetchBranchesByCompany(companyId);

      const branches = res.data.map((branch) => ({
        value: branch.branchMstID,
        label: branch.branch,
      }));

      setBranchList(branches);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const resetBranches = () => {
    setBranchList([]);
  };

  return {
    branchList,
    loadBranches,
    resetBranches,
  };
};
