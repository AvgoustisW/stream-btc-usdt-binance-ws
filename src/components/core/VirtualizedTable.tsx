import React from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export interface VirtualizedTableColumn<T> {
	label: string;
	width?: string;
	accessor: (row: T) => React.ReactNode;
	colStyle?: string;
	rowStyle?: (row: T) => React.ReactNode;
}

export interface VirtualizedTableProps<T> {
	data: T[];
	rowHeight: number;
	columns: VirtualizedTableColumn<T>[];
	rowKey: keyof T;
	noDataText?: string;
}

export const VirtualizedTable = <T,>({
	data,
	rowHeight,
	columns,
	noDataText = "Waiting on data...",
	rowKey,
}: VirtualizedTableProps<T>) => {
	// Generate the header using the columns config.
	const header = (
		<div className="flex font-bold px-2 py-1 border-b border-gray-800">
			{columns.map((col) => (
				<div key={`header-${col.label}`} className={col.width ?? "w-full" + " " + col.colStyle}>
					{col.label}
				</div>
			))}
		</div>
	);

	// Render a row based on the columns config.
	const renderRow = (row: T) => (
		<>
			{columns.map((col) => (
				<div
					key={`cell-${col.label}`}
					className={`${col.width ?? "w-full"} flex  items-center px-2 py-1 ${col.rowStyle ? col.rowStyle(row) : ""}`}
				>
					{col.accessor(row)}
				</div>
			))}
		</>
	);

	if (data.length === 0) {
		return (
			<div className="p-4 h-full">
				<p>{noDataText}</p>
			</div>
		);
	}

	return (
		<div className="p-4 h-full">
			{/* Header */}

			{header}
			{/* Virtualized rows */}
			<AutoSizer>
				{({ height, width }) => (
					<List height={height} itemCount={data.length} itemSize={rowHeight} width={width} itemData={data}>
						{({ index, style, data }: ListChildComponentProps<T[]>) => (
							<div key={`vt-row-${data[index][rowKey]}`} style={style} className="flex border-t border-gray-800">
								{renderRow(data[index])}
							</div>
						)}
					</List>
				)}
			</AutoSizer>
		</div>
	);
};
