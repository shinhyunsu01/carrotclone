import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product } from ".prisma/client";
import { User } from ".prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";

interface ProductWithUser extends Product {
	user: User;
}

interface ItemDetailResponse {
	ok: boolean;
	product: ProductWithUser;
	relatedProducts: Product[];
	isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
	product,
	relatedProducts,
	isLiked,
}) => {
	const { user, isLoading } = useUser();

	// hook 으로 mutate 함수 얻을수 있고 mutate(key)로 동일한 키를 사용하는 다른 swr hook 에게
	// revalidation 메시지를 브로드캐스팅 가능
	//mutate("/api/user", {...data, name: newName}, false)
	const { mutate } = useSWRConfig();
	const router = useRouter();

	//캐시 된 데이터를 뮤테이트하기 위한 함수
	const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
		router.query.id ? `/api/products/${router.query.id}` : null
	);

	const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);

	const onFavClick = () => {
		if (!data) return;
		boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false); // true 이면 원 상태로 돌아옴
		//서버에 추후에 보냄
		toggleFav({});
	};

	return (
		<Layout canGoBack>
			<div className="px-4 py-4">
				<div className="mb-8">
					<div className="relative pb-80">
						<Image
							src={`https://imagedelivery.net/fhkogDoSTeLvyDALpsIbnw/${product.image}/public`}
							className=" bg-slate-300 object-cover"
							layout="fill"
						/>
					</div>
					<div className="flex cursor-pointer py-3 border-t  border-b items-center space-x-3">
						<Image
							width={48}
							height={48}
							src={`https://imagedelivery.net/fhkogDoSTeLvyDALpsIbnw/${product?.user.avatar}/avatar`}
							className="w-12 h-12 rounded-full bg-slate-300"
						/>
						<div>
							<p className="text-sm font-medium text-gray-700">
								{product?.user?.name}
							</p>
							<Link href={`/users/profiles/${product?.user?.id}`}>
								<a className="text-xs font-medium text-gray-500">
									View profile &rarr;
								</a>
							</Link>
						</div>
					</div>
					<div className="mt-5">
						<h1 className="text-3xl font-bold text-gray-900">
							{product?.name}
						</h1>
						<p className="text-3xl block mt-3 text-gray-900">
							${product?.price}
						</p>
						<p className=" text-base my-6 text-gray-700">
							{product?.description}
						</p>
						<div className="flex items-center justify-between space-x-2">
							<Button large text="Talk to seller" />

							<button
								onClick={onFavClick}
								className={cls(
									"p-3 rounded-md flex items-center justify-center",
									isLiked
										? " text-red-400 hover:bg-gray-100 hover:text-red-500"
										: "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
								)}
							>
								{isLiked ? (
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
											clipRule="evenodd"
										></path>
									</svg>
								) : (
									<svg
										className="h-6 w-6 "
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
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
					<div className="grid mt-6 grid-cols-2 gap-4">
						{data?.relatedProducts.map((product) => (
							<div key={product.id}>
								<div className="h-56 w-full mb-4 bg-slate-300" />
								<h3 className="text-gray-700 -mb-1">{product.name}</h3>
								<span className="text-sm font-medium text-gray-900">
									${product.price}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const getStaticPaths: GetStaticPaths = () => {
	// fallback에서 'blocking'반환하지 않은 새 경로 는 SSR과 동일하게 생성 getStaticPaths될 때까지
	//기다린 다음 HTML(따라서 차단하는 이유 ) 이후 요청을 위해 캐시되어 경로당 한 번만 발생합니다.

	//기본적으로 생성된 페이지를 업데이트 하지 않는다.
	return {
		paths: [],

		//
		fallback: "blocking",
	};
};
// 1. getStaticProps 이 페이지를 정적으로 만들겠다...
// 2. 얼마나 많은 페이지 만들지는 getStaticPaths 로 이동..
export const getStaticProps: GetStaticProps = async (ctx) => {
	if (!ctx?.params?.id) {
		return {
			props: {},
		};
	}
	const product = await client.product.findUnique({
		where: {
			id: +ctx.params.id.toString(),
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					avatar: true,
				},
			},
		},
	});
	const terms = product?.name.split(" ").map((word) => ({
		name: {
			contains: word,
		},
	}));

	//search
	const relatedProducts = await client.product.findMany({
		where: {
			OR: terms,
			AND: {
				id: {
					not: product?.id,
				},
			},
		},
	});
	const isLiked = false;
	//await new Promise((resolve) => setTimeout(resolve, 10000));
	return {
		props: {
			product: JSON.parse(JSON.stringify(product)),
			relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
			isLiked,
		},
	};
};

export default ItemDetail;
