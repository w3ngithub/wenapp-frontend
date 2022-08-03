import React, { useState } from "react";
import { Col, Row } from "antd";
import About from "components/Modules/profile/About/index";
import Biography from "components/Modules/profile/Biography/index";
import Auxiliary from "util/Auxiliary";
import ProfileHeader from "components/Modules/profile/ProfileHeader";
import User from "types/user";
import UserProfileModal from "components/Modules/profile/UserProfileModal";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "services/users/userDetails";
import moment from "moment";

// {
// 	id: number,
// 	title: string,
// 	icon: string,
// 	name: string
// }[]
export const aboutList = [
	{
		id: 1,
		title: "Email",
		icon: "email",
		name: "email",
	},
	{
		id: 2,
		title: "Gender",
		icon: "user-o",
		name: "gender",
	},
	{
		id: 3,
		title: "Phone",
		icon: "phone",
		name: "primaryPhone",
	},
	{
		id: 4,
		title: "Marital Status",
		icon: "home",
		name: "maritalStatus",
	},
];

function Profile() {
	// const user: { user: User } = JSON.parse(
	// 	localStorage.getItem("user_id") || ""
	// );
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user_id") || "")
	);
	const [openModal, setOpenModal] = useState(false);
	const mutation = useMutation(updateProfile, {
		onError: (error) => {
			console.log(error);
		},
		onSuccess: (data, variables, context) => {
			setUser(data.data.data);
			localStorage.setItem(
				"user_id",
				JSON.stringify({ user: data.data.data.user })
			);
			setOpenModal(false);
		},
	});

	const aboutData = aboutList.map((about) => ({
		...about,
		desc: user.user[about.name],
	}));

	const handleProfileUpdate = (user) => {
		console.log(user);
		const updatedUser = {
			...user,
			dob: moment.utc(user.dob._d).format(),
			joinDate: moment.utc(user.joinDate._d).format(),
			primaryPhone: +user.primaryPhone,
			secondaryPhone: +user.secondaryPhone || undefined,
		};

		mutation.mutate(updatedUser);
	};

	return (
		<>
			<UserProfileModal
				toggle={openModal}
				onToggle={setOpenModal}
				user={user.user}
				onSubmit={handleProfileUpdate}
				isLoading={mutation.isLoading}
			/>

			<Auxiliary>
				<ProfileHeader
					user={{ name: user.user.name, position: user.user.position.name }}
					onMoreDetailsClick={setOpenModal}
				/>
				<div className="gx-profile-content">
					<Row>
						<Col xs={24}>
							<About data={aboutData} />
							<Biography />
						</Col>
					</Row>
				</div>
			</Auxiliary>
		</>
	);
}

export default Profile;
