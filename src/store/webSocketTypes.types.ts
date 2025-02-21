/**
 * @description Represents a CryptoCompare message containing order book information.
 */
export interface CryptoCompareMessage {
	/**
	 * @description Type of the message.
	 * LoadComplete ("3") for subscription load
	 * OrderBookUpdate ("8") for an order book update,
	 * OrderBookSnapshot ("9") for an order book snapshot.
	 * SubscriptionComplete ("16") for a subscription complete message.
	 * StreamerWelcome ("20") for a welcome message
	 */
	TYPE: MessageType;

	/**
	 * @description The market you have requested (name of the market e.g. Binance).
	 * Currently fixed to Binance via Market.BINANCE.
	 */
	M: Market.BINANCE;

	/**
	 * @description The mapped from asset (base symbol / coin) you have requested (e.g. BTC, ETH).
	 */
	FSYM: string;

	/**
	 * @description The mapped to asset (quote/counter symbol/coin) you have requested (e.g. BTC, USD).
	 */
	TSYM: string;

	/**
	 * @description The side is 0 for BID and 1 for ASK.
	 */
	SIDE: Side;

	/**
	 * @description The action to apply on the snapshot:
	 * 1 for ADD, 2 for REMOVE, 3 for NOACTION, 4 for CHANGE/UPDATE.
	 */
	ACTION: Action;

	/**
	 * @description Our internal order book sequence.
	 * The snapshot you get when you subscribe will have the starting sequence and all other
	 * updates will be increments of 1 on the sequence. This does not reset.
	 */
	CCSEQ: number;

	/**
	 * @description The difference in nanoseconds between the REPORTEDNS and the time we publish the update on our internal network.
	 */
	DELAYNS: number;

	/**
	 * @description The price in the to asset (quote/counter symbol/coin) of the order book position.
	 */
	P: number;

	/**
	 * @description The from asset (base symbol/coin) volume of the position.
	 */
	Q: number;

	/**
	 * @description The external exchange reported timestamp in nanoseconds.
	 * If not provided, we store the time we received the message.
	 */
	REPORTEDNS: number;

	/**
	 * @description The external exchange sequence if they have one.
	 */
	SEQ: number;
}

/**
 * @description Enum for types of CryptoCompare messages.
 */
export enum MessageType {
	LoadComplete = "3",
	OrderBookUpdate = "8",
	OrderBookSnapshot = "9",
	SubscriptionComplete = "16",
	StreamerWelcome = "20",
	ServerError = "500",
}

/**
 * @description Enum representing the market. Currently supports only Binance.
 */
export enum Market {
	BINANCE = "Binance",
}

/**
 * @description Enum specifying the side (BID/ASK) of the order book.
 */
export enum Side {
	BID = 0,
	ASK = 1,
}

/**
 * @description Enum for the type of action on an order book snapshot.
 */
export enum Action {
	ADD = 1,
	REMOVE = 2,
	NOACTION = 3,
	CHANGE = 4,
}

/**
 * @description Human-readable labels for MessageType enum.
 */
export const MessageTypeLabels: Record<MessageType, string> = {
	[MessageType.OrderBookUpdate]: "OBU",
	[MessageType.OrderBookSnapshot]: "OBS",
	[MessageType.SubscriptionComplete]: "Sub ✓",
	[MessageType.LoadComplete]: "Load ✓",
	[MessageType.StreamerWelcome]: "Welcome",
	[MessageType.ServerError]: "Server Error",
};

/**
 * @description Human-readable labels for Market enum.
 */
export const MarketLabels: Record<Market, string> = {
	[Market.BINANCE]: "Binance",
};

/**
 * @description Human-readable labels for Side enum.
 */
export const SideLabels: Record<Side, string> = {
	[Side.BID]: "Bid",
	[Side.ASK]: "Ask",
};

/**
 * @description Human-readable labels for Action enum.
 */
export const ActionLabels: Record<Action, string> = {
	[Action.ADD]: "Add",
	[Action.REMOVE]: "Remove",
	[Action.NOACTION]: "No Action",
	[Action.CHANGE]: "Change/Update",
};

/**
 * @description Human-readable labels for each field of a CryptoCompareMessage.
 */
export const CryptoCompareMessageFieldLabels: Record<keyof CryptoCompareMessage, string> = {
	TYPE: "Message Type",
	M: "Market",
	FSYM: "From Symbol",
	TSYM: "To Symbol",
	SIDE: "Side",
	ACTION: "Action",
	CCSEQ: "Internal Sequence",
	DELAYNS: "Delay (ns)",
	P: "Price",
	Q: "Quantity",
	REPORTEDNS: "Reported Timestamp (ns)",
	SEQ: "Exchange Sequence",
};
