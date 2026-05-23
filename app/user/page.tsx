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

  <div className="profile-page">

    <div className="profile-card">

      <div className="profile-header">

       <div className="profile-avatar">
  {fotoPerfil ? (
    <img
      src={fotoPerfil}
      alt="Foto de perfil"
      className="profile-avatar-image"
    />
  ) : (
    nombreUsuario?.charAt(0)?.toUpperCase() || "U"
  )}
</div>

        <h1 className="profile-title">
          Mi Perfil
        </h1>

      </div>

      {usuario ? (

        <form
          onSubmit={handleUpdate}
          className="profile-form"
        >

          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) =>
              setNombreUsuario(e.target.value)
            }
            placeholder="Nombre de usuario"
            required
            className="profile-input"
          />

          <input
            type="text"
            value={fotoPerfil}
            onChange={(e) =>
              setFotoPerfil(e.target.value)
            }
            placeholder="URL de foto de perfil"
            className="profile-input"
          />

          <textarea
            value={biografia}
            onChange={(e) =>
              setBiografia(e.target.value)
            }
            placeholder="Biografía"
            className="profile-textarea"
          />

          <input
            type="email"
            value={usuario.correo}
            readOnly
            className="profile-email"
          />

          <button
            type="submit"
            className="save-button"
          >
            Guardar cambios
          </button>

        </form>

      ) : (

        <p className="profile-message">
          {mensaje}
        </p>

      )}

      {mensaje && (
        <p className="profile-message">
          {mensaje}
        </p>
      )}

      <button
        onClick={handleLogout}
        className="logout-button"
      >
        Cerrar sesión
      </button>

    </div>

  </div>

);
}