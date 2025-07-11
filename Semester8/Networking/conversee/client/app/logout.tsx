import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function handleLogout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("username");
  redirect("/login");
}

export function LogoutButton() {
  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="absolute top-6 right-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </form>
  );
}
