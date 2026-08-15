import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@servexa-warranty-ai/ui/components/card";
import { ForgotPasswordForm } from "./components/forgot-password-form";
import { useTranslation } from "react-i18next";

export function ForgotPassword() {
    const { t } = useTranslation();
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          {t("Forgot Password")}</CardTitle>
        <CardDescription>
          {t("Enter your registered email and")}<br /> {t("we will send you a link to\n reset your password.")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter>
        <p className="mx-auto px-8 text-center text-sm text-balance text-muted-foreground">
          {t("Don\'t have an account?")}{" "}
          <Link
            to="/sign-up"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("Sign up")}</Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
