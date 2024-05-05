require('dotenv').config();
var express = require('express');
var { Pool } = require('pg');
var nodemailer = require('nodemailer');
var cors = require('cors');

var app = express();

// Database pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const secondaryPool = new Pool({
  user: process.env.SC_DB_USER,
  host: process.env.SC_DB_HOST,
  database: process.env.SC_DB_DATABASE,
  password: process.env.SC_DB_PASSWORD,
  port: process.env.SC_DB_PORT,
});

app.use(cors());
app.use(express.json());

// Nodemailer setup
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

// Generate and send verification code
// This object will hold the email and verification code pairs
let verificationCodes = {};

// Generate and send verification code
app.post('/send-verification-code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }

  // Generate a random verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the code in the in-memory object
  verificationCodes[email] = verificationCode;

// Send the code to the user's email
var mailOptions = {
  from: process.env.MAIL_USER,
  to: email,
  subject: 'Your AutoJob Verification Code',
  text: `Hello,

  Thank you for registering with AutoJob. We're excited to have you on board and are ready to assist you in finding your next great job opportunity.

  Your verification code is: ${verificationCode}

  Please enter this code on the verification page to continue. The code is valid for 10 minutes and can only be used once.

  If you didn't request this code, please ignore this email.

  Warm regards,
  The AutoJob Team`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending the code');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Verification code sent');
    }
  });
});

// Verify the code
app.post('/verify-code', (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] && verificationCodes[email] === verificationCode) {
    // Code verification is successful
    res.send('Code verified successfully');
    // Optionally remove the code after successful verification
    delete verificationCodes[email];
  } else {
    // Code verification failed
    res.status(400).send('Invalid code');
  }
});

// POST route for submitting the form
app.post('/submit-form', async (req, res) => {
  const { email, name, keywords, salary_max, salary_min } = req.body;

  try {
    if (!keywords || !keywords.length) {
      throw new Error('Keywords are required');
    }

    const keywordsArray = `{${keywords.join(',')}}`; // Convert keywords array to PostgreSQL array format

    const currentDate = new Date(); // Get the current date

    const result = await pool.query(
      `INSERT INTO public."user"(email, name, keyword_list, salary_min, salary_max, date) 
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name, 
          keyword_list = EXCLUDED.keyword_list,
          salary_min = EXCLUDED.salary_min,
          salary_max = EXCLUDED.salary_max,
          date = CURRENT_TIMESTAMP
      RETURNING *`,
      [email, name, keywordsArray, salary_min, salary_max]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Unsubscribe route
app.post('/unsubscribe', async (req, res) => {
  const { email } = req.body;

  try {
    // Ensure email is provided
    if (!email) {
      throw new Error('Email is required for unsubscription');
    }

    // Execute a DELETE query to remove the user's record
    const result = await pool.query(
      `DELETE FROM public."user" WHERE email = $1 RETURNING *`, // Replace "public."user"" with your actual user table
      [email]
    );

    // If no rows are returned, the email wasn't found in the database
    if (result.rows.length === 0) {
      return res.status(404).send('No user found with the provided email.');
    }

    // Send a thank you email for using AutoJob and ask for feedback
    var unsubscribeMailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'We’re sad to see you go - AutoJob Unsubscribe Confirmation',
      text: `Hello,

We're sorry to see you leave the AutoJob community. We are continually striving to improve, and your feedback is invaluable to us.

If you have a moment, we would greatly appreciate it if you could let us know why you decided to unsubscribe and how we can improve our service.

Thank you for your time with AutoJob. We hope to have the opportunity to serve you again in the future.

Warm regards,
The AutoJob Team`
    };

    transporter.sendMail(unsubscribeMailOptions, function(error, info) {
      if (error) {
        console.error('Error sending unsubscribe email:', error);
        return res.status(500).send('Error sending unsubscribe email');
      } else {
        console.log('Unsubscribe email sent: ' + info.response);
        // Respond with the deleted user information or a success message
        res.json({ message: 'Unsubscribed successfully.', user: result.rows[0] });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.post('/search-jobs', async (req, res) => {
  const { searchText } = req.body;

  try {
    const sqlQuery = `
      SELECT * FROM "All_Jobs"
      WHERE "Title" ILIKE $1 OR "Company" ILIKE $1;
    `;
    const values = [`%${searchText}%`];
    const results = await secondaryPool.query(sqlQuery, values);

    if (results.rowCount > 0) {
      res.json(results.rows);
    } else {
      res.status(404).send('No matching jobs found');
    }
  } catch (error) {
    console.error('Database query error', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = app;
