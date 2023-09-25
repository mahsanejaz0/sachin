const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const fs = require("fs");
const chargebee = require("chargebee");
const { CleanHTMLData, CleanDBData } = require("../config/database/connection");
const emailTemplate = require("../helpers/emailTemplates/emailTemplates");
const transporter = require("../config/mail/mailconfig");
require("dotenv").config();
const encryptionKey = process.env.KEY;
const {
  Qry,
  checkAuthorization,
  randomToken,
  fetchUsers,
} = require("../helpers/functions");
const secretKey = process.env.jwtSecretKey;
const sitename = process.env.sitename;
const sitekey = process.env.sitekey;

const backoffice_link = "https://aura.threearrowstech.com/";
const weblink = "https://dashboard.skytsevni.net/";
const emailImagesLink =
  "https://threearrowstech.com/projects/quantum/public/images/email-images/";
const noreply_email = "mails@skytsevni.net";
const company_name = "Aura";

chargebee.configure({
  site: sitename,
  api_key: sitekey,
});

// Create a multer middleware for handling the file upload
const upload = multer();

//register new user
router.post("/register", async (req, res) => {
  const postData = req.body;
  const randomCode = randomToken(10);
  const emailToken = randomToken(150);

  const sponsorid = CleanHTMLData(CleanDBData(postData.sponsorid));
  const username = CleanHTMLData(CleanDBData(postData.username)).toLowerCase();
  const firstname = CleanHTMLData(CleanDBData(postData.firstname));
  const lastname = CleanHTMLData(CleanDBData(postData.lastname));
  const email = CleanHTMLData(CleanDBData(postData.email));
  const mobile = CleanHTMLData(CleanDBData(postData.mobile));
  const address = CleanHTMLData(CleanDBData(postData.address));
  const password = CleanHTMLData(CleanDBData(postData.password));
  const country = CleanHTMLData(CleanDBData(postData.country));
  const language = "";
  const zip_code = CleanHTMLData(CleanDBData(postData.zipcode));
  const city = CleanHTMLData(CleanDBData(postData.city));
  const birthday = CleanHTMLData(CleanDBData(postData.birthdate));

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

  try {
    const selectUsernameQuery = `SELECT * FROM usersdata WHERE username = ?`;
    const selectUsernameResult = await Qry(selectUsernameQuery, [username]);

    if (selectUsernameResult.length > 0) {
      res.json({
        status: "error",
        message: "The username you entered is already taken",
      });
      return;
    }

    const selectEmailQuery = `SELECT * FROM usersdata WHERE email = ?`;
    const selectEmailResult = await Qry(selectEmailQuery, [email]);

    if (selectEmailResult.length > 0) {
      res.json({
        status: "error",
        message: "An account with this email address already exists",
      });
      return;
    }

    const selectSponsorQuery = `SELECT * FROM usersdata WHERE randomcode = ?`;
    const selectSponsorResult = await Qry(selectSponsorQuery, [sponsorid]);
    const userSponsorId = selectSponsorResult[0].id;

    if (
      !sponsorid ||
      !selectSponsorResult ||
      selectSponsorResult.length === 0
    ) {
      res.json({
        status: "error",
        message: "Invalid sponsor name",
      });
      return;
    }

    const insertResult = await Qry(
      `INSERT INTO usersdata (mobile,sponsorid,username,password,email,country, address, zipcode, city, firstname, lastname, randomcode, emailtoken,status,birth_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mobile,
        userSponsorId,
        username,
        encryptedPassword,
        email,
        country,
        address,
        zip_code,
        city,
        firstname,
        lastname,
        randomCode,
        emailToken,
        "pending",
        birthday,
      ]
    );

    if (insertResult.affectedRows > 0) {
      // Email variables
      const company = company_name;
      const verify_link = `${weblink}login/${emailToken}/${email}`;

      const title = "Verify Your Account Registration on " + company;
      const emailimg = emailImagesLink + "welcome.png";
      const heading = "Registered Successfully";
      const subheading = "";

      // Construct the email content
      const body = `
            <p style="text-align:left">Dear ${username} <br> Thank you for registering with ${company}! We are delighted to have you on board. To complete the registration process and unlock full access to our platform, please verify your account by clicking the "Verify Account" button below:</p>
    
            <p><a href="${verify_link}" style="padding: 10px 15px;display: inline-block;border-radius: 5px;background: #1a253a;color: #ffffff;" class="btn btn-primary">Verify Account</a></p>
            
            <p style="text-align:left">
            If you are unable to click the button, you can also copy and paste the following link into your web browser:
            </p>
            
            <p style="text-align:left">${verify_link}</p>
            
            <p style="text-align:left">
            Please note that your account must be verified to ensure the security of your information and provide a seamless user experience. If you have any questions or need assistance, please don't hesitate to reach out to our support team at info@aura.com or chat with a support at <a href="https://app.aura.com">https://app.aura.com</a>
            </p>
            <p  style="text-align:left">
            Thank you for choosing ${company}! <br>
    
            Best regards,<br>
            The ${company} Team
            </p>
          `;
      const mailOptions = {
        from: {
          name: "Aura",
          address: noreply_email,
        },
        to: {
          name: username,
          address: email,
        },
        subject: "Signup successfully on " + company_name,
        html: emailTemplate(
          title,
          emailimg,
          heading,
          subheading,
          body,
          company_name
        ),
        text: body,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          res.json({
            status: "success",
            message: "Account created but email not sent",
            error: err,
          });
        } else {
          res.json({
            status: "success",
            message:
              "Your account has been registered successfully. Please check your email for verification. Please check your spam folder. If you still don't get the activation email, contact us: support@aura.com",
          });
        }
      });
    } else {
      res.json({
        status: "error",
        message: "Server error occurred in registration",
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

//login user
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
    } else if (user.username === username && passwordMatch) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: "365d" });
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
        name: "aura",
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

    if (
      selectUserResult.length > 0 &&
      userData.email === email &&
      userData.emailtoken === token
    ) {
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
        email,
        token,
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

//login user data
router.post("/userdata", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token

    if (authUser) {
      const userSelectResult = await Qry(
        `SELECT id as userid,pkgid, sponsorid, username, randomcode, firstname, lastname, email, picture, current_balance,  status, mobile, emailstatus, address, country, createdat, loginstatus, lastlogin, lastip, user_type FROM usersdata WHERE id = ?`,
        [authUser]
      );
      const userdbData = userSelectResult[0];

      if (userdbData.sponsorid !== "") {
        const sponsorSelectResult = await Qry(
          `SELECT username AS sponsorusername FROM usersdata WHERE id = ?`,
          [userdbData.sponsorid]
        );
        const sponsordbData = sponsorSelectResult[0];
        userdbData.sponsorusername = sponsordbData.sponsorusername;
      } else {
        userdbData.sponsorusername = "admin";
      }

      const transactionSelectResult = await Qry(
        `SELECT COALESCE(ROUND(SUM(amount)), 0) AS totalpayout FROM transaction WHERE type = ? AND receiverid = ?`,
        ["payout", authUser]
      );
      const transactiondbData = transactionSelectResult[0];

      const selectTreeResult = await Qry(
        `SELECT COUNT(*) AS count FROM usersdata WHERE sponsorid = ? AND status = ?`,
        [authUser, "approved"]
      );
      const count = selectTreeResult[0].count;

      const transactionResult = await Qry(
        `SELECT
      DATE_FORMAT(createdat, '%b') AS month,
      ROUND(SUM(amount)) AS amount FROM transaction WHERE receiverid = ? GROUP BY month ORDER BY
      FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')`,
        [authUser]
      );

      const totalRefBonusSelectResult = await Qry(
        `SELECT COALESCE(ROUND(SUM(amount)), 0) AS totalrefBonus FROM transaction WHERE type = ? AND receiverid = ?`,
        ["referralbonus", authUser]
      );
      const totalRefBonusdbData = totalRefBonusSelectResult[0].totalrefBonus;

      const refBonusSelectResult = await Qry(
        `SELECT
      DATE_FORMAT(createdat, '%b') AS month,
      ROUND(SUM(amount)) AS amount FROM transaction WHERE receiverid = ? and type = ? GROUP BY month ORDER BY
      FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')`,
        [authUser, "referralbonus"]
      );

      const totalLevelBonusSelectResult = await Qry(
        `SELECT COALESCE(ROUND(SUM(amount)), 0) AS totalLevelBonus FROM transaction WHERE type = ? AND receiverid = ?`,
        ["unilevelbonus", authUser]
      );
      const totalLevelBonusdbData =
        totalLevelBonusSelectResult[0].totalLevelBonus;

      const levelBonusSelectResult = await Qry(
        `SELECT
      DATE_FORMAT(createdat, '%b') AS month,
      ROUND(SUM(amount)) AS amount FROM transaction WHERE receiverid = ? and type = ? GROUP BY month ORDER BY
      FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')`,
        [authUser, "unilevelbonus"]
      );

      const totalRoiSelectResult = await Qry(
        `SELECT COALESCE(ROUND(SUM(amount)), 0) AS totalRoi FROM transaction WHERE type = ? AND receiverid = ?`,
        ["roi", authUser]
      );
      const totalRoidbData = totalRoiSelectResult[0].totalRoi;

      const roiSelectResult = await Qry(
        `SELECT
      DATE_FORMAT(createdat, '%b') AS month,
      ROUND(SUM(amount)) AS amount FROM transaction WHERE receiverid = ? and type = ? GROUP BY month ORDER BY
      FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')`,
        [authUser, "roi"]
      );

      userdbData.totalpayout = transactiondbData.totalpayout;
      userdbData.activereferrals = count;
      userdbData.referrallink = `${weblink}signup/${userdbData.randomcode}`;
      userdbData.profilepictureurl = `${backoffice_link}uploads/userprofile/${userdbData.picture}`;

      transactionResult.length === 0
        ? transactionResult.push({ month: "Jan", amount: 0 })
        : transactionResult;
      userdbData.balancetransactions = transactionResult;

      userdbData.totalRefBonus = totalRefBonusdbData;
      refBonusSelectResult.length === 0
        ? refBonusSelectResult.push({ month: "Jan", amount: 0 })
        : refBonusSelectResult;
      userdbData.refBonustransactions = refBonusSelectResult;
      userdbData.totalLevelBonus = totalLevelBonusdbData;
      levelBonusSelectResult.length === 0
        ? levelBonusSelectResult.push({ month: "Jan", amount: 0 })
        : levelBonusSelectResult;
      userdbData.levelBonustransactions = levelBonusSelectResult;
      userdbData.totalRoi = totalRoidbData;
      roiSelectResult.length === 0
        ? roiSelectResult.push({ month: "Jan", amount: 0 })
        : roiSelectResult;
      userdbData.roiTransactions = roiSelectResult;

      res.json({
        status: "success",
        data: userdbData,
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: "Server error occurred in query",
    });
  }
});

