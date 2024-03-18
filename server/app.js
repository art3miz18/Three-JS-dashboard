require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoute');
const users = require('./routes/authRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/api/products', productRoutes); //  product routes
app.use('/api/users', users); // user routes


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
