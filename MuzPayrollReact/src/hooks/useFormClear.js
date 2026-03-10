import { toast } from "react-hot-toast";

export const useFormClear = ({
  setAmendmentData,
  selectedAmendment,
  clearErrors,
  reset,
  userCode,
  ids = {}, // optional ids
}) => {
  const { companyId, branchId } = ids;

  const handleClear = () => {
    if (selectedAmendment) {
      // Restore selected amendment values
      setAmendmentData(selectedAmendment);

      clearErrors();
      toast.success("Unsaved changes have been cleared");
    } else {
      //  New record → reset to empty insert state
      reset({
        userCode,
        authorizationStatus: 0,
        withaffectdate: "",
        companyMst: companyId ? Number(companyId) : null,
        branchEntity: branchId ? Number(branchId) : null,
        activeDate: new Date().toISOString().split("T")[0],
      });
    }
  };
  return {
    handleClear,
  };
};
