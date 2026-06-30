import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@servexa-warranty-ai/ui/components/card";
import { Logo } from "@/assets/logo";
import bgLight from "./assets/background.png";
import bgDark from "./assets/background-dark.png";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export function ForgotPassword() {
  return (
    <div className="relative flex h-svh w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={bgLight}
          className="h-full w-full object-cover dark:hidden"
          alt="Background"
        />
        <img
          src={bgDark}
          className="hidden h-full w-full object-cover dark:block"
          alt="Background"
        />
      </div>

      <div className="absolute left-4 top-4 z-20 flex items-center md:left-8 md:top-8 text-foreground">
        <Logo className="me-2" />
        <h1 className="text-white text-xl font-bold">Servexa Warranty AI</h1>
      </div>

      <div className="z-10 w-full max-w-sm px-4 md:px-0">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your registered email and <br /> we will send you a link to
              reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
          <CardFooter>
            <p className="mx-auto px-8 text-center text-sm text-balance text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
