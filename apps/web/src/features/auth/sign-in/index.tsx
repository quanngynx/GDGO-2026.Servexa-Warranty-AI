import { Logo } from "@/assets/logo";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import bgDark from "./assets/background-dark.png";
import bgLight from "./assets/background.png";
import { UserAuthForm } from "./components/user-auth-form";

export function SignIn() {
  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="absolute left-2 top-2 z-20 flex items-center md:left-8 md:top-8">
        <Logo className="me-2" />
        <h1 className="text-xl font-bold">Servexa Warranty AI</h1>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-2">
          <div className="flex flex-col space-y-2 text-start">
            <h2 className="text-xl font-semibold tracking-tight">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">
              Enter your username and password below <br />
              to log into your account
            </p>
          </div>
          <UserAuthForm />
          {/* <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking sign in, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p> */}
        </div>
      </div>

      <div
        className={cn(
          "relative h-full overflow-hidden bg-muted max-lg:hidden",
          "[&>img]:absolute [&>img]:inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:select-none"
        )}
      >
        <img
          src={bgLight}
          className="dark:hidden"
          width={1024}
          height={1151}
          alt="Shadcn-Admin"
        />
        <img
          src={bgDark}
          className="hidden dark:block"
          width={1024}
          height={1138}
          alt="Shadcn-Admin"
        />
      </div>
    </div>
  );
}
