import React from "react";
import { Collapse } from "antd";
import parse from "html-react-parser";

const Panel = Collapse.Panel;

const Collapses = ({ data = [], defaultActiveKey = ["0"] }) => {
	return (
		<Collapse defaultActiveKey={defaultActiveKey}>
			{data?.map((item, index) => (
				<Panel header={item?.title} key={index}>
					<p style={{ margin: 0 }}>{parse(item?.content)}</p>
				</Panel>
			))}
		</Collapse>
	);
};

export default Collapses;
