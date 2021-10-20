import {symbols} from './backend'

test('confirms symbol of Spades', () => {
  expect(symbols['Spades']).toBe('\u2660');
});