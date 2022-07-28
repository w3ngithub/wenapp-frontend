import React, { useState } from "react";
import { Button } from "antd";
import LiveTime from "./../LiveTime/index";

function index() {
	const [punch, setPunch] = useState<string>("Punch In  ");

	const handlePunch = () => {
		setPunch(prev =>
			prev === "Punch In  " ? "Punch Out " : "Office Hour 9Hr"
		);
	};
	return (
		<>
			<Button onClick={handlePunch} className="gx-btn-cyan" icon="schedule">
				{punch} {punch !== "Office Hour 9Hr" && <LiveTime />}
			</Button>
		</>
	);
}

export default index;
