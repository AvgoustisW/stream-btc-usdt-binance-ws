import { useWebSocketStore } from "@/store/webSocketStore";

const StreamController = () => {
	const { connect, disconnect } = useWebSocketStore();

	const handleDisconnectFromStream = () => {
		disconnect();
	};

	const handleConnectToStream = () => {
		connect();
	};

	return (
		<div className="p-4 flex ">
			<div className=" bg-blue-500  cursor-pointer mr-6" onClick={handleConnectToStream}>
				Start
			</div>
			<div className=" bg-red-500 cursor-pointer" onClick={handleDisconnectFromStream}>
				Stop
			</div>
		</div>
	);
};

export default StreamController;
