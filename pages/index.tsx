import useUser from "@libs/client/useUser";
import Head from "next/head";
import type { NextPage } from "next";
import FloatingButton from "../components/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";
import useSWR, { SWRConfig } from "swr";
import { Product } from ".prisma/client";
import Image from "next/image";
import client from "@libs/server/client";

export interface ProductWithCount extends Product {
	_count: {
		favs: number;
	};
}

interface ProductResponse {
	ok: boolean;
	products: ProductWithCount[];
}

const Home: NextPage = () => {
	const { user, isLoading } = useUser();
	const { data } = useSWR<ProductResponse>("/api/products");

	return (
		<Layout title="홈" hasTabBar>
			<Head>
				<title>Home</title>
			</Head>
			<div className="flex flex-col space-y-5">
				{data?.products?.map((product) => (
					<Item
						id={product.id}
						key={product.id}
						title={product.name}
						price={product.price}
						hearts={product._count?.favs}
					/>
				))}
				<FloatingButton href="/products/upload">
					<svg
						className="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
				</FloatingButton>
			</div>
		</Layout>
	);
	//<Image src={riceCake} />
};
const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
	return (
		<SWRConfig
			value={{
				fallback: {
					"/api/products": {
						ok: true,
						products,
					},
				},
			}}
		>
			<Home />
		</SWRConfig>
	);
};

//캐시 기능을 다시 사용 못함
export async function getServerSideProps() {
	//ssr server side rendering
	//swr stale-while-revalidate
	//swr -> 장점
	// 캐싱이 가능 / 배경에서 데이터를 갱신 해주기 때문에 항상 최신 데이터를 볼수 있다

	const products = await client.product.findMany({});
	console.log(products);
	return {
		props: {
			products: JSON.parse(JSON.stringify(products)),
		},
	};
}

export default Page;
