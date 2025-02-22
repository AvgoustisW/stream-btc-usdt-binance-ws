import { useWebSocketStore } from "@/store/webSocketStore";
import { AlertType } from "@/store/webSocketTypes.types";
import { rowColorByType } from "@/utils/terminalUtils";

const AlertsLegend = () => {
	const { alertsCheap, alertsSolid, alertsBig } = useWebSocketStore((state) => state);
	const alertTypes: AlertType[] = [AlertType.BIG, AlertType.SOLID, AlertType.CHEAP];

	const findAlertsLength = (type: AlertType) => {
		switch (type) {
			case AlertType.CHEAP:
				return alertsCheap.length;
			case AlertType.SOLID:
				return alertsSolid.length;
			case AlertType.BIG:
				return alertsBig.length;
			default:
				return 0;
		}
	};
	return (
		<div className="flex items-center space-x-8">
			{alertTypes.map((type) => (
				<div key={type} className="flex items-center space-x-1">
					<span className="text-2xl font-bold">{findAlertsLength(type)}</span>
					<div className={`w-10 h-2 ${rowColorByType(type)}`}></div>
				</div>
			))}
		</div>
	);
};

export default AlertsLegend;
