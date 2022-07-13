import twilio from 'twilio';
import { TWILIO_SMS_NUMBER } from '../../config.js';
import logger from './logger.js';

class Twilio {
  constructor() {
    const { TWILIO_ACCPUNT_SID: accSid } = import('../../config.js');
    const { TWILIO_AUTH_TOKEN: authToken } = import('../../config.js');
    this.client = twilio(accSid, authToken);
  }

  #wapMessage(data) {
    let message = '';
    message = `Nuevo pedido de ${data.name} (${data.user})\n`;
    message += 'Se informa detalle de nuevo pedido:\n\n';
    let totalOrder = 0;
    data.forEach((p) => {
      message += `Articulo: ${p.code}\n`;
      message += `Nombre: ${p.name}\n`;
      message += `Cantidad: ${p.quantity}\n`;
      message += `Precio unit: $ ${p.price}\n`;
      message += `Total: $ ${parseInt(p.quantity) * parseFloat(p.price)}\n\n`;
      totalOrder += parseInt(p.quantity) * parseFloat(p.price);
    });
    message += `Total del pedido: $ ${totalOrder}`;
    return message;
  }

  async sms(dest, body) {
    try {
      const { TWILIO_SMS_NUMBER } = await import('../../config.js');
      const message = await this.client.messages.create({
        body: body,
        from: TWILIO_SMS_NUMBER,
        to: dest,
      });
    } catch (err) {
      logger.error(`Module: utils/twilio.js Method: sms -> ${err}`);
    }
  }

  async wapp(dest, data) {
    const { TWILIO_WAP_NUMBER } = await import('../../config.js');
    try {
      await this.client.messages.create({
        body: this.#wapMessage(data),
        from: `whatsapp:${TWILIO_WAP_NUMBER}`,
        to: `whatsapp:${dest}`,
      });
    } catch (err) {
      logger.error(`Module: utils/twilio.js Method: wapp -> ${err}`);
    }
  }
}
export default new Twilio();
