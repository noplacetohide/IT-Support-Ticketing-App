import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useLogin, useRegister } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function GetStarted() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  // React Query mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Mode state
  const [isLogin, setIsLogin] = useState(true);

  // Form state
  const [email, setEmail] = useState("rahul@example.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("");

  // Derived state from mutations
  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const error =
    loginMutation.error?.message ||
    registerMutation.error?.message ||
    null;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFullNameValid = name.trim().length > 0;
  const isFormValid = isEmailValid && isPasswordValid && (isLogin || isFullNameValid);

  const handleSubmit = () => {
    if (!isFormValid) return;
    console.log({isLogin, name, password, email})
    if (isLogin) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (result) => {
            login(result.token, result.user);
            navigate("/", { replace: true });
          },
        }
      );
    } else {
      registerMutation.mutate(
        { name, email, password },
        {
          onSuccess: (result) => {
            login(result.token, result.user);
            navigate("/", { replace: true });
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-background via-background to-muted/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-2">
          {/* Logo / Brand */}
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20">
           <div className="w-16 h-16 rounded-sm bg-blue-600 flex items-center justify-center shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isLogin ? t("login.title") : t("register.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? t("login.subtitle") : t("register.subtitle")}
          </CardDescription>
          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1 mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                isLogin
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("login.login")}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                !isLogin
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("register.register")}
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center animate-in fade-in slide-in-from-top-1 duration-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-foreground"
                >
                  {t("register.fullNameLabel")}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t("register.fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-base"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                {t("login.emailLabel")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-base"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                {t("login.passwordLabel")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 text-base"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={cn(
                "w-full h-11 text-sm font-semibold tracking-wide transition-all duration-300 bg-blue-600 hover:bg-blue-700 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {isLogin ? t("login.signingIn") : t("register.signingUp")}
                </span>
              ) : (
                isLogin ? t("login.signIn") : t("register.signUp")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
