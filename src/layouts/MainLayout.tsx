import { Outlet } from "react-router-dom";
import Header from "@/components/core/Header";

const MainLayout = () => {
	return (
		<div className="h-screen text-white bg-slate-950">
			<Header />
			<Outlet />
		</div>
	);
};

export default MainLayout;
