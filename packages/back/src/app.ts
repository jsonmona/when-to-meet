import express from 'express';
import { rootRouter } from './route/index.ts';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost',
});
await redisClient.connect();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'whentomeet:',
});

const app = express();
const port = process.env.PORT || 3000;
const prefix = '/api';

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: 'when-to-meet-secret',
  })
);
app.use(cookieParser());
app.use(csrf());
app.use(prefix, rootRouter);

// React SPA 처리
app.get(/^\/(?!api).*/, (req, res, next) => {
  if (req.path.startsWith(prefix)) {
    return next();
  }
  res.cookie('_csrf', req.csrfToken());
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
