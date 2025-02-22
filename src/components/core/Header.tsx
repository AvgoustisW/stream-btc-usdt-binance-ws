import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import StreamController from "@/components/StreamController";
import MonitorLegend from "../monitor/MonitorLegend";
import AlertsLegend from "../alerts/AlertsLegend";

const Header = () => {
	const { pathname } = useLocation();
	const hasExtraInfo = pathname === "/monitor";
	const pathForExtraInfo = hasExtraInfo ? pathname : "";
	return (
		<header className="px-10 py-2 sticky w-full  top-0 z-200 flex items-center justify-between border-b border-green-500">
			<StreamController />
			{hasExtraInfo && pathForExtraInfo === "/monitor" ? <MonitorLegend /> : <AlertsLegend />}
			<Navigation />
		</header>
	);
};

export default Header;
