import { Avatar } from "../Avatar";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

interface AddCommentProps {
  onAddComment: (text: string, parentId: number | undefined) => void;
  name: string | undefined | null;
  profilePic: string | undefined | null;
}

const AddComment = ({ onAddComment, name, profilePic }: AddCommentProps) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    onAddComment(commentText, undefined);
    setCommentText("");
  };

  return (
    <div className="flex items-start gap-3 mb-6">
      <Avatar
        profileImage={profilePic ?? ""}
        name={name ?? ""}
        className="w-9 h-9"
      />
      <div className="flex flex-1 items-center gap-1.5">
        <Input
          type="text"
          placeholder="Add a comment..."
          className="w-full bg-gray-200 rounded-md p-3 text-black border-[2px] border-white  focus-visible:border-gray-600"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <SendHorizontal onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default AddComment;
