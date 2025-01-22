"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const t = useTranslations("ResetPassword");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://192.168.50.142:3000/api/auth/reset?token=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.push("/login?reset=success");
      } else {
        setError(data.message || t("resetError"));
      }
    } catch (error) {
      setError(t("resetError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("resetPassword")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("enterNewPassword")}
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("newPassword")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {!passwordsMatch && confirmPassword !== "" && (
                <p className="text-red-500 text-sm">{t("passwordMismatch")}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || !passwordsMatch || !password || !confirmPassword
              }
            >
              {isLoading ? t("resetting") : t("resetPassword")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
