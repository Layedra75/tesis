const usuarioController = require("./UserController");
const pacienteController = require("./pacienteController");

//Vista principal
const vistaPrincipal = (req, res) => {
  res.render("pages/dashboard", { alert: false });
};

//Vista Citas Medicas
const citasMedicas = (req, res) => {
  pacienteController.obtenerListaPacientes((errorPacientes, pacientes) => {
    if (errorPacientes) {
      console.error("Error al obtener la lista de pacientes:", errorPacientes);
      res.status(500).send("Error al obtener la lista de pacientes");
    } else {
      usuarioController.obtenerListaUsuarios((errorUsuarios, usuarios) => {
        if (errorUsuarios) {
          console.error(
            "Error al obtener la lista de usuarios:",
            errorUsuarios
          );
          res.status(500).send("Error al obtener la lista de usuarios");
        } else {
          // Filtrar solo los usuarios con rol "doctor"
          const doctores = usuarios.filter(
            (usuario) => usuario.rol === "doctor"
          );
          res.render("pages/citas", { pacientes, doctores, alert: false });
        }
      });
    }
  });
};

//Vista lista de pacientes
const vistaPacientes = (req, res) => {
  pacienteController.obtenerListaPacientes((error, pacientes) => {
    if (error) {
      console.error("Error al obtener la lista de pacientes:", error);
      res.status(500).send("Error al obtener la lista de pacientes");
    } else {
      res.render("pages/pacientes", { pacientes, alert: false });
    }
  });
};

//Vista lista de usuarios(Trabajadores)
const vistaUsuarios = (req, res) => {
  usuarioController.obtenerListaUsuarios((error, usuarios) => {
    if (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      res.status(500).send("Error al obtener la lista de usuarios");
    } else {
      res.render("pages/usuarios", { usuarios, alert: false });
    }
  });
};

module.exports = {
  vistaPrincipal,
  vistaPacientes,
  vistaUsuarios,
  citasMedicas,
};
