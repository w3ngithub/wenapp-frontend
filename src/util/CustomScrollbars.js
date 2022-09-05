import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const CustomScrollbars = props => {
	const getWindowsSize = () => {
		const { innerHeight } = window;
		return innerHeight;
	};
	const [windowSize, setWindowSize] = useState(getWindowsSize());

	useEffect(() => {
		const handleWindowResize = () => {
			setWindowSize(getWindowsSize());
		};

		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);

	return (
		<Scrollbars
			{...props}
			autoHide
			autoHeight
			autoHeightMin={windowSize - 100}
			renderTrackHorizontal={props => (
				<div
					{...props}
					style={{ display: "none" }}
					className="track-horizontal"
				/>
			)}
		/>
	);
};
export default CustomScrollbars;
