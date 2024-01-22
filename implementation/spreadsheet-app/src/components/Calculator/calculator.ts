import { ICalculator } from "../../interfaces/ICalculator";

export class Calculator implements ICalculator{
    evaluateExpression(expression: string): number {
        const tokens = expression.match(/\d+(\.\d+)?|[\+\-\*\/\^()]|\.\d+/g); // Match numbers, operators, and parentheses
        if (!tokens) return NaN; // Return NaN if no tokens are found

        const numbers: number[] = [];
        const operators: string[] = [];

        for (let token of tokens) {
            if (this.isNumber(token)) {
                numbers.push(parseFloat(token));
            } else if (token === '(') {
                operators.push(token);
            } else if (token === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                    this.applyAndPush(numbers, operators);
                }
                operators.pop(); // Remove '('
            } else if (this.isOperand(token)) {
                while (operators.length && this.hasPrecedence(operators[operators.length - 1], token)) {
                    this.applyAndPush(numbers, operators);
                }
                operators.push(token);
            }
        }

        while (operators.length) {
            this.applyAndPush(numbers, operators);
        }

        return numbers.length ? numbers.pop()! : 0; // Handle empty stack case
    }

    private isNumber(token: string): boolean {
        return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
    }

    private isOperand(op: string): boolean {
        return ['+', '-', '*', '/', '^'].includes(op);
    }

    private hasPrecedence(op1: string, op2: string): boolean {
        if (op1 === '(' || op1 === ')') {
            return false;
        }
        else if (op1 === '^' || op2 === '^') {
            return true
        }
        return (op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-');
    }

    private applyOperator(operator: string, b: number, a: number): number {
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': 
                if (b === 0) throw new Error("Division by zero.");
                return a / b;
            case '^': return a**b;
            default: throw new Error("Invalid operator.");
        }
    }

    private applyAndPush(numbers: number[], operators: string[]): void {
        const b = numbers.pop()!;
        const a = numbers.pop()!;
        const operator = operators.pop()!;
        numbers.push(this.applyOperator(operator, b, a));
    }
}
