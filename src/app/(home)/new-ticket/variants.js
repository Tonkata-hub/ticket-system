export const formVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 15,
			when: "beforeChildren",
			staggerChildren: 0.1,
		},
	},
};

export const itemVariants = {
	hidden: { opacity: 0, y: 20 },
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

export const titleVariants = {
	hidden: { opacity: 0, y: -20 },
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

export const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: "spring",
			stiffness: 200,
			damping: 15,
			delay: 0.3,
		},
	},
	hover: {
		scale: 1.05,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 10,
		},
	},
	tap: {
		scale: 0.95,
	},
};
