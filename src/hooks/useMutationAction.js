import { useCallback } from "react";
import notify from "@utils/notify";

/**
 * Institutional-grade mutation handler
 * Strictly avoids async/await and optional chaining
 * @param {Function} mutation - The mutation function from TanStack Query
 * @param {Object} options - Configuration for notifications and callbacks
 */
export function useMutationAction(mutation, options) {
  const safeOptions = options || {};

  return useCallback(
    (payload, customOptions) => {
      const mergedOptions = customOptions || {};
      const messages = mergedOptions.messages || safeOptions.messages;

      if (!messages) {
        // Fallback for missing messages
        mutation(payload, {
          onSuccess: (data) => {
            if (mergedOptions.onSuccess) mergedOptions.onSuccess(data);
            if (safeOptions.onSuccess) safeOptions.onSuccess(data);
          },
          onError: (err) => {
            if (mergedOptions.onError) mergedOptions.onError(err);
            if (safeOptions.onError) safeOptions.onError(err);
          },
        });
        return;
      }

      notify.promise(
        new Promise((resolve, reject) => {
          mutation(payload, {
            onSuccess: (data) => {
              if (mergedOptions.onSuccess) mergedOptions.onSuccess(data);
              if (safeOptions.onSuccess) safeOptions.onSuccess(data);
              resolve(data);
            },
            onError: (err) => {
              if (mergedOptions.onError) mergedOptions.onError(err);
              if (safeOptions.onError) safeOptions.onError(err);
              reject(err);
            },
          });
        }),
        messages,
      );
    },
    [mutation, safeOptions],
  );
}
