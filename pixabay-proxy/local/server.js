import express from 'express';
import cors from 'cors';
import { pixabayProxy } from '../index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', pixabayProxy);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Local server listening at http://localhost:${PORT}`);
});
