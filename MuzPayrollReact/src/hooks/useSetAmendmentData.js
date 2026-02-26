// hooks/useSetAmendmentData.js
import { useCallback } from "react";

// import { toLocalDate } from "../utils/dateFormater";

export const useSetAmendmentData = ({ amendLength, setValue, fieldMap }) => {
  const setAmendmentData = useCallback(
    (selectedAmendment) => {
      //has no data passed the compilation stoped
      if (amendLength <= 0 || !selectedAmendment) return;

      //loop with respect to the form feilds
      Object.entries(fieldMap).forEach(([formField, dataKey]) => {
        //set the data with respect to form feilds
        let value = selectedAmendment[dataKey];

        // defaults & transforms
        if (formField === "authorizationStatus") {
          value = selectedAmendment.authorizationStatus ? 1 : 0;
        }
        if (formField === "companyImag") {
          console.log("Conpamy image path", selectedAmendment.companyImagePath);
        }
        if (formField === "country") {
          value = selectedAmendment.country ?? "IN";
        }

        setValue(formField, value ?? "", {
          shouldDirty: false,
          shouldValidate: true,
        });
      });
    },
    [setValue, amendLength, fieldMap],
  );

  const setSeconderyFormData = useCallback(
    (selectedItem) => {
      //has no data passed the compilation stoped
      if (!selectedItem) return;

      //loop with respect to the form feilds
      Object.entries(fieldMap).forEach(([formField, dataKey]) => {
        //set the data with respect to form feilds
        let value = selectedItem[dataKey];

        // defaults & transforms
        if (formField === "authorizationStatus") {
          value = selectedItem.authorizationStatus ? 1 : 0;
        }
        if (formField === "companyImag") {
          console.log("Conpamy image path", selectedItem.companyImagePath);
        }
        if (formField === "country") {
          value = selectedItem.country ?? "IN";
        }

        setValue(dataKey, value ?? "", {
          shouldDirty: false,
          shouldValidate: true,
        });
      });
    },
    [setValue, amendLength, fieldMap],
  );

  return { setAmendmentData, setSeconderyFormData};
};
