import { BCRYPT_SALT_ROUNDS } from '../../config.js';

export async function hashDehash(params = { pwd: pwd, pwdHash: pwdHash, op: op }) {
  const bcrypt = import('bcrypt');
  // const { BCRYPT_SALT_ROUNDS } = import('../../config.js');
  if (params?.op) {
    switch (params.op) {
      case 'hash':
        if (!params?.pwd) {
          throw new Error('Se requiere una contraseña');
        } else {
          const pwdHash = (await bcrypt).hash(params.pwd, parseInt(BCRYPT_SALT_ROUNDS));
          if (!pwdHash) {
            throw new Error(`No se pudo cifrar la contraseña\n${err}`);
          } else {
            return pwdHash;
          }
        }
        break;

      case 'dehash':
        if (params?.pwd && params?.pwdHash) {
          return await (await bcrypt).compare(params.pwd, params.pwdHash);
        } else {
          throw new Error('Se requiere una contraseña');
        }
        break;

      default:
        throw new Error('Operacion no implementada');
    }
  }
}
