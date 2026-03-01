import { motion } from "framer-motion";
import { Bell, ArrowRight, Clock, Activity } from "lucide-react";
import { CardSkeleton } from "@components/ui/Card/Card";
import { formatDate } from "@utils/format";

const smooth = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };

const ActivityItem = ({ icon: Icon, title, subtitle, time, status, delay = 0 }) => (
    <motion.div
        className="activity-pro"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...smooth, delay }}
        whileHover={{ x: 3, transition: { duration: 0.15 } }}
    >
        <div className={`activity-pro__icon ${status}`}>
            <Icon size={15} strokeWidth={2.5} />
        </div>
        <div className="activity-pro__content">
            <h4>{title}</h4>
            <p>{subtitle}</p>
        </div>
        <div className="activity-pro__time">
            <Clock size={10} />
            <span>{time}</span>
        </div>
    </motion.div>
);

const NotificationCenter = ({ loading, notifications, onNavigate, onViewAll }) => {
    return (
        <motion.div
            className="card-pro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smooth, delay: 0.6 }}
        >
            <div className="card-pro__header">
                <div className="card-pro__header-left">
                    <div className="card-pro__icon">
                        <Bell size={18} strokeWidth={2.5} />
                    </div>
                    <h3>Recent Notifications</h3>
                </div>
                {notifications.length > 0 && !loading && (
                    <motion.button
                        className="btn-text-only"
                        onClick={onViewAll}
                        whileHover={{ x: 2 }}
                    >
                        <span>View All</span>
                        <ArrowRight size={14} />
                    </motion.button>
                )}
            </div>
            <div className="card-pro__content no-padding">
                {loading ? (
                    <div className="activity-list">
                        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} height={70} />)}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="empty-pro py-12">
                        <Bell size={32} strokeWidth={1.5} className="text-muted opacity-20" />
                        <h4 className="mt-4 text-muted">No notifications</h4>
                    </div>
                ) : (
                    <div className="activity-list">
                        {notifications.slice(0, 5).map((notif, i) => (
                            <ActivityItem
                                key={notif.id}
                                icon={Bell}
                                title={notif.title}
                                subtitle={notif.type.replace(/_/g, " ")}
                                time={formatDate(notif.created_at, { month: "short", day: "numeric" })}
                                status={notif.is_read ? "read" : "unread"}
                                delay={i * 0.05}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NotificationCenter;
