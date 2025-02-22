import React, { useMemo } from "react";
import { VirtualizedTable, VirtualizedTableColumn } from "@/components/core/VirtualizedTable";
import { AlertTypeLabels, CryptoCompareAlert, CryptoCompareAlertFieldLabels } from "@/store/webSocketTypes.types";
import { rowColorByType } from "@/utils/terminalUtils";
import { useWebSocketStore } from "@/store/webSocketStore";

const ROW_HEIGHT = 50;

const AlertsTerminal: React.FC = () => {
	const { alertsCheap, alertsSolid, alertsBig } = useWebSocketStore((state) => state);

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
				rowStyle: (row) => row && `text-green-300 ${rowColorByType(row.TYPE)} text-2xl  font-bold`,
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

	return (
		<div className="flex flex-col h-full gap-5">
			<div className="h-1/3">
				<VirtualizedTable
					data={alertsBig}
					rowHeight={ROW_HEIGHT}
					columns={columns}
					rowKey="terminal-item"
					noDataText="No big order alerts"
				/>
			</div>
			<div className="h-1/3 border-t border-green-500">
				<VirtualizedTable
					data={alertsSolid}
					rowHeight={ROW_HEIGHT}
					columns={columns}
					rowKey="terminal-item"
					noDataText="No solid order alerts"
				/>
			</div>
			<div className="h-1/3 border-t border-green-500">
				<VirtualizedTable
					data={alertsCheap}
					rowHeight={ROW_HEIGHT}
					columns={columns}
					rowKey="terminal-item"
					noDataText="No cheap order alerts"
				/>
			</div>
		</div>
	);
};

export default AlertsTerminal;
