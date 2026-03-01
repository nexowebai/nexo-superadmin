import { motion } from "framer-motion";
import {
  Rocket,
  Bell,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import Button from "@components/ui/Button";
import notify from "@utils/notify";
import "./ComingSoonPage.css";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function ComingSoonPage({
  title = "Coming Soon",
  subtitle = "We're working hard to bring you something amazing",
  features = [],
  icon: Icon = Rocket,
}) {
  const handleNotifyMe = () => {
    notify.success("You'll be notified when this feature launches!");
  };

  const defaultFeatures =
    features.length > 0
      ? features
      : [
          {
            icon: CreditCard,
            title: "Payment Processing",
            description: "Seamless payment integration",
          },
          {
            icon: BarChart3,
            title: "Analytics Dashboard",
            description: "Comprehensive revenue insights",
          },
          {
            icon: Shield,
            title: "Secure Transactions",
            description: "Enterprise-grade security",
          },
          {
            icon: Clock,
            title: "Real-time Updates",
            description: "Instant payment notifications",
          },
        ];

  return (
    <PageContainer>
      <div className="coming-soon">
        {/* Animated background elements */}
        <div className="coming-soon__bg">
          <div className="coming-soon__orb coming-soon__orb--1" />
          <div className="coming-soon__orb coming-soon__orb--2" />
          <div className="coming-soon__orb coming-soon__orb--3" />
          <div className="coming-soon__grid" />
        </div>

        <motion.div
          className="coming-soon__content"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {/* Icon */}
          <motion.div className="coming-soon__icon-wrapper" variants={fadeUp}>
            <div className="coming-soon__icon-glow" />
            <div className="coming-soon__icon">
              <Icon size={40} />
            </div>
            <motion.div
              className="coming-soon__sparkle coming-soon__sparkle--1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={16} />
            </motion.div>
            <motion.div
              className="coming-soon__sparkle coming-soon__sparkle--2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles size={12} />
            </motion.div>
          </motion.div>

          {/* Title & Subtitle */}
          <motion.h1 className="coming-soon__title" variants={fadeUp}>
            {title}
          </motion.h1>
          <motion.p className="coming-soon__subtitle" variants={fadeUp}>
            {subtitle}
          </motion.p>

          {/* Progress Indicator */}
          <motion.div className="coming-soon__progress" variants={fadeUp}>
            <div className="coming-soon__progress-bar">
              <motion.div
                className="coming-soon__progress-fill"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
            <span className="coming-soon__progress-text">75% Complete</span>
          </motion.div>

          {/* Features Preview */}
          <motion.div className="coming-soon__features" variants={fadeUp}>
            <h3 className="coming-soon__features-title">What's Coming</h3>
            <div className="coming-soon__features-grid">
              {defaultFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="coming-soon__feature"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="coming-soon__feature-icon">
                    <feature.icon size={20} />
                  </div>
                  <div className="coming-soon__feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div className="coming-soon__cta" variants={fadeUp}>
            <Button
              variant="primary"
              size="lg"
              icon={Bell}
              onClick={handleNotifyMe}
            >
              Notify Me When Ready
            </Button>
          </motion.div>

          {/* Back Link */}
          <motion.a
            href="/dashboard"
            className="coming-soon__back"
            variants={fadeUp}
            whileHover={{ x: -4 }}
          >
            <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
            Back to Dashboard
          </motion.a>
        </motion.div>
      </div>
    </PageContainer>
  );
}

export default ComingSoonPage;
