import { useCallback, useState } from "react";
import { fetchBranchesByCompany } from "../services/branch.service";
import { handleApiError } from "../utils/errorToastResolver";

export const useLoadBranch = () => {
  const [branchList, setBranchList] = useState([]);

  const loadBranches = useCallback(async (userId, companyId) => {
    if (!companyId) return;

    try {
      const res = await fetchBranchesByCompany(userId,companyId);

      const branches = res.data.map((branch) => ({
        value: branch.entityHierarchyId,
        label: branch.entityName,
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
