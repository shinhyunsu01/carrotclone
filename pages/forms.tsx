import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
	username: string;
	password: string;
	email: string;
	errors?: string;
}

export default function Forms() {
	const {
		register,
		handleSubmit,
		reset,
		resetField,
		setError,
		formState: { errors },
	} = useForm<LoginForm>({
		mode: "onChange",
	});
	const onValid = (data: LoginForm) => {
		console.log("im valid bby");
		// reset(); <- 클릭후 초기화
		// resetField("password");

		//setError("username", { message: "Taken username" }); <- 특정 에러가 발생 하면 강제로 줄수 있음
	};
	const onInvalid = (errors: FieldErrors) => {
		console.log(errors);
	};
	return (
		<form onSubmit={handleSubmit(onValid, onInvalid)}>
			<input
				{...register("username", {
					required: "Username is required",
					minLength: 5,
				})}
				type="text"
				placeholder="Username"
			/>
			<input
				{...register("email", {
					required: "Eamil is required",
					validate: {
						notGmail: (value) =>
							!value.includes("@gmail.com") || "Gmail is not allowed",
					},
				})}
				type="email"
				className={`${Boolean(errors.email) ? "border-red-500" : ""}`}
				placeholder="Email"
			/>
			{errors.email?.message}
			<input
				{...register("password", {
					required: "Password is required",
				})}
				type="password"
				placeholder="Password"
			/>
			<input type="submit" value="Create Value"></input>
			{errors.username?.message}
		</form>
	);
}
