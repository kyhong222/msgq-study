/*
 * npm install amqplib
 */

var amqp = require('amqplib/callback_api');

const url = 'amqp://{{localhost}}:{{4000}}';
const queueName = 'MQ_test';

amqp.connect(url, function(error, connect){
    if(error){
        console.log(error);
        return;
    }
    connect.createChannel(function(error, channel){
        if(error){
            console.log(error);
            return;
        }
        channel.assertQueue(queueName, {durable: true}, function(error){
            let sendData = {
                type : 'message',
                message : 'test message!'
            };
            channel.sendToQueue(queueName, encode(sendData), {
                persistent: true
            });
            setImmediate(function() {
                channel.close();
                connect.close();
            });
        });
    });
});

function encode(doc) {  
    return new Buffer(JSON.stringify(doc));
}