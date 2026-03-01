import { motion } from 'framer-motion';
import { Rocket, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Button from '@components/ui/Button';
import './ComingSoon.css';

function ComingSoonPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="coming-soon">
            <div className="coming-soon__bg">
                <div className="coming-soon__orb coming-soon__orb--1" />
                <div className="coming-soon__orb coming-soon__orb--2" />
                <div className="coming-soon__orb coming-soon__orb--3" />
            </div>

            <div className="coming-soon__content">
                <motion.div
                    className="coming-soon__icon"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                >
                    <Rocket size={64} />
                </motion.div>

                <motion.h1
                    className="coming-soon__title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Something Amazing is Coming
                </motion.h1>

                <motion.p
                    className="coming-soon__subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    We're working hard to bring you an incredible experience.
                    <br />
                    Stay tuned for updates!
                </motion.p>

                <motion.form
                    className="coming-soon__form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="coming-soon__input-group">
                        <Mail className="coming-soon__input-icon" size={20} />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="coming-soon__input"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        rightIcon={ArrowRight}
                    >
                        {submitted ? 'Subscribed!' : 'Notify Me'}
                    </Button>
                </motion.form>

                <motion.div
                    className="coming-soon__countdown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="coming-soon__countdown-item">
                        <span className="coming-soon__countdown-value">00</span>
                        <span className="coming-soon__countdown-label">Days</span>
                    </div>
                    <div className="coming-soon__countdown-item">
                        <span className="coming-soon__countdown-value">00</span>
                        <span className="coming-soon__countdown-label">Hours</span>
                    </div>
                    <div className="coming-soon__countdown-item">
                        <span className="coming-soon__countdown-value">00</span>
                        <span className="coming-soon__countdown-label">Minutes</span>
                    </div>
                    <div className="coming-soon__countdown-item">
                        <span className="coming-soon__countdown-value">00</span>
                        <span className="coming-soon__countdown-label">Seconds</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ComingSoonPage;
