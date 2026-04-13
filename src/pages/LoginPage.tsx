import React, { useState } from "react";
import { authenticate, login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../images/Logo.png";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticate(email, password)) {
      login();
      onLogin();
    } else {
      setError("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-700/25 blur-3xl" />

      <div className="w-full max-w-sm mx-4 rounded-2xl bg-gradient-to-b from-purple-500/45 to-transparent p-[1px]">
        <div className="premium-glass-card rounded-2xl p-6">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo Lexin" className="h-16 w-auto mb-3" />
          <p className="text-sm text-muted-foreground mt-1">Entre para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-black/30 border-purple-300/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black/30 border-purple-300/20"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full shadow-[0_0_16px_rgba(168,85,247,0.35)]">
            Entrar
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
