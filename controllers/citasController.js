const conexion = require('../database/db');

// Metodo para obtener citas medicas
const obtenerCitasMedicas = (req, res) => {
  // Realizar la consulta para obtener citas médicas desde la base de datos
  const sql = `
    SELECT
        citas.id AS cita_id,
        DATE_FORMAT(citas.fecha, '%Y-%m-%d') AS fecha,
        citas.hora_inicio,
        pacientes.nombre AS nombre_paciente,
        pacientes.apellido AS apellido_paciente,
        users.name AS nombre_doctor,
        users.lastname AS apellido_doctor,
        citas.descripcion
    FROM
        citasmedicas AS citas
        INNER JOIN pacientes ON citas.paciente_id = pacientes.id
        INNER JOIN users ON citas.doctor_id = users.id;
  `;

  conexion.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener citas médicas:', error);
      res.status(500).json({ success: false, message: 'Error al obtener citas médicas', data: [] });
    } else {
      const eventos = results.map((cita) => ({
        title: `Cita con ${cita.nombre_paciente} ${cita.apellido_paciente}`,
        start: `${cita.fecha}T${cita.hora_inicio}`,
        pacienteNombre: `${cita.nombre_paciente} ${cita.apellido_paciente}`,
        doctorNombre: `${cita.nombre_doctor} ${cita.apellido_doctor}`,
        descripcion: cita.descripcion,
      }));

      res.json({ success: true, data: eventos });
    }
  });
};

// Método para guardar citas médicas
const crearCitaMedica = (req, res) => {
  try {
    const { fecha, horaInicio, pacienteId, doctorId, descripcion } = req.body;

    // Realizar la inserción en la base de datos
    const sql = 'INSERT INTO citasmedicas (fecha, hora_inicio, paciente_id, doctor_id, descripcion) VALUES (?, ?, ?, ?, ?)';
    conexion.query(sql, [fecha, horaInicio, pacienteId, doctorId, descripcion], (error, results) => {
      if (error) {
        console.error('Error al crear la cita médica:', error);
        res.status(500).json({ success: false, message: 'Error al crear la cita médica' });
      } else {
        res.json({ success: true, message: 'Cita médica creada exitosamente' });
      }
    });
  } catch (error) {
    console.error('Error en el servidor al crear la cita médica:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor al crear la cita médica' });
  }
};

const obtenerTotalCitasMedicas = (callback) => {
  const sql = 'SELECT COUNT(*) AS numero_total_de_citas FROM citasmedicas';

  conexion.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener el número total de citas médicas:', error);
      callback('Error al obtener el número total de citas médicas', null);
    } else {
      const numeroTotalDeCitas = results[0].numero_total_de_citas;
      callback(null, numeroTotalDeCitas);
    }
  });
};
module.exports = { crearCitaMedica, obtenerCitasMedicas, obtenerTotalCitasMedicas };
