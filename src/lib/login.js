export async function loginUser({ usernameOrEmail, password }) {
    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
  
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
  
    return data; // includes token, user data, etc.
  }