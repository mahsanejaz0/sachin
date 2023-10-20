const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/userroutes');
const adminApiRoutes = require('./routes/adminroutes');

const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8000;
const app = express()

const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3005','https://admin.mytether.co/','http://admin.mytether.co/','https://app.mytether.co/','http://app.mytether.co/'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'authorization'],
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Parse JSON bodies
app.use(bodyParser.json());

// Connect routes
app.use('/user/api', apiRoutes);

// Connect routes
app.use('/admin/api', adminApiRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });