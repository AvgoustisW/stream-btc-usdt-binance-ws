import { useWebSocketStore } from "@/store/webSocketStore.ts";

const StreamController = () => {
	const { connect, disconnect, isConnected } = useWebSocketStore();

	const handleConnectToStream = () => {
		connect();
	};

	const handleDisconnectFromStream = () => {
		disconnect();
	};

	return (
		<div className=" flex gap-4 ">
			<button
				className={` px-4 py-2 rounded bg-blue-500 text-white font-bold ${
					isConnected ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-600"
				}`}
				onClick={handleConnectToStream}
				disabled={isConnected}
			>
				Start
			</button>
			<button
				className={` cursor-pointer  px-4 py-2 rounded bg-red-500 text-white font-bold ${
					!isConnected ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-red-600"
				}`}
				onClick={handleDisconnectFromStream}
				disabled={!isConnected}
			>
				Stop
			</button>
		</div>
	);
};

export default StreamController;
