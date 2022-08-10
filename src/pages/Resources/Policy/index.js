import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Divider } from "antd";
import parse from "html-react-parser";
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
			{data?.data?.data?.data?.map((policy, index, policies) => (
				<>
					<Descriptions title={policy?.title}>
						<Descriptions.Item>{parse(policy?.content)}</Descriptions.Item>
					</Descriptions>
					{policies?.length - 1 !== index && <Divider />}
				</>
			))}
		</Card>
	);
}

export default Policy;
