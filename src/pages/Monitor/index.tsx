import MonitorTerminal from "@/components/monitor/MonitorTerminal";
import { useWebSocketStore } from "@/store/webSocketStore";

const Monitor = () => {
	const messages = useWebSocketStore((state) => state.messages);

	return <MonitorTerminal messages={messages} />;
};

export default Monitor;
