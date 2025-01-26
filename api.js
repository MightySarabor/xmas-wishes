const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: 'api',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

app.use(express.json());

app.post('/send', async (req, res) => {
  const { wish } = req.body;
  if (!wish) {
    return res.status(400).send({ message: 'Wish is required' });
  }

  const message = JSON.stringify({ wish, status: 1 });

  try {
    await producer.connect();
    await producer.send({
      topic: 'initial-topic',
      messages: [{ value: message }],
    });
    console.log('Message sent to initial-topic:', message);
    await producer.disconnect();
    res.status(200).send({ message: 'Wish sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ message: 'Failed to send wish' });
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
