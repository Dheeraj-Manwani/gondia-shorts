"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
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

import { Textarea } from "@/components/ui/textarea";
import { CreateArticle, createArticleSchema } from "@/db/schema/article";
import { ArticleType } from "@prisma/client/index.js";
import { isAttachmentRequired, isVideoRequired } from "@/lib/utils";
import { MultiFilepnd } from "./Attachment";
import { VideoAttachment } from "./VideoAttachment";

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
  console.log("fileMap", fileMap);
  const [files, setFiles] = React.useState<string[]>([]);
  const [uploadedVideoUrl, setUploadedVideoUrl] = React.useState<string>("");

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

      if (article.imageUrls && article.imageUrls.length > 0) {
        setFiles(article.imageUrls);
        console.log(
          "article.imageUrls inside useefffff ========== ",
          article.imageUrls
        );
        const newFileMap = new Map();
        article.imageUrls.forEach((url) => {
          const fileName = url.split("_")[0] || url;
          newFileMap.set(url, new File([], fileName));
        });
        setFileMap(newFileMap);
      }
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type") {
        form.setValue("videoUrl", "");
        form.setValue("imageUrls", []);
        setUploadedVideoUrl("");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // const handleSetFiles = async (newFiles: File[]) => {
  //   const toastId = toast.loading("Uploading files...");
  //   const newFileMap = new Map(fileMap);

  //   try {
  //     for (const file of newFiles) {
  //       const alreadyExists = Object.values(fileMap).some(
  //         (existingFile) => existingFile.name === file.name
  //       );

  //       if (alreadyExists) continue;

  //       const result = await storeFileInS3(file);
  //       console.log("Uploaded", file.name, "->", result);

  //       if (result) {
  //         newFileMap.set(
  //           `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${result}`,
  //           file
  //         );
  //       }
  //     }
  //     setFileMap(newFileMap);
  //     const filesArray = Array.from(newFileMap.keys());

  //     form.setValue("imageUrls", filesArray);
  //     toast.success("Files uploaded successfully", { id: toastId });
  //   } catch (error) {
  //     console.error("Error uploading files", error);
  //     toast.error("Failed to upload files. Please try again.", { id: toastId });
  //   }

  //   console.log(form.getValues("imageUrls"));
  //   console.log(form.getValues("title"));
  //   console.log(form.getValues("content"));
  // };

  const handleSetFiles = async (newFiles: string[]) => {
    setFiles(newFiles);
    form.setValue("imageUrls", newFiles);
  };

  const handleUploadedVideoUrl = (url: string) => {
    setUploadedVideoUrl(url);
    form.setValue("videoUrl", url);
  };

  function onSubmit(values: z.infer<typeof createArticleSchema>) {
    try {
      // Handle video URL - prioritize uploaded video over YouTube URL
      let finalVideoUrl = values.videoUrl;
      if (uploadedVideoUrl && isVideoRequired(selectedType)) {
        finalVideoUrl = uploadedVideoUrl;
      }

      const finalValues = {
        ...values,
        imageUrls: files,
        videoUrl: finalVideoUrl,
      };
      console.log("finalValues", finalValues);

      setArticle(finalValues);
      togglePreviewMode(true);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  // const onInvalid = (inv: any) => {
  //   console.log("inv ===== ", inv);
  // };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-full pt-4 mx-5"
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
                  <SelectItem value={ArticleType.FULL_IMAGE}>
                    Only Image (Full Verticle)
                  </SelectItem>
                  <SelectItem value={ArticleType.FULL_VIDEO}>
                    Only Video (Full Verticle)
                  </SelectItem>
                  <SelectItem value={ArticleType.IMAGE_N_TEXT}>
                    Image with Text
                  </SelectItem>
                  <SelectItem value={ArticleType.VIDEO_N_TEXT}>
                    Video with Text
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

        {isVideoRequired(selectedType) && (
          <FormItem>
            <VideoAttachment
              label="Upload Video File (max 100MB)"
              videoUrl={uploadedVideoUrl}
              setVideoUrl={handleUploadedVideoUrl}
            />
          </FormItem>
        )}

        {isAttachmentRequired(selectedType) && (
          <FormItem>
            {/* <ArticleAttachment fileMap={fileMap} setFileMap={handleSetFiles} /> */}
            {/* <FormLabel>Images</FormLabel> */}
            <MultiFilepnd
              label="Add Images (max 6 files, up to 5MB each)"
              src={files}
              setSrc={handleSetFiles}
            />
          </FormItem>
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
