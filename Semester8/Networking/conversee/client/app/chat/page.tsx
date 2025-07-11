import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChatForm } from "./form";

export default async function Home(props: {
  searchParams: {
    receiver?: string;
  };
}) {
  const params = await props.searchParams;
  console.log({
    params,
  });
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  if (!username) redirect("/login");
  return <ChatForm username={username} receiver={params.receiver} />;
}
