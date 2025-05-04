"use client";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import { areFileMapsEqual } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function ArticleAttachment({
  fileMap,
  setFileMap,
}: {
  fileMap: Map<string, File>;
  setFileMap: (files: File[]) => void;
}) {
  const [fileMapState, setFileMapState] = React.useState<Map<string, File>>(
    new Map()
  );
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  React.useEffect(() => {
    console.log("fileMap inside attach ========", fileMap);
    if (!areFileMapsEqual(fileMapState, fileMap)) {
      console.log("maps are not equal inside attach ========", fileMapState);
      setFileMapState(fileMap);
    }
  }, [fileMap]);

  return (
    <FileUpload
      maxFiles={6}
      maxSize={5 * 1024 * 1024}
      className="w-full max-w-md"
      onValueChange={setFileMap}
      onFileReject={onFileReject}
      multiple
      label="Add Images (max 6 files, up to 5MB each)"
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="flex items-center justify-center">
            <Upload className="size-6 text-muted-foreground" />
            <span className="p-2">Browse files</span>
          </div>
          {/* <p className="font-medium text-sm">Drag & drop files here</p> */}
          <p className="text-muted-foreground text-xs">
            Add Images (max 6 files, up to 5MB each)
          </p>
        </div>
        {/* <FileUploadTrigger asChild>
          
        </FileUploadTrigger> */}
      </FileUploadDropzone>
      <FileUploadList>
        {Array.from(fileMapState.values()).map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-4">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
