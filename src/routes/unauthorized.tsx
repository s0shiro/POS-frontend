import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-5xl font-bold text-foreground">403</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact your manager if you believe this is an error.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
