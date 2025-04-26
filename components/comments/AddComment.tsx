import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AddCommentProps {
  onAddComment: (text: string) => void;
}

const AddComment = ({ onAddComment }: AddCommentProps) => {
  const [commentText, setCommentText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="flex items-start gap-3 mb-6">
      <Avatar className="w-10 h-10 bg-purple-600">
        <AvatarFallback className="text-white">D</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Add a comment..."
          className="w-full bg-gray-200 rounded-md p-3 text-black border-[2px] border-white  focus-visible:border-gray-600"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default AddComment;
