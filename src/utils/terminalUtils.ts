import { AlertType } from "@/store/webSocketTypes.types";

export const rowColorByType = (type: AlertType | "none") => {
	switch (type) {
		case AlertType.CHEAP:
			return "bg-slate-700";
		case AlertType.SOLID:
			return "bg-blue-700";
		case AlertType.BIG:
			return "bg-red-800";
		default:
			return "";
	}
};
