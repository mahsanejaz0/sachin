const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const fs = require("fs");
const Coinpayments = require("coinpayments");
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
const CPKEY = process.env.CPKEY;
const CPSECRET = process.env.CPSECRET;
const CPCURRENCY = process.env.CPCURRENCY;

const backoffice_link = "https://nodeapp.mytether.co/";
const weblink = "https://app.mytether.co/";
const emailImagesLink =
  "https://threearrowstech.com/projects/quantum/public/images/email-images/";
const noreply_email = "mails@mytether.co";
const company_name = "Bank Of Tether";

const CoinpaymentsCredentials = {
  key: CPKEY,
  secret: CPSECRET
};

const client = new Coinpayments(CoinpaymentsCredentials)

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
      //Email variables
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
            Please note that your account must be verified to ensure the security of your information and provide a seamless user experience.
            </p>
            <p  style="text-align:left">
            Thank you for choosing ${company}! <br>

            Best regards,<br>
            The ${company} Team
            </p>
          `;
      const mailOptions = {
        from: {
          name: "Bank Of Tether",
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
              "Your account has been registered successfully. Please check your email for verification. Please check your spam folder.",
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
    console.log("Error executing query:", error);
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
        message: "Invalid account login.",
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
        message: "Invalid username or password.",
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
      message: error.message,
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



router.post("/dashboard", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {

      const sponsorLevelBonusQuery = "SELECT SUM(amount) as total from transaction where receiverid = ? and type = ?";
      const selectLevelBonusResult = await Qry(sponsorLevelBonusQuery, [authUser, 'Level Bonus']);

      let levelBonus = selectLevelBonusResult[0].total

      if (levelBonus === null || levelBonus === '') {
        levelBonus = 0
      }

      levelBonus = levelBonus.toFixed(2)

      const sponsorPayoutQuery = "SELECT SUM(final_amount) as total from transaction where receiverid = ? and type = ? and status = ?";
      const selectPayoutResult = await Qry(sponsorPayoutQuery, [authUser, 'payout', 'approved']);

      let payout = selectPayoutResult[0].total

      if (payout === null || payout === '') {
        payout = 0
      }

      const sponsorUserDataQuery = "SELECT pkgid from usersdata where id = ?";
      const selectUserDataResult = await Qry(sponsorUserDataQuery, [authUser]);

      const sponsorContractDataQuery = `
        SELECT SUM(c.amount) AS total_amount
        FROM contracts AS c
        INNER JOIN userpackages AS up ON c.id = up.pkgid
        WHERE up.status = ? AND up.userid = ?;
`;

      const selectContractDataResult = await Qry(sponsorContractDataQuery, ['active', authUser]);

      let total_contract_amount = selectContractDataResult[0].total_amount

      if (total_contract_amount === '' || total_contract_amount === null) {
        total_contract_amount = 0
      }


      obj = {
        levelBonus: levelBonus,
        payout: payout,
        contractName: 'Active Contracts',
        contractAmount: total_contract_amount
      }

      res.status(200).json(
        {
          status: "success",
          data: obj
        });
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

      // const selectSumDepositQuery = "SELECT SUM(amount) as total FROM transaction WHERE type = ? and senderid = ?";
      // const selectSumDepositResult = await Qry(selectSumDepositQuery, ['deposit', authUser]);

      const sponsorContractDataQuery = `
        SELECT SUM(c.amount) AS total_amount
        FROM contracts AS c
        INNER JOIN userpackages AS up ON c.id = up.pkgid
        WHERE up.status = ? AND up.userid = ?;
