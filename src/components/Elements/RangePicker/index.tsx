import React from "react";
import { DatePicker } from "antd";

const { RangePicker: DateRangePicker } = DatePicker;

function RangePicker({
	handleChangeDate,
	date
}: {
	handleChangeDate: any;
	date: any;
}) {
	return (
		<DateRangePicker
			onChange={handleChangeDate}
			value={date}
			style={{ width: "240px" }}
		/>
	);
}

export default RangePicker;
