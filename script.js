const questions = [
    "Why do you want to work as a cleaner?",
    "How do you handle challenging cleaning tasks?",
    "What cleaning tools are you familiar with?",
    "How do you ensure safety while cleaning?",
    "Can you describe a time you went above and beyond in a cleaning task?"
  ];
  
  const answers = [];
  let currentQuestionIndex = 0;
  
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  
  function askNextQuestion() {
    if (currentQuestionIndex < questions.length) {
      chatBox.innerHTML += `<p><strong>Bot:</strong> ${questions[currentQuestionIndex]}</p>`;
      userInput.value = "";
    } else {
      sendAnswersForScoring();
    }
  }
  
  function validateAnswer(answer) {
    return answer.trim().length > 3;
  }
  
  function sendAnswersForScoring() {
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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` // Replace with your API key
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: `Evaluate the following cleaning interview answers and provide a score (1-10) with an explanation.\n\n${answers.map(
          (a, i) => `${i + 1}. ${questions[i]} Answer: ${a}\n`
        ).join("")}\n\nScore and Explanation:`,
        max_tokens: 150
      })
    })
    .then(response => response.json())
    .then(data => {
      const result = data.choices[0].text.trim();
  
      const scoreMatch = result.match(/Score:\s*(\d+)/i);
      const explanationMatch = result.match(/Explanation:\s*(.+)/i);
  
      const score = scoreMatch ? scoreMatch[1] : "N/A";
      const explanation = explanationMatch ? explanationMatch[1] : "Explanation not available.";
  
      const resultPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Interview Results</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .score { font-size: 48px; font-weight: bold; color: #4CAF50; }
            .explanation { font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Interview Results</h1>
          <p class="score">Score: ${score}</p>
          <p class="explanation">${explanation}</p>
        </body>
        </html>
      `;
  
      window.location.href = `data:text/html;charset=utf-8,${encodeURIComponent(resultPage)}`;
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    });
  }
  
  sendButton.addEventListener("click", () => {
    const userAnswer = userInput.value.trim();
    if (validateAnswer(userAnswer)) {
      answers.push(userAnswer);
      chatBox.innerHTML += `<p><strong>You:</strong> ${userAnswer}</p>`;
      currentQuestionIndex++;
      askNextQuestion();
    } else {
      chatBox.innerHTML += `<p><strong>Bot:</strong> That doesn't seem like a valid answer. Please try again.</p>`;
    }
  });
  
  // Start the interview
  askNextQuestion();
  