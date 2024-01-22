import { Calculator } from '../Calculator/calculator';

describe('Calculator Tests', () => {
    let calculator: Calculator;

    beforeAll(() => {
        calculator = new Calculator();
    });

    test('adds two numbers', () => {
        expect(calculator.evaluateExpression('2 + 3')).toBe(5);
    });

    test('subtracts two numbers', () => {
        expect(calculator.evaluateExpression('5 - 2')).toBe(3);
    });

    test('multiplies two numbers', () => {
        expect(calculator.evaluateExpression('4 * 3')).toBe(12);
    });

    test('divides two numbers', () => {
        expect(calculator.evaluateExpression('10 / 2')).toBe(5);
    });

    test('exponentiate a number', () => {
        expect(calculator.evaluateExpression('3 ^ 4')).toBe(81);
    });

    test('combines addition and multiplication', () => {
        expect(calculator.evaluateExpression('2 + 3 * 4')).toBe(14);
    });

    test('combines subtraction and division', () => {
        expect(calculator.evaluateExpression('20 - 4 / 2')).toBe(18);
    });

    test('handles parentheses', () => {
        expect(calculator.evaluateExpression('(2 + 3) * 4')).toBe(20);
    });

    test('handles nested parentheses', () => {
        expect(calculator.evaluateExpression('((2 + 3) * (3 - 1)) / 2')).toBe(5);
    });

    test('throws error on division by zero', () => {
        expect(() => calculator.evaluateExpression('5 / 0')).toThrow('Division by zero.');
    });

    test('returns NaN for invalid expression', () => {
        expect(calculator.evaluateExpression('2 +')).toBeNaN();
    });

    test('returns NaN for non-numeric expression', () => {
        expect(calculator.evaluateExpression('abc')).toBeNaN();
    });

    test('handles empty string', () => {
        expect(calculator.evaluateExpression('')).toBeNaN();
    });

    test('returns NaN for only operators', () => {
        expect(calculator.evaluateExpression('++++')).toBeNaN();
    });

    test('handles only parentheses', () => {
        expect(calculator.evaluateExpression('(()())')).toBe(0);   
    });
});
