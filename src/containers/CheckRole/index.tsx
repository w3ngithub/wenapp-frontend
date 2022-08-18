import { getLocalStorageData } from "helpers/utils";
import React from "react";

function CheckRole({ children }: { children: React.ReactNode }) {
	const user = getLocalStorageData("user_id");
	const isAdmin = user?.user?.role?.value === "Admin";

	if (isAdmin) return children;
	return null;
}

export default CheckRole;
