import React, { useMemo } from "react";
import { VirtualizedTable, VirtualizedTableColumn } from "@/components/core/VirtualizedTable";
import { AlertTypeLabels, CryptoCompareAlert, CryptoCompareAlertFieldLabels } from "@/store/webSocketTypes.types";
import { rowColorByType } from "@/utils/terminalUtils";

interface AlertsTerminalProps {
	alerts: CryptoCompareAlert[];
}

const ROW_HEIGHT = 50;

const AlertsTerminal: React.FC<AlertsTerminalProps> = ({ alerts }) => {
	const columns: VirtualizedTableColumn<CryptoCompareAlert>[] = useMemo(
		() => [
			{
				label: CryptoCompareAlertFieldLabels.TYPE,
				accessor: (row) => row && AlertTypeLabels[row.TYPE],
				rowStyle: (row) => row && rowColorByType(row.TYPE),
			},
			{
				label: `${CryptoCompareAlertFieldLabels.TOTAL} $(USD)`,
				accessor: (row) => row.TOTAL.toLocaleString("en-US"),
				rowStyle: (row) => row && `${rowColorByType(row.TYPE)} text-2xl font-bold`,
			},
			{
				label: `${CryptoCompareAlertFieldLabels.PRICE} $(USD)`,
				accessor: (row) => row && row.PRICE.toLocaleString("en-US"),
				rowStyle: (row) => row && rowColorByType(row.TYPE),
			},
			{
				label: CryptoCompareAlertFieldLabels.QUANTITY,
				accessor: (row) => row && row.QUANTITY,
				rowStyle: (row) => row && rowColorByType(row.TYPE),
			},
		],
		[]
	);

	return <VirtualizedTable data={alerts} rowHeight={ROW_HEIGHT} columns={columns} rowKey="terminal-item" />;
};

export default AlertsTerminal;