`;

      const selectContractDataResult = await Qry(sponsorContractDataQuery, ['active', authUser]);

      let min_withdrawal = selectContractDataResult[0].total_amount

      if (min_withdrawal === '' || min_withdrawal === null) {
        min_withdrawal = 0
      }

      if (min_withdrawal === 0) {
        res.status(200).json({
          status: "error",
          message: 'You are not able to withdrawal.',
        });
        return;
      }

      let min_withdrawal_amount = (min_withdrawal / 100) * 10

      let min_withdrawal_msg = 'You can withdrawal minimum $' + min_withdrawal_amount

      if (amount < min_withdrawal_amount) {
        res.status(200).json({
          status: "error",
          message: min_withdrawal_msg,
        });
        return;
      }

      const settingsData = await Qry(
        "SELECT * FROM `setting` WHERE keyname IN (?)",
        ["payout_fee"]
      );

      const payout_fee = settingsData[0].keyvalue;

      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];

      if (amount > userData.current_balance) {
        res.status(200).json({
          status: "error",
          message: 'Invalid amount. You have only $' + userData.current_balance + ' in your E-Wallet'
        });
        return;
      }

      let amount1 = amount - amount * (payout_fee / 100);
      let updatedbalance = userData.current_balance - amount;

      let message = `You have requested a withdrawal of $${amount}. After a ${payout_fee}% Payout Fee  your withdrawal of $${amount1} is being processed.`;

      const updateUserBalance = await Qry(
        "UPDATE usersdata set `current_balance`= ? where id = ?",
        [updatedbalance, authUser]
      );

      const insertTransactionsResult = await Qry(
        "INSERT INTO `transaction` (`receiverid`, `senderid`, `amount`, `final_amount`, `type`, `payoutaccount1`, `payoutaccount2`, `details`, `status`) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          userData.id,
          0,
          amount,
          amount1,
          type,
          payoutaccount1,
          payoutaccount2,
          message,
          "pending",
        ]
      );


      //Email variables
      const company = company_name;

      const title = "Payout request on " + company;
      const emailimg = emailImagesLink + "payout.png";
      const heading = "Payout Request";
      const subheading = "";

      let username = userData.username
      let email = userData.email

      // Construct the email content
      const body = `
            <p style="text-align:left">Dear ${username} <br> You have requested payout successfully on ${company}. It will be verify soon. Thank You</p>

            <p  style="text-align:left">
            Thank you for choosing ${company}! <br>

            Best regards,<br>
            The ${company} Team
            </p>
          `;
      const mailOptions = {
        from: {
          name: "Bank Of Tether",
          address: noreply_email,
        },
        to: {
          name: username,
          address: email,
        },
        subject: "Payout request on " + company_name,
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
      });

      res.status(200).json({
        status: "success",
        message: message,
      });
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ status: "error", message: e });
  }
});


router.post("/payoutdata", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {

      const sponsorContractDataQuery = `
        SELECT SUM(c.amount) AS total_amount
        FROM contracts AS c
        INNER JOIN userpackages AS up ON c.id = up.pkgid
        WHERE up.status = ? AND up.userid = ?;
