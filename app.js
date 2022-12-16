const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

var path = require('path');
const options = {
  swaggerDefinition :{
      info:{
          title: 'Text to speech',
          version: '1.0.0',
          description: 'Text to speech'
      },
      host: '204.48.25.136:3000',
      basePath: '/',
  },
  apis: ['./app.js'],
}

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


/**
 * @swagger
 * /:
 *  post:
 *    description: Takes a text String and converts it into speech
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: text
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPost"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPost"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentPost:
 *     type: object
 *     required:
 *     - text
 *     properties:
 *       text:
 *         type: string
 *         example: How are you
*/
app.post('/',(req,res)=>{

  (function() {

    "use strict";

    var sdk = require("microsoft-cognitiveservices-speech-sdk");
    var readline = require("readline");
    var text = req.body.text;
    console.log("text trim "+text.trim().length)
    if(!text || text.trim().length==0){
      res.send("No text detected");
      return;
    }
    //console.log("req " +JSON.stringify(req))
    console.log(JSON.stringify(req['body']))
    var audioFile = "YourAudioFile.mp3";
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
      synthesizer.speakTextAsync(text,
          function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
          var options = {
            root: path.join(__dirname)
        };
        console.log("Hi Yash bro __dirname "+__dirname);
        var fileName = 'YourAudioFile.mp3';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
            }
        });    
    } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
              "\nDid you set the speech resource key and region values?");
              res.end("Hi Yash Error");
        }
        synthesizer.close();
        synthesizer = null;
      },
          function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = null;
      });
      console.log("Now synthesizing to: " + audioFile);
    //});
}());

})

function converter(res) {


    (function() {

        "use strict";
    
        var sdk = require("microsoft-cognitiveservices-speech-sdk");
        var readline = require("readline");
    
        var audioFile = "YourAudioFile.mp3";
        // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
    
        // The language of the voice that speaks.
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 
    
        // Create the speech synthesizer.
        var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
    
        //rl.question("Enter some text that you want to speak >\n> ", function (text) {
          //rl.close();
          // Start the synthesizer and wait for a result.
          var text = "Hi Yash whats up";
          synthesizer.speakTextAsync(text,
              function (result) {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log("synthesis finished.");
              var options = {
                root: path.join(__dirname)
            };

            var fileName = 'YourAudioFile.mp3';
            res.sendFile(fileName, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent:', fileName);
                }
            });    
        } else {
              console.error("Speech synthesis canceled, " + result.errorDetails +
                  "\nDid you set the speech resource key and region values?");
                  res.end("Hi Yash Error aala");
            }
            synthesizer.close();
            synthesizer = null;
          },
              function (err) {
            console.trace("err - " + err);
            synthesizer.close();
            synthesizer = null;
          });
          console.log("Now synthesizing to: " + audioFile);
        //});
    }());


}