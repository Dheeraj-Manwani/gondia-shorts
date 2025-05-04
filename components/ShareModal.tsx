import { Article } from "@/db/schema/news";
import React, { useState, useEffect } from "react";

interface ShareModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;

  useEffect(() => {
    // Generate a shareable URL for the article
    const url = `${baseUrl}/article/${article.id}`;
    setShareUrl(url);
  }, [article, baseUrl]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const handleShare = (platform: string) => {
    let shareLink = "";
    const text = `Check out this article: ${article.title}`;

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          text + " " + shareUrl
        )}`;
        break;
      case "telegram":
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }

    window.open(shareLink, "_blank");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Share</h2>
          <button
            onClick={onClose}
            className="text-gray-700 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close share dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Article preview */}
        <div className="flex items-start space-x-3 mb-6 pb-4 border-b border-gray-200">
          {article.imageUrls && (
            <img
              src={article.imageUrls[0]}
              alt={article.title}
              className="w-16 h-16 object-cover rounded-md"
            />
          )}
          <div>
            <h3 className="font-medium text-sm line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{article.sourceText}</p>
          </div>
        </div>

        {/* Share URL */}
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 border rounded-l-lg px-3 py-2 text-sm bg-gray-50"
          />
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-blue-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Share platforms */}
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => handleShare("twitter")}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#1DA1F2] rounded-full text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </div>
            <span className="text-xs">Twitter</span>
          </button>

          <button
            onClick={() => handleShare("facebook")}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#1877F2] rounded-full text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.62v-7h-2.35v-2.69h2.35v-2a3.27 3.27 0 0 1 3.49-3.59c.99 0 1.84.07 2.09.1v2.42h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69l-.35 2.69h-2.34V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
              </svg>
            </div>
            <span className="text-xs">Facebook</span>
          </button>

          <button
            onClick={() => handleShare("whatsapp")}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#25D366] rounded-full text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.6 14.1c-.3-.15-1.6-.8-1.85-.9-.25-.1-.45-.15-.65.15s-.7.9-.85 1.05c-.15.15-.3.18-.6.03a7.36 7.36 0 0 1-2.2-1.35c-.8-.7-1.35-1.55-1.5-1.85-.15-.3 0-.45.1-.6.13-.13.3-.35.45-.5.15-.17.2-.3.3-.5.1-.2.05-.35-.03-.5-.08-.15-.65-1.55-.9-2.13-.24-.57-.48-.48-.65-.48-.15 0-.35-.02-.5-.02-.2 0-.5.07-.75.35-.26.29-1 .98-1 2.4s1.03 2.77 1.17 2.98c.15.2 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.73.53-.05 1.7-.7 1.95-1.38.25-.66.25-1.23.18-1.35-.07-.1-.27-.18-.57-.33m-5.55 7.65a9.82 9.82 0 0 1-5-1.37l-.35-.22-3.7.97.99-3.62-.24-.38a9.8 9.8 0 0 1-1.5-5.26c0-5.45 4.43-9.88 9.88-9.88 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.92 7.01c0 5.45-4.43 9.87-9.9 9.87m8.4-18.25A11.78 11.78 0 0 0 11.07 0 11.94 11.94 0 0 0 0 11.88c0 2.1.54 4.15 1.58 5.95L0 24l6.3-1.65c1.73.93 3.7 1.43 5.72 1.43h.01c6.55 0 11.89-5.33 11.89-11.88 0-3.18-1.23-6.17-3.48-8.42" />
              </svg>
            </div>
            <span className="text-xs">WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare("telegram")}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#0088cc] rounded-full text-white mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.62-2.4 2.68-2.6.01-.04.01-.19-.08-.27-.09-.08-.21-.05-.3-.03-.13.03-2.2 1.4-6.22 4.12-.59.4-1.12.6-1.6.58-.53-.02-1.54-.3-2.3-.55-.93-.31-1.67-.47-1.6-1 .03-.25.35-.5.96-.76 3.74-1.63 6.24-2.7 7.5-3.23 3.57-1.5 4.3-1.76 4.8-1.77.1 0 .35.02.5.15.12.1.2.25.22.41.01.17.02.27 0 .4z" />
              </svg>
            </div>
            <span className="text-xs">Telegram</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
