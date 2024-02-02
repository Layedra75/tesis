const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const usuarioController = require("./UserController");
const {promisify} = require('util')

//metodo para registrarse
exports.register = async (req, res) => {
    try {
        const { name, lastname, cedula, date, email, celular, pass, rol } = req.body;
        if (!name || !lastname || !cedula || !date || !email || !celular || !pass || !rol) {
            return res.status(400).json({ message: 'Por favor, complete todos los campos' });
        }

        // Validación del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'El correo electrónico no es válido' });
        }

        // Verificar si el correo electrónico ya está registrado
        conexion.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (results.length > 0) {
                const usuarios = await obtenerListaUsuariosAsync();
                return res.render('pages/usuarios', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "El correo electrónico ya está registrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    confirmButtonColor: "#5D87FF",
                    timer: false,
                    ruta: 'usuarios',
                    usuarios: usuarios
                });
            }

            // Si el correo electrónico no está registrado, continuar con el registro
            const passHash = await bcryptjs.hash(pass, 8);
            conexion.query('INSERT INTO users (name, lastname, email, pass, rol, cedula, celular, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, lastname, email, passHash, rol, cedula, celular, date], async (error, results) => {
                    if (error) {
                        const usuarios = await obtenerListaUsuariosAsync();
                        res.render('pages/usuarios', {
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "Error al registrar",
                            alertIcon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            confirmButtonColor: "#5D87FF",
                            ruta: 'usuarios',
                            usuarios: usuarios
                        });
                    } else {
                        const usuarios = await obtenerListaUsuariosAsync();
                        res.render('pages/usuarios', {
                            alert: true,
                            alertTitle: "Registro exitoso",
                            alertMessage: "Registro exitoso",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: 'usuarios',
                            usuarios: usuarios
                        });
                    }
                });
        });

    } catch (error) {
        const usuarios = await obtenerListaUsuariosAsync();
        res.render('pages/usuarios', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en el servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'usuarios',
            usuarios: usuarios
        });
    }
};

//metodo para login
 exports.login = async(req,res)=>{
     try {
         const email = req.body.email
         const pass = req.body.pass        

         if(!email|| !pass ){
             res.render('authentication/login',{
                 alert:true,
                 alertTitle: "Advertencia",
                 alertMessage: "Ingrese un usuario y password",
                 alertIcon:'info',
                 showConfirmButton: true,
                 confirmButtonColor: "#5D87FF",
                 timer: false,
                 ruta: 'login',
                 layout: false
             })
         }else{
             conexion.query('SELECT * FROM users WHERE email = ?', [email], async (error, results)=>{
                 if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                     res.render('authentication/login', {
                         alert: true,
                         alertTitle: "Error",
                         alertMessage: "Usuario y/o Password incorrectas",
                         alertIcon:'error',
                         showConfirmButton: true,
                         timer: false,
                         confirmButtonColor: "#5D87FF",
                         ruta: 'login',
                         layout: false    
                     })
                 }else{
                     //inicio de sesión    
                     const id = results[0].id    
                     const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                         expiresIn: process.env.JWT_TIEMPO_EXPIRA
                     })
                    const cookiesOptions = {
                         expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                         httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('authentication/login', {
                         alert: true,
                         alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                         timer: 800,
                        ruta: '',
                        layout: false
                    })
                 }
             })
         }
     } catch (error) {
         console.log(error)
     }
 }

//metodo de autenticacion
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next(); }
                req.user = results[0];
                return next();
            })
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login');
    }
}

//metodo logout
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

// Función asincrónica para obtener la lista de usuarios
async function obtenerListaUsuariosAsync() {
    return new Promise((resolve, reject) => {
        usuarioController.obtenerListaUsuarios((error, usuarios) => {
            if (error) {
                reject(error);
            } else {
                resolve(usuarios);
            }
        });
    });
}
