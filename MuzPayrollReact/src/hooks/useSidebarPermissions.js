import { fetchSideBar } from "../services/menu.service";

export const useSidebarPermissions = () => {
  const setSidebar = async (
    transtype,
    transsubtype,
    userid,
    solutionid,
    optionid,
    entityHierarchyId,
    setBackendPermissions
  ) => {
    try {
      const res = await fetchSideBar(
        transtype,
        transsubtype,
        userid,
        solutionid,
        optionid,
        entityHierarchyId
      );

      setBackendPermissions(res.data);
    } catch (error) {
      console.error("Error fetching sidebar permissions:", error);
    }
  };

  return { setSidebar };
};