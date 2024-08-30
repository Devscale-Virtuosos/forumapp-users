import z from "zod";
import { IUser } from "../types";

export const inputRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export function validateInputRegister(user: IUser) {
  return inputRegisterSchema.safeParse(user);
}

export const inputLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function validateInputLogin(credential: Omit<IUser, "name">) {
  return inputLoginSchema.safeParse(credential);
}