//single user data
router.post("/singleuserdata", async (req, res) => {
  const postData = req.body;
  const randomcode = CleanHTMLData(CleanDBData(postData.randomcode));

  try {
    const userSelectQuery = `SELECT sponsorid,username, randomcode, firstname, lastname, email, picture, current_balance,referral_side,  status, mobile, emailstatus, address, country, createdat, loginstatus, lastlogin, lastip, customerid,kyc_status FROM usersdata WHERE randomcode = ?`;

    const userSelectParams = [randomcode];
    const userSelectResult = await Qry(userSelectQuery, userSelectParams);
    const userdbData = userSelectResult[0];

    const sponsorSelectQuery = `SELECT username AS sponsorusername FROM usersdata WHERE id = ?`;
    const sponsorSelectParams = [userdbData.sponsorid];
    const sponsorSelectResult = await Qry(
      sponsorSelectQuery,
      sponsorSelectParams
    );
    const sponsordbData = sponsorSelectResult[0];

    if (userdbData.sponsorid === "") {
      userdbData.sponsorusername = "admin";
    } else {
      userdbData.sponsorusername = sponsordbData.sponsorusername;
    }

    res.json({
      status: "success",
      data: userdbData,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({
      status: "error",
      message: "Server error occurred",
    });
  }
});

//admin messages
router.post("/getmessageslist", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const messagesSelect = await Qry(
        `SELECT * FROM messages WHERE userid = '${authUser}' OR userid = 'all' ORDER BY id DESC LIMIT 20`
      );

      if (messagesSelect.length > 0) {
        const messagesArray = { entries: messagesSelect };
        res.status(200).json({ status: "success", data: messagesArray });
      } else {
        const messagesArray = {
          entries: [{ id: 1, type: "empty", details: "no new message" }],
        };
        res.status(200).json({ status: "success", data: messagesArray });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//get single message
router.post("/getsinglemessage", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const { messageid } = req.body;

      const messagesSelect = await Qry(`
      SELECT *
      FROM messages
      WHERE randomcode = '${messageid}' AND (userid = 'all' OR userid = '${authUser}')
    `);

      const messagesdbData = messagesSelect;

      if (messagesdbData.length > 0) {
        res.status(200).json({ status: "success", data: messagesdbData });
      } else {
        res.status(200).json({ status: "error", data: "no data found" });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//notifications data
router.post("/getnotifications", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const notificationsSelect = await Qry(`
      SELECT id, type, seen, details, createdat AS date
      FROM transaction
      WHERE (senderid = '${authUser}' OR receiverid = '${authUser}')
      AND NOT (senderid = '${authUser}' AND type = 'referralbonus')
      ORDER BY id DESC LIMIT 5
    `);

      if (notificationsSelect.length > 0) {
        const notificationsArray = { entries: notificationsSelect };
        res.status(200).json({ status: "success", data: notificationsArray });
      } else {
        const notificationsArray = {
          entries: [{ id: 1, type: "empty", details: "no new notifications" }],
        };
        res.status(200).json({ status: "success", data: notificationsArray });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//last 7 days transactions
router.post("/lastweektransactions", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const transactionSelect = await Qry(`
      SELECT * 
      FROM transaction
      WHERE createdat > DATE(NOW() - INTERVAL 7 DAY) AND (senderid = '${authUser}' OR receiverid = '${authUser}')
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

//get all referral users
router.post("/referralusers", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const referralSelect = await Qry(`
      SELECT username, firstname, lastname, picture, status, country, createdat mobile, email,createdat
      FROM usersdata
      WHERE sponsorid = '${authUser}'
      ORDER BY id DESC
    `);

      const referraldbData = referralSelect;
      const referralArray = { entries: referraldbData };

      if (referraldbData.length > 0) {
        referralArray.picturelink = `${backoffice_link}/backend_apis/views/uploads/userprofile/`;
        res.status(200).json({ status: "success", data: referralArray });
      } else {
        const referralArray = { entries: [] };
        res.status(200).json({
          status: "error",
          data: referralArray,
          message: "no referral found",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//update user profile data
router.post("/updateprofiledata", async (req, res) => {
  const postData = req.body;
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const updates = [];
      const date = new Date().toISOString();
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
  "/updateprofilepicture",
  upload.single("image"),
  async (req, res) => {
    const postData = req.body;
    try {
      const authUser = await checkAuthorization(req, res);
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

//update profile password
router.post("/updatepassword", async (req, res) => {
  const postData = req.body;

  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    const oldpassword = CleanHTMLData(CleanDBData(postData.oldpassword));
    const newpassword = CleanHTMLData(CleanDBData(postData.newpassword));
    if (authUser) {
      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];

      if (!userData || userData.id !== authUser) {
        res.json({
          status: "error",
          message: "Invalid data contact support for this issue",
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
      const hashedPassword = bcrypt.hashSync(newpassword, options.cost);
      const encryptedPassword = crypto.AES.encrypt(
        hashedPassword,
        encryptionKey
      ).toString();
      const decryptedPassword = crypto.AES.decrypt(
        userData.password,
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
          message: "Password updated successfully",
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

// Start news
router.post("/news", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      // start latest news data
      const selectnewsQuery = `SELECT * FROM news ORDER BY id DESC`;
      const selectnewsResult = await Qry(selectnewsQuery);
      // end latest news data

      res.status(200).json({
        status: "success",
        news: selectnewsResult,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

router.post("/singlenews", async (req, res) => {
  try {
    const postData = req.body;
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      let id = postData.newsid;
      // start latest news data
      const selectnewsQuery = `SELECT * FROM news where id = ?`;
      const selectnewsResult = await Qry(selectnewsQuery, [id]);
      // end latest news data

      res.status(200).json({
        status: "success",
        news: selectnewsResult,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});
// End news
//get settings data
router.post("/getsettingsdata", async (req, res) => {
  const postData = req.body;
  const keynames = postData.keynames;

  try {
    const authUser = await checkAuthorization(req, res);
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
//payout request

router.post("/payoutrequest", async (req, res) => {
  try {
    const postData = req.body;
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      let amount = CleanHTMLData(CleanDBData(postData.amount));
      const payoutaccount1 = CleanHTMLData(
        CleanDBData(postData.payoutaccount1)
      );
      const payoutaccount2 = CleanHTMLData(
        CleanDBData(postData.payoutaccount2)
      );
      const type = CleanHTMLData(CleanDBData(postData.type));
      const status = CleanHTMLData(CleanDBData(postData.status));

      const settingsData = await Qry(
        "SELECT * FROM `setting` WHERE keyname IN (?, ?, ?)",
        ["payout_fee", "min_payout", "payout_flat_fee"]
      );

      const payout_fee = settingsData[0].keyvalue;
      const min_payout = settingsData[1].keyvalue;
      const payout_flat_fee = settingsData[2].keyvalue;

      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];

      let amount1 = amount - amount * (payout_fee / 100) - payout_flat_fee;
      let updatedbalance = userData.current_balance - amount;

      let message = `You have requested a withdrawal of $${amount}. After a ${payout_fee}% Payout Fee and a $${payout_flat_fee} network fee, your $${amount1} withdrawal is being processed.`;
      let details = `You have requested a withdrawal of $${amount}. After a ${payout_fee}% Payout Fee and a $${payout_flat_fee} network fee, your withdrawal amount is $${amount1}.`;

      const updateUserBalance = await Qry(
        "UPDATE usersdata set `current_balance`= ? where id = ?",
        [updatedbalance, authUser]
      );

      const insertTransactionsResult = await Qry(
        "INSERT INTO `transaction` (`receiverid`, `senderid`, `amount`,`type`,`payoutaccount1`,`payoutaccount2`,`details`,`status`) VALUES (?,?,?,?,?,?,?,?)",
        [
          userData.id,
          0,
          amount1,
          type,
          payoutaccount1,
          payoutaccount2,
          details,
          "pending",
        ]
      );

      res.status(200).json({
        status: "success",
        message: message,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e });
  }
});

//Insert Any Transaction

router.post("/transaction", async (req, res) => {
  try {
    const postData = req.body;
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const date = new Date().toISOString();
      if (postData.type === "deposit") {
        postData.senderid = authUser;
        postData.receiverid = 0;
        const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
        const selectUserResult = await Qry(selectUserQuery, [authUser]);
        const userData = selectUserResult[0];
        const decryptedPassword = crypto.AES.decrypt(
          userData.password,
          encryptionKey
        ).toString(crypto.enc.Utf8);
        const passwordMatch = bcrypt.compareSync(
          postData.password,
          decryptedPassword
        );

        if (!passwordMatch) {
          res.json({
            status: "error",
            message: "Invalid account password",
          });
          return;
        }
      }
      delete postData.password;
      // Prepare data for insertion into the 'transaction' table
      const transactionData = {
        ...postData,
        createdat: date,
      };

      // Clean and insert the transaction data
      const keys = Object.keys(transactionData).filter(
        (key) => key !== "password"
      );
      const values = keys.map((key) =>
        CleanHTMLData(CleanDBData(transactionData[key]))
      );
      const insertTransactionQuery = `INSERT INTO transaction(${keys.join(
        ", "
      )}) VALUES (${values.map(() => "?").join(", ")})`;
      await Qry(insertTransactionQuery, values);

      res.status(200).json({
        status: "success",
        message: "Transaction submitted successfully",
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post(
  "/uploadkycdata",
  upload.fields([
    { name: "idcardFront", maxCount: 1 },
    { name: "idcardBack", maxCount: 1 },
  ]),
  async (req, res) => {
    const postData = req.body;
    try {
      const authUser = await checkAuthorization(req, res);
      if (authUser) {
        let id_front, id_back;
        const uploadDir = path.join(__dirname, "../public/uploads/kyc/");

        const identityType = postData.identityType;
        const residentialAddress = postData.residentialAddress;
        const date = new Date().toISOString().slice(0, 19).replace("T", " ");

        if (identityType === "Passport") {
          const idCardFront = postData.idcardFront.split(";base64,");
          const idCardFrontTypeAux = idCardFront[0].split("image/");
          const idCardFrontType = idCardFrontTypeAux[1];
          const idCardFrontBase64 = Buffer.from(idCardFront[1], "base64");
          const idCardFrontFilename = `${Date.now()}.png`;
          const idCardFrontFilePath = path.join(uploadDir, idCardFrontFilename);
          fs.writeFileSync(idCardFrontFilePath, idCardFrontBase64);
          id_front = idCardFrontFilename;
          id_back = "";
        } else if (identityType === "Identity Card") {
          // Process the front and back sides of the identity (ID card)
          const idCardFront = postData.idcardFront.split(";base64,");
          const idCardFrontTypeAux = idCardFront[0].split("image/");
          const idCardFrontType = idCardFrontTypeAux[1];
          const idCardFrontBase64 = Buffer.from(idCardFront[1], "base64");
          const idCardFrontFilename = `${Date.now()}.png`;
          const idCardFrontFilePath = path.join(uploadDir, idCardFrontFilename);
          fs.writeFileSync(idCardFrontFilePath, idCardFrontBase64);
          const idCardBack = postData.idcardBack.split(";base64,");
          const idCardBackTypeAux = idCardBack[0].split("image/");
          const idCardBackType = idCardBackTypeAux[1];
          const idCardBackBase64 = Buffer.from(idCardBack[1], "base64");
          const idCardBackFilename = `${Date.now()}.png`;
          const idCardBackFilePath = path.join(uploadDir, idCardBackFilename);
          fs.writeFileSync(idCardBackFilePath, idCardBackBase64);
          id_front = idCardFrontFilename;
          id_back = idCardBackFilename;
        } else {
          res.status(400).json({
            status: "error",
            message: "Invalid identity type selected.",
          });
        }

        const insertPackageResult = await Qry(
          "INSERT INTO `kyc`(`userid`, `id_front`, `id_back`, `address`, `type`, `date`) VALUES (?,?,?,?,?,?)",
          [authUser, id_front, id_back, residentialAddress, identityType, date]
        );

        const updateUser = await Qry(
          "update usersdata set kyc_status = ? where id = ?",
          ["Uploaded", authUser]
        );
        if (
          insertPackageResult.affectedRows > 0 &&
          updateUser.affectedRows > 0
        ) {
          res.status(200).json({
            status: "success",
            message: "K.Y.C data uploaded successfully",
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: "error", message: e });
    }
  }
);

router.post("/getadminwallet", async (req, res) => {
  try {
    const keynames = req.body.keynames;
    const authUser = await checkAuthorization(req, res); // Assuming check_authorization() checks the authorization token
    const userslist = [];
    const usersdata = {};

    if (authUser) {
      const userSelect = await Qry(
        "SELECT id AS tid, keyname, keyvalue FROM setting WHERE keyname IN (" +
          keynames +
          ")"
      );
      const rows = userSelect;

      for (const row of rows) {
        const user = JSON.parse(row.keyvalue);
        user.tid = row.tid; // Add the 'tid' column to the decoded user object
        userslist.push(user);
      }

      usersdata.entries = userslist;

      if (!userslist.length) {
        usersdata.entries = [];
      }

      res.json({
        status: "success",
        data: usersdata,
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

router.post("/getsingledepositwallet", async (req, res) => {
  try {
    const tid = req.body.tid;
    const authUser = await checkAuthorization(req, res);
    const userslist = [];
    const usersdata = {};

    if (authUser) {
      const userSelect = await Qry(
        "SELECT id AS tid, keyname, keyvalue FROM setting WHERE id = ?",
        [tid]
      );
      const row = userSelect[0];

      const user = JSON.parse(row.keyvalue);
      user.tid = row.tid; // Add the 'tid' column to the decoded user object
      userslist.push(user);
      usersdata.entries = userslist;
      usersdata.picturelink = `${backoffice_link}/uploads/walletqr/`;
      res.json({
        status: "success",
        data: usersdata,
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

// Binary Bonus add to current balance on 10th of every month

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

      const selectTransactionsQuery = `SELECT t.*, u1.username as senderusername, u2.username as receiverusername FROM transaction t 
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

router.post("/getfaqs", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      // Fetch FAQs from the database
      const faqsSelect = await Qry("SELECT * FROM faq");
      const faqsdbData = faqsSelect;

      if (faqsdbData.length < 1) {
        // If no FAQs are found, return a default entry
        faqsArray.entries.push({
          id: 1,
          type: "empty",
          details: "no new faqs",
        });
      }

      res.status(200).json({
        status: "success",
        data: faqsdbData,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

//Get Packages
router.post("/getpackages", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const selectUser = await Qry("select pkgid from usersdata where id = ?", [
        authUser,
      ]);
      const userData = selectUser[0];

      const getpacakges = `SELECT p.id as tid, p.* from packages p where status = ? and id > ?`;
      const pacakgesData = await Qry(getpacakges, [1, userData.pkgid]);
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

//Get purchased Packages summary
router.post("/getpackagessummary", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      const getpacakges = await Qry(
        `select up.id as tid, up.*, p.title,p.amount,p.roi from userpackages up 
      LEFT JOIN packages p ON up.pkgid = p.id 
      where userid = ?
      `,
        [authUser]
      );

      res.json({
        status: "success",
        data: getpacakges,
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

//deploy user to system and in chargebee
router.post("/deployuser", async (req, res) => {
  const postData = req.body;
  const selectedpkg = CleanHTMLData(CleanDBData(postData.selectedpkg));
  const amount = CleanHTMLData(CleanDBData(postData.amount));
  const password = CleanHTMLData(CleanDBData(postData.password));
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {
      let amountToPay;
      const selectPkg = await Qry(`select * from packages where id = ?`, [
        selectedpkg,
      ]);
      const pkgData = selectPkg[0];
      const pkgAmount = parseInt(pkgData.amount);

      if (pkgData.fee_type === "percentage") {
        amountToPay =
          (parseInt(pkgData.fee) / 100) * pkgAmount + pkgAmount;
      } else {
        amountToPay = parseInt(pkgData.fee) + pkgAmount;
      }

      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];
      const userSponsorId = userData.sponsorid;
      const userWalletBalance = parseInt(userData.current_balance);
      const username = userData.username;
      const email = userData.email;
      // Generate a salt for password hashing
      const saltRounds = 16; // The number of salt rounds determines the complexity of the hashing
      const salt = bcrypt.genSaltSync(saltRounds);

      const options = {
        cost: 12, // Specify the hashing cost (higher cost means more secure but slower)
        salt: salt, // Pass the generated salt
      };
      const decryptedPassword = crypto.AES.decrypt(
        userData.password,
        encryptionKey
      ).toString(crypto.enc.Utf8);
      const passwordMatch = bcrypt.compareSync(password, decryptedPassword);

      if (!passwordMatch) {
        res.json({
          status: "error",
          message: "Incorrect account password",
        });
        return;
      }

      if (userWalletBalance < amountToPay) {
        res.json({
          status: "error",
          message: "Your account balance is below the package amount ",
        });
        return;
      }

      if (pkgData.id === userData.pkgid) {
        res.json({
          status: "error",
          message: `You are already a member of this package ${pkgData.id} === ${userData.pkgid}`,
        });
        return;
      }

      const updateUser = await Qry(
        "update usersdata set status = ?, pkgid = ?, current_balance = current_balance - ? where id = ?",
        ["approved", selectedpkg, amountToPay, authUser]
      );

      const insertPkg = await Qry(
        "insert into userpackages (pkgid,userid,createdat) values (?,?,?)",
        [selectedpkg, authUser, date]
      );

      const settingsData = await Qry(
        "SELECT * FROM `setting` WHERE keyname IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "referral_commission_status",
          "referral_commission_type",
          "referral_commission_value",
          "unilevel_status",
          "unilevel_bonus_level1",
          "unilevel_bonus_level2",
          "unilevel_bonus_level3",
          "unilevel_bonus_level4",
          "unilevel_bonus_level5",
          "unilevel_bonus_level6",
          "unilevel_bonus_level7",
          "unilevel_bonus_level8",
          "unilevel_bonus_level9",
          "unilevel_bonus_level10",
        ]
      );

      const referralCommissionType = settingsData[0].keyvalue;
      const referralCommissionValue = settingsData[1].keyvalue;
      const referralCommissionStatus = settingsData[2].keyvalue;
      let commissionAmount;

      if (referralCommissionStatus === "On" && userSponsorId !== "") {
        referralCommissionType === "Percentage"
          ? (commissionAmount = (referralCommissionValue / 100) * amount)
          : referralCommissionType === "Flat"
          ? (commissionAmount = referralCommissionValue)
          : (commissionAmount = 0);

        if (commissionAmount > 0) {
          updateSponsorBalance = await Qry(
            "update usersdata set current_balance = current_balance + ? where id = ?",
            [commissionAmount, userSponsorId]
          );

          insertTransaction = await Qry(
            "insert into transaction ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)",
            [
              userSponsorId,
              userData.id,
              commissionAmount,
              "referralbonus",
              "received referral bonus on investment from sponsor user " +
                userData.username,
            ]
          );
        }
      }

      if (updateUser.affectedRows > 0 && insertPkg.affectedRows > 0) {
        // Email variables
        const company = company_name;
        const title = "Package upgraded successfully " + company;
        const emailimg = emailImagesLink + "welcome.png";
        const heading = "Package Upgraded";
        const subheading = "";

        // Construct the email content
        const body = `
              <p style="text-align:left">Dear ${username} <br> you hae successfully purchased the package of amount $${pkgData.amount}:</p>

              <p style="text-align:left">
              keep upgrading for seamless benefits:
              </p>

              <p style="text-align:left">
              Please note that your account must be verified to ensure the security of your information and provide a seamless user experience. If you have any questions or need assistance, please don't hesitate to reach out to our support team at info@aura.com or chat with a support at <a href="https://app.aura.com">https://app.aura.com</a>
              </p>
              <p  style="text-align:left">
              Thank you for choosing ${company}! <br>

              Best regards,<br>
              The ${company} Team
              </p>
            `;
        const mailOptions = {
          from: {
            name: "Aura",
            address: noreply_email,
          },
          to: {
            name: username,
            address: email,
          },
          subject: "Package Upgraded",
          html: emailTemplate(
            title,
            emailimg,
            heading,
            subheading,
            body,
            company_name
          ),
          text: body,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
            res.json({
              status: "success",
              message: "Package purchased successfully - email not sent",
            });
          } else {
            res.json({
              status: "success",
              message: `You have successfully purchased a package of amount $${pkgData.amount}`,
            });
          }
        });
      } else {
        res.json({
          status: "error",
          message: "Server error occurred in registration",
        });
      }
    }
  } catch (error) {
    res.json({
      status: "error",
      errordetails: error.message,
    });
  }
});

router.post("/gethierarchy", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    const maxDepth = 3;
    let finalData = [];

    if (authUser) {
      // Fetch user hierarchy starting from the authenticated user's ID
      const users = await fetchUsers(authUser, 1, maxDepth);

      // Fetch user data for the authenticated user
      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];

      // Create the desired parent node
      const firstNode = {
        id: authUser,
        title: userData.username,
        img: "https://clipart-library.com/images/kTKo7BB8c.png",
        children: users, // Place the existing data as children of the desired parent node
      };

      finalData = [firstNode];

      if (firstNode.children.length > 0) {
        res.status(200).json({
          status: "success",
          data: finalData,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "No data found",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/roicronjob", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    const maxDepth = 3;
    let finalData = [];

    const settingsData = await Qry(
      "SELECT * FROM `setting` WHERE keyname IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "referral_commission_status",
        "referral_commission_type",
        "referral_commission_value",
        "unilevel_status",
        "unilevel_bonus_level1",
        "unilevel_bonus_level2",
        "unilevel_bonus_level3",
        "unilevel_bonus_level4",
        "unilevel_bonus_level5",
        "unilevel_bonus_level6",
        "unilevel_bonus_level7",
        "unilevel_bonus_level8",
        "unilevel_bonus_level9",
        "unilevel_bonus_level10",
      ]
    );

    const uniLevelStatus = settingsData[3].keyvalue;

    if (authUser) {
      const selectUserQuery = `SELECT ud.pkgid,ud.sponsorid,ud.id,ud.username, p.roi as pkg_roi_percentage,p.amount as pkg_amount FROM usersdata ud
      LEFT JOIN packages p ON ud.pkgid = p.id 
      where ud.status = 'approved'
      `;
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      selectUserResult.map(async (user) => {
        const roi_percentage = user.pkg_roi_percentage;
        const pkg_amount = user.pkg_amount;
        const roi_amount = (roi_percentage / 100) * pkg_amount;
        const userId = user.id;
        const userSponsorId = user.sponsorid;
        const username = user.username;

        updateUserBalance = await Qry(
          "update usersdata set current_balance = current_balance + ? where id = ?",
          [roi_amount, userId]
        );

        insertTransaction = await Qry(
          "insert into transaction ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)",
          [
            userId,
            0,
            roi_amount,
            "roi",
            `Daily income ${roi_percentage}% on pkg of  $${pkg_amount}`,
          ]
        );

        let bonusValue, bonusType, bonusDetails;
        let x = 4;
        let level = 1;
        let sponsorid = userSponsorId;
        if (uniLevelStatus === "On") {
          while (x <= 8 && sponsorid !== "") {
            if (level === 1) {
              bonusType = "referralbonus";
              bonusDetails = `Received referral commission from user ${username} on  daily income`;
            } else {
              bonusType = "unilevelbonus";
              bonusDetails = `Received Level ${level} commission from user ${username} on daily income`;
            }
            const bonusPercentage = settingsData[x].keyvalue;
            bonusValue = (bonusPercentage / 100) * roi_amount;
            updateSponsorBalance = await Qry(
              "update usersdata set current_balance = current_balance + ? where id = ?",
              [bonusValue, sponsorid]
            );

            insertTransaction = await Qry(
              "insert into transaction ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)",
              [sponsorid, userId, bonusValue, bonusType, bonusDetails]
            );
            const snameData = await Qry(
              "SELECT * FROM usersdata WHERE id = ?",
              [sponsorid]
            );
            sponsorid = snameData[0].sponsorid;
            x++;
            level++;
          }
        }
      });

      res.status(200).json({ status: "succes", message: "done" });
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

module.exports = router;
