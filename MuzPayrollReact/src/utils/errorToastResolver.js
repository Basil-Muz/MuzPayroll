import { toast } from "react-hot-toast";

export const handleApiError = (
  error,
  {
    entity,
    // operation, // fetch | save | update | delete (optional)
  } = {},
) => {
  const defaultMessage = "Something went wrong";

  /* ----------------------------------
     1️⃣ Network / Axios-level errors
  ---------------------------------- */
  if (error?.code === "ERR_NETWORK") {
    toast.error("Unable to connect to server. Please check your network.");
    return;
  }

  if (!error?.response) {
    toast.error(error?.message || defaultMessage);
    return;
  }

  /* ----------------------------------
     2️⃣ Backend response extraction
  ---------------------------------- */
  const responseData = error.response.data || {};
  console.log("Error in toast",error)
  const status =
    error.response.status ||
    responseData.statusCode ||
    error.status;

  const backendErrors = responseData.errors;
  const message =
    (Array.isArray(backendErrors) && backendErrors[0]) ||
    responseData.message ||
    error.message ||
    defaultMessage;

  /* ----------------------------------
     Status-based handling
  ---------------------------------- */
  switch (status) {
    case 400:
      toast.error(message || "Invalid request.");
      break;

    case 401:
      toast.error("Session expired. Please login again.");
      break;

    case 403:
      toast.error("You do not have permission to perform this action.");
      break;

    case 404:
      toast.error(
        message || `${entity ? entity + " " : ""}not found.`,
      );
      break;

    case 409:
      toast.error(message || "Duplicate record exists.");
      break;

    case 422:
      toast.error(message || "Operation not allowed.");
      break;

    case 500:
      toast.error("Server error. Please try again later.");
      break;

    default:
      toast.error(message);
  }
};