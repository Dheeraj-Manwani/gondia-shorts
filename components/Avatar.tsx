// import { useRecoilValue } from "recoil";
import Image, { StaticImageData } from "next/image";
import profile from "@/public/profile.png";
// import { loggedUser } from "../recoil/atom/atom";

export function Avatar({
  name,
  className = "",
  type,
  profileImage,
}: {
  name?: string | null | undefined;
  className?: string;
  type?: string;
  profileImage?: string | StaticImageData | undefined | null;
}) {
  //   const loggedInUser = useRecoilValue(loggedUser);
  //   console.log("iinside avatar ", name, profileImage);
  //   console.log("iinside avatar state is", loggedInUser);
  return (
    <div
      className={
        `relative inline-flex items-center justify-center overflow-hidden rounded-full ${
          !profileImage ? "bg-gray-600 " : " "
        } ` + className
      }
    >
      {name && name.trim() !== "" && !profileImage && (
        <span className=" text-gray-100 ">
          {name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase() || "")
            .join("")}
        </span>
      )}
      {name && profileImage && (
        <span className=" text-gray-100 ">
          <Image
            width={60}
            height={60}
            src={profileImage}
            alt="profile image"
          />
        </span>
      )}
      {!name && type === "link" && (
        <Image
          width={60}
          height={60}
          src={profile}
          alt="login"
          className="bg-white cursor-pointer"
        />
      )}
      {!name && type !== "link" && (
        <Image
          width={60}
          height={60}
          src={profile}
          alt="login"
          className="bg-white"
        />
      )}
    </div>
  );
}
