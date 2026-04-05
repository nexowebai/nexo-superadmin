import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuth } from '@context/AuthContext';
import notify from '@utils/notify';

export function useProfile() {
    const { user, updateUser } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: () => authService.getProfile(),
        select: (res) => res?.data || res,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (payload) => authService.updateProfile(payload),
        onSuccess: (res) => {
            const updatedUser = res?.data || res;
            updateUser(updatedUser);
            notify.success('Profile updated successfully');
            refetch();
        },
        onError: (err) => {
            notify.error(err?.message || 'Failed to update profile');
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: (payload) => authService.changePassword(payload),
        onSuccess: () => {
            notify.success('Password changed successfully');
        },
        onError: (err) => {
            notify.error(err?.message || 'Failed to change password');
        }
    });

    return {
        profile: data || user,
        isLoading,
        updateProfile: updateProfileMutation.mutateAsync,
        updating: updateProfileMutation.isPending,
        changePassword: changePasswordMutation.mutateAsync,
        changingPassword: changePasswordMutation.isPending,
        refetch
    };
}
