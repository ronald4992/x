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
setMessage("✅ Bienvenido, sesión iniciada correctamente.");
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
<div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg
shadow">
<h1 className="text-xl font-bold mb-4 text-center">Inicio de
sesión</h1>
{/* 📋 Al enviar el formulario se ejecuta handleLogin */}
<form onSubmit={handleLogin} className="flex flex-col gap-4">
{/* Campo para el correo */}
<input
type="email"
placeholder="Correo electrónico"
value={correo}

onChange={(e) => setCorreo(e.target.value)} // 🔄 Actualiza elestado
required
className="border p-2 rounded"
/>
{/* Campo para la contraseña */}
<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e) => setPassword(e.target.value)} // 🔄 Actualizael estado
required
className="border p-2 rounded"
/>
<button type="submit" className="bg-green-600 text-white p-2
rounded">
Iniciar sesión
</button>
</form>
{/* 💬 Mostramos mensajes de éxito o error */}
{message && <p className="mt-4 text-center">{message}</p>}
<p className="mt-4 text-center">
¿No tienes cuenta?{" "}
<button
onClick={() => router.push("/register")}
className="text-blue-600 underline"
>
Regístrate aquí
</button>
</p>
</div>
);
}