import React, { useMemo } from "react";
import { VirtualizedTable, VirtualizedTableColumn } from "@/components/core/VirtualizedTable";
import {
	CryptoCompareMessage,
	MessageTypeLabels,
	SideLabels,
	ActionLabels,
	CryptoCompareMessageFieldLabels,
} from "@/store/webSocketTypes.types";

interface MonitorTerminalProps {
	messages: CryptoCompareMessage[];
}

const ROW_HEIGHT = 35;

const MonitorTerminal: React.FC<MonitorTerminalProps> = ({ messages }) => {
	const columns: VirtualizedTableColumn<CryptoCompareMessage>[] = useMemo(
		() => [
			{
				label: CryptoCompareMessageFieldLabels.FSYM,
				accessor: (row) => row && row.FSYM,
			},
			{
				label: CryptoCompareMessageFieldLabels.TSYM,
				accessor: (row) => row && row.TSYM,
			},
			{
				label: CryptoCompareMessageFieldLabels.P,
				accessor: (row) => row && row.P,
				rowStyle: "text-green-500 text-xl font-bold",
				colStyle: "text-green-500",
			},
			{
				label: CryptoCompareMessageFieldLabels.SIDE,
				accessor: (row) => row && SideLabels[row.SIDE],
			},
			{
				label: CryptoCompareMessageFieldLabels.ACTION,
				accessor: (row) => row && ActionLabels[row.ACTION],
			},

			{
				label: CryptoCompareMessageFieldLabels.TYPE,
				accessor: (row) => row && MessageTypeLabels[row.TYPE],
			},
		],
		[]
	);

	return <VirtualizedTable data={messages} rowHeight={ROW_HEIGHT} columns={columns} rowKey="terminal-item" />;
};

export default MonitorTerminal;
