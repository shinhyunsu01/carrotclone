import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: number;
		};
	}
}

const cookieOptions = {
	cookieName: "carrotsession",
	password: process.env.COOKIE_PASSWORD!,
};
// Next.js API 경로 를 래핑 session하고 요청에 객체를 추가합니다 .
export function withApiSession(fn: any) {
	return withIronSessionApiRoute(fn, cookieOptions);
}

// api route안에서 인증 할수도 있고,  getServerSideProps 안에서도 할수 있음
export function withSsrSession(handler: any) {
	return withIronSessionSsr(handler, cookieOptions);
}
