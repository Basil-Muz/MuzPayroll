import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLoader } from "../context/LoaderContext";
// import { useCompanyAmendList } from "./useCompanyAmendList";
import { handleApiError } from "../utils/errorToastResolver";
import { ensureMinDuration } from "../utils/loaderDelay";

export const useSaveForm = ({
  trigger,
  //   errors,
  userCode,
  reset,
  entityId,
  amendments,
  refreshAmendments,
  entity, // Table name(company, branch, location...)
  saveEntity, //  service(api) for saving the entity
  //   setStep,
}) => {
  const { showRailLoader, hideLoader } = useLoader();
  const [step, setStep] = useState(0); //   switch steps
  const datePickerRef = useRef(null); //    Open authrization datePickerRef after save
  //   const {
  //     // amendments,
  //     // setAmendments,
  //     fetchCompanyAmendData,
  //   } = useCompanyAmendList();

  const onSubmit = async (data) => {
    const isValid = await trigger("documents"); //  validate all docs
    if (!isValid) {
      toast.error("Please complete the document details");
      return;
    }

    const startTime = Date.now();
    const isFirstAmend = amendments.length === 0;

    // show loader
    if (isFirstAmend) showRailLoader("Saving"+ entity +"information…");
    else showRailLoader("Updating" + entity +" details…");

    try {
      const payload = {
        ...data,
        userCode,
        authorizationDate: new Date().toISOString().split("T")[0],
      };
      // console.log("Submitting data", data);
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "companyImage") {
          formData.append(key, value);
        }
      });

      if (payload.companyImage instanceof File) {
        //  New Image file from user
        formData.append("companyImage", payload.companyImage);
      } else if (typeof payload.companyImage === "string") {
        //Old image in amends
        formData.append("companyImagePath", payload.companyImage);
      }

      // console.log("FormData contents:");
      // for (const [key, value] of formData.entries()) {
      //   if (value instanceof File) {
      //     console.log(key, {
      //       name: value.name,
      //       size: value.size,
      //       type: value.type,
      //     });
      //   } else {
      //     console.log(key, value);
      //   }
      // }

      await saveEntity(formData); // to call the API
      //   await refreshAmendments(companyId);   //  refresh Amendments data
      //setCanSave(false);     // disable save button
      toast.success(entity +" saved successfully!");
      setStep(0); //Goes to step 1
      console.log("Has Amend", isFirstAmend);
      // reset only on success
      if (!isFirstAmend) {
        await refreshAmendments(entityId); // fetch the amendment data
      } else {
        reset(); //form reset
      }
      //     try {
      //
      //       // const responseText = await response.text();
      //       // if (responseText) {
      //       //   result = JSON.parse(responseText);
      //       // }
      //     } catch (error) {
      //   handleApiError(error);
      // }
      //       console.error("Error parsing response:", parseError);
      //     }

      // if (result && result.success === true) {
      //   toast.success("Company saved successfully!");
      //   return;
      // }

      /* -------------------------------
          Prepare documents JSON
        (NO FileList inside JSON)
      -------------------------------- */
      // const documentsPayload = data.documents.map((doc) => {
      //   // Append file separately
      //   if (doc.file && doc.file.length > 0) {
      //     formData.append("files", doc.file[0]); //  backend handles array
      //   }

      //   return {
      //     type: doc.type,
      //     number: doc.number,
      //     expiryDate: doc.expiryDate,
      //     remarks: doc.remarks || "",
      //   };
      // });

      /* -------------------------------
          Prepare final JSON payload
      -------------------------------- */
      // const payload = {
      //   ...data,
      //   documents: documentsPayload,
      // };

      // console.log("payload:", payload);

      //  VERY IMPORTANT: remove FileList from payload
      // delete payload.documents?.file;

      /* -------------------------------
          Append JSON as Blob
      -------------------------------- */
      // formData.append(
      //   "data",
      //   new Blob([JSON.stringify(payload)], {
      //     type: "application/json",
      //   })
      // );

      /* -------------------------------
          Debug FormData (correct way)
      -------------------------------- */
      // console.log("FormData entries:");
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value instanceof File ? "FILE" : value);
      // }

      /* -------------------------------
          API CALL (example)
      -------------------------------- */
      // await fetch("/api/branch/save", {
      //   method: "POST",
      //   body: formData
      // });
    } catch (err) {
      // const apiErrors = err.response?.data?.errors;
      // if (apiErrors) {
      //   Object.entries(apiErrors).forEach(([field, message]) => {
      //     setError(field, { type: "server", message });
      //   });
      // }
      console.error("Submit failed:", err);

      handleApiError(err, {
        operation: "save", //Opration name
        entity: entity, //Table name
      });
    } finally {
      await ensureMinDuration(startTime, 1200);
      if (isFirstAmend) datePickerRef.current?.setOpen(true);
      // hide loader ONLY at the end
      hideLoader();
    }
  };
  return { onSubmit, step, setStep, datePickerRef };
};
