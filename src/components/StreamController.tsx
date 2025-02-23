import { useWebSocketStore } from "@/store/webSocketStore";
import IconButton from "./core/IconButton";
import { FaStop, FaPlay } from "react-icons/fa";
import RadioButtonPanel from "./core/RadioButtonPanel";

const StreamController = () => {
	const { connect, disconnect, isConnected, isLoading, autoReconnect, setAutoReconnect } = useWebSocketStore();

	const handleConnectToStream = () => connect();
	const handleDisconnectFromStream = () => disconnect();
	const handleToggleStream = () => (isConnected ? handleDisconnectFromStream() : handleConnectToStream());

	const isStartDisabled = isConnected || isLoading;
	const isStopDisabled = !isConnected || isLoading;
	const buttonDisabled = isConnected ? isStopDisabled : isStartDisabled;

	return (
		<div className="flex gap-4">
			<IconButton
				text={isConnected ? "Stop" : "Start"}
				onClick={handleToggleStream}
				disabled={buttonDisabled}
				className={`min-w-[90px] ${!buttonDisabled ? (isConnected ? "hover:bg-red-400" : "hover:bg-green-400") : ""}`}
				isLoading={isLoading}
				icon={isConnected ? <FaStop /> : <FaPlay />}
			/>
			<div className="flex items-center gap-2 border px-2 rounded border-slate-600">
				<span className="text-sm font-medium">Auto-Reconnect:</span>
				<RadioButtonPanel checked={autoReconnect} setChecked={setAutoReconnect} />
			</div>
		</div>
	);
};

export default StreamController;
