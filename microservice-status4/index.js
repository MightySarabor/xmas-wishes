const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'microservice-status4',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'microservice-status4-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'status3-topic', fromBeginning: false });

  console.log('Microservice Status 4 is ready to process messages.');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const wish = JSON.parse(message.value.toString());
        console.log('Received:', wish);

        wish.status = 4; // Status von 3 auf 4 setzen und ausgeben

        console.log('Processed:', JSON.stringify(wish));  
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};

run().catch(console.error);
