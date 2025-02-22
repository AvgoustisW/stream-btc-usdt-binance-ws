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
	lastCCSEQ: number | null;
	messages: MessageItem[];
	alertsCheap: CryptoCompareAlert[];
	alertsSolid: CryptoCompareAlert[];
	alertsBig: CryptoCompareAlert[];
	sendMessage: (message: string) => void;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}

const MAX_MESSAGES = 500;
const ALERT_WINDOW_MS = 60000;
const BINANCE_SUBSCRIPTION = "8~Binance~BTC~USDT";
export const useWebSocketStore = create<WebSocketStore>((set, get) => {
	let socket: WebSocket | null = null;
	const apiKey = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
	const RECONNECT_DELAY = 2000;

	return {
		isConnected: false,
		isLoading: false,
		lastMessage: null,
		messages: [],
		lastCCSEQ: null,
		alertsCheap: [],
		alertsSolid: [],
		alertsBig: [],

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
					subs: [BINANCE_SUBSCRIPTION],
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
				if (message.TYPE !== MessageType.OrderBookUpdate && message.TYPE !== MessageType.OrderBookSnapshot) {
					return;
				} else if (message.TYPE === MessageType.OrderBookSnapshot) {
					//Snapshot setting first CCSEQ
					set((state) => {
						state.lastCCSEQ = message.CCSEQ;
						return state;
					});
				} else {
					// OrderBookUpdate Type 8 (Messages to process for terminal)
					// If there is a previous message, ensure its CCSEQ is exactly one less, if it's not we are out of sync and need to reconnect.
					const { lastCCSEQ } = get();
					if (lastCCSEQ !== null && message.CCSEQ !== lastCCSEQ + 1) {
						console.error(`Out of sync: expected CCSEQ ${lastCCSEQ + 1}, but got ${message.CCSEQ}. Reconnecting...`);
						console.log(lastCCSEQ, message.CCSEQ);
						get().reconnect();
						return;
					}
					// Setting CCEQ for next sync check.
					set(() => {
						return { lastCCSEQ: message.CCSEQ };
					});

					// Process the message normally
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

						// Messages: Insert new message at the beginning (latest first)
						if (state.messages.length < MAX_MESSAGES) {
							newMessages = [newItem, ...state.messages];
						} else {
							newMessages = [newItem, ...state.messages.slice(0, MAX_MESSAGES - 1)];
						}

						// Process alerts into three separate arrays based on type.
						const now = Date.now();
						// Remove outdated alerts from each array.
						const filteredCheap = state.alertsCheap.filter((alert) => now - alert.TIMESTAMP < ALERT_WINDOW_MS);
						const filteredSolid = state.alertsSolid.filter((alert) => now - alert.TIMESTAMP < ALERT_WINDOW_MS);
						const filteredBig = state.alertsBig.filter((alert) => now - alert.TIMESTAMP < ALERT_WINDOW_MS);

						// Depending on the alert type, prepend the new alert accordingly.
						let newAlertsCheap = filteredCheap;
						let newAlertsSolid = filteredSolid;
						let newAlertsBig = filteredBig;

						const alertData = {
							TYPE: alertType,
							PRICE: price,
							QUANTITY: quantity,
							TOTAL: total,
							TIMESTAMP: now,
						};
						if (alertType === AlertType.CHEAP) {
							newAlertsCheap = [alertData, ...filteredCheap].slice(0, MAX_MESSAGES);
						} else if (alertType === AlertType.SOLID) {
							newAlertsSolid = [alertData, ...filteredSolid].slice(0, MAX_MESSAGES);
						} else if (alertType === AlertType.BIG) {
							newAlertsBig = [alertData, ...filteredBig].slice(0, MAX_MESSAGES);
						}

						return {
							lastMessage: event.data,
							messages: newMessages,
							alertsCheap: newAlertsCheap,
							alertsSolid: newAlertsSolid,
							alertsBig: newAlertsBig,
						};
					});
				}
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
