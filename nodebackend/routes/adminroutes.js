const express = require("express");
const forever = require("forever");
const app = express();
const multer = require("multer");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const fs = require("fs");
const { CleanHTMLData, CleanDBData } = require("../config/database/connection");
const transporter = require("../config/mail/mailconfig");
const emailTemplate = require("../helpers/emailTemplates/emailTemplates");

require("dotenv").config();
const encryptionKey = process.env.KEY;
const {
  Qry,
  adminAuthorization,
  randomToken,
  settings_data,
  checkAuthorization,
  fetchUsers,
} = require("../helpers/functions");
const secretKey = process.env.jwtSecretKey;

const backoffice_link = "https://aura.threearrowstech.com/";
const weblink = "https://adminaura.skytsevni.net/";
const emailImagesLink =
  "https://threearrowstech.com/projects/quantum/public/images/email-images/";
const noreply_email = "mails@mytether.co";
const company_name = "Bank Of Tether";

// Create a multer middleware for handling the file upload
const upload = multer();

router.post("/login", async (req, res) => {
  const postData = req.body;
  const username = CleanHTMLData(CleanDBData(postData.username));
  const password = CleanHTMLData(CleanDBData(postData.password));

  try {
    const selectUserQuery = `SELECT * FROM usersdata WHERE username = ?`;
    const selectUserResult = await Qry(selectUserQuery, [username]);

    if (selectUserResult.length === 0) {
      res.json({
        status: "error",
        message: "Invalid login details.",
      });
      return;
    }

    const user = selectUserResult[0];
    const decryptedPassword = crypto.AES.decrypt(
      user.password,
      encryptionKey
    ).toString(crypto.enc.Utf8);
    const passwordMatch = bcrypt.compareSync(password, decryptedPassword);

    if (!passwordMatch) {
      res.json({
        status: "error",
        message: "Invalid login details.",
      });
      return;
    } else if (user.emailstatus === "unverified") {
      res.json({
        status: "error",
        message: "Please verify your account first. We have sent you an email.",
      });
      return;
    } else if (
      user.username === username &&
      passwordMatch &&
      user.usertype === "admin"
    ) {
      console.log("user.usertypeuser.usertypeuser.usertype", user.usertype);
      const token = jwt.sign({ username }, secretKey, { expiresIn: "12h" });
      const date = new Date().toISOString().slice(0, 19).replace("T", " ");
      const expireat = new Date(date);
      expireat.setHours(expireat.getHours() + 1);

      //   const insertQuery = `INSERT INTO access_tokens (username, token, created_at, expire_at) VALUES (?, ?, ?, ?)`;
      //   const insertParams = [username, token, date, expireat];
      //   const insertResult = await Qry(insertQuery, insertParams);

      const updateLoginQuery = `UPDATE usersdata SET lastlogin = ?, lastip = ? WHERE username = ?`;
      const updateLoginParams = [date, req.ip, username];
      const updateLoginResult = await Qry(updateLoginQuery, updateLoginParams);

      const userSelectQuery = `SELECT username, randomcode, firstname, lastname, email, picture, current_balance, status, mobile, emailstatus, address, country, createdat, loginstatus, lastlogin, lastip FROM usersdata WHERE id = ?`;
      const userSelectParams = [user.id];
      const userSelectResult = await Qry(userSelectQuery, userSelectParams);
      const userdbData = userSelectResult[0];

      if (updateLoginResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Login Successfully",
          token: token,
          user: userdbData,
        });
        return;
      }
    } else {
      res.json({
        status: "error",
        message: "you are not allowed to login as admin",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//login admin data
router.post("/userdata", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const userSelectQuery = `SELECT sponsorid, username, randomcode, firstname, lastname, email, picture, current_balance,  status, mobile, emailstatus, address, country, createdat, loginstatus, lastlogin, lastip, allowedroutes FROM usersdata WHERE id = ?`;

      const userSelectParams = [authUser];
      const userSelectResult = await Qry(userSelectQuery, userSelectParams);
      const userdbData = userSelectResult[0];

      const transactionSelectQuery = `SELECT COALESCE(SUM(amount), 0) AS totalpayout FROM transaction WHERE type = 'payout' AND receiverid = ?`;
      const transactionSelectParams = [authUser];
      const transactionSelectResult = await Qry(
        transactionSelectQuery,
        transactionSelectParams
      );
      const transactiondbData = transactionSelectResult[0];
      userdbData.totalpayout = transactiondbData.totalpayout;

      const selectTreeQuery = `SELECT COUNT(*) AS count FROM usersdata WHERE sponsorid = ? AND status = 'approved'`;
      const selectTreeParams = [authUser];
      const selectTreeResult = await Qry(selectTreeQuery, selectTreeParams);
      const count = selectTreeResult[0].count;
      userdbData.activereferrals = count;

      userdbData.referrallink = `${weblink}signup/${userdbData.randomcode}`;

      userdbData.profilepictureurl = `${backoffice_link}uploads/userprofile/${userdbData.picture}`;

      res.json({
        status: "success",
        data: userdbData,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//forget password
router.post("/forgetpassword", async (req, res) => {
  const postData = req.body;
  const email = CleanHTMLData(CleanDBData(postData.email));
  const randomcode = randomToken(150);

  try {
    const selectUserQuery = `SELECT * FROM usersdata WHERE email = ?`;
    const selectUserResult = await Qry(selectUserQuery, [email]);
    const userData = selectUserResult[0];

    if (!userData || userData.email !== email) {
      res.json({
        status: "error",
        message: "No account found with this email address",
      });
      return;
    }

    const title = "Password reset requested on " + company_name;
    const username = userData.username;
    const emailimg = emailImagesLink + "passwordreset.png";
    const resetLink = `${weblink}reset-password/${randomcode}/${email}`;
    const heading = "Password Reset";
    const subheading = "";
    const body = `Hello ${username},<br>You have requested a password reset on ${company_name} App. Please click on the reset button below:<br>
      <p><a href="${resetLink}" style="padding: 10px 15px;display: inline-block;border-radius: 5px;background: #1a253a;color: #ffffff;" class="btn btn-primary">Reset Password</a></p>`;

    const mailOptions = {
      from: {
        name: "Bank Of Tether",
        address: noreply_email,
      },
      to: {
        name: username,
        address: email,
      },
      subject: "Reset password requested " + company_name,
      html: emailTemplate(title, emailimg, heading, subheading, body),
      text: "This is the plain text version of the email content",
    };

    transporter.sendMail(mailOptions, async (err, info) => {
      if (!err) {
        const updateQuery = `UPDATE usersdata SET emailtoken = ? WHERE email = ?`;
        const updateParams = [randomcode, email];
        const updateResult = await Qry(updateQuery, updateParams);

        if (updateResult.affectedRows > 0) {
          res.json({
            status: "success",
            message:
              "Email sent for password reset request. Please check your email.",
          });
        } else {
          res.json({
            status: "error",
            message: "Failed to update email token",
          });
        }
      } else {
        res.json({
          status: "error",
          message: "Failed to send email",
        });
      }
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//reset password
router.post("/resetpassword", async (req, res) => {
  const postData = req.body;
  const email = CleanHTMLData(CleanDBData(postData.email));
  const password = CleanHTMLData(CleanDBData(postData.password));

  try {
    const selectUserQuery = `SELECT * FROM usersdata WHERE email = ?`;
    const selectUserResult = await Qry(selectUserQuery, [email]);
    const userData = selectUserResult[0];

    if (!userData || userData.email !== email) {
      res.json({
        status: "error",
        message: "Invalid account",
      });
      return;
    }

    // Generate a salt for password hashing
    const saltRounds = 16; // The number of salt rounds determines the complexity of the hashing
    const salt = bcrypt.genSaltSync(saltRounds);

    const options = {
      cost: 12, // Specify the hashing cost (higher cost means more secure but slower)
      salt: salt, // Pass the generated salt
    };
    const hashedPassword = bcrypt.hashSync(password, options.cost);
    const encryptedPassword = crypto.AES.encrypt(
      hashedPassword,
      encryptionKey
    ).toString();

    const updateQuery = `UPDATE usersdata SET password = ?, emailtoken = '' WHERE email = ?`;
    const updateParams = [encryptedPassword, email];
    const updateResult = await Qry(updateQuery, updateParams);

    if (updateResult.affectedRows > 0) {
      res.json({
        status: "success",
        message: "Password updated successfully",
      });
    } else {
      res.json({
        status: "error",
        message: "Failed to update password",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//verify email status
router.post("/verifyemailaccount", async (req, res) => {
  const postData = req.body;
  const email = CleanHTMLData(CleanDBData(postData.email));
  const token = CleanHTMLData(CleanDBData(postData.token));

  try {
    const selectUserQuery =
      "SELECT * FROM usersdata WHERE email = ? AND emailtoken = ?";
    const selectUserResult = await Qry(selectUserQuery, [email, token]);
    const userData = selectUserResult[0];

    if (userData && userData.email === email && userData.emailtoken === token) {
      const updateQuery =
        'UPDATE usersdata SET emailtoken = "", emailstatus = "verified" WHERE email = ? AND emailtoken = ?';
      const updateParams = [email, token];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "valid token",
        });
      } else {
        res.json({
          status: "error",
          message: "server error",
        });
      }
    } else {
      res.json({
        status: "error",
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//validate email token
router.post("/validateemailtoken", async (req, res) => {
  const postData = req.body;
  const email = CleanHTMLData(CleanDBData(postData.email));
  const token = CleanHTMLData(CleanDBData(postData.token));

  try {
    const selectUserQuery = `SELECT * FROM usersdata WHERE email = ? AND emailtoken = ?`;
    const selectUserResult = await Qry(selectUserQuery, [email, token]);
    const userData = selectUserResult[0];

    if (userData && userData.email === email && userData.emailtoken === token) {
      res.json({
        status: "success",
        message: "Valid token",
      });
    } else {
      res.json({
        status: "error",
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Add News
router.post("/addnews", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;

    if (authUser) {
      const title = CleanHTMLData(CleanDBData(postData.title));
      const description = CleanHTMLData(CleanDBData(postData.description));

      const insertQuery = "INSERT into news (title,description) values (?,?)";
      const updateParams = [title, description];
      const updateResult = await Qry(insertQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "News addedd successfully!",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to insert news",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Get News
router.post("/getnews", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const getNews = `SELECT * from news`;
      const NewsData = await Qry(getNews);

      res.json({
        status: "success",
        data: NewsData,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Delete News
router.post("/deletenews", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const postData = req.body;
      const id = CleanHTMLData(CleanDBData(postData.id));

      const deleteQuery = "DELETE from news WHERE id = ?";
      const deleteParams = [id];
      const deleteResult = await Qry(deleteQuery, deleteParams);

      if (deleteResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "News deleted successfully!",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to delete news",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Update User Current Balance
router.post("/updatecurrentbalance/", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;

    if (authUser) {
      const userid = CleanHTMLData(CleanDBData(postData.userid));
      const type = CleanHTMLData(CleanDBData(postData.type));
      const amount = CleanHTMLData(CleanDBData(postData.amount));

      const selectUserQuery = `SELECT * FROM usersdata WHERE id = ?`;
      const selectUserResult = await Qry(selectUserQuery, [userid]);
      const userData = selectUserResult[0];
      let balance = selectUserResult[0]["current_balance"];

      if (selectUserResult.length === 0) {
        res.json({
          status: "error",
          message: "No account found with this username",
        });
        return;
      }

      let details = "";
      if (type === "Deduct") {
        balance = balance - amount;
        details = "Eur " + amount + " deducted from your balance";
      } else if (type === "Add") {
        balance = +balance + +amount;
        details = "Eur " + amount + " added to your balance";
      }

      const updateQuery =
        "UPDATE usersdata SET current_balance = ? WHERE id = ?";
      const updateParams = [balance, userid];
      const updateResult = await Qry(updateQuery, updateParams);

      const insertQuery =
        "insert into transactions ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)";
      const insertParams = [userid, 0, amount, "Update Balance", details];
      const insertResult = await Qry(insertQuery, insertParams);

      if (insertResult.affectedRows > 0 && updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "User balance has been " + type + "ed successfully",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to update balance",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Get Users List
router.post("/getuserslist", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      let status;
      if (req.body.status === 'approved') {
        status = 'approved';
      }
      if (req.body.status === 'pending') {
        status = 'pending';
      }

      const getUsers = `SELECT emailstatus,
      ud.id as userid, ud.username,ud.randomcode, ud.firstname, ud.lastname,ud.current_balance, ud.email, ud.createdat, ud.mobile, ud.loginstatus
      FROM usersdata ud
      where usertype = ? and status = ?
      ORDER BY ud.id DESC
      `;
      const UsersData = await Qry(getUsers, ["user", status]);

      res.json({
        status: "success",
        userdata: UsersData,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
});


//Get Users List
router.post("/getusers", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {

      const getUsers = `SELECT username, firstname, lastname, email, current_balance from usersdata where usertype = ?`;
      const UsersData = await Qry(getUsers, ["user"]);

      res.json({
        status: "success",
        userdata: UsersData,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

//update profile data
router.post("/updateprofiledata", async (req, res) => {
  const postData = req.body;
  try {
    const authUser = await adminAuthorization(req, res);
    if (authUser) {
      const updates = [];
      const date = new Date().toISOString().slice(0, 19).replace("T", " ");
      postData.updatedat = date;

      for (const [key, value] of Object.entries(postData)) {
        const sanitizedValue = CleanHTMLData(CleanDBData(value));
        updates.push(`${key} = '${sanitizedValue}'`);
      }

      const updateQuery = `UPDATE usersdata SET ${updates.join(
        ", "
      )} WHERE id = '${authUser}'`;
      const updateResult = await Qry(updateQuery);

      if (updateResult) {
        res.status(200).json({
          status: "success",
          message: "Profile Data updated successfully",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//update profile picture
router.post(
  "/updateprofilepicture/",
  upload.single("image"),
  async (req, res) => {
    const postData = req.body;
    try {
      const authUser = await adminAuthorization(req, res);
      if (authUser) {
        const uploadDir = path.join(
          __dirname,
          "../public/uploads/userprofile/"
        );
        const imageParts = req.body.image.split(";base64,");
        const imageTypeAux = imageParts[0].split("image/");
        const imageType = imageTypeAux[1];
        const imageBase64 = Buffer.from(imageParts[1], "base64");

        const filename = `${Date.now()}.png`;
        const filePath = path.join(uploadDir, filename);

        try {
          fs.writeFileSync(filePath, imageBase64);
          const date = new Date().toISOString();

          const updateQuery = `UPDATE usersdata SET picture = '${filename}', updatedat = '${date}'  WHERE id = '${authUser}'`;
          const updateResult = await Qry(updateQuery);

          if (updateResult) {
            const pictureUrl = `${req.protocol}://${req.get(
              "host"
            )}/uploads/userprofile/${filename}`;
            res.status(200).json({
              status: "success",
              message: "Profile picture updated successfully",
              pictureurl: pictureUrl,
            });
          } else {
            res.status(500).json({
              status: "error",
              message: "Something went wrong. Please try again later.",
            });
          }
        } catch (error) {
          res.status(500).json({
            status: "error",
            message:
              "An error occurred while uploading file. Please try again later.",
          });
        }
      }
    } catch (e) {
      res.status(500).json({ status: "error", message: e });
    }
  }
);

// za Update featured status of a product

router.post("/updateFeaturedStatus", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const { id, featured } = req.body;

      const updateQuery = "UPDATE products SET featured = ? WHERE id = ?";
      const updateParams = [featured, id];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Featured status updated successfully!",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to update featured status",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//upload product
router.post("/uploadproduct", upload.single("image"), async (req, res) => {
  const postData = req.body;
  try {
    const authUser = await adminAuthorization(req, res);
    const productTitle = postData.title;
    const productPrice = postData.price;

    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (authUser) {
      try {
        const uploadDir = path.join(__dirname, "../public/uploads/products/");
        const imageParts = req.body.image.split(";base64,");
        const imageTypeAux = imageParts[0].split("image/");
        const imageType = imageTypeAux[1];
        const imageBase64 = Buffer.from(imageParts[1], "base64");

        const filename = `${Date.now()}.png`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, imageBase64);

        console.log("dddddd", postData);

        const insertQuery = `insert into products (title,price,picture,list,createdat,updatedat) values (?,?,?,?,?)`;
        const insertProduct = await Qry(insertQuery, [
          productTitle,
          productPrice,
          filename,
          date,
          date,
        ]);

        if (insertProduct) {
          res
            .status(200)
            .json({ status: "success", message: "New product successfully" });
        } else {
          res.status(500).json({
            status: "error",
            message: "Something went wrong. Please try again later.",
          });
        }
      } catch (error) {
        res.status(500).json({
          status: "error",
          message:
            "An error occurred while uploading file. Please try again later.",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});
//update profile password
router.post("/updatepassword/", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;
    const oldpassword = CleanHTMLData(CleanDBData(postData.oldpassword));
    const newpassword = CleanHTMLData(CleanDBData(postData.newpassword));

    if (authUser) {
      const selectUserQuery = `SELECT * FROM usersdata WHERE id = ?`;
      const selectUserResult = await Qry(selectUserQuery, [authUser]);

      // Generate a salt for password hashing
      const saltRounds = 16; // The number of salt rounds determines the complexity of the hashing
      const salt = bcrypt.genSaltSync(saltRounds);

      const options = {
        cost: 12, // Specify the hashing cost (higher cost means more secure but slower)
        salt: salt, // Pass the generated salt
      };
      const hashedPassword = bcrypt.hashSync(newpassword, options.cost);
      const encryptedPassword = crypto.AES.encrypt(
        hashedPassword,
        encryptionKey
      ).toString();
      const decryptedPassword = crypto.AES.decrypt(
        selectUserResult[0].password,
        encryptionKey
      ).toString(crypto.enc.Utf8);
      const passwordMatch = bcrypt.compareSync(oldpassword, decryptedPassword);

      if (!passwordMatch) {
        res.json({
          status: "error",
          message: "Incorrect Old Password",
        });
        return;
      }

      const updateQuery = "UPDATE usersdata SET password = ? WHERE id = ?";
      const updateParams = [encryptedPassword, authUser];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Password has been updated successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//get settings data
router.post("/getsettingsdata", async (req, res) => {
  const postData = req.body;
  const keynames = postData.keynames;

  try {
    const authUser = adminAuthorization(req, res);
    const settingslist = {};
    if (authUser) {
      const settingSelectQuery = `SELECT * FROM setting WHERE keyname IN (${keynames})`;
      const settingSelectResult = await Qry(settingSelectQuery);
      const settingsdbData = settingSelectResult;

      settingslist["values"] = settingsdbData;

      if (Object.keys(settingslist).length > 0) {
        res.json({
          status: "success",
          data: settingslist,
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});


router.post("/getcontractsdata", async (req, res) => {
  const postData = req.body;
  const keyids = postData.keyids;

  try {
    const authUser = adminAuthorization(req, res);
    const contractlist = {};
    if (authUser) {
      const settingSelectQuery = `SELECT * FROM contracts WHERE id IN (${keyids})`;
      const settingSelectResult = await Qry(settingSelectQuery);
      const settingsdbData = settingSelectResult;

      contractlist["values"] = settingsdbData;

      if (Object.keys(contractlist).length > 0) {
        res.json({
          status: "success",
          data: contractlist,
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//get deposit wallets
router.post("/getdepositwallets", async (req, res) => {
  try {
    const postData = req.body;
    const keynames = postData.keynames;
    const authUser = await checkAuthorization(req, res); // Assuming check_authorization() checks the authorization token

    if (authUser) {
      const userSelect = await Qry(
        "SELECT id as tid, keyname, keyvalue FROM setting WHERE keyname IN (" +
        keynames +
        ")"
      );
      const userslist = [];
      const usersdata = { entries: [] };

      for (const usersdbData of userSelect) {
        const user = JSON.parse(usersdbData.keyvalue);
        user.tid = usersdbData.tid; // Add the 'tid' column to the user object
        userslist.push(user);
      }

      usersdata.entries = userslist;

      if (userslist.length > 0) {
        return res.json({
          status: "success",
          data: usersdata,
          picturelink: `${backoffice_link}/uploads/walletqr/`,
        });
      } else {
        return res.json({
          status: "success",
          data: usersdata,
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//add new deposit wallet
router.post("/postdepositwallet", upload.single("image"), async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res); // Assuming check_authorization() checks the authorization token
    if (authUser) {
      const uploadDir = path.join(__dirname, "../public/uploads/walletqr/");
      const imageParts = req.body.image.split(";base64,");
      const imageTypeAux = imageParts[0].split("image/");
      const imageType = imageTypeAux[1];
      const imageBase64 = Buffer.from(imageParts[1], "base64");
      const filename = `${Date.now()}.png`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, imageBase64);

      date = new Date().toISOString().slice(0, 19).replace("T", " ");
      const postData = {
        obj: {
          coinname: req.body.coinname,
          walletqrcode: filename,
          walletaddress: req.body.walletaddress,
          walletmessage: req.body.walletmessage,
        },
      };
      const insData = JSON.stringify(postData.obj);

      const insertWallet = await Qry(
        "insert into setting(keyname,keyvalue) values ('depositwallet', '" +
        insData +
        "')"
      );
      if (insertWallet.affectedRows > 0) {
        res.json({
          status: "success",
          message: "New deposit wallet added successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//delete deposit wallet
router.post("/deletewallet", async (req, res) => {
  try {
    const tid = req.body.tid;
    const authUser = await checkAuthorization(req, res); // Assuming check_authorization() checks the authorization token

    if (authUser) {
      const tdel = await Qry("DELETE FROM setting WHERE id = ?", [tid]);

      if (tdel) {
        res.json({
          status: "success",
          message: "Wallet deleted successfully",
        });
      } else {
        res.json({
          status: "error",
          message: "Wallet was not deleted",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//update settings data
router.post("/updatesettingsdata", async (req, res) => {
  const postData = req.body;

  try {
    const authUser = adminAuthorization(req, res);
    if (authUser) {
      if (postData.image) {
        const uploadDir = path.join(
          __dirname,
          "../public/uploads/adminuploads/"
        );
        const imageParts = req.body.image.split(";base64,");
        const imageTypeAux = imageParts[0].split("image/");
        const imageType = imageTypeAux[1];
        const imageBase64 = Buffer.from(imageParts[1], "base64");
        const filename = `${Date.now()}.png`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, imageBase64);
        const currentDate = new Date().toISOString();

        postData.obj.walletqrcode = filename1;
        postData.obj.walletaddress = req.body.walletaddress;
        postData.obj.walletmessage = req.body.walletmessage;

        for (const [keyname, value] of Object.entries(postData.obj)) {
          const updateQuery = `UPDATE setting SET keyvalue = ? WHERE keyname = ?`;
          const updateParams = [value, keyname];
          await Qry(updateQuery, updateParams);
        }
        res.json({
          status: "success",
          message: "Deposit wallet updated successfully",
          qrpictureurl: `${backoffice_link}/backend_apis/views/uploads/walletqr/${filename1}`,
        });
      } else {
        for (const [keyname, value] of Object.entries(postData.obj)) {
          const updateQuery = `UPDATE setting SET keyvalue = ? WHERE keyname = ?`;
          const updateParams = [value, keyname];
          await Qry(updateQuery, updateParams);
        }

        res.json({
          status: "success",
          message: "settings data has been updated successfully",
        });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", message: e });
  }
});

router.post("/updatecontractsdata", async (req, res) => {
  const postData = req.body;

  try {
    const authUser = adminAuthorization(req, res);
    if (authUser) {
      console.log(postData.obj)
      for (const [keyname, value] of Object.entries(postData.obj)) {
        const updateQuery = `UPDATE contracts SET name = ?, amount = ?, status = ? WHERE id = ?`;
        const updateParams = [value.name, value.amount, value.status, keyname];
        await Qry(updateQuery, updateParams);
      }

      res.json({
        status: "success",
        message: "Contracts has been updated successfully",
      });

    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", message: e });
  }
});

//update user password
router.post("/updateuserpassword/", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;
    const userid = CleanHTMLData(CleanDBData(postData.userid));
    const password = CleanHTMLData(CleanDBData(postData.password));
    const confirmassword = CleanHTMLData(CleanDBData(postData.confirmpassword));
    const admintransactionpassword = CleanHTMLData(
      CleanDBData(postData.admintransactionpassword)
    );

    if (authUser) {
      const selectUserQuery = `SELECT * FROM usersdata WHERE id = ?`;
      const selectUserResult = await Qry(selectUserQuery, [authUser]);

      // Generate a salt for password hashing
      const saltRounds = 16; // The number of salt rounds determines the complexity of the hashing
      const salt = bcrypt.genSaltSync(saltRounds);

      const options = {
        cost: 12, // Specify the hashing cost (higher cost means more secure but slower)
        salt: salt, // Pass the generated salt
      };
      const hashedPassword = bcrypt.hashSync(password, options.cost);
      const encryptedPassword = crypto.AES.encrypt(
        hashedPassword,
        encryptionKey
      ).toString();
      const decryptedPassword = crypto.AES.decrypt(
        selectUserResult[0].admin_transaction_password,
        encryptionKey
      ).toString(crypto.enc.Utf8);
      const passwordMatch = bcrypt.compareSync(
        admintransactionpassword,
        decryptedPassword
      );

      if (!passwordMatch) {
        res.json({
          status: "error",
          message: "Invalid admin transaction password",
        });
        return;
      }

      if (password !== confirmassword) {
        res.json({
          status: "error",
          message: "Password does not matched",
        });
        return;
      }

      const updateQuery = "UPDATE usersdata SET password = ? WHERE id = ?";
      const updateParams = [encryptedPassword, userid];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "User password has been updated successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//update admin transaction password
router.post("/updatetransactionpassword", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;
    const oldpassword = CleanHTMLData(
      CleanDBData(postData.old_admin_transaction_password)
    );
    const newpassword = CleanHTMLData(
      CleanDBData(postData.admin_transaction_password)
    );

    if (authUser) {
      const selectUserQuery = `SELECT * FROM usersdata WHERE id = ?`;
      const selectUserResult = await Qry(selectUserQuery, [authUser]);

      // Generate a salt for password hashing
      const saltRounds = 16; // The number of salt rounds determines the complexity of the hashing
      const salt = bcrypt.genSaltSync(saltRounds);

      const options = {
        cost: 12, // Specify the hashing cost (higher cost means more secure but slower)
        salt: salt, // Pass the generated salt
      };
      const hashedPassword = bcrypt.hashSync(newpassword, options.cost);
      const encryptedPassword = crypto.AES.encrypt(
        hashedPassword,
        encryptionKey
      ).toString();
      const decryptedPassword = crypto.AES.decrypt(
        selectUserResult[0].admin_transaction_password,
        encryptionKey
      ).toString(crypto.enc.Utf8);
      const passwordMatch = bcrypt.compareSync(oldpassword, decryptedPassword);

      if (!passwordMatch) {
        res.json({
          status: "error",
          message: "Incorrect old transaction password",
          p: passwordMatch,
        });
        return;
      }

      const updateQuery =
        "UPDATE usersdata SET admin_transaction_password = ? WHERE id = ?";
      const updateParams = [encryptedPassword, authUser];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Transaction password has been updated successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

router.post("/blockuser", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;
    const userid = CleanHTMLData(CleanDBData(postData.userid));
    if (authUser) {
      const updateQuery = "UPDATE usersdata SET loginstatus = ? WHERE id = ?";
      const updateParams = ["Block", userid];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "User has been block successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

router.post("/unblockuser", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;
    const userid = CleanHTMLData(CleanDBData(postData.userid));
    if (authUser) {
      const updateQuery = "UPDATE usersdata SET loginstatus = ? WHERE id = ?";
      const updateParams = ["Unblock", userid];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "User has been unblock successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

// start kyc routs
router.post("/kycreport", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const getKYC = `SELECT k.*, ud.username, ud.firstname, ud.lastname, ud.email 
      FROM kyc k
      left join usersdata ud on k.userid = ud.id
      ORDER BY id DESC`;
      const kycData = await Qry(getKYC);
      const imageURL = `${backoffice_link}uploads/kyc/`;

      res.json({
        status: "success",
        data: kycData,
        imageURL: imageURL,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

router.post("/approvekyc", async (req, res) => {
  try {
    const postData = req.body;
    const kycId = postData.id;
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const selectkycQuery = `SELECT * FROM kyc WHERE id = ?`;
      const selectkycResult = await Qry(selectkycQuery, [kycId]);

      const updateKYC = await Qry("update kyc set status = ? where id = ?", [
        "Approved",
        kycId,
      ]);
      const updateUser = await Qry(
        "update usersdata set kyc_status = ? where id = ?",
        ["verified", selectkycResult[0].userid]
      );

      res.json({
        status: "success",
        data: "KYC has been approved successfully.",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

router.post("/rejectkyc", async (req, res) => {
  try {
    const postData = req.body;
    const kycId = postData.id;
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const selectkycQuery = `SELECT * FROM kyc WHERE id = ?`;
      const selectkycResult = await Qry(selectkycQuery, [kycId]);

      const updateKYC = await Qry("update kyc set status = ? where id = ?", [
        "Rejected",
        kycId,
      ]);
      const updateUser = await Qry(
        "update usersdata set kyc_status = ? where id = ?",
        ["unverified", selectkycResult[0].userid]
      );

      res.json({
        status: "success",
        data: "KYC has been rejected successfully.",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});
// end kyc routs

// start add deduct binary points
router.post("/adddeductbinarypoints", async (req, res) => {
  try {
    const postData = req.body;
    const userid = postData.userid;
    const points = postData.points;
    const type = postData.type;
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      if (type === "add") {
        const selectLeftBinaryPointsUsers = await Qry(
          "WITH RECURSIVE UserTree AS (SELECT `id`, `userid`, `pid`, `leg` FROM `binarytree` WHERE `userid` = ? UNION ALL SELECT bt.`id`, bt.`userid`, bt.`pid`, bt.`leg` FROM `binarytree` bt JOIN UserTree ut ON bt.`userid` = ut.`pid`) SELECT * FROM UserTree WHERE leg = ? ",
          [userid, "L"]
        );
        const leftreceiverIds = selectLeftBinaryPointsUsers.map(
          (row) => row.pid
        );
        let leftDataToInsert = JSON.stringify({
          receiver_ids: leftreceiverIds,
        });

        const selectRightBinaryPointsUsers = await Qry(
          "WITH RECURSIVE UserTree AS (SELECT `id`, `userid`, `pid`, `leg` FROM `binarytree` WHERE `userid` = ? UNION ALL SELECT bt.`id`, bt.`userid`, bt.`pid`, bt.`leg` FROM `binarytree` bt JOIN UserTree ut ON bt.`userid` = ut.`pid`) SELECT * FROM UserTree WHERE leg = ? ",
          [userid, "R"]
        );
        const rightreceiverIds = selectRightBinaryPointsUsers.map(
          (row) => row.pid
        );
        let rightDataToInsert = JSON.stringify({
          receiver_ids: rightreceiverIds,
        });

        if (leftreceiverIds.length > 0) {
          const insertLeftPoints = await Qry(
            "insert into points(sender_id,points,leg,type,period,receiver_ids) values (?, ?, ?, ?, ?, ?)",
            [
              userid,
              points,
              "L",
              "Add Binary Points By Admin",
              "month",
              leftDataToInsert,
            ]
          );
        } else {
          leftDataToInsert = NULL;
        }
        if (rightreceiverIds.length > 0) {
          const insertRightPoints = await Qry(
            "insert into points(sender_id,points,leg,type,period,receiver_ids) values (?, ?, ?, ?, ?, ?)",
            [
              userid,
              points,
              "R",
              "Add Binary Points By Admin",
              "month",
              rightDataToInsert,
            ]
          );
        } else {
          rightDataToInsert = NULL;
        }
      } else if (type === "deduct") {
        const selectLeftBinaryPointsUsers = await Qry(
          "WITH RECURSIVE UserTree AS (SELECT `id`, `userid`, `pid`, `leg` FROM `binarytree` WHERE `userid` = ? UNION ALL SELECT bt.`id`, bt.`userid`, bt.`pid`, bt.`leg` FROM `binarytree` bt JOIN UserTree ut ON bt.`userid` = ut.`pid`) SELECT * FROM UserTree WHERE leg = ? ",
          [userid, "L"]
        );
        const leftreceiverIds = selectLeftBinaryPointsUsers.map(
          (row) => row.pid
        );
        let leftDataToInsert = JSON.stringify({
          receiver_ids: leftreceiverIds,
        });

        const selectRightBinaryPointsUsers = await Qry(
          "WITH RECURSIVE UserTree AS (SELECT `id`, `userid`, `pid`, `leg` FROM `binarytree` WHERE `userid` = ? UNION ALL SELECT bt.`id`, bt.`userid`, bt.`pid`, bt.`leg` FROM `binarytree` bt JOIN UserTree ut ON bt.`userid` = ut.`pid`) SELECT * FROM UserTree WHERE leg = ? ",
          [userid, "R"]
        );
        const rightreceiverIds = selectRightBinaryPointsUsers.map(
          (row) => row.pid
        );
        let rightDataToInsert = JSON.stringify({
          receiver_ids: rightreceiverIds,
        });

        if (leftreceiverIds.length > 0) {
          const insertLeftPoints = await Qry(
            "insert into points(sender_id,points,leg,type,period,receiver_ids) values (?, ?, ?, ?, ?, ?)",
            [
              userid,
              points,
              "L",
              "Deduct Binary Points By Admin",
              "month",
              leftDataToInsert,
            ]
          );
        } else {
          leftDataToInsert = NULL;
        }
        if (rightreceiverIds.length > 0) {
          const insertRightPoints = await Qry(
            "insert into points(sender_id,points,leg,type,period,receiver_ids) values (?, ?, ?, ?, ?, ?)",
            [
              userid,
              points,
              "R",
              "Deduct Binary Points By Admin",
              "month",
              rightDataToInsert,
            ]
          );
        } else {
          rightDataToInsert = NULL;
        }
      } else {
        res.json({
          status: "error",
          message: "Something went wrong, please try again later.",
        });
        return;
      }
      res.json({
        status: "success",
        message: "Points has been " + type + "ed successfully.",
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});
// end add deduct binary points

router.post("/payoutreport", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res);
    if (authUser) {
      const transactionSelect = await Qry(`
      SELECT tr.*, ud.username, ud.firstname, ud.lastname, ud.email
      FROM transaction tr
      where type = 'Payout'
      ORDER BY id DESC
    `);

      const transactiondbData = transactionSelect;
      const transactionarray = { entries: transactiondbData };

      if (transactiondbData.length > 0) {
        res.status(200).json({ status: "success", data: transactionarray });
      } else {
        transactionarray.entries = [];
        res.status(200).json({ status: "success", data: transactionarray });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//select products
router.post("/getproduct", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const getProduct = `SELECT * from products ORDER BY id DESC`;
      const ProductData = await Qry(getProduct);
      const imageURL = `${backoffice_link}uploads/products/`;
      res.json({
        status: "success",
        data: ProductData,
        imageURL: imageURL,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//delete product
router.post("/deleteproduct", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const postData = req.body;
      const id = CleanHTMLData(CleanDBData(postData.id));

      const deleteQuery = "DELETE from products WHERE id = ?";
      const deleteParams = [id];
      const deleteResult = await Qry(deleteQuery, deleteParams);

      if (deleteResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Product deleted successfully!",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to delete Product",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Update Product Detail
router.post("/updateproduct/", upload.single("image"), async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;
    if (authUser) {
      const updates = [];
      const id = CleanHTMLData(CleanDBData(postData.id));
      delete postData.id;
      if (postData.image) {
        const uploadDir = path.join(__dirname, "../public/uploads/products/");
        const imageParts = req.body.image.split(";base64,");
        const imageTypeAux = imageParts[0].split("image/");
        const imageType = imageTypeAux[1];
        const imageBase64 = Buffer.from(imageParts[1], "base64");

        const filename = `${Date.now()}.png`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, imageBase64);
        postData.picture = filename;
      }
      delete postData.image;

      for (const [key, value] of Object.entries(postData)) {
        const sanitizedValue = CleanHTMLData(CleanDBData(value));
        updates.push(`${key} = '${sanitizedValue}'`);
      }

      const updateQuery = `UPDATE products  SET ${updates.join(
        ", "
      )}  WHERE id = ?`;
      const updateParams = [id];
      const updateResult = await Qry(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Product updated successfully",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to update product",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//select any report
router.post("/report", async (req, res) => {
  const postData = req.body;
  const reportType = CleanHTMLData(CleanDBData(postData.type));
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const reportSelectQuery = `
      SELECT t.id as id, u1.username AS senderusername, u2.username AS receiverusername, t.amount, t.createdat, t.approvedat, t.status, t.details, t.type,t.rejectreason, t.hash, t.payoutmethod, t.payoutaccount1, t.payoutaccount2, t.payoutaccount3, t.seen
      FROM transaction t
      LEFT JOIN usersdata u1 ON t.senderid = u1.id
      LEFT JOIN usersdata u2 ON t.receiverid = u2.id
      WHERE t.type=?   ORDER BY t.id DESC    
              `;

      const reportSelectParams = [reportType];
      let reportSelectResult = await Qry(reportSelectQuery, reportSelectParams);

      if (reportSelectResult.length < 1) {
        reportSelectResult = [];
      }
      res.json({
        status: "success",
        data: reportSelectResult,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});


router.post("/depositsummary", async (req, res) => {
  const postData = req.body;
  const reportType = CleanHTMLData(CleanDBData(postData.type));
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const reportSelectQuery = `
      SELECT t.id as id, u1.username AS senderusername, u2.username AS receiverusername, t.final_amount, t.amount, t.createdat, t.approvedat, t.status, t.details, t.type,t.rejectreason, t.hash, t.payoutmethod, t.payoutaccount1, t.payoutaccount2, t.payoutaccount3, t.seen
      FROM transaction t
      LEFT JOIN usersdata u1 ON t.senderid = u1.id
      LEFT JOIN usersdata u2 ON t.receiverid = u2.id
      WHERE t.type=? ORDER BY t.id DESC    
              `;

      const reportSelectParams = ['deposit'];
      let reportSelectResult = await Qry(reportSelectQuery, reportSelectParams);

      if (reportSelectResult.length < 1) {
        reportSelectResult = [];
      }
      res.json({
        status: "success",
        data: reportSelectResult,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});



router.post("/levelbonussummary", async (req, res) => {
  const postData = req.body;
  const reportType = CleanHTMLData(CleanDBData(postData.type));
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const reportSelectQuery = `
      SELECT t.id as id, u1.username AS senderusername, u2.username AS receiverusername, t.final_amount, t.amount, t.createdat, t.approvedat, t.status, t.details, t.type,t.rejectreason, t.hash, t.payoutmethod, t.payoutaccount1, t.payoutaccount2, t.payoutaccount3, t.seen
      FROM transaction t
      LEFT JOIN usersdata u1 ON t.senderid = u1.id
      LEFT JOIN usersdata u2 ON t.receiverid = u2.id
      WHERE t.type=? ORDER BY t.id DESC    
              `;

      const reportSelectParams = ['Level Bonus'];
      let reportSelectResult = await Qry(reportSelectQuery, reportSelectParams);

      if (reportSelectResult.length < 1) {
        reportSelectResult = [];
      }
      res.json({
        status: "success",
        data: reportSelectResult,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Add New Package
router.post("/addnewpackage", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const postData = req.body;

    if (authUser) {
      const title = CleanHTMLData(CleanDBData(postData.title));
      const amount = CleanHTMLData(CleanDBData(postData.amount));
      const roi = CleanHTMLData(CleanDBData(postData.roi));

      const insertQuery =
        "INSERT into packages (title,amount,roi) values (?,?,?)";
      const updateParams = [title, amount, roi];
      const updateResult = await Qry(insertQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "New package successfully!",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to insert package",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Get Packages
router.post("/getpackages", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const getpacakges = `SELECT p.id as tid, p.* from packages p where status = 1`;
      const pacakgesData = await Qry(getpacakges);
      res.json({
        status: "success",
        data: pacakgesData,
      });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//Delete News
router.post("/deletepackage", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const postData = req.body;
      const id = CleanHTMLData(CleanDBData(postData.id));

      const deleteQuery = "update packages set status = ? WHERE id = ?";
      const deleteParams = [0, id];
      const deleteResult = await Qry(deleteQuery, deleteParams);

      if (deleteResult.affectedRows > 0) {
        res.json({
          status: "success",
          message: "Package deleted successfully!",
        });
      } else {
        res.json({
          status: "error",
          message: "Failed to delete package",
        });
      }
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

router.post("/getdepositlist", async (req, res) => {
  try {
    const postData = req.body;
    const status = postData.status;
    const authUser = await checkAuthorization(req, res);
    const transactionslist = { entries: [] };

    let statuscondition = "";
    if (status !== "all") {
      statuscondition = `AND t.status = '${status}'`;
    }

    if (authUser) {
      const query = `
        SELECT t.id as tid, u.username AS senderusername, t.amount, t.hash, t.createdat, t.approvedat, t.status, t.details, t.type, t.hash
        FROM transaction t
        LEFT JOIN usersdata u ON t.senderid = u.id
        WHERE t.type = 'deposit'
        ${statuscondition}
      `;

      const transactionSelect = await Qry(query);
      const transactionsdbData = transactionSelect;

      transactionslist.entries = transactionsdbData;

      res.status(200).json({
        status: "success",
        data: transactionslist,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/verifyuseremailmanual", async (req, res) => {
  try {
    const postData = req.body;
    const userId = postData.userid;
    const authUser = await checkAuthorization(req, res);

    if (authUser) {
      const updateQuery = `
        UPDATE usersdata
        SET emailstatus = 'verified'
        WHERE id = ?
      `;

      const updateResult = await Qry(updateQuery, [userId]);

      if (updateResult.affectedRows > 0) {
        res.status(200).json({
          status: "success",
          message: "Email status updated successfully",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Something went wrong, please try again later",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

//update profile data
router.post("/depositaction", async (req, res) => {
  const postData = req.body;
  const action = CleanHTMLData(CleanDBData(postData.action));
  const rowId = CleanHTMLData(CleanDBData(postData.tid));

  try {
    const authUser = await adminAuthorization(req, res);
    let updateResult;
    if (authUser) {
      const selectTransaction = await Qry(
        `select * from transaction where id = ?`,
        [rowId]
      );
      const transactionData = selectTransaction[0];

      if (action === "approved") {
        updateResult = await Qry(
          `UPDATE transaction
        SET status = ? 
        WHERE status = 'pending' AND type = 'deposit' and id = ?`,
          [action, transactionData.id]
        );

        const updateUser = await Qry(
          `UPDATE usersdata
        SET current_balance = current_balance + ? 
        WHERE  id = ?`,
          [transactionData.amount, transactionData.senderid]
        );
      } else if (action === "rejected") {
        const reason = CleanHTMLData(CleanDBData(postData.reason));
        updateResult = await Qry(
          `UPDATE transaction
        SET status = ? , details = ?
        WHERE status = 'pending' AND type = 'deposit' and id = ?`,
          [action, reason, transactionData.id]
        );
      } else {
        res.json({
          status: "error",
          message: "invalid action",
        });
      }

      if (updateResult.affectedRows > 0) {
        res.status(200).json({
          status: "success",
          message: "Deposit " + action + " successfully",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

//dashboard data
router.post("/dashboard", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    const dashboarddata = {};

    if (authUser) {
      const selectInvestmentQuery =
        "SELECT SUM(amount) as total, type FROM transaction WHERE type = 'deposit'";
      const investmentData = await Qry(selectInvestmentQuery);
      if (investmentData[0].total === null || investmentData[0].total === '') {
        investmentData[0].total = 0
      }
      dashboarddata.deposit = parseFloat(investmentData[0].total).toFixed(2);

      const selectPayoutQuery =
        "SELECT SUM(amount) as total, type FROM transaction WHERE status = 'approved' AND type = 'payout'";
      const payoutData = await Qry(selectPayoutQuery);

      if (payoutData[0].total === null || payoutData[0].total === '') {
        payoutData[0].total = 0
      }

      dashboarddata.payout = parseFloat(payoutData[0].total).toFixed(2);

      const selectReferralBonusQuery =
        "SELECT SUM(amount) as total, type FROM transaction WHERE status = 'approved' AND type = 'referralbonus'";
      const referralBonusData = await Qry(selectReferralBonusQuery);
      dashboarddata.referralbonus = parseFloat(
        referralBonusData[0].total
      ).toFixed(2);

      const selectRoiQuery =
        "SELECT SUM(amount) as total FROM transaction WHERE type = 'roi'";
      const roiData = await Qry(selectRoiQuery);

      if (roiData[0].total === null || roiData[0].total === '') {
        roiData[0].total = 0
      }

      dashboarddata.roi = parseFloat(roiData[0].total).toFixed(2);

      const selectUnilevelBonusQuery =
        "SELECT SUM(amount) as total, type FROM transaction WHERE status = 'approved' AND type = 'unilevelbonus'";
      const unilevelBonusData = await Qry(selectUnilevelBonusQuery);
      dashboarddata.unilevelbonus = parseFloat(
        unilevelBonusData[0].total
      ).toFixed(2);

      const selectActiveUsersQuery =
        "SELECT COUNT(id) as total FROM usersdata WHERE status = 'approved'";
      const activeUsersData = await Qry(selectActiveUsersQuery);
      dashboarddata.activeusers = activeUsersData[0].total;

      const selectInactiveUsersQuery =
        "SELECT COUNT(id) as total FROM usersdata WHERE status = 'pending'";
      const inactiveUsersData = await Qry(selectInactiveUsersQuery);
      dashboarddata.inactiveusers = inactiveUsersData[0].total;

      res.status(200).json({
        status: "success",
        data: dashboarddata,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});


router.post("/roidata", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const selectRoiQuery =
        `SELECT r.*, ud.username
      FROM transaction r
      left join usersdata ud on r.receiverid = ud.id
      where type = 'roi'
      ORDER BY r.id DESC`;
      const roiData = await Qry(selectRoiQuery);

      res.status(200).json({
        status: "success",
        data: roiData,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

//last 7 days transactions
router.post("/lasttransactions", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const transactionSelect = await Qry(`
      SELECT * 
      FROM transaction
      WHERE createdat > DATE(NOW() - INTERVAL 7 DAY) AND (type = 'roi' or type = 'deposit')
      ORDER BY id DESC
    `);

      const transactiondbData = transactionSelect;
      const transactionarray = { entries: transactiondbData };

      if (transactiondbData.length > 0) {
        res.status(200).json({ status: "success", data: transactionarray });
      } else {
        transactionarray.entries = [];
        res.status(200).json({ status: "success", data: transactionarray });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//treeview
router.post("/gethierarchy", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res);
    const maxDepth = 3;
    const randomcode = req.body.randomcode;
    let finalData = [];

    if (authUser) {
      // Fetch user data for the authenticated user
      const selectUserQuery = "SELECT * FROM usersdata WHERE randomcode = ?";
      const selectUserResult = await Qry(selectUserQuery, [randomcode]);
      const userData = selectUserResult[0];

      // Fetch user hierarchy starting from the authenticated user's ID
      const users = await fetchUsers(userData.id, 1, maxDepth);

      // Create the desired parent node
      const firstNode = {
        id: userData.id,
        title: userData.username,
        img: "https://clipart-library.com/images/kTKo7BB8c.png",
        children: users, // Place the existing data as children of the desired parent node
      };

      finalData = [firstNode];

      res.status(200).json({
        status: "success",
        data: finalData,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});


router.post("/payoutsummary", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);

    if (authUser) {
      const postData = req.body;
      const status = CleanHTMLData(CleanDBData(postData.status));

      const selectTransactionsQuery = `SELECT t.id as tid, t.*, u1.username as senderusername, u2.username as receiverusername FROM transaction t 
    LEFT JOIN usersdata u1 ON t.senderid = u1.id 
    LEFT JOIN usersdata u2 ON t.receiverid = u2.id 
    WHERE t.type = ? and t.status = ?`;
      const selectTransactionsResult = await Qry(selectTransactionsQuery, ['payout', status]);

      res.status(200).json({
        status: "success",
        data: selectTransactionsResult,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: e.message });
  }
});

//delete user
router.post("/deleteuser", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res);
    const postData = req.body;
    const userId = postData.userid;

    if (authUser) {
      const deleteUserQuery = "DELETE FROM usersdata WHERE id = ?";
      const deleteUserResult = await Qry(deleteUserQuery, [userId]);

      if (deleteUserResult.affectedRows > 0) {
        res.status(200).json({
          status: "success",
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "User not found or not deleted",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/selecttransactions", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);

    if (authUser) {
      const postData = req.body;
      const type = CleanHTMLData(CleanDBData(postData.type));
      const status = CleanHTMLData(CleanDBData(postData.status));
      const userType = CleanHTMLData(CleanDBData(postData.usertype));

      let userCondition;
      if (userType === "sender") {
        userCondition = `And t.senderid = ${authUser}`;
      } else {
        userCondition = `And t.receiverid = ${authUser}`;
      }

      let statuscondition = "";
      if (status !== "all") {
        statuscondition = `AND t.status = '${status}'`;
      }

      const selectTransactionsQuery = `SELECT t.id as tid, t.*, u1.username as senderusername, u2.username as receiverusername FROM transaction t 
    LEFT JOIN usersdata u1 ON t.senderid = u1.id 
    LEFT JOIN usersdata u2 ON t.receiverid = u2.id 
    WHERE t.type = ? ${statuscondition} ${userCondition}`;
      const selectTransactionsResult = await Qry(selectTransactionsQuery, [
        type,
      ]);

      res.status(200).json({
        status: "success",
        data: selectTransactionsResult,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/payoutaction", async (req, res) => {
  try {
    const authUser = await adminAuthorization(req, res);
    const postData = req.body;
    const action = postData.action;
    const transactionid = postData.tid;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (authUser) {
      // Fetch transaction data
      const selectTransactionQuery = "SELECT * FROM transaction WHERE id = ?";
      const selectTransactionResult = await Qry(selectTransactionQuery, [
        transactionid,
      ]);
      const transactionData = selectTransactionResult[0];
      const userid = transactionData.receiverid;
      const payoutAmount = transactionData.amount;

      // Fetch user data
      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [userid]);
      const userData = selectUserResult[0];
      const username = userData.username;
      const email = userData.email;

      if (action === "approved") {
        // Update transaction status to 'approved'
        const updateTransactionQuery =
          "UPDATE transaction SET status = ?, approvedat = ? WHERE id = ?";
        await Qry(updateTransactionQuery, ["approved", date, transactionid]);

        // Email variables
        const company = company_name;


        // const title = "Payout Approved";
        // const emailimg = emailImagesLink + 'payout.png';
        // const heading = "Payout Approved";
        // const subheading = "The recent payout request is approved successfully";
        // const body = '<p style="text-align:left">Hello ' + username + ' <br> your payout request of $' + transactionData.amount + ' successfully approved  and sent to your desired account</p>';


        // const mailOptions = {
        //   from: {
        //     name: "Bank Of Tether",
        //     address: noreply_email,
        //   },
        //   to: {
        //     name: username,
        //     address: email,
        //   },
        //   subject: "Payout Approved on " + company_name,
        //   html: emailTemplate(
        //     title,
        //     emailimg,
        //     heading,
        //     subheading,
        //     body,
        //     company_name
        //   ),
        //   text: body,
        // };

        // transporter.sendMail(mailOptions, (err, info) => {
        //   if (err) {
        //     console.error("Error sending email:", err);
        //     res.json({
        //       status: "success",
        //       message: "withdrawal approved but email not sent",
        //       error: err,
        //     });
        //   } else {
        //     res.json({
        //       status: "success",
        //       message:
        //         "withdrawal approved successfully",
        //     });
        //   }
        // });

        res.json({
          status: "success",
          message:
            "withdrawal approved successfully",
        });

      }

      if (action === "rejected") {
        const reason = postData.reason;
        // Update transaction status to 'rejected' and provide a reason
        const updateTransactionQuery =
          "UPDATE transaction SET status = ?, rejectreason = ?, approvedat = ? WHERE id = ?";
        await Qry(updateTransactionQuery, [
          "rejected",
          reason,
          date,
          transactionid,
        ]);

        // Update user account balance
        const updateUserQuery =
          "UPDATE usersdata SET current_balance = current_balance + ? WHERE id = ?";
        await Qry(updateUserQuery, [payoutAmount, userid]);

        // Email variables
        //     const company = company_name;
        //     const title = "Payout Rejected";
        //     const emailimg = emailImagesLink + 'payout.png';
        //     const heading = "Payout Rejected";
        //     const subheading = "The recent payout request is rejected";
        //     const body = `<p style="text-align:left">Hello ${username} <br> your payout request of $${transactionData.amount} has been rejected
        //     <br>
        //     <b>Reason: ${reason}</b>
        //     </p>
        // `


        // const mailOptions = {
        //   from: {
        //     name: "Bank Of Tether",
        //     address: noreply_email,
        //   },
        //   to: {
        //     name: username,
        //     address: email,
        //   },
        //   subject: "Payout Rejected on " + company_name,
        //   html: emailTemplate(
        //     title,
        //     emailimg,
        //     heading,
        //     subheading,
        //     body,
        //     company_name
        //   ),
        //   text: body,
        // };

        // transporter.sendMail(mailOptions, (err, info) => {
        //   if (err) {
        //     console.error("Error sending email:", err);
        //     res.json({
        //       status: "success",
        //       message: "withdrawal rejected but email not sent",
        //       error: err,
        //     });
        //   } else {
        //     res.json({
        //       status: "success",
        //       message:
        //         "withdrawal rejected successfully",
        //     });
        //   }
        // });

        res.json({
          status: "success",
          message:
            "withdrawal rejected successfully",
        });

      }

    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

module.exports = router;
