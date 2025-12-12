import express from 'express';
import { rootRouter } from './components/index.ts';

const app = express();
const port = process.env.PORT || 3000;
const prefix = '/api';

app.use(express.json({ limit: '10mb' }));
app.use(prefix, rootRouter).listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
