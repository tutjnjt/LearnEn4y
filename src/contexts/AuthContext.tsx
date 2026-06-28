import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserProfile {
  uid: string;
  email: string;
  role: "user" | "admin" | "demo";
  stars: number;
  points: number;
  completedLevels: Record<string, boolean>;
  gameStars: Record<string, Record<string, number>>;
  playTime: number;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Initialize profile
          const isDemo = user.email === "demo@en4bun.vn";
          const isAdmin = user.email === "admin@en4bun.vn";
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            role: isAdmin ? "admin" : isDemo ? "demo" : "user",
            stars: 0,
            points: 0,
            completedLevels: {},
            gameStars: {},
            playTime: 0,
            avatar: "👧"
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfileData = async (updater: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)) => {
    if (!user) return;
    
    let newData: Partial<UserProfile> = {};
    
    setProfile(prev => {
      if (!prev) return prev;
      newData = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...newData };
    });

    if (Object.keys(newData).length > 0) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, newData, { merge: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, updateProfileData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

