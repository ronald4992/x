"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// =========================
// TIPOS
// =========================

interface Usuario {
  id: string;
  nombre_usuario: string;
  correo: string;
  foto_perfil: string | null;
  biografia: string | null;
}

interface Publicacion {
  id: string;
  contenido: string;
  imagen: string | null;
  creado_en: string;
  usuario: Usuario[] | Usuario | null;
}

export default function AdminPage() {

  const router = useRouter();

  const [publicaciones, setPublicaciones] =
    useState<Publicacion[]>([]);

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState<string>("");

  // =========================
  // VERIFICAR ADMIN
  // =========================

  useEffect(() => {

    const verificarAdmin = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ❌ No logueado
      if (!user) {

        router.push("/login");

        return;
      }

      // ❌ No autorizado
      if (
        user.email !==
        "julian.lozanoh@uniagustinan.edu.co"
      ) {

        router.push("/login");

        return;
      }

      // ✅ Admin autorizado
      await fetchUsuarios();

      await fetchPublicaciones();

      setLoading(false);
    };

    verificarAdmin();

  }, [router]);

  // =========================
  // OBTENER PUBLICACIONES
  // =========================

  const fetchPublicaciones = async () => {

    const { data, error } =
      await supabase
        .from("publicaciones")
        .select(`
          id,
          contenido,
          imagen,
          creado_en,
          usuario:usuarios!usuario_id(
            id,
            nombre_usuario,
            correo,
            foto_perfil,
            biografia
          )
        `)
        .order("creado_en", {
          ascending: false,
        });

    if (error) {

      console.log(error.message);

      setMessage(
        "❌ Error al cargar publicaciones"
      );

    } else if (data) {

      setPublicaciones(data);
    }
  };

  // =========================
  // OBTENER USUARIOS
  // =========================

  const fetchUsuarios = async () => {

    const { data, error } =
      await supabase
        .from("usuarios")
        .select("*")
        .order("nombre_usuario", {
          ascending: true,
        });

    if (error) {

      console.log(error.message);

      setMessage(
        "❌ Error al cargar usuarios"
      );

    } else if (data) {

      setUsuarios(data);
    }
  };

  // =========================
  // ACTUALIZAR USUARIO
  // =========================

  const actualizarUsuario = async (
    id: string,
    nombre_usuario: string,
    foto_perfil: string | null,
    biografia: string | null
  ) => {

    const { error } =
      await supabase
        .from("usuarios")
        .update({
          nombre_usuario,
          foto_perfil,
          biografia,
        })
        .eq("id", id);

    if (error) {

      setMessage(
        "❌ Error al actualizar usuario: "
        + error.message
      );

    } else {

      setMessage(
        "✅ Usuario actualizado"
      );

      fetchUsuarios();

      fetchPublicaciones();
    }
  };

  // =========================
  // ELIMINAR PUBLICACION
  // =========================

  const eliminarPublicacion = async (
    id: string
  ) => {

    const { error } =
      await supabase
        .from("publicaciones")
        .delete()
        .eq("id", id);

    if (error) {

      setMessage(
        "❌ Error al eliminar publicación"
      );

    } else {

      setMessage(
        "✅ Publicación eliminada"
      );

      fetchPublicaciones();
    }
  };

  // =========================
  // HELPERS
  // =========================

  const nombreUsuarioDe = (
    usuario: Usuario[] | Usuario | null
  ) => {

    if (!usuario)
      return "Usuario no encontrado";

    if (Array.isArray(usuario)) {

      return (
        usuario[0]?.nombre_usuario
        ?? "Usuario no encontrado"
      );
    }

    return (
      usuario.nombre_usuario
      ?? "Usuario no encontrado"
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <p className="text-center mt-10">
        ⏳ Cargando datos...
      </p>
    );
  }

  // =========================
  // INTERFAZ
  // =========================

  return (

    <div className="max-w-7xl mx-auto mt-10 p-6 space-y-10">

      <h1 className="text-3xl font-bold text-center">
        Panel Administrativo
      </h1>

      {message && (

        <p className="text-center text-green-600">
          {message}
        </p>
      )}

      {/* ========================= */}
      {/* PUBLICACIONES */}
      {/* ========================= */}

      <section>

        <h2 className="text-2xl font-semibold mb-4">
          Publicaciones
        </h2>

        <table className="w-full border-collapse border">

          <thead>

            <tr className="bg-gray-200">

              <th className="border p-2">
                Usuario
              </th>

              <th className="border p-2">
                Contenido
              </th>

              <th className="border p-2">
                Imagen
              </th>

              <th className="border p-2">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {publicaciones.map((pub) => (

              <tr key={pub.id}>

                <td className="border p-2">
                  @{nombreUsuarioDe(pub.usuario)}
                </td>

                <td className="border p-2">
                  {pub.contenido}
                </td>

                <td className="border p-2">

                  {pub.imagen && (

                    <img
                      src={pub.imagen}
                      alt="post"
                      className="w-20 h-20 object-cover"
                    />
                  )}

                </td>

                <td className="border p-2">

                  <button
                    onClick={() =>
                      eliminarPublicacion(pub.id)
                    }
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>

      {/* ========================= */}
      {/* USUARIOS */}
      {/* ========================= */}

      <section>

        <h2 className="text-2xl font-semibold mb-4">
          Usuarios
        </h2>

        <table className="w-full border-collapse border">

          <thead>

            <tr className="bg-gray-200">

              <th className="border p-2">
                Usuario
              </th>

              <th className="border p-2">
                Correo
              </th>

              <th className="border p-2">
                Foto
              </th>

              <th className="border p-2">
                Biografía
              </th>

              <th className="border p-2">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {usuarios.map((user) => (

              <tr key={user.id}>

                <td className="border p-2">

                  <input
                    type="text"
                    value={user.nombre_usuario}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((u) =>
                          u.id === user.id
                            ? {
                                ...u,
                                nombre_usuario:
                                  e.target.value,
                              }
                            : u
                        )
                      )
                    }
                    className="border p-1 w-full"
                  />

                </td>

                <td className="border p-2">
                  {user.correo}
                </td>

                <td className="border p-2">

                  <input
                    type="text"
                    value={user.foto_perfil ?? ""}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((u) =>
                          u.id === user.id
                            ? {
                                ...u,
                                foto_perfil:
                                  e.target.value,
                              }
                            : u
                        )
                      )
                    }
                    className="border p-1 w-full"
                  />

                </td>

                <td className="border p-2">

                  <textarea
                    value={user.biografia ?? ""}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((u) =>
                          u.id === user.id
                            ? {
                                ...u,
                                biografia:
                                  e.target.value,
                              }
                            : u
                        )
                      )
                    }
                    className="border p-1 w-full"
                  />

                </td>

                <td className="border p-2">

                  <button
                    onClick={() =>
                      actualizarUsuario(
                        user.id,
                        user.nombre_usuario,
                        user.foto_perfil,
                        user.biografia
                      )
                    }
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Guardar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>

    </div>
  );
}