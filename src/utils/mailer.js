import mailer from 'nodemailer';
import { ADMIN_MAIL, ADMIN_MAIL_PWD } from '../../config.js';
import logger from './logger.js';

const mailSender = mailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: ADMIN_MAIL,
    pass: ADMIN_MAIL_PWD,
  },
});

const mailData = {
  from: 'E-Commerce Server',
  to: ADMIN_MAIL,
  subject: '',
  html: '',
};

export default async function sendMail(data, type) {
  switch (type) {
    case 'user':
      mailData.subject = 'Nuevo registro';
      mailData.html = `Se informa la creación de un nuevo usuario.<br /><br />`;
      mailData.html += `<ul>`;
      mailData.html += `<li>Mail: ${data.user}</li>`;
      mailData.html += `<li>Nombre: ${data.name}</li>`;
      mailData.html += `<li>Edad: ${data.age}</li>`;
      mailData.html += `<li>Domicilio: ${data.address}</li>`;
      mailData.html += `<li>Teléfono: ${data.phoneNmbr}</li>`;
      mailData.html += `</ul>`;
      break;

    case 'order':
      mailData.subject = `Nuevo pedido de ${data.name} (${data.user})`;
      mailData.html = 'Se informa detalle de nuevo pedido: <br /> <br />';
      let totalOrder = 0;
      data.forEach((p) => {
        mailData.html += `Articulo: ${p.code}<br />`;
        mailData.html += `Nombre: ${p.name}<br />`;
        mailData.html += `Cantidad: ${p.quantity}<br />`;
        mailData.html += `Precio unit: $ ${p.price}<br />`;
        mailData.html += `Total: $ ${parseInt(p.quantity) * parseFloat(p.price)}<br /><br />`;
        totalOrder += parseInt(p.quantity) * parseFloat(p.price);
      });
      mailData.html += `Total del pedido: $ ${totalOrder}`;
      break;

    default:
      logger.warn(`Module: utils/mailer.js. Method: sendmail -> No match to send email.`);
      break;
  }
  try {
    mailSender.sendMail(mailData);
  } catch (err) {
    logger.error(`Module: utils/mailer.js Method: sendMail -> ${err}`);
  }
}
