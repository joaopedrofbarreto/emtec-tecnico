import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { servicosRoutes } from './routes/servicos.js';
import { categoriasRoutes } from './routes/categorias.js';
import { regioesRoutes } from './routes/regioes.js';
import { faixasRoutes } from './routes/faixas.js';
import { regrasRoutes } from './routes/regras.js';
import { calculoRoutes } from './routes/calculo.js';

const app = Fastify({ logger: true });

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

app.get('/health', async () => ({ status: 'ok' }));

app.register(servicosRoutes);
app.register(categoriasRoutes);
app.register(regioesRoutes);
app.register(faixasRoutes);
app.register(regrasRoutes);
app.register(calculoRoutes);

app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});