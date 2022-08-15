import React, { useState } from "react";
import { ScheduleOutlined } from '@ant-design/icons';
import { Button } from "antd";
import LiveTime from "./../LiveTime/index";

function PunchInOut() {
	const [punch, setPunch] = useState<string>("Punch In  ");

	const handlePunch = (): void => {
		setPunch(prev =>
			prev === "Punch In     " ? "Punch Out    " : "Office Hour 9Hr"
		);
	};
	return <>
        <Button
            onClick={handlePunch}
            className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
            icon={<ScheduleOutlined />}
        >
            {punch} {punch !== "Office Hour 9Hr" && <LiveTime />}
        </Button>
    </>;
}

export default PunchInOut;
