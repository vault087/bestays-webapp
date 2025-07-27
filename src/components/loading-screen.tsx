import { LoaderOne } from "./ui/loader";

interface LoadingScreenProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingScreen({ message = "Loading...", size = "lg" }: LoadingScreenProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoaderOne size={size} className="text-primary" />
        {message && <p className="text-muted-foreground text-sm font-medium">{message}</p>}
      </div>
    </div>
  );
}
