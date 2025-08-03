"use client";

// import { useState } from "react";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
// import { Icon } from "./Icon";
// import { checkValidImageExtension } from "@/app/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { storeFileInS3 } from "@/actions/s3";
import { validateImageFile } from "@/lib/utils";
// import { uploadFile } from "@/actions/index";

export function MultiFilepnd({
  label,
  src,
  setSrc,
}: {
  label: string;
  src: string[];
  setSrc: (src: string[]) => void;
}) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.files &&
      src.length < 6 &&
      e.target.files.length + src.length <= 6
    ) {
      const toastId = toast.loading("Uploading file, please wait...");
      const newUrlList = [...src];
      for (const file of e.target.files) {
        //   const file = e.target.files[0];
        const validation = validateImageFile(file, 5);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }
        //   const fileNameWithoutSpecialChars = file?.name.replace(
        //     /[^a-zA-Z0-9]/g,
        //     ""
        //   );
        // const fileName = fileNameWithoutSpecialChars.slice(0, -extension.length);
        // const storageRef = ref(
        //   storage,
        //   `Products/${fileName + uuidv4() + "." + extension}`
        // );

        // await uploadBytes(storageRef, file);

        // const url = await getDownloadURL(storageRef);

        //   const url = await uploadAttachment(file, extension, "Product_Images");
        const url = await storeFileInS3(file);
        console.log("Uploaded", file.name, "->", url);
        if (!url) {
          toast.error("File Upload Failed!", { id: toastId });
          continue;
        }
        const result = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${url}`;
        newUrlList.push(result);
      }
      toast.success("File Uploaded!", { id: toastId });
      setSrc(newUrlList);
    } else {
      toast.error("You can only upload 6 images at a time.");
    }
  };

  return (
    <div className="">
      <label
        htmlFor="email"
        className="block mb-1 text-sm font-medium  text-black"
      >
        {label}
      </label>
      <div className="flex  gap-5 flex-row">
        <div className="flex  gap-2 flex-row flex-wrap">
          {src && src.length ? (
            src.map((href) => (
              <div key={uuidv4()}>
                <button
                  className="w-[116px] flex flex-row-reverse"
                  data-href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    const newHrefs = src.filter((a) => a !== href);
                    setSrc(newHrefs);
                  }}
                >
                  <X className="size-4 absolute rounded-[50%] cursor-pointer border-2 border-black" />
                </button>
                <Image
                  height={200}
                  width={200}
                  alt="attachment"
                  className="rounded-lg z-10 p-2 w-28"
                  src={href}
                  id="profile-image"
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>

        {src.length < 6 && (
          <div className="ml-1 h-full rounded-lg cursor-pointer flex flex-col justify-center items-center max-h-52 m-auto">
            <label
              htmlFor="profile-image-upload"
              className=" rounded-lg cursor-pointer flex flex-col justify-center items-center"
            >
              <Plus className="size-10 fill-black mt-3" />
            </label>
            <input
              id="profile-image-upload"
              className="hidden"
              type="file"
              onChange={handleFileChange}
              multiple
            />
          </div>
        )}
      </div>
    </div>
  );
}
