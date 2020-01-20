const express = require('express');
const cors = require('cors');

const data = require('./data.json');
// create server
const server = express();
const port = 4000;

var returnJson = [];
var validationJson = [];

server.get("/api/questions", cors(), (req, res) => {
    res.json({ returnJson });
});

server.get("/api/quiz", cors(), (req, res) => {
    var randomQ = randomShuffledQuestions(returnJson);
    res.json({ randomQ });
});

function randomShuffledQuestions(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function populateReturnJson() {

    var answers = [];
    var parentJson = {};
    var dataValidation = {};

    Object.keys(data.results).forEach(function (key) {
        dataValidation.question_id = key;
        dataValidation.answer = data.results[key].correct_answer;

        parentJson.id = key;
        parentJson.type = data.results[key].type;
        parentJson.question = data.results[key].question;
        answers.push(data.results[key].correct_answer);

        var i = 0;
        if (data.results[key].incorrect_answers != undefined && data.results[key].incorrect_answers[i] != undefined) {
            Object.keys(data.results[key].incorrect_answers).forEach(function (i) {
                answers.push(data.results[key].incorrect_answers[i]);
                i++;
            });
        }
        parentJson.answers = answers;
        answers = [];
        returnJson.push(parentJson);
        validationJson.push(dataValidation);
        parentJson = {};
        dataValidation = {};
    });
}

server.post("/api/submit", cors(), (req, res) => {

    var resultSummary = {};
    var correct = 0;
    var wrong = 0;
    var questions_answered = 0;
    var final_score = 0;

    var summary = [];
    let body = [];
    req.on('data', function (chunk) {
        body.push(chunk);
    });

    req.on('end', function () {

        body = Buffer.concat(body).toString();
        if (body != undefined) {

            var resultBody = JSON.parse(body);
            if (resultBody !== undefined && resultBody.data !== undefined) {
                for (let k = 0; k < resultBody.data.length; k++) {
                    questions_answered++;

                    for (let i = 0; i < validationJson.length; i++) {
                        if (validationJson[i].question_id === resultBody.data[k].id) {
                            if (validationJson[i].answer === resultBody.data[k].answer) {
                                correct++;
                                resultSummary.valid_answer = correct;
                                break;
                            } else {
                                wrong++;
                                resultSummary.wrong_answer = wrong;
                                break;
                            }
                        }
                    }
                    resultSummary.questions_worked = questions_answered;
                }
            }
            try {
                resultSummary.total = '50';
                let percent = correct / 50 * 100;
                if (percent >= 60) {
                    resultSummary.result = 'Pass';
                } else {
                    resultSummary.result = 'Fail';
                }
                resultSummary.percentage = percent+'%';
            } catch (error) {
                console.log("error:: SUMMARY--> ", error);
            }
            
            summary.push(resultSummary);
            console.log("POST:: SUMMARY--> ", summary);
        }

        res.json({ resultSummary });
        res.end(body);
    });
});

// starting server

server.listen(port, () => {
    populateReturnJson();
    console.log("populateJson: ", returnJson);
    console.log("validationJson: ", validationJson);
    console.log(`Server listening at ${port}`);
});