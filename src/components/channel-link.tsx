export const CHANNEL_URL = "https://www.youtube.com/@gitship_sauce";

export function ChannelLink({ children = "Gitship Sauce" }: { children?: React.ReactNode }) {
  return (
    <a href={CHANNEL_URL} target="_blank" rel="noopener" className="font-semibold text-ink underline decoration-2 underline-offset-2">
      {children}
    </a>
  );
}
