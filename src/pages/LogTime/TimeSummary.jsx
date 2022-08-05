import React from "react";
import { Col, Row } from "antd";

import IconWithTextCard from "components/Modules/Metrics/IconWithTextCard";

function TimeSummary({ tsw, tst }) {
	return (
		<Col xl={24} lg={24} md={24} sm={24} xs={24} className="gx-order-sm-1">
			<Row>
				<Col xl={12} lg={12} md={12} sm={12} xs={24}>
					<IconWithTextCard
						cardColor="cyan"
						icon="diamond"
						title={tsw}
						subTitle="Time Spent This Week"
					/>
				</Col>
				<Col xl={12} lg={12} md={12} sm={12} xs={24}>
					<IconWithTextCard
						cardColor="orange"
						icon="tasks"
						title={tst}
						subTitle="Time Spent Today"
					/>
				</Col>
			</Row>
		</Col>
	);
}

export default TimeSummary;
