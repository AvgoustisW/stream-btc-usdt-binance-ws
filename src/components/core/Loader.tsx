import React from "react";

interface LoaderProps {
	size?: number;
	borderWidth?: number;
	color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 16, borderWidth = 2, color = "" }) => {
	return (
		<div className="flex justify-center items-center">
			<div
				style={{
					width: `${size}px`,
					height: `${size}px`,
					borderWidth: `${borderWidth}px`,
					borderColor: color,
					borderTopColor: "transparent",
				}}
				className="border-solid rounded-full animate-spin"
			></div>
		</div>
	);
};

export default Loader;
