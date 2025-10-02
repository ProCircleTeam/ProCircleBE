require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerSpec = require('./docs/swagger.json');

const PORT = process.env.APP_PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
const express = require('express');
const app = express();
swaggerSpec.servers = [
	{
		url: baseUrl,
	},
];

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const goalRoutes = require('./routes/goal');
const genericRoutes = require('./routes/generic');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors({
	origin: ['http://localhost:3000'], // Whatever domain frontend is deployed to should be added to this list
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.get('/', (req, res) => {
	res.send({message: 'Hello, welcome to ProCircle BE'});
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/goal', goalRoutes);
app.use('/api/v1/generic', genericRoutes);

app.listen(PORT, () => {
	console.log(`Server started successfully at http://localhost:${PORT}`);
});
