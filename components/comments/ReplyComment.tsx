import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

interface ReplyCommentProps {
  parentId: number;
  onReply: (text: string, parentId: number) => void;
  onClose: () => void;
}

const ReplyComment = ({ parentId, onReply, onClose }: ReplyCommentProps) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return; // Prevent submitting empty comments
    }
    onReply(commentText, parentId);
    setCommentText("");
  };

  return (
    <div className="flex flex-col w-full items-start mt-3 ml-2">
      <div className="flex flex-col flex-1 w-full items-center">
        <Input
          type="text"
          placeholder="Add a reply..."
          className="w-full bg-gray-200 rounded-md p-2 text-black border-white  focus-visible:border-white text-sm h-9"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        {error && (
          <div className="text-red-400 text-xs m-0 ml-1 w-full text-left">
            {error}
          </div>
        )}
      </div>
      <div className="flex gap-2 w-full h-3 ml-1 mb-3">
        <Button
          onClick={() => handleSubmit()}
          variant={"link"}
          className=" text-gray-700 p-0.5 text-xs h-6"
        >
          Reply
        </Button>
        <Button
          onClick={onClose}
          variant={"link"}
          className=" text-gray-700 p-0.5 text-xs h-6"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ReplyComment;
