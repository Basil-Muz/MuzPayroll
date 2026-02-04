import { toast } from "react-hot-toast";

export const useFormClear = ({
    setAmendmentData,
    selectedAmendment,
    clearErrors,
    reset,
    userCode
}) =>{
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
        activeDate: new Date().toISOString().split("T")[0],
      });
    }
  };
  return {
    handleClear
  }
}