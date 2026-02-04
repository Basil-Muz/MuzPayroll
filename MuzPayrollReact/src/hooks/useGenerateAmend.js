import { useCallback } from "react";

export const useGenerateAmend = ({
  setSelectedAmendment,
  setAddingNewAmend,
  reset,
  getValues,
  clearErrors,
  // setIsReadOnly,
}) => {
    //Prepare form for generating new amendments
  const handleGenerateAmendment = useCallback(() => {
    setSelectedAmendment(null);
    setAddingNewAmend(true);
    // setIsReadOnly(false);

    reset({
      ...getValues(), //  keep base data
        authorizationStatus: 0, // ENTRY
        withaffectdate: "",
      // documents: [
      //   {
      //     type: "",
      //     number: "",
      //     expiryDate: "",
      //     file: null,
      //     remarks: "",
      //   },
      // ],
    });

    clearErrors();
  }, [setSelectedAmendment, setAddingNewAmend, reset, getValues, clearErrors]);
  return { handleGenerateAmendment };
};
