import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
	ok: boolean;
	[key: string]: any;
}

interface ConfigType {
	method: "GET" | "POST" | "DELETE";
	handler: (req: NextApiRequest, res: NextApiResponse) => void;
	isPrivate?: boolean;
}

export default function withHandler({
	method,
	handler,
	isPrivate = true,
}: ConfigType) {
	return async function (
		req: NextApiRequest,
		res: NextApiResponse
	): Promise<any> {
		if (req.method !== method) {
			res.status(405).end();
		}
		if (isPrivate && !req.session.user) {
			return res.status(401).json({ ok: false, error: "plz log in." });
		}
		try {
			await handler(req, res);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ err });
		}
	};
}
