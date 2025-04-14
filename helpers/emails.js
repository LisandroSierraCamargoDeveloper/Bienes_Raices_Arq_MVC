import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Reemplaza con tu email verificado en Resend
      to: email,
      subject: 'Confirma tu Cuenta en BienesRaices.com',
      html: `
        <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
        <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
        <a href="${process.env.BACKEND_URL}/auth/confirmar-cuenta/${token}">Confirma tu cuenta</a> </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
    });
  } catch (error) {
    console.error('Error al enviar el correo de registro:', error);
    // Maneja el error apropiadamente
  }
};

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Reemplaza con tu email verificado en Resend
      to: email,
      subject: 'Reestablece tu Password en BienesRaices.com',
      html: `
        <p>Hola ${nombre}, has solicitado reestablecer tu password en bienesRaices.com</p>
        <p>Sigue el siguiente enlace para generar un password nuevo: 
        <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Reestablecer Password</a> </p>
        <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
      `,
    });
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
    // Maneja el error apropiadamente
  }
};

export { emailRegistro, emailOlvidePassword };