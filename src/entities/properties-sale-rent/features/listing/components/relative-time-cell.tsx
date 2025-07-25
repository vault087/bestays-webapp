import useRelativeTime from "@nkzw/use-relative-time";

interface RelativeTimeCellProps {
  date: string | null;
}

export function RelativeTimeCell({ date }: RelativeTimeCellProps) {
  const relativeTime = useRelativeTime(date ? new Date(date).getTime() : Date.now());

  if (!date) return <span className="text-muted-foreground">—</span>;

  return <span className="text-muted-foreground text-sm">{relativeTime}</span>;
}
