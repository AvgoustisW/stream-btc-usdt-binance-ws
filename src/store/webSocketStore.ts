import { create } from "zustand";
import {
	AlertType,
	CryptoCompareAlert,
	CryptoCompareMessage,
	MessageType,
	MessageTypeLabels,
} from "./webSocketTypes.types";

export interface MessageItem {
	message: CryptoCompareMessage;
	alertType: AlertType | "none";
}
interface WebSocketStore {
	isConnected: boolean;
	isLoading: boolean;
	lastMessage: string | null;
	messages: MessageItem[];
	alerts: CryptoCompareAlert[];
	sendMessage: (message: string) => void;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}

const MAX_MESSAGES = 500;
const ALERT_WINDOW_MS = 60000; // 1 minute alerts window

export const useWebSocketStore = create<WebSocketStore>((set, get) => {
	let socket: WebSocket | null = null;
	const apiKey = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
	const RECONNECT_DELAY = 2000;

	return {
		isConnected: false,
		isLoading: false,
		lastMessage: null,
		messages: [],
		alerts: [],

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
				// Check for server error and trigger reconnect if necessary.
				if (message.TYPE === MessageType.ServerError) {
					console.error(MessageTypeLabels[MessageType.ServerError], message.M);
					get().reconnect();
					return;
				}
				if (message.TYPE !== MessageType.OrderBookUpdate) return;
				set((state) => {
					let newMessages: MessageItem[];

					const price = message.P;
					const quantity = message.Q;
					const total = price * quantity;
					let alertType: AlertType = AlertType.NONE;

					if (total > 1000000) {
						alertType = AlertType.BIG;
					} else if (quantity > 10 && total < 1000000) {
						alertType = AlertType.SOLID;
					} else if (price < 50000) {
						alertType = AlertType.CHEAP;
					}

					message.ALERT_TYPE = alertType;
					const newItem: MessageItem = { message, alertType };

					/** Messages **/
					// Insert new message item at the beginning (latest first)
					if (state.messages.length < MAX_MESSAGES) {
						newMessages = [newItem, ...state.messages];
					} else {
						newMessages = [newItem, ...state.messages.slice(0, MAX_MESSAGES - 1)];
					}
					/** Messages **/

					/** Alerts **/
					const now = Date.now();
					// Filter out alerts older than 1 minute
					const filteredAlerts = state.alerts.filter((alert) => now - alert.TIMESTAMP < ALERT_WINDOW_MS);

					// Collect alerts if they have a type
					const triggeredAlerts: CryptoCompareAlert[] = [];
					if (alertType !== AlertType.NONE) {
						triggeredAlerts.push({
							TYPE: alertType,
							PRICE: price,
							QUANTITY: quantity,
							TOTAL: total,
							TIMESTAMP: now,
						});
					}

					// Place newly triggered alerts at the beginning, then append the filtered (older) alerts
					let newAlerts = [...triggeredAlerts, ...filteredAlerts];
					// Cap alerts to MAX_MESSAGES entries if necessary
					if (newAlerts.length > MAX_MESSAGES) {
						newAlerts = newAlerts.slice(0, MAX_MESSAGES);
					}

					return {
						lastMessage: event.data,
						messages: newMessages,
						alerts: newAlerts,
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
