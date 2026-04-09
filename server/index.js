import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import repoRoutes from './routes/repo.js';
import analyzeRoutes from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', repoRoutes);
app.use('/api', analyzeRoutes);

app.get('/', (req, res) => {
  res.send('GitAtlas Backend is running🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
