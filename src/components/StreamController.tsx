import { useWebSocketStore } from "@/store/webSocketStore";
import IconButton from "./core/IconButton";
import { FaStop, FaPlay } from "react-icons/fa";
import RadioButtonPanel from "./core/RadioButtonPanel";

const StreamController = () => {
	const { connect, disconnect, isConnected, isLoading, autoReconnect, setAutoReconnect } = useWebSocketStore();

	const handleConnectToStream = () => {
		connect();
	};

	const handleDisconnectFromStream = () => {
		disconnect();
	};

	const isStartDisabled = isConnected && !isLoading;
	const isStopDisabled = !isConnected && !isLoading;

	return (
		<div className="flex gap-4">
			<IconButton
				text="Start"
				onClick={handleConnectToStream}
				disabled={isStartDisabled}
				className={` ${isStartDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-400"}`}
				isLoading={isLoading}
				icon={<FaPlay />}
			/>
			<IconButton
				text="Stop"
				onClick={handleDisconnectFromStream}
				disabled={isStopDisabled}
				className={` ${isStopDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-red-400"}`}
				icon={<FaStop />}
			/>
			<div className="flex items-center gap-2 border px-2 rounded border-slate-600">
				<span className="text-sm font-medium">Auto-Reconnect:</span>
				<RadioButtonPanel checked={autoReconnect} setChecked={setAutoReconnect} />
			</div>
		</div>
	);
};

export default StreamController;
