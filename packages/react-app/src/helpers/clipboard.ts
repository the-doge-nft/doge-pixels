import { showErrorToast, showSuccessToast } from "../DSL/Toast/Toast";

const copyToClipboard = (value: string) => {
  try {
    navigator.clipboard
      .writeText(value)
      .then(() => showSuccessToast("Copied!"))
      .catch(e => showErrorToast("Could not Copy"));
  } catch (e) {
    alert("Copying to clipboard failed! Check your browser");
  }
};

export default copyToClipboard;
