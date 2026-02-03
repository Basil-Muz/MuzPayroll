import { toast } from "react-hot-toast";

export const handleApiError = (
  error,
  {
    entity,
    operation , // fetch | save | update | delete
  },
) => {
  // console.error("API Error:", error);

  const defaultMessage = "Something went wrong";

  // Network / connection issue
  if (!error.response) {
    toast.error("Unable to connect to server. Please check your network.");
    return;
  }

  // HTTP errors
  const status = error.type;
  switch (status) {
    case 400:
      toast.error("Invalid request.");
      break;
    case 401:
      toast.error("Session expired. Please login again.");
      break;
    case 403:
      toast.error("You do not have permission.");
      break;
    case 404:
      toast.error(
        error?.errors[0] || `${entity ? entity + " " : ""}not found.`,
      );
      break;
    case 409:
      toast.error(error.errors[0] || "Duplicate record exists.");
      break;
    case 422:
      toast.error(error.errors[0] || "Operation not allowed.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    default:
      toast.error(error.errors[0] || defaultMessage);
  }
  return;
};
