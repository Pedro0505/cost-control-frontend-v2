"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, register, loading } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            if (!email || !password) return;
            await login({ email, password });
        } else {
            if (!username || !email || !password) return;
            const success = await register({ username, email, password });
            if (success) {
                toast.success("Conta criada com sucesso! Faça login para continuar.");
                setIsLogin(true);
                setPassword("");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
            <Card className="w-full max-w-md bg-white shadow-sm border-slate-100 rounded-2xl overflow-hidden">
                <CardHeader className="space-y-1 text-center border-b border-slate-50 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        {isLogin ? "Acessar Conta" : "Criar Nova Conta"}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {isLogin
                            ? "Informe suas credenciais para entrar no sistema"
                            : "Preencha os campos abaixo para se cadastrar"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="username">Nome de usuário</Label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="seu_usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-9"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-800 hover:bg-slate-900 h-10 rounded-lg mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isLogin ? (
                                "Entrar"
                            ) : (
                                "Cadastrar"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-indigo-600 hover:underline font-medium"
                        >
                            {isLogin
                                ? "Não tem uma conta? Cadastre-se"
                                : "Já possui uma conta? Faça login"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}