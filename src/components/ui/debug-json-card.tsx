export function DebugCard({ label, json }: { label: string; json: string | null | object }) {
  return (
    <div className="bg-background w-full max-w-md rounded-lg border p-4">
      <h3 className="mb-3 text-sm font-semibold">{label}</h3>
      <div className="overflow-auto rounded border p-3 dark:bg-slate-900">
        <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify(json, null, 2)}</pre>
      </div>
    </div>
  );
}
