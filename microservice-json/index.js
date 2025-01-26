const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'microservice-json',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'microservice-json-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await producer.connect();

  console.log('Microservice JSON is ready to process messages.');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // JSON parsen
        const wish = JSON.parse(message.value.toString());
        console.log('Received:', wish);

        // Status bearbeiten
        wish.status = 'Processed by JSON Microservice';

        // JSON zurück in String konvertieren
        const updatedWish = JSON.stringify(wish);
        console.log('Processed:', updatedWish);

        // Nachricht an Kafka senden
        await producer.send({
          topic: 'processed-topic',
          messages: [{ value: updatedWish }],
        });
        console.log('Message sent to processed-topic.');
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};

run().catch(console.error);
