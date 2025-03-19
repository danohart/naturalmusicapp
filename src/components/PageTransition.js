import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/router";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1],
    },
  },
};

export default function PageTransition({ children }) {
  const router = useRouter();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={router.asPath}
        initial='initial'
        animate='enter'
        exit='exit'
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
