const express = require("express");
const fs = require("fs").promises; // Usa fs.promises para admitir async/await
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const directorioDestino = "C:\\Users\\Equipo_03\\Desktop\\mi_carpeta"; // directorio donde se genera el archivo
const nombreArchivo = "archivo_creado.txt";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor!");
});

app.post("/crear-archivo", async (req, res) => {
  const rutaArchivo = path.join(directorioDestino, nombreArchivo);

  try {
    // Verifica si el archivo existe
    await fs.access(rutaArchivo);

    // Si existe, lee el contenido existente y agrega el nuevo contenido con un salto de línea
    const contenidoExistente = await fs.readFile(rutaArchivo, "utf8");
    const nuevoContenido = `${contenidoExistente}\n${req.body.contenidoArchivo}`;

    // Escribe el contenido actualizado de vuelta al archivo
    await fs.writeFile(rutaArchivo, nuevoContenido);

    console.log(`Contenido agregado al archivo ${nombreArchivo}`);

    res
      .status(200)
      .json({
        mensaje:
          "Contenido agregado al archivo archivo_creado.txt correctamente",
      });
  } catch (error) {
    // Si el archivo no existe, crea un nuevo archivo con el contenido proporcionado
    if (error.code === "ENOENT") {
      await fs.writeFile(rutaArchivo, req.body.contenidoArchivo);
      console.log(`Archivo ${nombreArchivo} creado en ${directorioDestino}`);
      res.json({ mensaje: `Archivo ${nombreArchivo} creado correctamente` });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