`;

      const selectContractDataResult = await Qry(sponsorContractDataQuery, ['active', authUser]);

      let min_withdrawal = selectContractDataResult[0].total_amount

      if (min_withdrawal === '' || min_withdrawal === null) {
        min_withdrawal = 0
      }

      let amount = (min_withdrawal / 100) * 10

      res.status(200).json({
        status: "success",
        data: amount
      });
    }
  } catch (e) {
    console.log(e)
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


router.post("/deposit", async (req, res) => {
  try {
    const postData = req.body;
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const amount = postData.amount
      const password = postData.password
      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];
      const decryptedPassword = crypto.AES.decrypt(
        userData.password,
        encryptionKey
      ).toString(crypto.enc.Utf8);
      const passwordMatch = bcrypt.compareSync(
        password,
        decryptedPassword
      );

      if (!passwordMatch) {
        res.json({
          status: "error",
          message: "Invalid account password",
        });
        return;
      }
      let paymentAddress, CaInfo
      const selectCryptoAddress = await Qry(`select * from crypto_address where userid = ?`, [authUser]);
      if (selectCryptoAddress.length > 0) {
        paymentAddress = selectCryptoAddress[0].address
      } else {
        const CoinpaymentsGetCallbackAddressOpts = {
          currency: CPCURRENCY,
          ipn_url: 'http://localhost:8000/user/api/ipn'

        }
        CaInfo = await client.getCallbackAddress(CoinpaymentsGetCallbackAddressOpts)
        paymentAddress = CaInfo.address
        await Qry(`INSERT INTO crypto_address (userid, coin, address) values (?,?,?)`, [authUser, CPCURRENCY, CaInfo.address])
      }



      //   await Qry(`INSERT INTO create_deposit (user_id, amount, currency1, currency2, transaction_id, status) values (?,?,?,?,?,?)`, [authUser,Cinfo.amount,'USD',CPCURRENCY,Cinfo.txn_id,'pending'])

      res.status(200).json({
        status: "success",
        data: { address: paymentAddress },
      });

      // const settingsData = await Qry(
      //   "SELECT * FROM `setting` WHERE keyname IN (?)",
      //   [
      //     "deposit_fee"
      //   ]
      // );
      // const depositFee = settingsData[0].keyvalue;

      // let depositAmount = amount - ((amount / 100) * depositFee)

      // const updateUser = await Qry("update usersdata set current_balance = current_balance + ? where id = ?", [depositAmount, authUser]);
      // insertTransaction = await Qry(
      //   "insert into transaction ( receiverid, senderid, amount, final_amount, type, details) values ( ? , ? , ? , ? ,? , ?)",
      //   [
      //     0,
      //     authUser,
      //     amount,
      //     depositAmount,
      //     "deposit",
      //     "You have deposit $" + amount + " in your E-Wallet",
      //   ]
      // );

    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ status: "error", message: e.message });
  }
});


//get coinpayment transaction details
router.post("/gettransactiondetails", async (req, res) => {
  try {
    const postData = req.body;
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const txid = postData.txid

      const CoinpaymentsGetTxOpts = {
        txid: txid
      }
      const txDetails = await client.getTx(CoinpaymentsGetTxOpts)

      res.status(200).json({
        status: "success",
        data: txDetails,
      });

    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ status: "error", message: e.message });
  }
});


router.post("/ipn", async (req, res) => {
  try {
    const postData = req.body;
    await Qry(`insert into dummy(d_data) values (?)`, [JSON.stringify(postData)])
    const cryptoAddress = await Qry(`select * from crypto_address where address = ?`, [postData.address])
    if (postData.address === cryptoAddress[0].address) {
      const txnData = await Qry(`select * from crypto_payments where txid = ?`, [postData.txn_id])
      if (txnData.length > 0) {
        const update = await Qry(`update crypto_payments set confirms = ? , status = ? where txid = ?`, [postData.confirms, postData.status_text, postData.txn_id])

      } else {

        const settingsData = await Qry(
          "SELECT * FROM `setting` WHERE keyname IN (?)",
          [
            "deposit_fee"
          ]
        );
        const depositFee = settingsData[0].keyvalue;
        const amountusd = postData.fiat_amount;
        let depositAmount1 = amountusd - ((amountusd / 100) * depositFee)

        var depositAmount = parseFloat(depositAmount1.toFixed(2));

        const insert = await Qry(`insert into crypto_payments(userid, txid, address, coin, amount, amount_usd, confirms, status) values (?,?,?,?,?,?,?,?)`, [cryptoAddress[0].userid, postData.txn_id, postData.address, postData.currency, postData.amount, depositAmount, postData.confirms, postData.status_text]);
        const update_user = await Qry(`update usersdata set current_balance = current_balance+? where id = ?`, [depositAmount, cryptoAddress[0].userid]);

      }

    }

    // mail


    //Email variables
    const company = company_name;

    const title = "Deposit on " + company;
    const emailimg = emailImagesLink + "payout.png";
    const heading = "Deposit Successfully";
    const subheading = "";

    const usersData = await Qry(`select username, email from usersdata where id = ?`, [cryptoAddress[0].userid])
    let username = usersData[0].username
    let email = usersData[0].email

    // Construct the email content
    const body = `
            <p style="text-align:left">Dear ${username} <br> Thank you for deposit with ${company}! We are delighted to have you on board.</p>

            <p  style="text-align:left">
            Thank you for choosing ${company}! <br>

            Best regards,<br>
            The ${company} Team
            </p>
          `;
    const mailOptions = {
      from: {
        name: "Bank Of Tether",
        address: noreply_email,
      },
      to: {
        name: username,
        address: email,
      },
      subject: "Deposit successfully on " + company_name,
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
    });

    res.status(200).json({ status: "success" });

  } catch (e) {
    console.log(e.message)
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/getcontracts", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const selectUserQuery = "SELECT * FROM contracts WHERE status = ?";
      const selectUserResult = await Qry(selectUserQuery, ['On']);

      res.status(200).json({
        status: "success",
        data: selectUserResult,
      });
    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ status: "error", message: e.message });
  }
});


router.post("/getusercontracts", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const selectUserQuery = `select uc.*, c.name, c.amount from userpackages uc 
      LEFT JOIN contracts c ON uc.pkgid = c.id 
      where userid = ?
      `;
      const selectUserResult = await Qry(selectUserQuery, [authUser]);

      res.status(200).json({
        status: "success",
        data: selectUserResult,
      });
    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ status: "error", message: e.message });
  }
});


router.post("/depositreport", async (req, res) => {
  try {
    const authUser = await checkAuthorization(req, res);
    if (authUser) {
      const selectUserQuery = "SELECT * FROM crypto_payments where userid = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);

      res.status(200).json({
        status: "success",
        data: selectUserResult,
      });
    }
  } catch (e) {
    console.log(e.message)
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

router.post("/buycontract", async (req, res) => {
  const postData = req.body;
  const selectedpkg = CleanHTMLData(CleanDBData(postData.selectedpkg));
  const password = CleanHTMLData(CleanDBData(postData.password));
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {

      const selectPkg = await Qry(`select * from contracts where id = ?`, [selectedpkg]);
      const pkgData = selectPkg[0];
      const pkgAmount = parseInt(pkgData.amount);

      const selectcheckPkg = await Qry(`select * from userpackages where userid = ? and pkgid = ? and status = ?`, [authUser, selectedpkg, 'Active']);
      const arrayLength = selectcheckPkg.length;

      const selectUserQuery = "SELECT * FROM usersdata WHERE id = ?";
      const selectUserResult = await Qry(selectUserQuery, [authUser]);
      const userData = selectUserResult[0];
      const userWalletBalance = parseInt(userData.current_balance);
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

      if (userWalletBalance < pkgAmount) {
        res.json({
          status: "error",
          message: "You have insufficient balance to buy this contract",
        });
        return;
      }

      // if (arrayLength > 0) {
      //   res.json({
      //     status: "error",
      //     message: `You have already buy this contract.`,
      //   });
      //   return;
      // }

      const updateUser = await Qry(
        "update usersdata set status = ?, pkgid = ?, current_balance = current_balance - ?  where id = ?",
        ["approved", selectedpkg, pkgAmount, authUser]
      );

      const insertPkg = await Qry(
        "insert into userpackages (pkgid,userid,createdat) values (?,?,?)",
        [selectedpkg, authUser, date]
      );

      const settingsData = await Qry(
        "SELECT * FROM `setting` WHERE keyname IN (?, ?, ?, ?, ?, ?)",
        [
          "unilevel_status",
          "unilevel_bonus_level1",
          "unilevel_bonus_level2",
          "unilevel_bonus_level3",
          "unilevel_bonus_level4",
          "unilevel_bonus_level5",
        ]
      );
      let uniLevelStatus = settingsData[0].keyvalue;
      let sponsorid = userData.sponsorid
      let x = 1;
      if (uniLevelStatus === 'On') {
        while (x <= 5 && sponsorid !== '') {
          bonusValue = (settingsData[x].keyvalue / 100) * pkgAmount
          updateSponsorBalance = await Qry("update usersdata set current_balance = current_balance + ? where id = ?", [bonusValue, sponsorid])

          insertTransaction = await Qry("insert into transaction ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)", [sponsorid, authUser, bonusValue, 'Level Bonus', `Received Level ${x} commission from user ${userData.username}`])
          const snameData = await Qry(
            'SELECT * FROM usersdata WHERE id = ?',
            [sponsorid]
          );
          sponsorid = snameData[0].sponsorid;
          x++
        }
      }


      //Email variables
      const company = company_name;

      const title = "Purchase Contract on " + company;
      const emailimg = emailImagesLink + "welcome.png";
      const heading = "Purchase Contract Successfully";
      const subheading = "";

      let username = userData.username
      let email = userData.email

      // Construct the email content
      const body = `
            <p style="text-align:left">Dear ${username} <br> Thank you for purchasing contract with ${company}. You have successfully purchased contract of amount $${pkgData.amount}</p>

            <p  style="text-align:left">
            Thank you for choosing ${company}! <br>

            Best regards,<br>
            The ${company} Team
            </p>
          `;
      const mailOptions = {
        from: {
          name: "Bank Of Tether",
          address: noreply_email,
        },
        to: {
          name: username,
          address: email,
        },
        subject: "Purchase contract successfully on " + company_name,
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
      });

      res.json({
        status: "success",
        message: `You have successfully purchased a contract of amount $${pkgData.amount}`,
      });

    }
  } catch (error) {
    console.log(error)
    res.json({
      status: "error",
      errordetails: error.message,
    });
  }
});


router.post("/transferroi", async (req, res) => {
  const postData = req.body;
  let id = postData.id
  try {
    const authUser = await checkAuthorization(req, res); // Assuming checkAuthorization function checks the authorization token
    if (authUser) {

      const selectPkg = await Qry(`select * from userpackages where id = ?`, [id]);
      const pkgData = selectPkg[0];

      const selectUser = await Qry(`select * from usersdata where id = ?`, [pkgData.userid]);
      const userData = selectUser[0];

      const selectContract = await Qry(`select * from contracts where id = ?`, [pkgData.pkgid]);
      const contractData = selectContract[0];

      let roiAmount = pkgData.roi
      let contractAmount = contractData.amount

      let amount10 = (contractAmount / 100) * 10

      if (roiAmount < amount10) {
        res.json({
          status: "error",
          message: "You can transfer minimum 10% of your contract amount.",
        });
        return;
      }

      updateSponsorBalance = await Qry("update usersdata set current_balance = current_balance + ? where id = ?", [roiAmount, authUser])
      updateSponsorBalance = await Qry("update userpackages set roi = ?, transfered_roi = transfered_roi + ? where id = ?", [0, roiAmount, id])
      insertTransaction = await Qry("insert into transaction ( receiverid, senderid, pkgid, amount, type, details) values ( ?, ?, ? ,?, ?, ? )", [authUser, 0, contractData.id, roiAmount, 'ROI Transfer', `You have transfer $${roiAmount} to your E-Wallet`])

      const selectUserQuery = `select uc.*, c.name, c.amount from userpackages uc 
      LEFT JOIN contracts c ON uc.pkgid = c.id 
      where userid = ?
      `;
      const selectUserResult = await Qry(selectUserQuery, [authUser]);

      res.json({
        status: "success",
        message: `You have successfully transfer $${roiAmount} to your E-Wallet`,
        data: selectUserResult,
      });
    }
  } catch (error) {
    console.log(error)
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
    const settingsData = await Qry(
      "SELECT * FROM `setting` WHERE keyname IN (?)",
      [
        "roi",
      ]
    );
    const roi = settingsData[0].keyvalue;

    const selectPkgQuery = `SELECT * from userpackages where status = ?`;
    const selectPkgResult = await Qry(selectPkgQuery, ['Active']);
    selectPkgResult.map(async (data) => {

      const selectContract = `SELECT * from contracts where id = ?`;
      const selectContractResult = await Qry(selectContract, [data.pkgid]);
      const contractAmount = selectContractResult[0].amount;

      const roi_amount = (contractAmount / 100) * roi;

      updateROI = await Qry(
        "update userpackages set roi = roi + ?, total_roi = total_roi + ? where id = ?",
        [roi_amount, roi_amount, data.id]
      );

      insertTransaction = await Qry(
        "insert into transaction ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)",
        [
          data.userid,
          0,
          roi_amount,
          "roi",
          `Daily income ${roi}% on contract of $${contractAmount}`,
        ]
      );


      const selectCheckPkgQuery = `SELECT * from userpackages where id = ?`;
      const selectCheckPkgResult = await Qry(selectCheckPkgQuery, [data.id]);

      if (selectCheckPkgResult[0].total_roi >= contractAmount) {
        updateStatus = await Qry(
          "update userpackages set status = ? where id = ?",
          ['Expired', data.id]
        );

        updateUser = await Qry(
          "update usersdata set current_balance = current_balance + ? where id = ?",
          [contractAmount, data.userid]
        );

        insertTransaction = await Qry(
          "insert into transaction ( receiverid, senderid, amount, type, details) values ( ? , ? , ? ,? , ?)",
          [
            data.userid,
            0,
            contractAmount,
            "Contract Amount",
            `Your contract is expired. You have got $${contractAmount} to yout E-Wallet`,
          ]
        );


        //Email variables
        const company = company_name;

        const title = "Contract Expired on " + company;
        const emailimg = emailImagesLink + "welcome.png";
        const heading = "Contract Expired";
        const subheading = "";

        const selectUsersDataQuery = `SELECT username, email from usersdata where id = ?`;
        const selectUsersDataResult = await Qry(selectUsersDataQuery, [data.userid]);

        let username = selectUsersDataResult[0].username
        let email = selectUsersDataResult[0].email

        // Construct the email content
        const body = `
            <p style="text-align:left">Dear ${username} <br> Your contract has been expired on ${company}.</p>

            <p  style="text-align:left">
            Thank you for choosing ${company}! <br>

            Best regards,<br>
            The ${company} Team
            </p>
          `;
        const mailOptions = {
          from: {
            name: "Bank Of Tether",
            address: noreply_email,
          },
          to: {
            name: username,
            address: email,
          },
          subject: "Contract expired successfully on " + company_name,
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
        });

      }

    });

    res.status(200).json({ status: "succes", message: "done" });

  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

module.exports = router;
