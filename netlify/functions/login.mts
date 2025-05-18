import jwt from 'jsonwebtoken';
import type { Context } from "@netlify/edge-functions";

export default async (req: Request, context: Context) => {
  const { email, password } = await req.json();

  const validUserName = Netlify.env.get('VITE_NETLIFY_USER_NAME');
  const validPassword = Netlify.env.get('VITE_NETLIFY_USER_PASSWORD');

  if (email === validUserName && password === validPassword) {
    const token = jwt.sign({ email }, Netlify.env.get('JWT_SECRET'), { expiresIn: '1h' });
    return new Response(
      JSON.stringify({ message: "Login successful!", token }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    return new Response(
      JSON.stringify({ message: "Invalid email or password." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};