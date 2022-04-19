import type { NextPage } from "next";
import Layout from "../../components/layout";
import Message from "../../components/message";

const ChartDetail: NextPage = () => {
	return (
		<Layout canGoBack title="Steve">
			<div className="py-10 pb-16 px-4 space-y-4">
				<Message message="hi how much are you selling them for?" />
				<Message message="i want 20,000" reversed />
				<Message message="비싸" />
			</div>
		</Layout>
	);
};

export default ChartDetail;
