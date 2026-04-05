import { toast } from "sonner";

const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message || "Something went wrong"),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),

  promise: (promise, messages = {}) => {
    const {
      loading = "Loading...",
      success = "Success!",
      error = "Something went wrong",
    } = messages;

    return toast.promise(promise, {
      loading,
      success: (data) =>
        typeof success === "function" ? success(data) : success,
      error: (err) =>
        typeof error === "function" ? error(err) : err?.message || error,
    });
  },

  async: async (asyncFn, messages = {}) => {
    const {
      loading = "Loading...",
      success = "Success!",
      error = "Something went wrong",
    } = messages;

    const toastId = toast.loading(loading);

    try {
      const result = await asyncFn();
      toast.success(typeof success === "function" ? success(result) : success, {
        id: toastId,
      });
      return result;
    } catch (err) {
      toast.error(
        typeof error === "function" ? error(err) : err?.message || error,
        { id: toastId },
      );
      throw err;
    }
  },
};

export default notify;
