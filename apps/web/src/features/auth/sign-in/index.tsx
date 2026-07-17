import { UserAuthForm } from "./components/user-auth-form";

export function SignIn() {
  return (
    <>
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
    </>
  );
}
