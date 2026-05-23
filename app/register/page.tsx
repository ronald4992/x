"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
const [loading, setLoading] = useState(true);
const router = useRouter();
  // 📦 Estados
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  // ⚙️ Función de registro
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    // 🚀 Registro en Supabase Auth
    const { data, error } =
      await supabase.auth.signUp({
        email: correo,
        password,
      });

    // ❌ Error autenticación
    if (error) {
      setMessage(
        "❌ Error en registro: " + error.message
      );
      return;
    }

    // 🧩 Obtener ID del usuario
    const userId = data.user?.id;

    if (!userId) {
      setMessage(
        "⚠️ No se pudo obtener el ID del usuario."
      );
      return;
    }

    // 📘 Insertar en tabla usuarios
    const { error: insertError } =
      await supabase
        .from("usuarios")
        .insert([
          {
            id: userId,
            nombre_usuario: nombreUsuario,
            correo,
            password,
          },
        ]);

    // ❌ Error insertando
    if (insertError) {

      setMessage(
        "⚠️ Usuario autenticado pero no guardado en la tabla: "
        + insertError.message
      );

      return;
    }

    // ✅ Registro exitoso
    setMessage(
      "✅ Usuario registrado correctamente."
    );
  };
useEffect(() => {
const checkUser = async () => {
const { data } = await supabase.auth.getUser();
if (!data.user) {
// ✅ Usuario logueado, seguimos con la página
setLoading(false);
} else {
// ❌ No hay usuario logueado → redirige a login
router.push("/user");
}

};
checkUser();
}, [router]);
if (loading) return <p className="text-center mt-10">Verificando
sesión...</p>;
return (
  <div className="register-page">
    <div className="register-card">

      <div className="x-logo">𝕏</div>

      <h1 className="register-title">
        Crear cuenta
      </h1>

      <form
        onSubmit={handleRegister}
        className="register-form"
      >
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          required
          className="register-input"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="register-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />

        <button
          type="submit"
          className="register-button"
        >
          Registrarse
        </button>
      </form>

      {message && (
        <p className="register-message">
          {message}
        </p>
      )}

      <p className="register-login-text">
        ¿Ya tienes cuenta?
      </p>

      <button
        onClick={() => router.push("/login")}
        className="login-link"
      >
        Inicia sesión
      </button>

    </div>
  </div>
);
}