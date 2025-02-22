interface RadioButtonPanelProps {
	checked: boolean;
	setChecked: (value: boolean) => void;
}

const RadioButtonPanel = ({ checked, setChecked }: RadioButtonPanelProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.value === "true");
	};

	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-2">
				<input
					type="radio"
					name="autoReconnect"
					id="autoReconnectOff"
					value="false"
					checked={checked === false}
					onChange={handleChange}
					className="w-4 h-4 accent-red-500 cursor-pointer"
				/>
				<label htmlFor="autoReconnectOff" className="cursor-pointer">
					Off
				</label>
			</div>
			<div className="flex items-center gap-2">
				<input
					type="radio"
					name="autoReconnect"
					id="autoReconnectOn"
					value="true"
					checked={checked === true}
					onChange={handleChange}
					className="w-4 h-4 accent-green-500 cursor-pointer"
				/>
				<label htmlFor="autoReconnectOn" className="cursor-pointer">
					On
				</label>
			</div>
		</div>
	);
};

export default RadioButtonPanel;
