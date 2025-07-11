export function DebugCard({ label, json }: { label: string; json: string | null | object }) {
  return (
    <div className="w-full max-w-md rounded-lg border bg-slate-100 p-4 dark:bg-slate-800">
      <h3 className="mb-3 text-sm font-semibold">{label}</h3>
      <div className="overflow-auto rounded border bg-white p-3 dark:bg-slate-900">
        <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify(json, null, 2)}</pre>
      </div>
    </div>
  );
}
