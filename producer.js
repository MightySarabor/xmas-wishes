const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'initial-topic',
    messages: [
      {
        value: JSON.stringify({ wish: 'I want a new bike!', status: 1 }),
      },
    ],
  });
  console.log('Test message sent to initial-topic.');
  await producer.disconnect();
};

run().catch(console.error);
