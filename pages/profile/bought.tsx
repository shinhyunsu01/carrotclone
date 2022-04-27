import ProductList from "@components/product-list";
import type { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";

const Bought: NextPage = () => {
	return (
		<div className="flex flex-col space-y-5   py-10">
			{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
				<Layout title="구매내역" canGoBack>
					<div className="flex flex-col space-y-5 pb-10  divide-y">
						<ProductList kind="purchases" />
					</div>
				</Layout>
			))}
		</div>
	);
};

export default Bought;
