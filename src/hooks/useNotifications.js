import { useNotifications as useNotificationContext } from '@context';

export function useNotifications(options = {}) {
    return useNotificationContext();
}

export default useNotifications;
