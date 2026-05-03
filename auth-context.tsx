import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type DiscordUser = {
  id: string;
  username: string;
  global_name: string | null;
  discriminator: string;
  avatar: string | null;
};

type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: DiscordUser }
  | { status: "unauthenticated" };

type AuthContextType = {
  auth: AuthState;
  logout: () => Promise<void>;
  avatarUrl: (user: DiscordUser) => string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const user: DiscordUser = await res.json();
          setAuth({ status: "authenticated", user });
        } else {
          setAuth({ status: "unauthenticated" });
        }
      })
      .catch(() => setAuth({ status: "unauthenticated" }));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAuth({ status: "unauthenticated" });
  };

  const avatarUrl = (user: DiscordUser) => {
    if (user.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=64`;
    }
    const index = Number(user.discriminator === "0" ? BigInt(user.id) >> BigInt(22) : parseInt(user.discriminator)) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  };

  return (
    <AuthContext.Provider value={{ auth, logout, avatarUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
