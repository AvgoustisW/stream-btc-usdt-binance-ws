import MonitorTerminal from "@/components/monitor/MonitorTerminal";
import { useWebSocketStore } from "@/store/webSocketStore.ts";

const Monitor = () => {
	const messages = useWebSocketStore((state) => state.messages);

	return (
		<div className="h-[90dvh]">
			<MonitorTerminal messages={messages} />
		</div>
	);
};

export default Monitor;
