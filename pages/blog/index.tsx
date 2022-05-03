import Layout from "@components/layout";
import matter from "gray-matter";
import { readdirSync, readFileSync } from "fs";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
	title: string;
	date: string;
	category: string;
	slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
	//console.log(posts);
	return (
		<Layout title="Blog" seoTitle="Blog">
			<h1 className="font-semibold text-center text-lg my-10">Latest Posts</h1>

			{posts.map((post, index) => (
				<div key={index} className="mb-5">
					<span className="text-lg text-red-500">{post.title}</span>
					<div>
						<Link href={`/blog/${post.slug}`}>
							<a>
								<span>
									{post.date} / {post.category}
								</span>
								<div>
									<span>
										{post.date} / {post.category}
									</span>
								</div>
							</a>
						</Link>
					</div>
				</div>
			))}
		</Layout>
	);
};

//단 한번만 실행되고 htlm 을 가지고 있다
//prisma 넣어도 됨 데이터 베이스가 바뀌더라도 페이지는 안바뀜

// getStaticProps 사용 할땐 페이지가 빌드 되기 전에 데이터를 먼저 추가

export async function getStaticProps() {
	const blogPosts = readdirSync("./posts").map((file) => {
		const content = readFileSync(`./posts/${file}`, "utf-8");
		const [slug, _] = file.split(".");

		return { ...matter(content).data, slug };
	});

	return {
		props: { posts: blogPosts },
	};
}
export default Blog;
