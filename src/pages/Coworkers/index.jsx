import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllUsers } from "services/users/userDetails";
import UserDetailForm from "components/Modules/UserDetailModal";
import { Card, Table } from "antd";
import { CO_WORKERCOLUMNS } from "constants/CoWorkers";
import CircularProgress from "components/Elements/CircularProgress";

const formattedUsers = (users, isAdmin) => {
	return users.map(user => ({
		...user,
		key: user._id,
		dob: changeDate(user.dob),
		joinDate: changeDate(user.joinDate),
		isAdmin
	}));
};

function changeDate(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${dd}/${mm}/${yyyy}`;
}

function CoworkersPage() {
	// get user detail from storage
	const { user } = JSON.parse(localStorage.getItem("user_id"));

	const { data, isLoading, isError } = useQuery(["users"], getAllUsers);
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);

	const handleToggleModal = () => {
		setOpenUserDetailModal(prev => !prev);
	};

	const handleUserDetailSubmit = user => {
		console.log(user);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<UserDetailForm
				toggle={openUserDetailModal}
				onToggleModal={handleToggleModal}
				onSubmit={handleUserDetailSubmit}
			/>
			<Card title="Co-workers">
				<div className="components-table-demo-control-bar"></div>
				<Table
					className="gx-table-responsive"
					columns={CO_WORKERCOLUMNS}
					dataSource={formattedUsers(
						data.data.data.data,
						user.role.key === "admin"
					)}
					rowSelection={{}}
					loading={isLoading}
				/>
			</Card>
		</div>
	);
}

export default CoworkersPage;
