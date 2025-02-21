import React, { useMemo } from "react";
import { VirtualizedTable, VirtualizedTableColumn } from "@/components/core/VirtualizedTable";
import {
	CryptoCompareMessage,
	MessageTypeLabels,
	SideLabels,
	ActionLabels,
	CryptoCompareMessageFieldLabels,
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
				label: CryptoCompareMessageFieldLabels.FSYM,
				accessor: (row) => row && row.FSYM,
				rowStyle: (row) => row && rowColorByType(row.ALERT_TYPE),
			},
			{
				label: CryptoCompareMessageFieldLabels.TSYM,
				accessor: (row) => row && row.TSYM,
				rowStyle: (row) => row && rowColorByType(row.ALERT_TYPE),
			},
			{
				label: `${CryptoCompareMessageFieldLabels.P} $(USD)`,
				accessor: (row) => row && row.P.toLocaleString("en-US"),
				rowStyle: (row) => row && `${rowColorByType(row.ALERT_TYPE)} text-2xl font-bold`,
			},
			{
				label: CryptoCompareMessageFieldLabels.Q,
				accessor: (row) => row && row.Q,
				rowStyle: (row) => row && rowColorByType(row.ALERT_TYPE),
			},
			{
				label: CryptoCompareMessageFieldLabels.SIDE,
				accessor: (row) => row && SideLabels[row.SIDE],
				rowStyle: (row) => row && rowColorByType(row.ALERT_TYPE),
			},
			{
				label: CryptoCompareMessageFieldLabels.ACTION,
				accessor: (row) => row && ActionLabels[row.ACTION],
				rowStyle: (row) => row && rowColorByType(row.ALERT_TYPE),
			},

			{
				label: CryptoCompareMessageFieldLabels.TYPE,
				accessor: (row) => row && MessageTypeLabels[row.TYPE],
				rowStyle: (row) => row && rowColorByType(row.ALERT_TYPE),
			},
		],
		[]
	);

	return <VirtualizedTable data={data} rowHeight={ROW_HEIGHT} columns={columns} rowKey="terminal-item" />;
};

export default MonitorTerminal;
