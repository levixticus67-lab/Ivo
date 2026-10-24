import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = false }) {
  const Component = hover ? motion.div : "div";
  return (
    <Component className={"glass-panel " + className} whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}>
      {children}
    </Component>
  );
}
