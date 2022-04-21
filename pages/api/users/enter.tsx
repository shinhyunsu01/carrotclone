import twilio from "twilio";
import client from "@libs/server/client";

import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

import nodemailer from "nodemailer";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// api 만들때 꼭 export default 해줘야 한다고 한다.
// nextjs 가 사용자가 url 을 호출 하고 그 function 을 실행
// 그래야 req 와 res 를 줌
async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { phone, email } = req.body;
	const payload = Math.floor(100000 + Math.random() * 900000) + "";
	const user = phone ? { phone } : email ? { email } : null;
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
	if (phone) {
		/*const message = await twilioClient.messages.create({
			messagingServiceSid: process.env.TWILIO_MSID,
			to: process.env.MY_PHONE!, // ! <- 확실하게 존재 한다는 의미 타입스크립트한테 알려줌
			body: `Your login token is ${payload}`,
		});
		console.log(message);*/
	} else if (email) {
		/*const transporter = nodemailer.createTransport({
			service: "GMail",
			port: 587,
			host: "smtp.gmail.com",
			secure: true,
			requireTLS: true,
			auth: {
				user: "abcdqwer9687@gmail.com",
				pass: "Shinerobot9687",
			},
		});
		const mailOptions: nodemailer.SendMailOptions = {
			from: "abcdqwer9687@gmail.com",
			to: "gustn9687@naver.com",
			subject: "tttest",
			text: `Your token is ${payload}`,
			html: `<strong>Your token is ${payload}</strong>`,
		};
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			}
		});*/
	}
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

export default withHandler({
	method: "POST",
	handler,
	isPrivate: false,
});
