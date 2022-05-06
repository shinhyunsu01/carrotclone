import Layout from "@components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
	return (
		<Layout title={data.title} seoTitle={data.title}>
			<div
				className="blog-post-content"
				dangerouslySetInnerHTML={{ __html: post }}
			/>
		</Layout>
	);
};

export function getStaticPaths() {
	/*const files = readdirSync("./posts").map((file) => {
		const [name, extension] = file.split(".");
		return { params: { slug: name } };
	});*/
	// fallback에서 false반환하지 않은 모든 경로 getStaticPaths는 404 페이지 가 됩니다.

	// 가 실행 되면 next buildNext.js는 getStaticPaths 반환 되었는지 확인한 다음 에서 반환된 경로 만
	// fallback: false 빌드 합니다 .

	// 이 옵션은 생성할 경로가 적거나 새 페이지 데이터가 자주 추가되지 않는 경우에 유용합니다.
	/* return {
		paths: files,
		fallback: false,
	}; */
	return {
		paths: [],
		fallback: "blocking",
	};
}

export const getStaticProps: GetStaticProps = async (ctx: any) => {
	const { data, content } = matter.read(`./posts/${ctx.params?.slug}.md`);

	const { value } = await unified()
		.use(remarkParse)
		.use(remarkHtml)
		.process(content);

	return {
		props: {
			data,
			post: value,
		},
	};
};

export default Post;
