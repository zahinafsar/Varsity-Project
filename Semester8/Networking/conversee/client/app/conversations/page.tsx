import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ConversationList } from "./list";

export default async function Home() {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  if (!username) redirect("/login");

  return <ConversationList username={username} />;
}
