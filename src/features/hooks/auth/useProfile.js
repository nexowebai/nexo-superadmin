import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../../auth/authApi';
import { useAuth } from '@context/AuthContext';
import notify from '@utils/notify';

export function useProfile() {
    const { user, updateUser } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: () => authApi.getProfile(),
        select: (res) => res?.data || res,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (payload) => authApi.updateProfile(payload),
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
        mutationFn: (payload) => authApi.changePassword(payload),
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
