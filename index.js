import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js'

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/user', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server Running on port: http://localhost:${PORT}`)
});