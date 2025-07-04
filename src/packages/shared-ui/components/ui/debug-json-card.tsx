export function DebugCard({ label, json }: { label: string; json: string | null | object }) {
  return (
    <span className="mx-auto mt-8 flex w-full flex-col rounded bg-slate-300 p-4 font-mono text-sm font-light whitespace-pre-wrap">
      {label}: {JSON.stringify(json, null, 2)}
    </span>
  );
}
