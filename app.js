const express = require("express");
const config = require("./config"); // Ruta al archivo de configuración
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = config.PORT || 3000;
const nombreArchivo = config.nombreArchivo;
const directorioDestino = config.directorioDestino;
const rutaArchivo = path.join(directorioDestino, nombreArchivo);

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Ajusta el límite según tus necesidades

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor!");
});

// async function validarPermisosCrearArchivo(rutaCarpeta) {
//   const archivoPrueba = path.join(rutaCarpeta, "archivo_prueba.txt");

//   try {
//     // Intenta abrir la carpeta
//     await fs.opendir(rutaCarpeta);

//     // Intenta crear y luego eliminar un archivo en la carpeta
//     await fs.writeFile(archivoPrueba, "contenido de prueba");
//     await fs.unlink(archivoPrueba);

//     console.log(`Tienes permisos para crear un archivo en ${rutaCarpeta}`);
//     return true;
//   } catch (error) {
//     console.log(`No tienes permisos para crear un archivo en ${rutaCarpeta}`);
//     return false;
//   }
// }

// Ruta para agregar contenido al archivo
app.post("/agregar-contenido", async (req, res) => {
  try {
    // Validar permisos para crear archivos en la carpeta destino
    // const tienePermisos = await validarPermisosCrearArchivo(directorioDestino);

    // if (!tienePermisos) {
    //   console.log(
    //     `No tienes permisos para crear archivos en ${directorioDestino}`
    //   );
    //   return res.status(403).json({
    //     mensaje: "No tienes permisos para crear archivos en la carpeta destino",
    //   });
    // }

    // Intenta acceder al archivo
    await fs.access(rutaArchivo);

    // Si el archivo existe, lee el contenido y agrega el nuevo contenido con un salto de línea
    const contenidoExistente = await fs.readFile(rutaArchivo, "utf8");
    let nuevoContenido;

    if (
      req.body.contenidoArchivo &&
      req.body.contenidoArchivo.contenidoArchivo &&
      Array.isArray(req.body.contenidoArchivo.contenidoArchivo)
    ) {
      // Usa join para unir los elementos del arreglo con saltos de línea
      nuevoContenido = `${contenidoExistente}\n${req.body.contenidoArchivo.contenidoArchivo.join(
        "\n"
      )}`;
    } else {
      nuevoContenido = contenidoExistente;
    }

    // Escribe el contenido actualizado de vuelta al archivo
    await fs.writeFile(rutaArchivo, nuevoContenido);

    console.log(`Contenido agregado al archivo ${nombreArchivo}`);

    res.status(200).json({
      mensaje: "Contenido agregado al archivo archivo_creado.txt correctamente",
    });
  } catch (error) {
    // Si el archivo no existe, crea el directorio y luego crea el archivo con el contenido proporcionado
    if (error.code === "ENOENT") {
      try {
        await fs.mkdir(directorioDestino, { recursive: true }); // Crea el directorio de forma recursiva
        await fs.writeFile(
          rutaArchivo,
          req.body.contenidoArchivo.contenidoArchivo.join("\n")
        );
        console.log(`Archivo ${nombreArchivo} creado en ${directorioDestino}`);
        res.json({
          mensaje: `Archivo ${nombreArchivo} creado correctamente`,
        });
      } catch (error) {
        console.error("Error al crear el directorio o archivo:", error);
        res.status(500).json({ error: "Error al procesar la solicitud" });
      }
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  }
});

app.post("/limpiar-y-agregar", async (req, res) => {
  try {
    // Validar permisos para crear archivos en la carpeta destino
    // const tienePermisos = await validarPermisosCrearArchivo(directorioDestino);

    // if (!tienePermisos) {
    //   console.log(
    //     `No tienes permisos para crear archivos en ${directorioDestino}`
    //   );
    //   return res.status(403).json({
    //     mensaje: "No tienes permisos para crear archivos en la carpeta destino",
    //   });
    // }

    // Intenta acceder al archivo
    await fs.access(rutaArchivo);

    // Limpiar el contenido y agregar nuevo
    if (
      req.body.contenidoArchivo &&
      req.body.contenidoArchivo.contenidoArchivo &&
      Array.isArray(req.body.contenidoArchivo.contenidoArchivo)
    ) {
      // Usa join para unir los elementos del arreglo con saltos de línea
      await fs.writeFile(
        rutaArchivo,
        req.body.contenidoArchivo.contenidoArchivo.join("\n")
      );
      console.log(
        `Contenido limpiado y reemplazado en el archivo ${nombreArchivo}`
      );
    } else {
      console.error("Error: El contenido proporcionado no es un arreglo");
      res
        .status(400)
        .json({ error: "El contenido proporcionado no es un arreglo" });
      return;
    }

    res.status(200).json({
      mensaje:
        "Contenido limpiado y reemplazado en el archivo archivo_creado.txt correctamente",
    });
  } catch (error) {
    // Si el archivo no existe, crea el directorio y luego crea el archivo con el contenido proporcionado
    if (error.code === "ENOENT") {
      try {
        await fs.mkdir(directorioDestino, { recursive: true }); // Crea el directorio de forma recursiva
        await fs.writeFile(
          rutaArchivo,
          req.body.contenidoArchivo.contenidoArchivo.join("\n")
        );
        console.log(`Archivo ${nombreArchivo} creado en ${directorioDestino}`);
        res.json({
          mensaje: `Archivo ${nombreArchivo} creado correctamente`,
        });
      } catch (error) {
        console.error("Error al crear el directorio o archivo:", error);
        res.status(500).json({ error: "Error al procesar la solicitud" });
      }
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
