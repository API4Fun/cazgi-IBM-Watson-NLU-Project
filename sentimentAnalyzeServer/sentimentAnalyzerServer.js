const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');

    const NaturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1 ({
        version: '2020-08-01',
        authenticator: new IamAuthenticator ({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return NaturalLanguageUnderstanding;
}

NLUinstnc = getNLUInstance()

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {}
        }
    };

    NLUinstnc.analyze(analyzeParams)
        .then(analysisResults => {
            emot = analysisResults.result.emotion.document.emotion;
            console.log(emot);
            //console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(emot);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("Error You Have.  Try again!");
        });
   });

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {}
        }
    };
    
    NLUinstnc.analyze(analyzeParams)
        .then(analysisResults => {
            sentimt = analysisResults.result.sentiment.document.label.toString();
            console.log(sentimt);
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(sentimt);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("Error You Have.  Try using longer text!");
        });
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': {}
        }
    };

    NLUinstnc.analyze(analyzeParams)
        .then(analysisResults => {
            emot = analysisResults.result.emotion.document.emotion;
            console.log(emot);
            //console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(emot);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("Error You Have! Try again.");
        });
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {}
        }
    };
    
    NLUinstnc.analyze(analyzeParams)
        .then(analysisResults => {
            sentimt = analysisResults.result.sentiment.document.label.toString();
            console.log(sentimt);
            return res.send(sentimt);
            //console.log(JSON.stringify(analysisResults, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("Error You Have.  Try using longer text!");
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
