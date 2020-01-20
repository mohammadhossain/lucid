import * as React from 'react';
import IndexProps from './IndexProps';

export default class Multiple extends React.Component <IndexProps, {}>{
    selectNext(_nextId:number) {
        let n = _nextId +1;
        let idValN = 'quiz'+n;
        const obj1 = document.getElementById("quizCurrentForm");
        const obj2 = document.getElementById(idValN);
        let idValC = 'quiz' + _nextId;
        const objC = document.getElementById(idValC);
        if (objC !== undefined && objC !== null && obj1 !== undefined
            && obj1 !== null && obj2 !== undefined && obj2 !== null) {
            //obj1.removeChild(objC);
            obj1.appendChild(obj2);
            const obj = document.getElementById(idValN);
            if (obj !== undefined && obj !== null) {
                obj.style.display = "block";
            }
            if (objC !== undefined && objC !== null) {
                objC.style.display = "none";
            }
        }
        //this.props.handleCount(_nextId);

    }
    render() {
        return (
                <div style={{display: 'none'}} id={'quiz'+this.props.count}>
                    <div dangerouslySetInnerHTML={{ __html: this.props.count + '.  ' + this.props.data.question }} /><br />
                    <input type="radio" name={this.props.data.id} value={this.props.data.answers[0]} />{this.props.data.answers[0]}<br/>
                    <input type="radio" name={this.props.data.id} value={this.props.data.answers[1]} />{this.props.data.answers[1]}<br /> 
                    <input type="radio" name={this.props.data.id} value={this.props.data.answers[2]} />  {this.props.data.answers[2]}<br />
                    <input type="radio" name={this.props.data.id} value={this.props.data.answers[3]} /> {this.props.data.answers[3]}<br />
                    <a style={{ paddingBottom: '50px', float: 'right' }}
                        href="#"
                        onClick={() => this.selectNext(this.props.count)}
                    > <button style={{ color: 'blue' }} type="submit">Next</button>
                    </a>
                </div>
        );
    }
}