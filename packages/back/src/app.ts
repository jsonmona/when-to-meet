import express from 'express';
import { rootRouter } from './route/index.ts';

const app = express();
const port = process.env.PORT || 3000;
const prefix = '/api';

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(prefix, rootRouter);

// React SPA 처리
app.get(/^\/(?!api).*/, (req, res, next) => {
  if (req.path.startsWith(prefix)) {
    return next();
  }
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
