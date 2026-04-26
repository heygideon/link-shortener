import { useSession } from "@tanstack/react-start/server";

type SessionData = {
  userId?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "links-session",
    // biome-ignore lint/style/noNonNullAssertion: defined in .env
    password: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  });
}
