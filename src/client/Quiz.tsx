import * as React from 'react';
import Component from 'react';
import Multiple from './Multiple';
import Boolean from './Boolean';
import Text from './Text';

export default class Quiz extends React.Component {
    state = {
        loading: true
    };

    data: Object = {};
    html ='';
    count=0;
    responseData = '';
    totalAns = '';
    totalCorrect = ''; 
    totalIncorrect = '';
    percentage = '';
    finalResult = '';
    totalQ = '';
    number = 1;
    handleCount(_data:number){
        //alert('dasd..'+ _data);
        // this.number = _data;
        
    }
    componentDidMount() {
        this.verifyJson().then((response) => {

           this.html = this.html +{};
            
            this.html = response.randomQ.map((element:any, i:number) => {
                this.count = this.count + 1;
                if (element.type === 'text'){
                    return (
                        <div key={i}>
                            <Text handleCount={this.handleCount} data={element} count={this.count}/>
                            <br />
                        </div>);
                } if (element.type === 'multiple') {
                    return (
                        <div key={i}>
                            <Multiple handleCount={this.handleCount} data={element} count={this.count}/>
                            <br />
                        </div>);
                } else {
                    return (
                        <div key={i}>
                            <Boolean handleCount={this.handleCount} data={element} count={this.count} />
                            <br />
                        </div>);
                }
            });
            this.setState({
                loading: false

            });
            let idValN = 'quiz1';
            const obj = document.getElementById(idValN);
           /* if (obj !== undefined && obj !== null) {
                obj.style.display = "block";
            }*/
            const obj1 = document.getElementById("quizCurrentForm");
            const obj2 = document.getElementById("quiz1");
            if (obj1 !== undefined && obj1 !== null && obj2 !== undefined && obj2 !== null) {
                obj1.appendChild(obj2);
                const obj = document.getElementById(idValN);
                if (obj !== undefined && obj !== null) {
                    obj.style.display = "block";
                 }
            }
            console.log("QUIZ111: ", response);
        }).catch((error) => {
            console.log("QUIZ: EE: ", error);
        });
    }

    verifyJson(): Promise<any> {
        const url = "http://localhost:4000/api/quiz";
        return fetch(url).then((response) => {
            return response.ok ?
                response.json() : Promise.reject(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    logSubmit() {
        
        
        let childObj:any = {};
        let data = [];
        var allData:any = document.forms[0];
        var i;

        var container, inputs, index;
        container = document.getElementById('quizForm');
        if (container !== undefined && container!== null){
            allData = container.getElementsByTagName('input');
            for (i = 0; i < allData.length; ++i) {
                if (allData[i].type === 'radio') {
                    if (allData[i].checked) {
                        childObj.id = allData[i].name;
                        childObj.answer = allData[i].value;
                        data.push(childObj);
                        childObj = {};
                    }
                } else if (allData[i].type === 'text') {
                    if (allData[i].value !== undefined && allData[i].value !== '') {
                        childObj.id = allData[i].name;
                        childObj.answer = allData[i].value;
                        data.push(childObj);
                        childObj = {};
                    }
                }
            }

         }
        data.map((dataV: any) => {
            console.log('!!!!!!!!!!...', dataV);
        }); 
        var _this = this;
        var url = "http://localhost:4000/api/submit";
        var xhr = new XMLHttpRequest();
        let dVal='';
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                     console.log('@@@@@@@@@@@',xhr.response);  
                     _this.callbackResponse(xhr.response); 
                 }
        }
        this.responseData = dVal; 
        var data1 = JSON.stringify({ data });
        xhr.send(data1);
        
    }
    callbackResponse(_data:any){
        if (_data !== '') {
            try {
            this.responseData = _data;
            const parsedData:any = JSON.parse( _data );
            if (parsedData !== undefined && parsedData.resultSummary!== undefined){
                this.totalAns = parsedData.resultSummary.questions_worked !== undefined ? parsedData.resultSummary.questions_worked:'';
                this.totalCorrect = parsedData.resultSummary.valid_answer !== undefined ? parsedData.resultSummary.valid_answer: '';
                this.totalIncorrect = parsedData.resultSummary.wrong_answer !== undefined ? parsedData.resultSummary.wrong_answer: '';
                this.percentage = parsedData.resultSummary.percentage !== undefined ? parsedData.resultSummary.percentage: '';
                this.finalResult = parsedData.resultSummary.result !== undefined ? parsedData.resultSummary.result: '';
                this.totalQ = parsedData.resultSummary.total !== undefined ? parsedData.resultSummary.total : '';
            }
            this.setState({
                loading: true

            });
            } catch (error) {
                console.log("error:: SUMMARY--> ", error);
            }
        }
}
    render() {
        if (this.responseData!==''){
            return(
                <div>
                    <a style={{ paddingBottom: '50px', float: 'left' }}
                    href="/"
                > <button style={{ color: 'blue' }} type="submit">Restart Quiz</button>
                </a><br/>
                    <br />
                    <p dangerouslySetInnerHTML={{ __html: '' }} /> <br />
                    {this.totalCorrect !== '' ? <p dangerouslySetInnerHTML={{ __html: 'Correct: ' + this.totalCorrect }} /> : ''}
                    {this.totalIncorrect !== '' ? <p dangerouslySetInnerHTML={{ __html: 'Wrong: ' + this.totalIncorrect }} /> : ''}
                    {this.totalAns !== '' ? <p dangerouslySetInnerHTML={{ __html: 'Questions answered: ' + this.totalAns }} /> : ''}
                    {this.totalQ !== '' ? <p dangerouslySetInnerHTML={{ __html: 'Total questions: ' + this.totalQ }} /> : ''}
                    {this.percentage !== '' ? <p dangerouslySetInnerHTML={{ __html: 'Final Score: ' + this.percentage }} /> : ''}<br />
                
                </div>
            )
        } else {
            return (
                <div id="quizForm">

                    <div id="quizCurrentForm"></div><br /><br /><br /><br /><br /><br />
                    <a style={{ paddingBottom: '50px', float: 'right' }}
                        href="#"
                        onClick={() => this.logSubmit()}
                    > <button style={{ color: 'blue' }} type="submit">Submit Answers</button>
                    </a>   
                    <br />            
                    <br/>            
                    {this.html}
                
    
                </div>
            );
        }
    }
}