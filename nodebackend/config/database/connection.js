const mysql = require('mysql');
// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sachin',
  });
  // Connect to MySQL
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });
  function CleanDBData(data) {
    const dataType = typeof data;
    if (dataType === 'object' || dataType === 'array') {
      const jsonString = JSON.stringify(data);
      const escapedString = db.escape(jsonString);
      return escapedString.slice(1, -1); // Remove the surrounding single quotes
    } else if (dataType === 'number') {
      return data; // Return numeric values as is
    } else {
      const escapedData = db.escape(data);
      return escapedData.slice(1, -1); // Remove the surrounding single quotes
    }
  }
  
  function CleanHTMLData(data) {
    const dataType = typeof data;
    if (dataType === 'number') {
      return data; // Return numeric values as is
    } else {
      const escapedData = db.escape(data);
      const result = escapedData.slice(1, -1); // Remove the surrounding single quotes
      return result;
    }
  }
   
  module.exports = {
    db,
    CleanHTMLData,
    CleanDBData
  };
