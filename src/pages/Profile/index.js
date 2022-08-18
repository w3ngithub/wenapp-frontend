import React, { useState } from "react";
import { Col, notification, Row } from "antd";
import About from "components/Modules/profile/About/index";
import Biography from "components/Modules/profile/Biography/index";
import Auxiliary from "util/Auxiliary";
import ProfileHeader from "components/Modules/profile/ProfileHeader";
import UserProfileModal from "components/Modules/profile/UserProfileModal";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "services/users/userDetails";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "firebase";
import moment from "moment";
import { handleResponse } from "helpers/utils";

export const aboutList = [
	{
		id: 1,
		title: "Email",
		icon: "email",
		name: "email"
	},
	{
		id: 2,
		title: "Gender",
		icon: "user-o",
		name: "gender"
	},
	{
		id: 3,
		title: "Phone",
		icon: "phone",
		name: "primaryPhone"
	},
	{
		id: 4,
		title: "Marital Status",
		icon: "home",
		name: "maritalStatus"
	}
];

function Profile() {
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user_id") || "")
	);
	const [openModal, setOpenModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const mutation = useMutation(updateProfile, {
		onSuccess: response =>
			handleResponse(
				response,
				"Update profile successfully",
				"Could not update profile",
				[
					() => setUser(response.data.data),
					() =>
						localStorage.setItem(
							"user_id",
							JSON.stringify({ user: response.data.data.user })
						),
					() => setOpenModal(false),
					() => setIsLoading(false)
				]
			),

		onError: () =>
			notification({
				message: "Could not update profile!",
				type: "error"
			})
	});

	const aboutData = aboutList.map(about => ({
		...about,
		desc: user.user[about.name]
	}));

	const handleProfileUpdate = user => {
		setIsLoading(true);
		let updatedUser = {
			...user,
			dob: moment.utc(user.dob._d).format(),
			joinDate: moment.utc(user.joinDate._d).format(),
			primaryPhone: +user.primaryPhone,
			secondaryPhone: +user.secondaryPhone || undefined
		};

		if (user.photoURL) {
			const storageRef = ref(storage, `profile/${user?.photoURL?.name}`);

			const uploadTask = uploadBytesResumable(
				storageRef,
				user?.photoURL?.originFileObj
			);

			uploadTask.on(
				"state_changed",
				snapshot => {
					const pg = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					// setProgress(() => pg);
				},
				error => {
					// Handle unsuccessful uploads
					setIsLoading(false);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						updatedUser = {
							...updatedUser,

							photoURL: downloadURL
						};
						mutation.mutate(updatedUser);
					});
				}
			);
		} else {
			mutation.mutate(updatedUser);
		}
	};

	return (
		<>
			<UserProfileModal
				toggle={openModal}
				onToggle={setOpenModal}
				user={user.user}
				onSubmit={handleProfileUpdate}
				isLoading={isLoading}
			/>

			<Auxiliary>
				<ProfileHeader
					user={{
						name: user?.user?.name,
						position: user.user?.position?.name,
						photoURL: user?.user?.photoURL
					}}
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
