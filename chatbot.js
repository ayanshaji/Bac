const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const responses = {
  "how to borrow a book": "Go to 'Borrow Book' in the system and fill in the form.",
  "how to return a book": "Click on 'Return Book' and select the borrowed item.",
  "library timing": "The library is open from 9 AM to 5 PM on weekdays.",
  "how to login": "Use your registered email and password on the Login page.",
  "how to register": "Click on Sign Up and fill in your details.",
};

function getResponse(input) {
  const inputTokens = tokenizer.tokenize(input.toLowerCase());
  let bestMatch = "";
  let bestScore = 0;

  for (let question in responses) {
    const questionTokens = tokenizer.tokenize(question.toLowerCase());
    const score = natural.JaroWinklerDistance(inputTokens.join(' '), questionTokens.join(' '));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = question;
    }
  }

  return bestScore > 0.7 ? responses[bestMatch] : "Sorry, I didn't understand that. Please try again.";
}

module.exports = getResponse;