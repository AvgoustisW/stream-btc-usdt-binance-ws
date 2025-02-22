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

const apiKey = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
const MAX_MESSAGES = 500;
const ALERT_WINDOW_MS = 60000;
const BINANCE_SUBSCRIPTION = "8~Binance~BTC~USDT";
const RECONNECT_DELAY = 2000;

export const useWebSocketStore = create<WebSocketStore>((set, get) => {
	let socket: WebSocket | null = null;

	// Helper: Update the messages and alert arrays when receiving an OrderBookUpdate.
	const processUpdate = (message: CryptoCompareMessage, raw: string) => {
		set((state) => {
			const now = Date.now();
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

			// Insert new message (newest first)
			const newMessages =
				state.messages.length < MAX_MESSAGES
					? [newItem, ...state.messages]
					: [newItem, ...state.messages.slice(0, MAX_MESSAGES - 1)];

			// Update alerts – filter out stale alerts first.
			const filteredCheap = state.alertsCheap.filter((a) => now - a.TIMESTAMP < ALERT_WINDOW_MS);
			const filteredSolid = state.alertsSolid.filter((a) => now - a.TIMESTAMP < ALERT_WINDOW_MS);
			const filteredBig = state.alertsBig.filter((a) => now - a.TIMESTAMP < ALERT_WINDOW_MS);

			const alertData: CryptoCompareAlert = {
				TYPE: alertType,
				PRICE: price,
				QUANTITY: quantity,
				TOTAL: total,
				TIMESTAMP: now,
			};

			let newAlertsCheap = filteredCheap;
			let newAlertsSolid = filteredSolid;
			let newAlertsBig = filteredBig;

			if (alertType === AlertType.CHEAP) {
				newAlertsCheap = [alertData, ...filteredCheap].slice(0, MAX_MESSAGES);
			} else if (alertType === AlertType.SOLID) {
				newAlertsSolid = [alertData, ...filteredSolid].slice(0, MAX_MESSAGES);
			} else if (alertType === AlertType.BIG) {
				newAlertsBig = [alertData, ...filteredBig].slice(0, MAX_MESSAGES);
			}

			return {
				lastMessage: raw,
				messages: newMessages,
				alertsCheap: newAlertsCheap,
				alertsSolid: newAlertsSolid,
				alertsBig: newAlertsBig,
			};
		});
	};

	return {
		isConnected: false,
		isLoading: false,
		lastMessage: null,
		messages: [],
		lastCCSEQ: null,
		alertsCheap: [],
		alertsSolid: [],
		alertsBig: [],

		sendMessage: (msg: string) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(msg);
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
				// Handle ServerError immediately.
				if (message.TYPE === MessageType.ServerError) {
					console.error(MessageTypeLabels[MessageType.ServerError], message.M);
					get().reconnect();
					return;
				}
				// Only process OrderBookUpdate and OrderBookSnapshot.
				if (message.TYPE !== MessageType.OrderBookUpdate && message.TYPE !== MessageType.OrderBookSnapshot) {
					return;
				}
				// For snapshots, set the initial CCSEQ.
				if (message.TYPE === MessageType.OrderBookSnapshot) {
					set((state) => ({ ...state, lastCCSEQ: message.CCSEQ }));
				} else {
					// For updates, validate CCSEQ.
					const { lastCCSEQ } = get();
					if (lastCCSEQ !== null && message.CCSEQ !== lastCCSEQ + 1) {
						console.error(`Out of sync: expected CCSEQ ${lastCCSEQ + 1}, but got ${message.CCSEQ}. Reconnecting...`);
						get().reconnect();
						return;
					}
					// Update lastCCSEQ.
					set(() => ({ lastCCSEQ: message.CCSEQ }));
					// Process the update.
					processUpdate(message, event.data);
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
