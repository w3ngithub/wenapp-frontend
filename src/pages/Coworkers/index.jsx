import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllUsers } from "services/users/userDetails";
import UserDetailForm from "components/Modules/UserDetailModal";

function Coworkers() {
	const usersQuery = useQuery(["users"], getAllUsers);
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);

	const handleToggleModal = () => {
		setOpenUserDetailModal(prev => !prev);
	};

	const handleUserDetailSubmit = user => {
		console.log(user);
	};

	return (
		<div>
			<h1>Coworkers</h1>
			<UserDetailForm
				toggle={openUserDetailModal}
				onToggleModal={handleToggleModal}
				onSubmit={handleUserDetailSubmit}
			/>
		</div>
	);
}

export default Coworkers;
