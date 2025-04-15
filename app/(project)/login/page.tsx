import { handlerAuth } from "@/app/actions/handler-auth";


export default function SignIn() {
  return (
    <form
        action={handlerAuth}
        className="flex  flex-col items-center justify-center h-screen"
    >
      <button 
        type="submit"
        className="text-4xl font-bold border rounded-md px-4 cursor-pointer">Signin with Google</button>
    </form>
  )
} 
