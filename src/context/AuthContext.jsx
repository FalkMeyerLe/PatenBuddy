import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, signOutUser } from "@/firebase";

const ALLOWED_EMAIL =
    import.meta.env.VITE_ALLOWED_GOOGLE_EMAIL || "falkmeyerle@gmail.com";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                if (firebaseUser.email?.toLowerCase() === ALLOWED_EMAIL.toLowerCase()) {
                    setUser(firebaseUser);
                    setAuthError(null);
                } else {
                    signOutUser();
                    setUser(null);
                    setAuthError(
                        "Zugriff verweigert. Nur der autorisierte Google-Account darf sich anmelden."
                    );
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async () => {
        setAuthError(null);
        try {
            await signInWithGoogle();
        } catch (error) {
            if (error?.code !== "auth/popup-closed-by-user") {
                setAuthError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
            }
        }
    };

    const logout = async () => {
        await signOutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, authError, login, logout, isOwner: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

