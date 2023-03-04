const fs = require('fs');
// const PDFDocument = require('pdfkit');
const { convertArrayToCSV } = require('convert-array-to-csv');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const path = require('path');

const cronjobController =async (req,res) =>{
const sendMial = ()=>{
// Read the emails from the emails.json file
const emails = JSON.parse(fs.readFileSync('./modules/emails.json', 'utf-8'));
console.log("emails",emails)
// Create a Nodemailer transporter
const data = JSON.parse(fs.readFileSync('./modules/data.json', 'utf-8'));
    
const htmlTemplate = `
<html>
  <head>
    <style>
      .table-container {

        display: flex;
        justify-content: space-between;
      }
      .table {
        border-collapse: collapse;
        width: calc(50% - 16px);
        margin-right: 16px;
        table-layout: fixed;
        word-wrap: break-word;
      }
      th, td {
        text-align: left;
        padding: 8px;
        border: 1px solid #ddd;
        word-wrap: break-word;
        width: 12rem;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
    <h2>Monthly Data Report</h2>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            ${Object.keys(data).slice(0, Math.ceil(Object.keys(data).length / 2)).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${Object.values(data).slice(0, Math.ceil(Object.values(data).length / 2)).map(value => {
              if (typeof value === 'object') {
                if (Array.isArray(value)) {
                  return `<td>${value.map(item => `<p>${item.url}: ${item.pageViews}</p>`).join('')}</td>`;
                } else {
                  return `<td>${Object.entries(value).map(([k, v]) => `<p>${k}: ${v}</p>`).join('')}</td>`;
                }
              } else {
                return `<td>${value}</td>`;
              }
            }).join('')}
          </tr>
        </tbody>
      </table>
      <table class="table">
        <thead>
          <tr>
            ${Object.keys(data).slice(Math.ceil(Object.keys(data).length / 2)).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${Object.values(data).slice(Math.ceil(Object.values(data).length / 2)).map(value => {
              if (typeof value === 'object') {
                if (Array.isArray(value)) {
                  return `<td>${value.map(item => `<p>${item.url}: ${item.pageViews}</p>`).join('')}</td>`;
                } else {
                  return `<td>${Object.entries(value).map(([k, v]) => `<p>${k}: ${v}</p>`).join('')}</td>`;
                }
              } else {
                return `<td>${value}</td>`;
              }
            }).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>


`;
// Send the data to all the emails
let mailOptions;
emails.forEach(email => {

  pdf.create(htmlTemplate).toFile(`./modules/monthly_report_${new Date().toISOString().slice(0, 7)}.pdf`, (error, result) => {
    if (error) {
      console.log(`Error generating PDF: ${error}`);
    } else {
      console.log(`PDF saved to ${result.filename}`);

      // Attach the PDF to the email
      mailOptions = { 
        from:  "InsightsMonthly@gmail.com",
        to: email.email,
        subject: 'Monthly Data Report',
        text: `Hello,\n\nHere is the data for this month:\n`,
        attachments: [
          {
            filename: `monthly_report_${new Date().toISOString().slice(0, 7)}.pdf`,
            path: result.filename
          }
        ]
      };

      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "InsightsMonthly@gmail.com",
          pass: "qndugntruagipnuo"
        }
      }).sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error sending email to ${email.email}: ${error}`);
        } else {
          console.log(`Email sent to ${JSON.stringify(email)}: ${info.response}`);
        }
      });
    }
  }); 
});
res.send("cron job initiated successfully")
}
sendMial();
 cron.schedule('0 0 1 * *', () => {
    console.log('Cron job is running!');
 
  sendMial()

 }
)}
module.exports=cronjobController 