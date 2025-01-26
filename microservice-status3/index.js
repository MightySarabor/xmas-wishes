const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'microservice-status3',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'microservice-status3-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'status2-topic', fromBeginning: false });

  await producer.connect();

  console.log('Microservice Status 3 is ready to process messages.');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const wish = JSON.parse(message.value.toString());
        console.log('Received:', wish);

        wish.status = 4; // Status von 3 auf 4 setzen

        const updatedWish = JSON.stringify(wish);
        console.log('Processed:', updatedWish);

        await producer.send({
          topic: 'status3-topic',
          messages: [{ value: updatedWish }],
        });
        console.log('Message sent to status3-topic.');
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};

run().catch(console.error);
	
