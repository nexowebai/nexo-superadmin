import { useNotificationContext } from '../context/NotificationContext';

export function useNotifications(options = {}) {
    return useNotificationContext();
}

export default useNotifications;
