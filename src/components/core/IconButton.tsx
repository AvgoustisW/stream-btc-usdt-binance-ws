import React from "react";
import Loader from "./Loader";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	icon: React.ReactElement;
	isLoading?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ text, icon, isLoading, className = "", ...props }) => {
	return (
		<button {...props} className={`flex items-center gap-2 border border-slate-600  p-2 h-10  rounded ${className} `}>
			<span>{isLoading ? <Loader /> : icon}</span>
			<span>{text}</span>
		</button>
	);
};

export default IconButton;
