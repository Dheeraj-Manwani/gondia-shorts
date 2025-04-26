// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import profileImg from "@/public/profile.png";
import { Avatar } from "./Avatar";
import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";

// interface UserProfileProps {
//   name: string;
//   email: string;
//   imageUrl?: string;
// }

export const UserProfile = () => {
  const session = useSession();
  console.log("session inside user profile", session);
  return (
    <div className="flex items-center gap-2 p-2">
      {/* <Avatar className="h-10 w-10">
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name} />
        ) : (
          <AvatarImage src="../public/profile.png" alt="Default Avatar" />
        )}
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar> */}
      {session && session.status != "authenticated" && (
        <Avatar className="w-10 h-10" />
      )}
      {session && session.status == "authenticated" && (
        <Avatar
          profileImage={session.data.user?.image}
          name={session.data.user?.name}
          className="w-10 h-10"
        />
      )}
      {session.data?.user ? (
        <div className="flex flex-col">
          <p className="font-sm text-gray-700">{session.data.user.name}</p>
          <p className="text-xs text-gray-500">{session.data.user.email}</p>
        </div>
      ) : (
        <Button
          className="cursor-pointer text-gray-600  hover:underline px-1"
          onClick={() => signIn("google")}
          variant={"ghost"}
        >
          Sign In
        </Button>
      )}
    </div>
  );
};
