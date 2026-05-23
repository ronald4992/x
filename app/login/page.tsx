"use client";
// 👆 Este componente se ejecuta del lado del cliente (navegador)
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
// 👆 Importamos React y el cliente de Supabase que configuramos en/lib
export default function LoginPage() {
    const [loading, setLoading] = useState(true);
const router = useRouter();
// 📦 Estados tipados con TypeScript
const [correo, setCorreo] = useState<string>("");

const [password, setPassword] = useState<string>("");
const [message, setMessage] = useState<string | null>(null);
// ⚙️ Esta función se ejecuta cuando el usuario envía el formulario delogin
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault(); // 👈 Evita que el formulario recargue la página
// 🚀 1️⃣Autenticar usuario con Supabase (email y contraseña)
const { data, error } = await supabase.auth.signInWithPassword({
email:correo,
password,
});
// 🧩 Si hay error en la autenticación, mostramos el mensaje
if (error) {
setMessage("❌ Error al iniciar sesión: " + error.message);
return;
}
// ✅ Si el login es exitoso, guardamos el usuario en sesión
if (data.user) { //data.user es parte de supabase
  setMessage(
    "✅ Bienvenido, sesión iniciada correctamente."
  );

  setTimeout(() => {
    router.push("/mvp");
  }, 500);
} else {
setMessage("⚠️ No se encontró el usuario. Intenta de nuevo.");
}
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
<div className="login-page">
    <div className="login-card">

      <div className="x-logo">X</div>

      <h1 className="login-title">Inicia sesión en X</h1>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="login-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />

        <button type="submit" className="login-button">
          Iniciar sesión
        </button>
      </form>

      {message && <p className="login-message">{message}</p>}

      <p className="login-register">
        ¿No tienes cuenta?
      </p>

      <button
        onClick={() => router.push("/register")}
        className="register-link"
      >
        Crear cuenta
      </button>

    </div>
  </div>
);
}