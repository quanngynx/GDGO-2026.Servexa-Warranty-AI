import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@servexa-warranty-ai/ui/components/card";
import { SignUpForm } from "./components/sign-up-form";
import { useTranslation } from "react-i18next";

export function SignUp() {
    const { t } = useTranslation();
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          {t("Create an account")}</CardTitle>
        <CardDescription>
          {t("Enter your email and password to create an account.")}<br />
          {t("Already have an account?")}{" "}
          <Link
            to="/sign-in"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("Sign In")}</Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t("By creating an account, you agree to our")}{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("Terms of Service")}</a>{" "}
          {t("and")}{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("Privacy Policy")}</a>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
