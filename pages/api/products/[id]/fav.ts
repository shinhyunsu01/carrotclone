import { withIronSessionApiRoute } from "iron-session/next";

import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		query: { id },
		session: { user },
	} = req;
	//findUnique unique라고 선언된 설정만 건들수 있음
	//findFirst 기준고 일치하는 첫번째 레코드 반환
	const alreadyExists = await client.fav.findFirst({
		where: {
			productId: +id.toString(),
			userId: user?.id,
		},
	});
	if (alreadyExists) {
		//delete
		await client.fav.delete({
			where: {
				id: alreadyExists.id,
			},
		});
	} else {
		//create
		await client.fav.create({
			data: {
				user: {
					connect: {
						id: user?.id,
					},
				},
				product: {
					connect: {
						id: +id.toString(),
					},
				},
			},
		});
	}
	res.json({ ok: true });
}

export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler,
	})
);
