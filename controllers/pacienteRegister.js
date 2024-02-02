const pacienteController = require("./pacienteController");
const conexion = require('../database/db');

// Método para registrar pacientes
exports.registerPatient = async (req, res) => {
    try {
        const { nombre, apellido, cedula, fecha_nacimiento, genero, direccion, telefono, correo } = req.body;

        if (!nombre || !apellido || !cedula || !fecha_nacimiento || !genero || !direccion || !telefono || !correo) {
            return res.status(400).json({ message: 'Por favor, complete todos los campos' });
        }

        // Verificar si la cédula ya está registrada
        const cedulaExistente = await new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM Pacientes WHERE cedula = ?', [cedula], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0);
                }
            });
        });

        if (cedulaExistente) {
            const pacientes = await obtenerListaPacientesAsync(); 
            return res.render('pages/pacientes', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "La cédula ya se encuentra registrada",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'pacientes',
                pacientes: pacientes 
            });
        }

        // Realizar el registro del paciente
        conexion.query('INSERT INTO Pacientes (nombre, apellido, cedula, fecha_nacimiento, genero, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, cedula, fecha_nacimiento, genero, direccion, telefono, correo], async (error, results) => {
                if (error) {
                    const pacientes = await obtenerListaPacientesAsync(); 
                    res.render('pages/pacientes', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Error al registrar al paciente",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'pacientes',
                        pacientes: pacientes 
                    });
                } else {
                    const pacientes = await obtenerListaPacientesAsync();
                    res.render('pages/pacientes', {
                        alert: true,
                        alertTitle: "Registro exitoso",
                        alertMessage: "Registro exitoso del paciente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'pacientes',
                        pacientes: pacientes 
                    });
                }
            });

    } catch (error) {
        const pacientes = await obtenerListaPacientesAsync();
        res.render('pages/pacientes', {
            alert: true,
            alertTitle: "Error",
            alertMessage: `Error en el servidor: ${error.message}`,
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'pacientes',
            pacientes: pacientes 
        });
    }
};

// Función asincrónica para obtener la lista de pacientes
async function obtenerListaPacientesAsync() {
    return new Promise((resolve, reject) => {
        pacienteController.obtenerListaPacientes((error, pacientes) => {
            if (error) {
                reject(error);
            } else {
                resolve(pacientes);
            }
        });
    });
}
