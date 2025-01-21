"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { useTranslations } from "next-intl";

const LoginForm = () => {
  const t = useTranslations("Login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //a validateForm function
  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (!email) {
      setEmailError(t("emailRequired"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("invalidEmail"));
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError(t("passwordRequired"));
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending request to backend...");

      // Get the token from localStorage (if already present)
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.50.142:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token here
          },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();

      console.log("Backend response:", data);

      if (response.ok && data.token) {
        // Store the token securely in localStorage
        localStorage.setItem("token", data.token);

        // Check if the user is authorized (username matches "Merge")
        if (data.user.username === "Merge") {
          router.push("/dashboard"); // Redirect to dashboard
        } else {
          setError("Unauthorized access.");
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during login:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("login")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("emailAndPass")}</p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : t("loginSubmite")}
            </Button>
            <div className="flex justify-between gap-1 text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                {t("forgetPass")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
