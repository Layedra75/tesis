const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const pacienteRegister = require('../controllers/pacienteRegister')
const pacienteController = require('../controllers/pacienteController')
const usuarioController = require('../controllers/UserController')
const citasController = require('../controllers/citasController');
const { vistaPrincipal, vistaUsuarios, vistaPacientes, citasMedicas} = require('../controllers/PageControllers')

//router para las vistas
router.get('/', authController.isAuthenticated, vistaPrincipal)
router.get('/pacientes', authController.isAuthenticated, vistaPacientes)
router.get('/usuarios', authController.isAuthenticated, vistaUsuarios)

//router obtener citas en el calendario
router.get('/obtener-citas', citasController.obtenerCitasMedicas);

//Vista de citas
router.get('/citas', authController.isAuthenticated, citasMedicas)

//router para login
router.get('/login', (req, res) => {
    const alert = req.query.error === 'incorrect';
    res.render('authentication/login', { alert, layout: false });
});

// Ruta para crear una nueva cita médica
router.post('/guardar-cita', citasController.crearCitaMedica);

//router para eliminar usuario (Trabajador)
router.get('/eliminar-usuario/:id', usuarioController.eliminarUsuario);
// router para manejar la edicion de usuario
router.post('/editar-usuario/:id', usuarioController.editarUsuario);

//router para eliminar paciente
router.get('/eliminar-paciente/:id', pacienteController.deletePatient);
// router para manejar la edicion de usuario
router.post('/editar-paciente/:id', pacienteController.editarPaciente);


//router para el metodo de pacienteController
router.post('/pacientes', pacienteRegister.registerPatient)

//router para los métodos del authController
router.post('/usuarios', authController.register)
router.post('/login',authController.login)
router.get('/logout', authController.logout)

module.exports = router