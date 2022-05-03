console.log("hello iim bs");

interface Texttype {
	text: string;
}

export default function Bs({ text }: Texttype) {
	return <h1>{text}</h1>;
}
