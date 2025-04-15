import { handlerAuth } from "@/app/actions/handler-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth();

    if (!session) {
        redirect("/login")
    }
    
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Protected dashboard</h1>  
            <p>
                Email do usuario: { session?.user?.email ? session?.user?.email : "User not logged"}
            </p>
            {
                session?.user?.email && (
                    <form
                        action={handlerAuth}
                        className="flex  flex-col items-center justify-center h-screen">

                        <button
                            type="submit"
                            className="border rounded-md px-2 py-1 cursor-pointer"
                            >
                            Logout
                        </button>
                    </form>
                )
            }
        </div>
    )
}