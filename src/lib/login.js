import { BASE_APIURL } from "@/config";

export async function loginUser({ usernameOrEmail, password }) {
  try {
    const res = await fetch(`${BASE_APIURL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data; // includes token, user data, etc.
  } catch (error) {
    throw error;
  }
}