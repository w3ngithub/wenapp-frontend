import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface protectedRouteInterface {
	component?: React.ReactNode;
	rest?: any;
	children?: React.ReactNode;
}

export const ProtectedRoute = ({
	component: Component,
	children,
	...rest
}: protectedRouteInterface) => {
	let location = useLocation();
	const authUser = true;
	if (!authUser) {
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	return <Outlet />;
};
