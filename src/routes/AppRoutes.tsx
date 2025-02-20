import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Monitor from "../pages/Monitor";
import Alerts from "../pages/Alerts";

const AppRoutes = () => {
	const routes = [
		{
			element: <MainLayout />,
			children: [
				{ path: "/monitor", element: <Monitor /> },
				{ path: "/alerts", element: <Alerts /> },
				{ path: "*", element: <Navigate to="/monitor" /> },
			],
		},
	];

	return useRoutes(routes);
};

export default AppRoutes;
