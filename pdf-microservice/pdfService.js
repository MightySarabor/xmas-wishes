const express = require('express');
const { Kafka } = require('kafkajs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const app = express();
const port = 3001;

const kafka = new Kafka({
  clientId: 'pdfService',
  brokers: [process.env.KAFKA_BROKERS],
});

const producer = kafka.producer();

app.use(express.json());

app.post('/send-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'PDF file is required' });
  }

  // Zum Demonstrationszweck nur eine feste JSON-Nachricht senden
  const jsonMessage = JSON.stringify({ message: 'Fixed JSON message from PDF', filename: req.file.originalname });

  try {
    await producer.connect();
    await producer.send({
      topic: 'initial-topic',
      messages: [{ value: jsonMessage }],
    });
    console.log('Message sent to initial-topic:', jsonMessage);
    await producer.disconnect();
    fs.unlinkSync(req.file.path); // Optional: Löschen der hochgeladenen Datei
    res.status(200).send({ message: 'PDF processed and sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ message: 'Failed to process and send PDF' });
  }
});

app.listen(port, () => {
  console.log(`PDF Service listening at http://localhost:${port}`);
});
