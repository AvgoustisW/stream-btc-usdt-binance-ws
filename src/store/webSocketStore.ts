import { create } from "zustand";

interface WebSocketStore {
	isConnected: boolean;
	isLoading: boolean;
	lastMessage: string | null;
	sendMessage: (message: string) => void;
	connect: () => void;
	disconnect: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => {
	let socket: WebSocket | null = null;
	const apiKey = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;

	return {
		isConnected: false,
		isLoading: false,
		lastMessage: null,

		sendMessage: (message: string) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(message);
			}
		},

		connect: () => {
			if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
				console.log("WebSocket already connected or connecting");
				return;
			}

			set({ isLoading: true });
			socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`);

			socket.onopen = () => {
				set({ isConnected: true, isLoading: false });
				console.log("WebSocket connected");
				const subscriptionMessage = {
					action: "SubAdd",
					subs: ["8~Binance~BTC~USDT"],
				};
				socket!.send(JSON.stringify(subscriptionMessage));
			};

			socket.onmessage = (event) => {
				set({ lastMessage: event.data });
			};

			socket.onclose = () => {
				set({ isConnected: false, isLoading: false });
				console.log("WebSocket disconnected");
			};

			socket.onerror = (error) => {
				set({ isConnected: false, isLoading: false });
				console.error("WebSocket error:", error);
			};
		},

		disconnect: () => {
			if (socket) {
				socket.close();
				socket = null;
				set({ isConnected: false });
			}
		},
	};
});
