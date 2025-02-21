import React from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export interface VirtualizedTableColumn<T> {
	label: string;
	accessor: (row: T) => React.ReactNode;
	width?: string;
	colStyle?: string;
	rowStyle?: string;
}

export interface VirtualizedTableProps<T> {
	data: T[];
	rowHeight: number;
	columns: VirtualizedTableColumn<T>[];
	/**
	 * Optional function to generate a unique key for each row.
	 */
	rowKey?: string;
}

export const VirtualizedTable = <T,>({
	data,
	rowHeight,
	columns,
	rowKey = "vt-table-row",
}: VirtualizedTableProps<T>) => {
	// Generate the header using the columns config.
	const header = (
		<div className="flex font-bold px-2 py-1 border-b border-gray-300">
			{columns.map((col) => (
				<div key={`header-${col.label}`} className={col.width ?? "w-1/6" + " " + col.colStyle}>
					{col.label}
				</div>
			))}
		</div>
	);

	// Render a row based on the columns config.
	const renderRow = (row: T) => (
		<>
			{columns.map((col) => (
				<div key={`cell-${col.label}`} className={`${col.width ?? "w-1/6"} px-2 py-1 ${col.rowStyle}`}>
					{col.accessor(row)}
				</div>
			))}
		</>
	);

	return (
		<div className="p-4 h-full">
			{/* Header */}
			{header}
			{/* Virtualized rows */}
			<AutoSizer>
				{({ height, width }) => (
					<List height={height} itemCount={data.length} itemSize={rowHeight} width={width} itemData={data}>
						{({ index, style, data }: ListChildComponentProps<T[]>) => (
							<div key={`${rowKey}-${data[index]}`} style={style} className="flex border-t border-gray-200">
								{renderRow(data[index])}
							</div>
						)}
					</List>
				)}
			</AutoSizer>
		</div>
	);
};
