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

          <nav className="bg-gray-100 p-4 flex gap-4 justify-center items-center">

            {/* ========================= */}
            {/* ADMIN */}
            {/* ========================= */}

            {isAdmin ? (

              <Link
                href="/admin"
                className="text-red-600 font-semibold hover:underline"
              >
                Panel Admin
              </Link>

            ) : (

              <>
                <Link
                  href="/mvp"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  MVP
                </Link>

                <Link
                  href="/user"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Mi Perfil
                </Link>
              </>

            )}

            {/* ========================= */}
            {/* LOGOUT */}
            {/* ========================= */}

            <button
              onClick={cerrarSesion}
              className="bg-red-500 text-white px-3 py-1 rounded"
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