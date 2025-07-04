"use client";

import { Bug } from "lucide-react";
import { useState } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/modules/shadcn/components/ui/dialog";

export function DebugCard({ label, json }: { label: string; json: string | null | object }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed right-4 bottom-4 z-40">
          <Bug className="mr-2 h-4 w-4" />
          {open ? "Hide Debug" : "Show Debug"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto rounded bg-slate-100 p-4 dark:bg-slate-800">
          <pre className="font-mono text-sm whitespace-pre-wrap">{JSON.stringify(json, null, 2)}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
