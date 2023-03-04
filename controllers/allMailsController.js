const fs = require('fs');
const { v4: uuidv4 } = require('uuid')

const allMailsController = (req, res) => {
  const FILE_PATH = './modules/emails.json';

  try {
   
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, '[]');
    }
   

    const email = req.body.email;
    const uuid = uuidv4();
    console.log(email);

    fs.readFile(FILE_PATH, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return res.status(500).json({ message: 'Error reading file' });
      }

      const emails = JSON.parse(data);
      const filter = Array.isArray(emails) && emails.findIndex((e) => e.email == email);
      filter === -1 ? emails.push({ uuid, email }) : res.status(409).json({ message: 'email already exists' });
      fs.writeFile(FILE_PATH, JSON.stringify(emails), (err) => {
        if (err) {
          console.error(`Error writing file: ${err}`);
          return res.status(500).json({ message: 'Error writing file' });
        }
        console.log(`Saved email: ${email}`);
        res.json({ message: `Email ${JSON.stringify(email)} saved successfully!` });
      });
    });
  } catch (err) {
    console.error(`Unexpected error: ${err}`);
    res.status(500).json({ message: 'Unexpected error' });
  }
};

module.exports = allMailsController;
