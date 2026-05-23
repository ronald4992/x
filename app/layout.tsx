"use client";

import type { ReactNode } from "react";

import {
  Geist,
  Geist_Mono
} from "next/font/google";

import "./globals.css";

import {
  useEffect,
  useState
} from "react";

import { supabase }
from "@/lib/supabaseClient";

import Link from "next/link";

import { useRouter }
from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {

  const router = useRouter();

  const [user, setUser] =
    useState<any>(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  // =========================
  // VERIFICAR USUARIO
  // =========================

  useEffect(() => {

    const getUser = async () => {

      const { data } =
        await supabase.auth.getUser();

      const currentUser =
        data.user ?? null;

      setUser(currentUser);

      // ✅ Verificar admin
      if (
        currentUser?.email ===
        "julian.lozanoh@uniagustinan.edu.co"
      ) {

        setIsAdmin(true);

      } else {

        setIsAdmin(false);
      }
    };

    getUser();

    // =========================
    // ESCUCHAR LOGIN / LOGOUT
    // =========================

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {

          const currentUser =
            session?.user ?? null;

          setUser(currentUser);

          if (
            currentUser?.email ===
            "julian.lozanoh@uniagustinan.edu.co"
          ) {

            setIsAdmin(true);

          } else {

            setIsAdmin(false);
          }
        }
      );

    return () => {

      listener.subscription.unsubscribe();
    };

  }, []);

  // =========================
  // CERRAR SESIÓN
  // =========================

  const cerrarSesion = async () => {

    await supabase.auth.signOut();

    router.push("/login");
  };

  return (

    <html lang="en">

      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
      >

        {/* ========================= */}
        {/* NAVBAR */}
        {/* ========================= */}

        {user && (

         <nav className="navbar">

  <div className="navbar-logo">
    𝕏
  </div>

  <div className="navbar-links">

    {isAdmin ? (

      <Link
        href="/admin"
        className="nav-link admin-link"
      >
        Panel Admin
      </Link>

    ) : (

      <>
        <Link
          href="/mvp"
          className="nav-link"
        >
          Inicio
        </Link>

        <Link
          href="/user"
          className="nav-link"
        >
          Mi Perfil
        </Link>
      </>

    )}

  </div>

  <button
    onClick={cerrarSesion}
    className="logout-nav-button"
  >
    Cerrar sesión
  </button>

</nav>

        )}

        {/* ========================= */}
        {/* CONTENIDO */}
        {/* ========================= */}

        <main>
          {children}
        </main>

      </body>

    </html>
  );
}