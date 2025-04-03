// app/login/actions.js
"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../../lib/session";
import User from "@/models/User";
import bcrypt from "bcrypt";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

export async function login(prevState, formData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password } = result.data;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return {
            error: "Invalid email or password",
        };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return {
            error: "Invalid email or password",
        };
    }

    await createSession(user.id);
    return { success: true };
}

export async function logout() {
    await deleteSession();
    return { success: true };
}