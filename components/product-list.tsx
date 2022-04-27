import { ProductWithCount } from "pages";
import useSWR from "swr";
import { RecordingContext } from "twilio/lib/rest/api/v2010/account/call/recording";
import Item from "./item";

interface ProductListProps {
	kind: "favs" | "sales" | "purchases";
}

interface Record {
	id: number;
	product: ProductWithCount;
}

interface ProductListResponse {
	[key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
	const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);

	return data ? (
		<>
			{data[kind]?.map((record) => (
				<Item
					id={record.product.id}
					key={record.id}
					title={record.product.name}
					price={record.product.price}
					hearts={record.product._count.favs}
				/>
			))}
		</>
	) : null;
}
