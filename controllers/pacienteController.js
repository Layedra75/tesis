const conexion = require('../database/db');

//Metodo para listar pacientes
const obtenerListaPacientes = (callback) => {
    const sql = 'SELECT id, nombre, apellido, cedula, correo, telefono FROM Pacientes';
    conexion.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener la lista de pacientes:', error);
            callback('Error al obtener la lista de pacientes', null);
        } else {
            callback(null, results);
        }
    });
};

//Metodo para eliminar pacientes
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        // Realizar la eliminación del paciente
        conexion.query('DELETE FROM Pacientes WHERE id = ?', [id], (error, results) => {
            if (error) {
                res.render('pages/pacientes', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al eliminar al paciente",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'pacientes'
                });
            } else {
                // Después de la eliminación, obtener la lista actualizada de pacientes
                obtenerListaPacientes((err, pacientes) => {
                    if (err) {
                        res.render('pages/pacientes', {
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "Error al obtener la lista de pacientes",
                            alertIcon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'pacientes'
                        });
                    } else {
                        res.redirect('/pacientes?exito=true');
                    }
                });
            }
        });
    } catch (error) {
        res.render('pages/pacientes', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en el servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'pacientes'
        });
    }
};

//Metodo para editar pacientes
const editarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula, nombre, apellido, correo, telefono } = req.body;

        // Realizar la actualización del paciente
        conexion.query(
            'UPDATE Pacientes SET nombre = ?, apellido = ?, cedula = ?, correo = ?, telefono = ? WHERE id = ?',
            [nombre, apellido, cedula, correo, telefono, id],
            (error, results) => {
                if (error) {
                    res.render('pages/pacientes', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Error al editar el paciente',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'pacientes',
                    });
                } else {
                    // Después de la edición, obtener la lista actualizada de pacientes
                    obtenerListaPacientes((err, pacientes) => {
                        if (err) {
                            res.render('pages/pacientes', {
                                alert: true,
                                alertTitle: 'Error',
                                alertMessage: 'Error al obtener la lista de pacientes',
                                alertIcon: 'error',
                                showConfirmButton: true,
                                timer: false,
                                ruta: 'pacientes',
                            });
                        } else {
                            res.redirect('/pacientes?exitoEdit=true');
                        }
                    });
                }
            }
        );
    } catch (error) {
        res.render('pages/pacientes', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: 'Error en el servidor al editar el paciente',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'pacientes',
        });
    }
};


module.exports = { obtenerListaPacientes, deletePatient, editarPaciente};