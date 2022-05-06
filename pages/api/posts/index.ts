import { withIronSessionApiRoute } from "iron-session/next";

import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "POST") {
		const {
			body: { question, longitude, latitude },
			session: { user },
		} = req;

		const post = await client.post.create({
			data: {
				question,
				longitude,
				latitude,
				user: {
					connect: {
						id: user?.id,
					},
				},
			},
		});

		await res.unstable_revalidate("/community");

		res.json({
			ok: true,
			post,
		});
	}
	if (req.method === "GET") {
		const {
			query: { longitude, latitude },
		} = req;
		const parsedLatitude = parseFloat(latitude.toString());
		const parsedLongitue = parseFloat(longitude.toString());
		//console.log("2", req.query);

		const posts = await client.post.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatar: true,
					},
				},
				_count: {
					select: {
						wondering: true,
						answers: true,
					},
				},
			},
			where: {
				latitude: {
					gte: parsedLatitude - 0.01,
					lte: parsedLatitude + 0.01,
				},
				longitude: {
					gte: parsedLongitue - 0.01,
					lte: parsedLongitue + 0.01,
				},
			},
		});
		res.json({
			ok: true,
			posts,
		});
	}
}
export default withApiSession(
	withHandler({
		methods: ["GET", "POST"],
		handler,
	})
);
