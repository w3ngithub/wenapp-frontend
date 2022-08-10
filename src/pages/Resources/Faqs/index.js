import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Divider } from "antd";
import parse from "html-react-parser";
import CircularProgress from "components/Elements/CircularProgress";
import { getAllFaqs } from "services/resources";
import { notification } from "helpers/notification";

function Faqs() {
	const { data, isLoading, isError } = useQuery(["faqs"], getAllFaqs);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Users!", type: "error" });
		}
	}, [isError]);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<Card title="FAQS">
			{data?.data?.data?.data?.map((faq, index, faqs) => (
				<>
					<Descriptions title={faq?.title}>
						<Descriptions.Item>{parse(faq?.content)}</Descriptions.Item>
					</Descriptions>
					{faqs?.length - 1 !== index && <Divider />}
				</>
			))}
		</Card>
	);
}

export default Faqs;
