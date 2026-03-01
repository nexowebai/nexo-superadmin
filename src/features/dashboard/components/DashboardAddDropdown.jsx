import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Building2, UserPlus, FilePlus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardAddDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const items = [
        { label: "Add Organization", icon: Building2, path: "/organizations/create" },
        { label: "Create Admin", icon: UserPlus, path: "/admins/create" },
        { label: "New Request", icon: FilePlus, path: "/requests" },
    ];

    return (
        <div className="add-dropdown" ref={dropdownRef}>
            <motion.button
                className="add-btn-sleek"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05, rotate: isOpen ? 0 : 90 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Add new"
            >
                <Plus size={24} strokeWidth={2.5} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="add-dropdown__menu"
                        initial={{ opacity: 0, y: 15, scale: 0.9, x: 10 }}
                        animate={{ opacity: 1, y: 8, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 15, scale: 0.9, x: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="add-dropdown__header">Quick Actions</div>
                        {items.map((item, index) => (
                            <button
                                key={index}
                                className="add-dropdown__item"
                                onClick={() => {
                                    navigate(item.path);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="add-dropdown__item-icon">
                                    <item.icon size={16} />
                                </div>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardAddDropdown;
