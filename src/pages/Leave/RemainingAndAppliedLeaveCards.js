import { Col, Row } from "antd";
import IconWithTextCard from "components/Modules/Metrics/IconWithTextCard";
import React from "react";

function RemainingAndAppliedLeaveCards({ leavesRemaining, leavesTaken }) {
	return (
		<Row>
			<Col xl={12} sm={12} xs={12} className="gx-col-full">
				<IconWithTextCard
					cardColor="cyan"
					icon="product-list"
					title={leavesRemaining}
					subTitle="Leave Days Remaining"
				/>
			</Col>
			<Col xl={12} sm={12} xs={12} className="gx-col-full">
				<IconWithTextCard
					cardColor="orange"
					icon="tasks"
					title={leavesTaken}
					subTitle="Leave Days Applied"
				/>
			</Col>
		</Row>
	);
}

export default RemainingAndAppliedLeaveCards;
