import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import Collapse from "components/Elements/Collapse";
import CircularProgress from "components/Elements/CircularProgress";
import { getAllPolicies } from "services/resources";
import { notification } from "helpers/notification";

function Policy() {
	const { data, isLoading, isError } = useQuery(["policies"], getAllPolicies);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Users!", type: "error" });
		}
	}, [isError]);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<Card title="Policy">
			<Collapse data={data?.data?.data?.data} />
		</Card>
	);
}

export default Policy;
