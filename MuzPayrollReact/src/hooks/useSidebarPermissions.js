import { fetchSideBar } from "../services/menu.service";
import { handleApiError } from "../utils/errorToastResolver";

export const useSidebarPermissions = () => {
  const setSidebar = async (
    transtype,
    transsubtype,
    userid,
    solutionid,
    optionid,
    entityHierarchyId,
    setBackendPermissions,
  ) => {
    try {
      if (optionid === null) return;
      const res = await fetchSideBar(
        transtype,
        transsubtype,
        userid,
        solutionid,
        optionid,
        entityHierarchyId,
      );
      setBackendPermissions(res.data[0]);
    } catch (error) {
      handleApiError(error, { entity: "Action bar" });
      console.error("Error fetching sidebar permissions:", error);
    }
  };

  return { setSidebar };
};
