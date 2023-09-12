import   OpenAI    from "openai";
    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });
    'use strict';
    import DID_API from './api.json' assert { type: 'json' };   
        
    
    export default async function handler(req, res) {
    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    var messageResponse = new MessagingResponse();
    const sentMessage = req.body.Body || '';
    let replyToBeSent = "";
    let video="";
    if (sentMessage.trim().length === 0) {
    replyToBeSent = "We could not get your message. Please try again";
    
    } else {
       
        const dts= await generearvideo(sentMessage)
        const ids=dts["id"]                     
        linkvideo(ids)
        video= await linkvideo(ids)
        console.log(video)
        replyToBeSent=video;
       
    try {

        const completion = await openai.createCompletion({
        model: "text-davinci-003", // required
        prompt: req.body.Body, 
        temperature: 1, //
        n: 1,
        max_tokens: 250,
        stop: "."
    });
        replyToBeSent = completion.data.choices[0].text
            } catch (error) {
            if (error.response) {
                replyToBeSent = "servidor ocupado"
            } else { 
                replyToBeSent = "algo salio mal.";
            }
        }
    }
    messageResponse.message(replyToBeSent);
    
    res.writeHead(200, {
    'Content-Type': 'text/xml'
    });
    res.end(messageResponse.toString());
    }

async function generearvideo( mensaje){
    const body = { source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Billy_m/image.jpeg',
    'script':{
        'type': 'text',
        'input':mensaje}
    }
    const response= await fetch ('https://api.d-id.com/talks'
        ,{
            method:'POST', 
            body:JSON.stringify(body),
            headers: {
                Authorization: `Basic ${DID_API.key}`,
                'Content-Type': 'application/json',
              },
        })
        const data =await response.json()
        return data           
}

async function linkvideo(id){
   
    const response= await fetch (`https://api.d-id.com/talks/${id}`
        ,{
            method:'GET',             
            headers: {
                Authorization: `Basic ${DID_API.key}`,
                'Content-Type': 'application/json',
              },
        })
        const data =await response.json()
        console.log(data)
        return data            

}




//https://create-images-results.d-id.com/DefaultPresenters/Zivva_f/image.png