"use client";

// 👆 Este componente se ejecuta en el navegador (cliente)

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Usuario {
  id: string;
  nombre_usuario: string;
  correo: string;
  foto_perfil: string | null;
  biografia: string | null;
}

export default function UsuarioPage() {

  // 🧠 Estados
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [nombreUsuario, setNombreUsuario] =
    useState<string>("");

  const [fotoPerfil, setFotoPerfil] =
    useState<string>("");

  const [biografia, setBiografia] =
    useState<string>("");

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);
const [message, setMessage] = useState<string | null>(null);
const router = useRouter();
// 🚪 Función opcional: cerrar sesión -> antes del return
const handleLogout = async () => {
await supabase.auth.signOut();

router.push("/login");
};
useEffect(() => {
const checkUser = async () => {
const { data } = await supabase.auth.getUser();
if (!data.user) {
// ❌ No hay usuario logueado → redirige a login
router.push("/login");
} else {
// ✅ Usuario logueado, seguimos con la página
setLoading(false);
}
};
checkUser();
}, [router]);
  // 🚀 Obtener usuario logueado
  const fetchUsuario = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      setMensaje(
        "⚠️ No hay usuario logueado"
      );

      setLoading(false);

      return;
    }

    // 🔍 Buscar usuario en tabla usuarios
    const { data, error } = await supabase
      .from("usuarios")
      .select(`
        id,
        nombre_usuario,
        correo,
        foto_perfil,
        biografia
      `)
      .eq("id", user.id)
      .single();

    if (error) {

      console.error(
        "❌ Error al cargar usuario:",
        error.message
      );

      setMensaje(
        "❌ No se encontró el usuario"
      );

    } else if (data) {

      setUsuario(data);

      setNombreUsuario(
        data.nombre_usuario
      );

      setFotoPerfil(
        data.foto_perfil || ""
      );

      setBiografia(
        data.biografia || ""
      );
    }

    setLoading(false);
  };

  // ⚙️ Actualizar perfil
  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!usuario) return;

    const { error } = await supabase
      .from("usuarios")
      .update({
        nombre_usuario: nombreUsuario,
        foto_perfil: fotoPerfil,
        biografia,
      })
      .eq("id", usuario.id);

    if (error) {

      setMensaje(
        "❌ Error al actualizar: "
        + error.message
      );

    } else {

      setMensaje(
        "✅ Perfil actualizado correctamente"
      );

      fetchUsuario();
    }
  };

  // 🚀 Cargar usuario al iniciar
  useEffect(() => {
    fetchUsuario();
  }, []);

  // ⏳ Loading
  if (loading) {

    return (
      <p className="text-center">
        ⏳ Cargando...
      </p>
    );
  }

  // 🎨 Interfaz
  return (

    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">

      <h1 className="text-2xl font-bold mb-4 text-center">
        Mi Perfil
      </h1>

      {usuario ? (

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-4"
        >

          {/* Nombre usuario */}
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) =>
              setNombreUsuario(
                e.target.value
              )
            }
            placeholder="Nombre de usuario"
            required
            className="border p-2 rounded"
          />

          {/* Foto perfil */}
          <input
            type="text"
            value={fotoPerfil}
            onChange={(e) =>
              setFotoPerfil(
                e.target.value
              )
            }
            placeholder="URL foto perfil"
            className="border p-2 rounded"
          />

          {/* Biografía */}
          <textarea
            value={biografia}
            onChange={(e) =>
              setBiografia(
                e.target.value
              )
            }
            placeholder="Biografía"
            className="border p-2 rounded"
          />

          {/* Correo */}
          <input
            type="email"
            value={usuario.correo}
            readOnly
            className="border p-2 rounded bg-gray-100 text-gray-600"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Guardar cambios
          </button>

        </form>

      ) : (

        <p className="text-center text-gray-600">
          {mensaje}
        </p>
      )}

      {mensaje && (

        <p className="mt-4 text-center text-gray-700 font-medium">
          {mensaje}
        </p>
      )}
      <button
onClick={handleLogout}
className="bg-gray-400 text-white p-2 rounded mt-4 w-full"
>
Cerrar sesión
</button>
    
    </div>
  );
}