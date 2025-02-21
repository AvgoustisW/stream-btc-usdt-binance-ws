import AlertsTerminal from "@/components/alerts/AlertsTerminal";
import { useWebSocketStore } from "@/store/webSocketStore";

const Alerts = () => {
	const alerts = useWebSocketStore((state) => state.alerts);

	return (
		<div className="h-[90dvh]">
			<AlertsTerminal alerts={alerts} />
		</div>
	);
};

export default Alerts;
