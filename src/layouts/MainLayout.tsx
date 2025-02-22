import { Outlet } from "react-router-dom";
import Header from "@/components/core/Header";

const MainLayout = () => {
	return (
		<div className="h-dvh text-stone-100 bg-slate-950">
			<Header />
			<div className="h-[85dvh]">
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
