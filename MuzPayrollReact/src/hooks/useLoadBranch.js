import { useCallback, useState } from "react";
import { fetchBranchesByCompany } from "../services/branch.service";
import { handleApiError } from "../utils/errorToastResolver";
import { useLoader } from "../context/LoaderContext";
import { ensureMinDuration } from "../utils/loaderDelay";

export const useLoadBranch = () => {
  const [branchList, setBranchList] = useState([]);
    const { showRailLoader, hideLoader } = useLoader();
  const loadBranches = useCallback(async (userId, companyId) => {
    if (!companyId) return;
        const startTime = Date.now();
    showRailLoader("Refreshing...");
    try {
      const res = await fetchBranchesByCompany(userId,companyId);

      const branches = res.data.map((branch) => ({
        value: branch.entityHierarchyId,
        label: branch.entityName,
      }));
      console.log("conso",branches)
      setBranchList(branches);
    } catch (error) {
      handleApiError(error);
    }
    finally{
          await ensureMinDuration(startTime, 1200);
      hideLoader();
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
