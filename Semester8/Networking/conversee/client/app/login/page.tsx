import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function handleLogin(formData: FormData) {
  "use server";

  const cookieStore = await cookies();

  const username = formData.get("username")?.toString();
  if (!username?.trim()) {
    return;
  }

  cookieStore.set("username", username);
  redirect("/conversations");
}

export default function Login() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Welcome to Conversee
      </h2>
      <form action={handleLogin} className="w-full">
        <p className="text-gray-600 mb-2">Enter your name to start chatting</p>
        <div className="mb-6">
          <input
            type="text"
            name="username"
            placeholder="Enter your name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Join Chat
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Your name will be visible to other users in the chat
      </p>
    </div>
  );
}
