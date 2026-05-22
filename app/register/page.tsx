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

    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">

      <h1 className="text-xl font-bold mb-4 text-center">
        Registro de usuario
      </h1>

      {/* 📋 Formulario */}
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4"
      >

        {/* Nombre usuario */}
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) =>
            setNombreUsuario(e.target.value)
          }
          required
          className="border p-2 rounded"
        />

        {/* Correo */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
          }
          required
          className="border p-2 rounded"
        />

        {/* Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          className="border p-2 rounded"
        />

        {/* Botón */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Registrarse
        </button>

      </form>

      {/* 💬 Mensaje */}
      {message && (
        <p className="mt-4 text-center">
          {message}
        </p>
      )}
        {/* 🔗 Enlace a la página de login */}
<p className="mt-4 text-center">
¿Ya tienes cuenta?{" "}
<button
onClick={() => router.push("/login")}
className="text-blue-600 underline"
>
Inicia sesión aquí
</button>
</p>
    </div>
  );
}