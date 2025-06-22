export function getThumbnailFromYouTube(
  url?: string | null
): string | undefined {
  if (!url) return;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (!match) return;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}
