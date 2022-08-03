import React from "react";
import { Avatar } from "antd";

const ProfileHeader = ({
	user,
	onMoreDetailsClick
}: {
	user: { name: string; position: string };
	onMoreDetailsClick: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div className="gx-profile-banner">
			<div className="gx-profile-container">
				<div className="gx-profile-banner-top">
					<div className="gx-profile-banner-top-left">
						<div className="gx-profile-banner-avatar">
							<Avatar
								className="gx-size-90"
								alt="..."
								src={"https://via.placeholder.com/150x150"}
							/>
						</div>
						<div className="gx-profile-banner-avatar-info">
							<h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">
								{user.name}
							</h2>
							<p className="gx-mb-0 gx-fs-lg">{user.position}</p>
						</div>
					</div>
				</div>
				<div className="gx-profile-banner-bottom">
					<span className="gx-link ">
						<i className="icon icon-add gx-fs-lg gx-mr-2 gx-mr-sm-3 gx-d-inline-flex gx-vertical-align-middle" />
						<span
							className="gx-d-inline-flex gx-vertical-align-middle gx-ml-1 gx-ml-sm-0"
							onClick={() => onMoreDetailsClick(true)}
						>
							More Details
						</span>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
