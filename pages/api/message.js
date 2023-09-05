import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}); 

export default async function handler(req, res) {
    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    var messageResponse = new MessagingResponse();
   
    const sentMessage = req.body.Body || '';

    let replyToBeSent = "";
    if (sentMessage.trim().length === 0) {
        replyToBeSent = "";
        } else {
        try {
        const completion = await open.createCompletion({
        model: "text-davinci-003", // required
        prompt: sentMessage, // completion based on this
        temperature: 0, //
        n: 1,
        max_tokens: 250,
        // stop: "."
        });
        replyToBeSent = completion.data.choices[0].text
        } catch (error) {
        if (error.response) {
        replyToBeSent = "los servidores estan ocupados intente mas tarde"
        } else { // error getting response
        replyToBeSent = "algo salió mal.";
        }
        }
    }
        
    messageResponse.message(replyToBeSent);
    // send response
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(messageResponse.toString());
}