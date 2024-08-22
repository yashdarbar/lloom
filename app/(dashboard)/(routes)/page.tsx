import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"


export default function Home() {

  const { userId } = auth();
  console.log("User Id", userId);

  return (
    <div>
      {/* <UserButton
      /> */}
    </div>
  )
}
