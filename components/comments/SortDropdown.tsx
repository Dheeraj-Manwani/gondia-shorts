import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "@/db/schema/comments";
import { ChevronDown } from "lucide-react";

interface SortDropdownProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortDropdown = ({ sortOption, setSortOption }: SortDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center text-sm text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">
          <span>Sort by</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#ffffff] border-[#27272A] text-zinc-600"
      >
        <DropdownMenuItem
          onClick={() => setSortOption("top")}
          className={`hover:bg-zinc-700 focus:bg-zinc-700 ${
            sortOption === "top" ? "text-primary" : ""
          }`}
        >
          Top Comments
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setSortOption("newest")}
          className={`hover:bg-zinc-700 focus:bg-zinc-700 ${
            sortOption === "newest" ? "text-primary" : ""
          }`}
        >
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setSortOption("oldest")}
          className={`hover:bg-zinc-700 focus:bg-zinc-700 ${
            sortOption === "oldest" ? "text-primary" : ""
          }`}
        >
          Oldest First
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
