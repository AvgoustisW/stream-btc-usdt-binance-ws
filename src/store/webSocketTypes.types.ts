export interface MessageItem {
	message: CryptoCompareMessage;
	alertType: AlertType | "none";
}

/**
 * @description Represents a CryptoCompare message.
 */
export interface CryptoCompareMessage {
	/** @description Message type. */
	TYPE: MessageType;
	/** @description Market used (always Binance). */
	M: Market.BINANCE;
	/** @description Base asset symbol. */
	FSYM: string;
	/** @description Quote asset symbol. */
	TSYM: string;
	/** @description Order book side (BID/ASK). */
	SIDE: Side;
	/** @description Snapshot action (e.g. Add, Remove). */
	ACTION: Action;
	/** @description Internal order book sequence; increments with each update. */
	CCSEQ: number;
	/** @description Delay (ns) between message receipt and publish. */
	DELAYNS: number;
	/** @description Price at the update. */
	P: number;
	/** @description Volume of the base asset. */
	Q: number;
	/** @description Exchange-reported timestamp in nanoseconds (or receipt time if missing). */
	REPORTEDNS: number;
	/** @description Exchange sequence if provided. */
	SEQ: number;
	/** @description Alert status. This is created by us, it is not present in the CryptoCompare response*/
	ALERT_TYPE: AlertType | "none";
}

/**
 * @description Enum for various CryptoCompare message types.
 * @remarks Detailed information:
 * - "3": LoadComplete – subscription load is complete.
 * - "8": OrderBookUpdate – a single update to the order book.
 * - "9": OrderBookSnapshot – full snapshot of the order book.
 * - "16": SubscriptionComplete – first payload sent.
 * - "20": StreamerWelcome – welcome message with rate limits and server stats.
 * - "500": ServerError – general error, with further details in MESSAGE field.
 * - "999": Heartbeat – periodic message every minute.
 * - "17": UnsubscribeComplete – removal of a single subscription.
 * - "18": UnsubscribeAllComplete – all subscriptions removed.
 * - "401": Unauthorized – API key issues.
 * - "429": RateLimited – too many connections/subscriptions (inspect MESSAGE for specifics).
 */
export enum MessageType {
	LoadComplete = "3",
	OrderBookUpdate = "8",
	OrderBookSnapshot = "9",
	SubscriptionComplete = "16",
	StreamerWelcome = "20",
	ServerError = "500",
	Heartbeat = "999",
	UnsubscribeComplete = "17",
	UnsubscribeAllComplete = "18",
	Unauthorized = "401",
	RateLimited = "429",
}

/**
 * @description Enum for supported markets.
 */
export enum Market {
	BINANCE = "Binance",
}

/**
 * @description Enum for order book side.
 */
export enum Side {
	BID = 0,
	ASK = 1,
}

/**
 * @description Enum for snapshot actions.
 */
export enum Action {
	ADD = 1,
	REMOVE = 2,
	NOACTION = 3,
	CHANGE = 4,
}

/**
 * @description Human-readable labels for MessageType.
 */
export const MessageTypeLabels: Record<MessageType, string> = {
	[MessageType.LoadComplete]: "Load ✓",
	[MessageType.OrderBookUpdate]: "Order Book Update",
	[MessageType.OrderBookSnapshot]: "Order Book Snapshot",
	[MessageType.SubscriptionComplete]: "Subscription ✓",
	[MessageType.StreamerWelcome]: "Welcome",
	[MessageType.ServerError]: "Server Error",
	[MessageType.Heartbeat]: "Heartbeat",
	[MessageType.UnsubscribeComplete]: "Unsubscribe Complete",
	[MessageType.UnsubscribeAllComplete]: "Unsubscribe All Complete",
	[MessageType.Unauthorized]: "Unauthorized",
	[MessageType.RateLimited]: "Rate Limited",
};

/**
 * @description Human-readable labels for Market.
 */
export const MarketLabels: Record<Market, string> = {
	[Market.BINANCE]: "Binance",
};

/**
 * @description Human-readable labels for Side.
 */
export const SideLabels: Record<Side, string> = {
	[Side.BID]: "Bid",
	[Side.ASK]: "Ask",
};

/**
 * @description Human-readable labels for Action.
 */
export const ActionLabels: Record<Action, string> = {
	[Action.ADD]: "Add",
	[Action.REMOVE]: "Remove",
	[Action.NOACTION]: "No Action",
	[Action.CHANGE]: "Change/Update",
};

/**
 * @description Field labels for CryptoCompareMessage.
 */
export const CryptoCompareMessageFieldLabels: Record<keyof CryptoCompareMessage, string> = {
	TYPE: "Type",
	M: "Market",
	FSYM: "From",
	TSYM: "To",
	SIDE: "Side",
	ACTION: "Action",
	CCSEQ: "Int. Sequence",
	DELAYNS: "Delay (s)",
	P: "Price",
	Q: "Quantity",
	REPORTEDNS: "Timestamp",
	SEQ: "Exch. Sequence",
	ALERT_TYPE: "Alert Type",
};

/**
 * @description Represents an alert extracted from message data.
 */
export interface CryptoCompareAlert {
	/** @description Alert type. */
	TYPE: AlertType;
	/** @description Price triggering the alert. */
	PRICE: number;
	/** @description Quantity for the alert. */
	QUANTITY: number;
	/** @description Total computed from price and quantity. */
	TOTAL: number;
	/** @description Time the alert was generated (ms). */
	TIMESTAMP: number;
}

/**
 * @description Enum for alert types.
 */
export enum AlertType {
	CHEAP = "cheap",
	SOLID = "solid",
	BIG = "big",
	NONE = "none",
}

/**
 * @description Human-readable labels for AlertType.
 */
export const AlertTypeLabels: Record<AlertType, string> = {
	[AlertType.CHEAP]: "Cheap order",
	[AlertType.SOLID]: "Solid order",
	[AlertType.BIG]: "Big business here",
	[AlertType.NONE]: "No alert",
};

/**
 * @description Field labels for CryptoCompareAlert.
 */
export const CryptoCompareAlertFieldLabels: Record<keyof CryptoCompareAlert, string> = {
	TYPE: "Type",
	PRICE: "Price",
	QUANTITY: "Quantity",
	TOTAL: "Total",
	TIMESTAMP: "Timestamp",
};
