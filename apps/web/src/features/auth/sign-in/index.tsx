import { UserAuthForm } from "./components/user-auth-form";
import { useTranslation } from "react-i18next";

export function SignIn() {
    const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col space-y-2 text-start">
        <h2 className="text-xl font-semibold tracking-tight">{t("Welcome back!")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("Enter your username and password below")}<br />
          {t("to log into your account")}</p>
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
