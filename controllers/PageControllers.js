const usuarioController = require("./UserController");
const pacienteController = require("./pacienteController");
const citasController = require("./citasController")

// Vista principal
const vistaPrincipal = (req, res) => {
  pacienteController.obtenerListaPacientes((errorPacientes, pacientes, numeroPacientes) => {
    if (errorPacientes) {
      console.error("Error al obtener la lista de pacientes:", errorPacientes);
      res.status(500).send("Error al obtener la lista de pacientes");
    } else {
      citasController.obtenerTotalCitasMedicas((errorCitas, numeroTotalDeCitas) => {
        if (errorCitas) {
          console.error("Error al obtener el número total de citas médicas:", errorCitas);
          res.status(500).send("Error al obtener el número total de citas médicas");
        } else {
          usuarioController.obtenerTotalUsuarios((errorUsuarios, numeroTotalDeUsuarios) => {
            if (errorUsuarios) {
              console.error("Error al obtener el número total de usuarios:", errorUsuarios);
              res.status(500).send("Error al obtener el número total de usuarios");
            } else {
              res.render("pages/dashboard", {
                pacientes,
                numeroPacientes,
                numeroTotalDeCitas,
                numeroTotalDeUsuarios,
                alert: false
              });
            }
          });
        }
      });
    }
  });
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
