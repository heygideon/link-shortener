import db from "#/db";
import { sessions } from "#/db/schema";
import { useSession } from "@tanstack/react-start/server";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";

type SessionData = {
  sessionId?: string;
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

export async function createSession(userId: string) {
  const [row] = await db
    .insert(sessions)
    .values({
      userId,
      expiresAt: dayjs().add(7, "day").toDate(),
    })
    .returning({ id: sessions.id });

  const session = await useAppSession();
  await session.update({ sessionId: row.id });
}

export async function getSession() {
  const NULL_SESSION = { session: null, user: null };

  const session = await useAppSession();
  if (!session.data.sessionId) return NULL_SESSION;

  const dbSession = await db.query.sessions.findFirst({
    where: { id: session.data.sessionId },
    with: { user: true },
  });
  if (!dbSession) return NULL_SESSION;

  const { user, ...rest } = dbSession;
  return { session: rest, user };
}

export async function deleteSession() {
  const session = await useAppSession();
  if (!session.data.sessionId) return;

  await db.delete(sessions).where(eq(sessions.id, session.data.sessionId));
  await session.clear();
}
