import { Button, Modal } from "antd";
import Map from "components/Elements/Map";
import React from "react";

function LocationMap({
	title,
	open,
	onClose,
	location
}: {
	title: string;
	open: boolean;
	onClose: any;
	location: any;
}) {
	return (
		<Modal
			width={1100}
			title={title}
			style={{ flexDirection: "row" }}
			visible={open}
			mask={false}
			onCancel={onClose}
			footer={[
				<Button key="back" onClick={onClose}>
					Cancel
				</Button>
			]}
		>
			{open ? (
				<Map
					position={
						Array.isArray(location) && location?.length === 2
							? location
							: undefined
					}
					name={title}
				/>
			) : (
				""
			)}
		</Modal>
	);
}

export default LocationMap;
