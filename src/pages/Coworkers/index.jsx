import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllUsers } from "services/users/userDetails";
import UserDetailForm from "components/Modules/UserDetailModal";

function Coworkers() {
	const { data } = useQuery(["users"], getAllUsers);

	return (
		<div>
			<h1>Coworkers</h1>
			<UserDetailForm />
		</div>
	);
}

export default Coworkers;
