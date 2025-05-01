"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CloudUpload, Eye, Paperclip } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ArticleAttachment } from "./ArticleAttachment";
import { CreateArticle, createArticleSchema } from "@/db/schema/news";
import { ArticleType } from "@prisma/client";
import { isAttachmentRequired } from "@/lib/utils";
import { storeFileInS3 } from "@/actions/s3";

export default function NewArticle({
  article,
  setArticle,
  togglePreviewMode,
}: {
  article: CreateArticle | null;
  setArticle: (article: CreateArticle) => void;
  togglePreviewMode: (isPreviewMode: boolean) => void;
}) {
  const [fileMap, setFileMap] = React.useState<Map<string, File>>(new Map());

  const form = useForm<z.infer<typeof createArticleSchema>>({
    resolver: zodResolver(createArticleSchema),
  });
  const selectedType = form.watch("type");

  useEffect(() => {
    if (article) {
      form.setValue("type", article.type);
      form.setValue("videoUrl", article.videoUrl);
      form.setValue("imageUrls", article.imageUrls);
      form.setValue("title", article.title);
      form.setValue("content", article.content);
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type") {
        form.setValue("videoUrl", "");
        form.setValue("imageUrls", []);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSetFiles = async (newFiles: File[]) => {
    console.log("handle set file ============ newFiles", newFiles);
    const toastId = toast.loading("Uploading files...");
    const newFileMap = new Map(fileMap);

    try {
      for (const file of newFiles) {
        const alreadyExists = Object.values(fileMap).some(
          (existingFile) => existingFile.name === file.name
        );

        if (alreadyExists) continue;

        const result = await storeFileInS3(file);
        console.log("Uploaded", file.name, "->", result);

        if (result) {
          newFileMap.set(
            `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${result}`,
            file
          );
        }
      }
      setFileMap(newFileMap);
      const filesArray = Array.from(newFileMap.keys());

      form.setValue("imageUrls", filesArray);
      console.log("seeting imageUrls", filesArray);
      toast.success("Files uploaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error uploading files", error);
      toast.error("Failed to upload files. Please try again.", { id: toastId });
    }

    console.log(form.getValues("imageUrls"));
    console.log(form.getValues("title"));
    console.log(form.getValues("content"));
  };

  function onSubmit(values: z.infer<typeof createArticleSchema>) {
    try {
      // if (selectedType == ArticleType.YOUTUBE && !values.videoUrl) {
      //   form.setError("videoUrl", {
      //     type: "manual",
      //     message: "Youtube URL is required",
      //   });
      //   return;
      // }

      setArticle(values);
      togglePreviewMode(true);
      console.log(values);
      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  function onError(errors: any, data: any) {
    console.error("❌ Form errors:", errors, data);
    toast.error("Please fix the errors in the form before submitting.");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6 max-w-full py-10 mx-5"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Article Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select article type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ArticleType.IMAGE_N_TEXT}>
                    Image with Text
                  </SelectItem>
                  <SelectItem value={ArticleType.YOUTUBE}>
                    Youtube Video
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType == ArticleType.YOUTUBE && (
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Paste YouTube URL here"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Images</FormLabel>
              <FormControl>
                 <FileUploader
                  value={fileMap}
                  onValueChange={setFileMap}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {fileMap &&
                      fileMap.length > 0 &&
                      fileMap.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader> 

                <ArticleAttachment />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}

        {isAttachmentRequired(selectedType) && (
          <ArticleAttachment fileMap={fileMap} setFileMap={handleSetFiles} />
        )}

        {selectedType && (
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter title"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType && (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter content"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col items-center justify-between gap-2">
          {/* <Button
            type="submit"
            variant={"ghost"}
            className="w-full bg-zinc-300 hover:bg-zinc-400"
            onClick={() => togglePreviewMode(true)}
          >
            
          </Button> */}
          {/* {selectedType && (
            <Button type="submit" className="w-full">
              Submit
            </Button>
          )} */}
          <Button
            type="submit"
            className="w-full"
            // disabled={!form.formState.isValid}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
