import React, { useState } from "react";
import { Col, Row } from "antd";
import About from "components/Modules/profile/About/index";
import Biography from "components/Modules/profile/Biography/index";
import Auxiliary from "util/Auxiliary";
import ProfileHeader from "components/Modules/profile/ProfileHeader";
import User from "types/user";
import UserProfileModal from "components/Modules/profile/UserProfileModal";

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
	// const user: { user: User } = JSON.parse(
	// 	localStorage.getItem("user_id") || ""
	// );
	const user = JSON.parse(localStorage.getItem("user_id") || "");
	const [openModal, setOpenModal] = useState(false);

	const aboutData = aboutList.map(about => ({
		...about,
		desc: user.user[about.name]
	}));

	return (
		<>
			<UserProfileModal
				toggle={openModal}
				onToggle={setOpenModal}
				user={user.user}
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

						{/* <Col xl={8} lg={10} md={10} sm={24} xs={24}>
						<Contact />
					</Col> */}
					</Row>
				</div>
			</Auxiliary>
		</>
	);
}

export default Profile;
