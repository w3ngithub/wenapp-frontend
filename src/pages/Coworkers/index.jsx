import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllUsers } from "services/users/userDetails";

function Coworkers() {
	const { data } = useQuery(["users"], getAllUsers);

	return <div>Coworkers</div>;
}

export default Coworkers;
