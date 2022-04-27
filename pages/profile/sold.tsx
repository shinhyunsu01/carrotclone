import { Product } from ".prisma/client";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import type { NextPage } from "next";
import useSWR from "swr";

const Sold: NextPage = () => {
	return (
		<Layout title="판매내역" canGoBack>
			<div className="flex flex-col space-y-5 pb-10 divide-y">
				<ProductList kind="sales" />
			</div>
		</Layout>
	);
};

export default Sold;
