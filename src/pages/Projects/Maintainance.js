import { Card, Checkbox, Col, Collapse, Input, Select } from "antd";
import { Form } from "@ant-design/compatible";

import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { filterOptions } from "helpers/utils";
import React, { useState } from "react";

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};
const formItemLayout = {
	labelCol: {
		xs: { span: 0 },
		sm: { span: 16 }
	},
	wrapperCol: {
		xs: { span: 0 },
		sm: { span: 24 }
	}
};
const plainOptions = [
	"Toggle All",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

function Maintainance({ getFieldDecorator, selectedMonth, setSelectedMonth }) {
	const handleMonthChange = value => {
		if (value.includes("Toggle All")) {
			setSelectedMonth(plainOptions);
			return;
		}

		if (selectedMonth.includes("Toggle All")) {
			setSelectedMonth([]);
			return;
		}
		setSelectedMonth(prev => [...prev, ...value]);
	};
	return (
		<Collapse accordion>
			<Panel header="Maintenance" key="1">
				<Form {...layout} name="control-hooks" layout="vertical">
					<FormItem
						{...formItemLayout}
						style={{ marginBottom: "30px", display: "block" }}
						label="Enable Maintenance"
						help="Check this box to enable recurring monthly maintenance on this
                        project."
					>
						{getFieldDecorator("monthly", {})(<Checkbox>Yes</Checkbox>)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						style={{ marginBottom: "30px", display: "block" }}
						label="Select Month"
					>
						<CheckboxGroup
							className="gx-d-flex gx-flex-row gx-row-gap-10"
							style={{ marginTop: "15px" }}
							options={plainOptions}
							onChange={handleMonthChange}
							value={selectedMonth}
						/>
					</FormItem>

					<FormItem
						style={{ marginBottom: "30px", display: "block" }}
						{...formItemLayout}
						label="Send Mail On"
						help="Select the day of the month e.g. if you input 12 - the field mail will be sent on the 12th of every month."
					>
						{getFieldDecorator("emailDay", {
							rules: [{ required: true, message: "Required!" }]
						})(<Input placeholder="0" style={{ marginTop: "15px" }} />)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						style={{ marginBottom: "30px", display: "block" }}
						label="Project Coordinator E-mail"
						help="will default to info@webexpertsnepal.com if left blank"
					>
						{getFieldDecorator("sendEmailTo", {
							rules: [{ required: true, message: "Required!" }]
						})(<Input style={{ marginTop: "15px" }} />)}
					</FormItem>
				</Form>
			</Panel>
		</Collapse>
	);
}

export default Maintainance;
