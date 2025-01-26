const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'microservice-status1',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'microservice-status1-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'initial-topic', fromBeginning: false });

  await producer.connect();

  console.log('Microservice Status 1 is ready to process messages.');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const wish = JSON.parse(message.value.toString());
        console.log('Received:', wish);

        wish.status = 2; // Status von 1 auf 2 setzen

        const updatedWish = JSON.stringify(wish);
        console.log('Processed:', updatedWish);

        await producer.send({
          topic: 'status1-topic',
          messages: [{ value: updatedWish }],
        });
        console.log('Message sent to status1-topic.');
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};

run().catch(console.error);
	
