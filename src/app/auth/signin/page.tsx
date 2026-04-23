"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка регистрации");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
              П
            </div>
            <span className="text-2xl font-bold">Пыль в глаза</span>
          </Link>
          <h1 className="text-2xl font-bold">
            {isLogin ? "Вход в аккаунт" : "Регистрация"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Войдите для доступа к личному кабинету" : "Создайте аккаунт"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* OAuth buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("yandex", { callbackUrl: "/profile" })}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.19 15.93V14.4h-.87L9.62 17.93H7.85l3.02-3.87c-1.59-.32-2.59-1.44-2.59-3.16 0-2.15 1.44-3.47 3.65-3.47H14.8v10.5h-1.61zm0-5.83V9.57h-.96c-1.3 0-2.17.72-2.17 1.87 0 1.08.72 1.73 1.96 1.73h1.17v-.07z" />
              </svg>
              Войти через Яндекс
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("vk", { callbackUrl: "/profile" })}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.368 1.259 2.184 1.814.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.6-.964c-.044-.073-.316-.661-1.624-1.869-1.37-1.264-1.186-1.06.463-3.249.764-1.012 1.07-1.63.974-1.895-.092-.254-.656-.187-.656-.187l-2.452.015s-.182-.025-.316.056c-.132.079-.216.264-.216.264s-.388 1.035-.906 1.914c-1.092 1.854-1.528 1.952-1.706 1.837-.416-.268-.312-1.078-.312-1.653 0-1.797.272-2.547-.532-2.742-.266-.065-.463-.107-1.146-.114-.874-.01-1.614.003-2.033.208-.278.137-.493.44-.362.458.162.022.528.099.722.363.25.34.242 1.108.242 1.108s.144 2.117-.336 2.38c-.33.18-.782-.188-1.754-1.87-.497-.86-.872-1.814-.872-1.814s-.072-.177-.2-.272c-.156-.115-.374-.15-.374-.15l-2.33.015s-.35.01-.478.163c-.114.135-.009.416-.009.416s1.826 4.272 3.894 6.426c1.896 1.975 4.05 1.845 4.05 1.845h.975z" />
              </svg>
              Войти через ВКонтакте
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted">или</span>
            </div>
          </div>

          {/* Credentials form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Имя</label>
                <Input
                  placeholder="Иван"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Пароль</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="w-4 h-4 mr-2" />
              {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-accent hover:text-accent-hover transition-colors cursor-pointer"
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
