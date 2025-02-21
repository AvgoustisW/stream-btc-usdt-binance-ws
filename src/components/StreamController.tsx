import { useWebSocketStore } from "@/store/webSocketStore";
import IconButton from "./core/IconButton";
import { FaStop, FaPlay } from "react-icons/fa";

const StreamController = () => {
	const { connect, disconnect, isConnected, isLoading } = useWebSocketStore();

	const handleConnectToStream = () => {
		connect();
	};

	const handleDisconnectFromStream = () => {
		disconnect();
	};

	const isStartDisabled = isConnected && !isLoading;
	const isStopDisabled = !isConnected && !isLoading;

	return (
		<div className="flex  gap-4">
			<IconButton
				text="Start"
				onClick={handleConnectToStream}
				disabled={isStartDisabled}
				className={`bg-green-600 ${
					isStartDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-400"
				}`}
				isLoading={isLoading}
				icon={<FaPlay />}
			/>
			<IconButton
				text="Stop"
				onClick={handleDisconnectFromStream}
				disabled={isStopDisabled}
				className={`bg-red-600 ${isStopDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-red-400"}`}
				icon={<FaStop />}
			/>
		</div>
	);
};

export default StreamController;
