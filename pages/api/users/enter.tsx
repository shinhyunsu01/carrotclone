import client from "@libs/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

// api 만들때 꼭 export default 해줘야 한다고 한다.
// nextjs 가 사용자가 url 을 호출 하고 그 function 을 실행
// 그래야 req 와 res 를 줌
async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { phone, email } = req.body;
	const payload = Math.floor(100000 + Math.random() * 900000) + "";
	const user = phone ? { phone: +phone } : email ? { email } : null;
	if (!user) return res.json({ ok: false });
	const token = await client.token.create({
		data: {
			payload,
			user: {
				connectOrCreate: {
					// connet 하고 없으면 create
					where: {
						...user,
					},
					create: {
						name: "Annonymous",
					},
				},
			},
		},
	});
	console.log(token);
	return res.json({
		ok: true,
	});
	/*
	let user;
	if (phone) {
		user = await client.user.upsert({
			where: {
				phone: +phone,
			},
			create: {
				name: "Annoymous",
				phone: +phone,
			},
			update: {},
		});
	} else if (email) {
		user = await client.user.upsert({
			where: {
				email,
			},
			create: {
				name: "Annoymous",
				email,
			},
			update: {},
		});
	}*/

	/*
	if (email) {
		user = await client.user.findUnique({
			where: {
				email,
			},
		});
		if (user) console.log("found");
		if (!user) {
			console.log("did not found  will create");
			user = await client.user.create({
				data: {
					name: "Anonymous",
					email,
				},
			});
		}
	}
	if (phone) {
		user = await client.user.findUnique({
			where: {
				phone: +phone,
			},
		});
		if (user) console.log("found");
		if (!user) {
			console.log("did not found  will create");
			user = await client.user.create({
				data: {
					name: "Anonymous",
					phone: +phone,
				},
			});
		}
	}*/
}

export default withHandler("POST", handler);
