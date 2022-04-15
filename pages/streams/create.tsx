import type { NextPage } from "next";
const Create: NextPage = () => {
	return (
		<div className="space-y-5 py-10 px-4">
			<div>
				<label
					className="mb-1 block text-sm font-medium text-gray-700"
					htmlFor="name"
				>
					Name
				</label>
				<div className="rounded-md relative flex  items-center shadow-sm">
					<input
						id="name"
						type="email"
						className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
						required
					/>
				</div>
			</div>

			<div>
				<label
					className="mb-1 block text-sm font-medium text-gray-700"
					htmlFor="price"
				>
					Price
				</label>
				<div className="rounded-md relative shadow-sm flex items-center">
					<div className="absolute left-0 pl-3 flex pointer-events-none items-center justify-center">
						<span className="">$</span>
					</div>
					<input
						className="appearance-none w-full pl-7  py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-400 focus:border-orange-500"
						id="price"
						type="text"
						placeholder="0.00"
					/>
					<div className="absolute right-0  pointer-events-none pr-3 flex items-center">
						<span className="text-gray-500">USD</span>
					</div>
				</div>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium text-gray-700">
					Description
				</label>

				<textarea
					className="mt-1 shadow-sm w-full focus:-ring-2 focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500"
					rows={4}
				/>
			</div>
			<button className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none">
				Go Live
			</button>
		</div>
	);
};

export default Create;
