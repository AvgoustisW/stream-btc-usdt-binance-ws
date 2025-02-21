import { AlertType, AlertTypeLabels } from "@/store/webSocketTypes.types";
import { rowColorByType } from "@/utils/terminalUtils";

const MonitorLegend = () => {
	const alertTypes: (AlertType | "none")[] = [AlertType.CHEAP, AlertType.SOLID, AlertType.BIG];

	return (
		<div className="flex items-center space-x-4">
			{alertTypes.map((type) => (
				<div key={type} className="flex items-center space-x-1">
					<div className={`w-10 h-2 ${rowColorByType(type)}`}></div>
					<span className="text-sm">{AlertTypeLabels[type]}</span>
				</div>
			))}
		</div>
	);
};

export default MonitorLegend;
