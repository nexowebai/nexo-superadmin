import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

const getSupabase = () => {
    if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });
    }
    return supabaseInstance;
};

export const supabase = getSupabase();

export const subscribeToNotifications = (userId, { onInsert, onUpdate, onDelete, onConnectionChange }) => {
    const client = getSupabase();

    if (!client || !userId) {
        onConnectionChange?.('DISABLED');
        return null;
    }

    const channelName = `notifications_${userId}`;

    const channel = client
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'notifications'
            },
            (payload) => {
                if (payload.eventType === 'INSERT') {
                    if (payload.new.user_id === userId) {
                        onInsert?.(payload.new);
                    }
                } else if (payload.eventType === 'UPDATE') {
                    if (payload.new.user_id === userId) {
                        onUpdate?.(payload.new);
                    }
                } else if (payload.eventType === 'DELETE') {
                    if (payload.old.user_id === userId) {
                        onDelete?.(payload.old);
                    }
                }
            }
        )
        .subscribe((status) => {
            onConnectionChange?.(status);
        });

    return channel;
};

export const unsubscribeFromChannel = (channel) => {
    const client = getSupabase();
    if (channel && client) {
        client.removeChannel(channel);
    }
};

export default supabase;
