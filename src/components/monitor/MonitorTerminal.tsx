import React, { useMemo } from "react";
import { VirtualizedTable, VirtualizedTableColumn } from "@/components/core/VirtualizedTable";
import {
	CryptoCompareMessage,
	MessageTypeLabels,
	SideLabels,
	ActionLabels,
	CryptoCompareMessageFieldLabels,
	MarketLabels,
} from "@/store/webSocketTypes.types";
import { MessageItem } from "@/store/webSocketStore";
import { rowColorByType } from "@/utils/terminalUtils";

interface MonitorTerminalProps {
	messages: MessageItem[];
}

const ROW_HEIGHT = 50;

const MonitorTerminal: React.FC<MonitorTerminalProps> = ({ messages }) => {
	const data = messages.map((item) => item.message);

	const columns: VirtualizedTableColumn<CryptoCompareMessage>[] = useMemo(
		() => [
			{
				label: CryptoCompareMessageFieldLabels.TYPE,
				accessor: (row) => row && MessageTypeLabels[row.TYPE],
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: CryptoCompareMessageFieldLabels.M,
				accessor: (row) => row && MarketLabels[row.M],
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: CryptoCompareMessageFieldLabels.FSYM,
				accessor: (row) => row && row.FSYM,
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: CryptoCompareMessageFieldLabels.TSYM,
				accessor: (row) => row && row.TSYM,
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: CryptoCompareMessageFieldLabels.SIDE,
				accessor: (row) => row && SideLabels[row.SIDE],
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: CryptoCompareMessageFieldLabels.ACTION,
				accessor: (row) => row && ActionLabels[row.ACTION],
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: `${CryptoCompareMessageFieldLabels.P} $(USD)`,
				accessor: (row) => row && row.P.toLocaleString("en-US"),
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-green-300 text-2xl font-bold`,
			},
			{
				label: CryptoCompareMessageFieldLabels.Q,
				accessor: (row) => row && row.Q,
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-lg`,
			},
			{
				label: CryptoCompareMessageFieldLabels.REPORTEDNS,
				accessor: (row) => row && new Date(row.REPORTEDNS / 1e6).toLocaleString("en-US"),
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-sm`,
			},
			{
				label: CryptoCompareMessageFieldLabels.DELAYNS,
				accessor: (row) => row && `${(row.DELAYNS / 1e9).toFixed(3)} s`,
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},

			{
				label: CryptoCompareMessageFieldLabels.CCSEQ,
				accessor: (row) => row && row.CCSEQ,
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
			{
				label: CryptoCompareMessageFieldLabels.SEQ,
				accessor: (row) => row && row.SEQ,
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-xs`,
			},
		],
		[]
	);

	return <VirtualizedTable data={data} rowHeight={ROW_HEIGHT} columns={columns} rowKey="terminal-item" />;
};

export default MonitorTerminal;
