import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getIdTokenResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return undefined; }
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const token = await getIdTokenResult(currentUser);
        setIsAdmin(token.claims.admin === true);
      } catch (_error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo(() => ({ user, isAdmin, loading, logout: () => auth ? signOut(auth) : Promise.resolve() }), [user, isAdmin, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
