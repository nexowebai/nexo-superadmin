import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Zap } from "lucide-react";

const smooth = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };
const spring = { type: "spring", stiffness: 300, damping: 30 };

const SlaMetrics = ({ slaMetrics }) => {
    return (
        <motion.div
            className="card-pro card-pro--half"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smooth, delay: 0.65 }}
        >
            <div className="card-pro__header">
                <div className="card-pro__header-left">
                    <div className="card-pro__icon">
                        <Clock size={18} strokeWidth={2.5} />
                    </div>
                    <h3>SLA Metrics</h3>
                </div>
            </div>
            <div className="sla-content">
                <div className="sla-stats">
                    <motion.div
                        className="sla-stat sla-stat--success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...spring, delay: 0.7 }}
                    >
                        <div className="sla-stat__icon">
                            <TrendingUp size={18} strokeWidth={2.5} />
                        </div>
                        <div className="sla-stat__info">
                            <span className="sla-stat__value">{slaMetrics.onTime}%</span>
                            <span className="sla-stat__label">On Time</span>
                        </div>
                    </motion.div>
                    <motion.div
                        className="sla-stat sla-stat--warning"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...spring, delay: 0.75 }}
                    >
                        <div className="sla-stat__icon">
                            <Clock size={18} strokeWidth={2.5} />
                        </div>
                        <div className="sla-stat__info">
                            <span className="sla-stat__value">{slaMetrics.delayed}%</span>
                            <span className="sla-stat__label">Delayed</span>
                        </div>
                    </motion.div>
                    <motion.div
                        className="sla-stat sla-stat--error"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...spring, delay: 0.8 }}
                    >
                        <div className="sla-stat__icon">
                            <TrendingDown size={18} strokeWidth={2.5} />
                        </div>
                        <div className="sla-stat__info">
                            <span className="sla-stat__value">{slaMetrics.critical}%</span>
                            <span className="sla-stat__label">Critical</span>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    className="sla-response"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...smooth, delay: 0.85 }}
                >
                    <Zap size={16} strokeWidth={2.5} />
                    <div className="sla-response__info">
                        <span className="sla-response__label">Avg Response Time</span>
                        <span className="sla-response__value">{slaMetrics.avgResponseTime}</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SlaMetrics;
