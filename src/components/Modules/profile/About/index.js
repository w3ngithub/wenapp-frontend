import React from "react";
import { Col, Row, Tabs } from "antd";
import Widget from "components/Elements/Widget";
import { aboutList } from "routes/socialApps/Profile/data";
import AboutItem from "./AboutItem";

const TabPane = Tabs.TabPane;

class About extends React.Component {
	render() {
		return (
			<Widget
				title="About"
				styleName="gx-card-tabs gx-card-tabs-right gx-card-profile"
			>
				<div className="gx-mb-2">
					<Row>
						{this.props.data.map((about, index) => (
							<Col key={index} xl={8} lg={12} md={12} sm={12} xs={24}>
								<AboutItem data={about} />
							</Col>
						))}
					</Row>
				</div>
			</Widget>
		);
	}
}

export default About;
