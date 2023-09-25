const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database/connection')
const secretKey = process.env.jwtSecretKey;

// Promisify the query function
const Qry = (sql, params) => {
  const formattedQuery = db.format(sql, params); // Format the query with parameters
  console.log('Executing query:', formattedQuery); // Log the formatted query
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

//find available space in tree
async function findAvailableSpace(pid, leg) {
  try {
    const [rows] = await Qry(
      'SELECT `pid`, `userid` FROM `binarytree` WHERE `pid` = ? AND `leg` = ?',
      [pid, leg]
    );
    if (!rows || rows.length === 0) {
      return pid;
    }
    const nextID = await findAvailableSpace(rows.userid, leg);
    return nextID !== null ? nextID : null;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return null;
  }
}


async function checkAuthorization(req, res) {
  // Check if the authorization header is present
  if (!req.headers.authorization) {
    res.status(401).json({ status: 'error', message: 'Authorization header is missing.' });
    return false;
  } else {
    const token = req.headers.authorization.split(' ')[1];
    return new Promise((resolve) => {
      jwt.verify(token, secretKey, async (err, user) => {
        if (err) {
          res.status(401).json({ status: 'error', message: 'token_expired' });
          resolve(false); // Use resolve instead of reject
        } else {
          try {
            const selectUser = await Qry(`SELECT * FROM usersdata WHERE username = '${user.username}'`);
            const userData = selectUser[0];

            if (userData && userData.username === user.username) {
              resolve(userData.id);
            } else {
              res.status(401).json({ status: 'error', message: 'Invalid User.' });
              resolve(false); // Use resolve instead of reject
            }
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ status: 'error', message: 'Server error occurred' });
            resolve(false); // Use resolve instead of reject
          }
        }
      });
    });
  }
}

async function authMiddleware(req, res) {
  // Check if the authorization header is present
  if (!req.headers.authorization) {
    return res.status(401).json({ status: 'error', message: 'Authorization header is missing.' });
    return false;
  } else {
    const token = req.headers.authorization.split(' ')[1];
    return new Promise((resolve) => {
      jwt.verify(token, secretKey, async (err, user) => {
        if (err) {
          return res.status(401).json({ status: 'error', message: 'token_expired' });
          resolve(false); // Use resolve instead of reject
        } else {
          try {
            const selectUser = await Qry(`SELECT * FROM usersdata WHERE username = '${user.username}'`);
            const userData = selectUser[0];

            if (userData && userData.username === user.username) {
             return next(userData);
            } else {
              return res.status(401).json({ status: 'error', message: 'Invalid User.' });
              resolve(false); // Use resolve instead of reject
            }
          } catch (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ status: 'error', message: 'Server error occurred' });
            resolve(false); // Use resolve instead of reject
          }
        }
      });
    });
  }
}


async function adminAuthorization(req, res) {
  // Check if the authorization header is present
  if (!req.headers.authorization) {
    res.status(401).json({ status: 'error', message: 'Authorization header is missing.' });
    return false;
  } else {
    const token = req.headers.authorization.split(' ')[1];
    return new Promise((resolve) => {
      jwt.verify(token, secretKey, async (err, user) => {
        if (err) {
          res.status(401).json({ status: 'error', message: 'token_expired' });
          resolve(false); // Use resolve instead of reject
        } else {
          try {
            const selectUser = await Qry(`SELECT * FROM usersdata WHERE username = '${user.username}'`);
            const userData = selectUser[0];

            if (userData && userData.username === user.username && userData.usertype === 'admin') {
              resolve(userData.id);
            } else {
              res.status(401).json({ status: 'error', message: 'Invalid admin User.' });
              resolve(false); // Use resolve instead of reject
            }
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ status: 'error', message: 'Server error occurred' });
            resolve(false); // Use resolve instead of reject
          }
        }
      });
    });
  }
}



function randomToken(length = 100) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345689';
  let myString = '';
  for (let i = 0; i < length; i++) {
    const pos = crypto.randomInt(0, chars.length - 1);
    myString += chars[pos];
  }
  return myString;
}

async function settings_data(keyname) {
  try {
    const settingSelectQuery = `SELECT * FROM setting WHERE keyname = ?`;
    const settingSelectResult = await Qry(settingSelectQuery, [keyname]);
    return settingSelectResult;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return null;
  }
}

// Define a recursive function to fetch user hierarchy
async function fetchUsers(sponsorId, depth, maxDepth) {
  const users = [];
  const query = 'SELECT id, sponsorid, username FROM usersdata WHERE sponsorid = ?';
  const sqlResult = await Qry(query, [sponsorId]);

  for (const row of sqlResult) {
    const user = {
      id: row.id,
      title: row.username,
      img: "https://clipart-library.com/images/kTKo7BB8c.png",
      children: [],
    };

    if (depth < maxDepth) {
      user.children = await fetchUsers(row.id, depth + 1, maxDepth);
    }

    users.push(user);
  }

  return users;
}

module.exports = {
  checkAuthorization,
  adminAuthorization,
  authMiddleware,
  randomToken,
  findAvailableSpace,
  Qry,
  settings_data,
  fetchUsers
};