import { create } from "zustand";
import { CryptoCompareMessage, MessageType, MessageTypeLabels } from "./webSocketTypes.types";

interface WebSocketStore {
	isConnected: boolean;
	isLoading: boolean;
	lastMessage: string | null;
	messages: CryptoCompareMessage[];
	sendMessage: (message: string) => void;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}

const MAX_MESSAGES = 500;

export const useWebSocketStore = create<WebSocketStore>((set, get) => {
	let socket: WebSocket | null = null;
	const apiKey = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
	const RECONNECT_DELAY = 2000;

	return {
		isConnected: false,
		isLoading: false,
		lastMessage: null,
		messages: [],

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
				const subscription = {
					action: "SubAdd",
					subs: ["8~Binance~BTC~USDT"],
				};
				socket!.send(JSON.stringify(subscription));
			};

			socket.onmessage = (event) => {
				const message: CryptoCompareMessage = JSON.parse(event.data);
				if (message.TYPE === MessageType.ServerError) {
					console.error(MessageTypeLabels[MessageType.ServerError], message.M);

					get().reconnect();
					return;
				}
				if (message.TYPE !== MessageType.OrderBookUpdate) return;

				set((state) => {
					let newMessages: CryptoCompareMessage[];
					// If there’s room, add new message at the beginning.
					// Otherwise, remove the last element and then add the new message at the beginning.
					if (state.messages.length < MAX_MESSAGES) {
						newMessages = [message, ...state.messages];
					} else {
						newMessages = [message, ...state.messages.slice(0, MAX_MESSAGES - 1)];
					}
					return {
						lastMessage: event.data,
						messages: newMessages,
					};
				});
			};

			socket.onclose = () => {
				set({ isConnected: false, isLoading: false });
				console.log("WebSocket disconnected");
			};

			socket.onerror = (error) => {
				set({ messages: [], isConnected: false, isLoading: false });
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

		reconnect: () => {
			get().disconnect();
			console.log("Reconnecting WebSocket...");
			set({ isLoading: true });
			setTimeout(() => {
				get().connect();
			}, RECONNECT_DELAY);
		},
	};
});
