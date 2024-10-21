import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const postReq = async (body: { [x: string]: string | boolean | number | undefined | string[] }, endpoint: string) => {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json();
  return { data, res };
};
