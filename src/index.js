import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


import { Textfit } from "react-textfit";


const Screen = ({ value }) => {
  return (
    <Textfit className= "screen" mode= "single" forceSingleModeWidth={false}> {value} </Textfit>
  );
};

class Square extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button 
      className = "button" 
      onClick={() => this.props.onClick()} >
        {this.props.value}

      </button>
    );
  }
}


class Numbers extends React.Component {

  constructor(props) {
    super(props);
  }

  renderSquare(i) {
    return (
      <Square
        value={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    return (
      
      <div>
        <div className="board-row">
          {this.renderSquare('')}
          {this.renderSquare('^')}
          {this.renderSquare('%')}
          {this.renderSquare('C')}
        </div>
        <div className="board-row">
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare('/')}

        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare('x')}

        </div>
        <div className="board-row">
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare('-')}
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare('.')}
          {this.renderSquare('=')}
          {this.renderSquare('+')}
        </div>
      </div>
    );
  }
}

class Calc extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      input: '',
      answer: '',
    }
  }


tokenize(input) {
  let scanner = 0;
  const tokens = [];

  while (scanner < input.length) {
    const char = input[scanner];
    if (/[0-9]/.test(char)) {
      let digits = '';
      while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
        digits += input[scanner++];
      }
      const number = parseFloat(digits);
      tokens.push(number);
      continue;
    }
    if (/[+\-/*()%^]/.test(char)) {
      tokens.push(char);
      scanner++;
      continue;
    }
  }
  return tokens;
}

toPrefix(tokens) {
  const operators = [];
  const out = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (typeof token === 'number') {
      out.push(token);
      continue;
    }

    if (/[+\-/*<>=%^]/.test(token)) {
      while (this.undoStack(operators, token)) {
        out.push(operators.pop());
      }
      operators.push(token);
      continue;
    }

    throw new Error(`Unparsed token ${token} at position ${i}`);
  }

  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }

  return out;
}


undoStack(operators, nextToken) {
  const precedence = { '*': 2, '/': 2, '+': 1, '-': 1 };
  if (operators.length === 0) {
    return false;
  }
  const lastOperator = operators[operators.length - 1];
  return precedence[lastOperator] >= precedence[nextToken];
}

evaluatePrefix(prefix) {
  const stack = [];

  for (let i = 0; i < prefix.length; i++) {
    const token = prefix[i];

    if (/[+\-/*^%]/.test(token)) {
      stack.push(this.operate(token, stack));
      continue;
    }

    // token is a number
    stack.push(token);
  }

  return stack.pop();
}



operate(operator, stack) {
  const a = stack.pop();
  const b = stack.pop();

  switch (operator) {
    case '+':
      return b + a;
    case '-':
      return b - a;
    case '*':
      return b * a;
    case '/':
      if (a == 0){
        throw new Error ('can not divide by 0');
      }
      return b / a;
    case '^':
      return Math.pow(b, a);
    case '%':
      return b%a;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}


evaluate(input) {
  return this.evaluatePrefix(this.toPrefix(this.tokenize(input)));
}

  handleClick(i) {
    const value = i;
    switch (value) {
      case '=': {
        if (this.state.input!=='')
        {
            let ans= '';
              try
                {
                    ans = this.evaluate(this.state.input);
                }
                catch(err)
                {
                    this.setState({input: '', answer: ''});

                }
                
                if (ans === NaN){
                    this.setState({ input: '', answer: '' });
                }
                else
                    this.setState({ answer: ans , input: ans});
                    console.log(ans);

                break;
            }
      }
      case 'C': {
        this.setState({ input: '', answer: '' });
        break;
      }
   
    default: {
           if (value != 'x'){
          this.setState({ answer: this.state.answer += value})
          this.setState({ input: this.state.input += value})
        }
        else{
          this.setState({ input: this.state.input += '*'})
          this.setState({ answer: this.state.answer += value})
        }
        break;
      }
    }
  }


  render() {
    let value; 
    return (
      <div className="game">
        <div className="game-board">
        <Screen value = {this.state.answer}/>
        <Numbers 
            onClick={(i) => this.handleClick(i)}
          />        
          </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Calc />,
  document.getElementById('root')
);
