import express from 'express';
import { sep } from 'path';
import authRouter from './routes/auth.js';
import apiProductsRouter from './routes/products.js';
import apiCartsRouter from './routes/carts.js';
import userViewsRouter from './routes/user_views.js';
import logger from './utils/logger.js';
import session from './models/session.js';
import passportLocal from './models/passport_local.js';
import { isAuth } from './midwares/auth.js';

const app = express();

app.set('views', `.${sep}src${sep}views`);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session);
app.use(passportLocal.initialize());
app.use(passportLocal.session());

app.use('/', authRouter);
app.use('/user', isAuth, userViewsRouter);
app.use('/api/productos', apiProductsRouter);
app.use('/api/carrito', apiCartsRouter);
app.all('*', (req, res) => {
  logger.warn(
    `Method ${req.method} on route "${req.originalUrl}" not implemented.`
  );
  res.status(400).json({
    error: `Método ${req.method} en ruta '${req.originalUrl}' no implementado.`,
  });
});

export default app;
