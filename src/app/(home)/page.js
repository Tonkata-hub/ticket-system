"use client";

import { motion } from "framer-motion";
import HowItWorksSection from "./HowItWorksSection";
import NewTicketSection from "./NewTicketSection";
import WhyUsSection from "./WhyUsSection";

// Container variants for staggered children animations
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3,
			delayChildren: 0.2,
		},
	},
};

// Item variants for sections
const sectionVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 15,
		},
	},
};

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
			<motion.main className="flex-1 w-full" initial="hidden" animate="visible" variants={containerVariants}>
				<motion.div variants={sectionVariants}>
					<NewTicketSection />
				</motion.div>
				<motion.div variants={sectionVariants}>
					<WhyUsSection />
				</motion.div>
				<motion.div variants={sectionVariants}>
					<HowItWorksSection />
				</motion.div>
			</motion.main>
		</div>
	);
}
