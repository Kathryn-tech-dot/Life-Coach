// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input
  const input = inputField.value;

  // Clear input field
  inputField.value = '';
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user input to conversation
  let message = document.createElement('div');
  message.classList.add('chatbot-message', 'user-message');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
  conversation.appendChild(message);

  // Send user input to backend for processing
  sendUserInput(input);
});

// Function to send user input to backend
function sendUserInput(input) {
  // Send an HTTP request to your backend (you will need to implement this)
  fetch('/process_input', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: input })
  })
  .then(response => response.json())
  .then(data => {
    // Process response from backend
    const botResponse = data.response;

    // Display chatbot response
    displayChatbotResponse(botResponse);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Function to display chatbot response
function displayChatbotResponse(response) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add chatbot response to conversation
  let message = document.createElement('div');
  message.classList.add('chatbot-message', 'chatbot');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({ behavior: 'smooth' });
}

// Function to perform sentiment analysis and display the result
function performSentimentAnalysis() {
  // Get all chat messages from the conversation
  const chatMessages = document.querySelectorAll('.chatbot-message');

  // Extract text from each message and concatenate them to form the conversation data
  let conversationData = '';
  chatMessages.forEach(message => {
    const messageText = message.querySelector('.chatbot-text').textContent.trim();
    conversationData += messageText + ' ';
  });

  // Remove leading/trailing whitespace and ensure it's not empty
  conversationData = conversationData.trim();
  if (conversationData === '') {
    console.error('No conversation data found');
    return;
  }

  // Send conversation data to backend for sentiment analysis
  fetch('/sentiment_analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ conversation: conversationData })
  })
  .then(response => response.json())
  .then(data => {
    // Process sentiment analysis response
    const sentimentResult = data.sentiment_result;
    const response = data.response;
    // Handle the sentiment result and response as needed
    console.log("Sentiment Result:", sentimentResult);
    console.log("Response:", response);
    // Display sentiment analysis results in a popup message
    alert(`Sentiment Result: ${sentimentResult}\nResponse: ${response}`);
  })
  .catch(error => console.error('Error performing sentiment analysis:', error));
}

        document.addEventListener("DOMContentLoaded", function () {
          const chatContainer = document.getElementById("chatContainer");
          const input = document.getElementById("input");
          const sendButton = document.getElementById("sendButton");
  
          sendButton.addEventListener("click", handleSend);
  
          function handleSend() {
            const prompt = input.value.trim();
            if (prompt === "") return;
  
            addMessage(prompt, true); // Add user's message to chat
            openAISummarizer(prompt); // Call the function to get bot response
            input.value = ""; // Clear the input field
          }
  
          async function openAISummarizer(prompt) {
            const apiKey = "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"; // Replace "YOUR_API_KEY" with your actual OpenAI API key
  
            try {
              const response = await fetch(
                "https://api.openai.com/v1/completions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    model: "gpt-3.5-turbo-instruct",
                    prompt: "GPT, if this prompt isn't in the context of mental health, return invalid prompt, else return the response still in mental health context" + prompt,
                    max_tokens: 100,
                    temperature: 0,
                  }),
                }
              );
  
              const data = await response.json();
              const botResponse = data.choices[0].text.trim();
              addMessage(botResponse, false); // Add bot's response to chat
            } catch (error) {
              console.error("Error:", error);
              addMessage(
                "Sorry, something went wrong. Please try again later.",
                false
              );
            }
          }
  
          function addMessage(text, isUser) {
            const messageContainer = document.createElement("div");
            messageContainer.classList.add("messageContainer");
            messageContainer.classList.add(
              isUser ? "userMessageContainer" : "botMessageContainer"
            );
            messageContainer.innerHTML = `<p class="message">${text}</p>`;
            chatContainer.appendChild(messageContainer);
  
            // Scroll to the bottom of the chat container
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        });
     

// RECOMMENDATIONS 
document.addEventListener("DOMContentLoaded", function() {
  // Add event listener to the "Get Recommendations" button
  document.getElementById("toggle-recommendations").addEventListener("click", function(event) {
      event.preventDefault(); // Prevent default action of the link
      window.location.href = "/recommendations"; // Redirect to the recommendations page
  });
});


// Function to send request for recommendations
function sendRecommendationsRequest() {
  fetch('/recommendations') // Assuming this is the endpoint for fetching recommendations
  .then(response => response.json())
  .then(data => {
      const recommendations = data.recommendations;
      displayRecommendations(recommendations); // Call a function to display recommendations
  })
  .catch(error => console.error('Error fetching recommendations:', error));
}

// Function to display recommendations
function displayRecommendations(recommendations) {
  
}
// NOTIFICATION
document.addEventListener("DOMContentLoaded", function() {
  // Add event listener to the "Notifications" button
  document.getElementById("toggle-notifications").addEventListener("click", function(event) {
      event.preventDefault(); // Prevent default action of the link
      window.location.href = "/notifications"; // Redirect to the notifications page
  });
});


// Function to show notifications when "Notifications" is clicked
function showNotifications() {
  // Make an AJAX request to the server to fetch notifications
  fetch('/notifications')
  .then(response => response.text())
  .then(notifications => {
      if (notifications.trim() === "") {
          // No notifications available
          document.getElementById('no-notifications').style.display = 'block';
          document.getElementById('notifications-content').style.display = 'none';
      } else {
          // Display notifications in a notifications container
          document.getElementById('notifications-content').innerText = notifications;
          document.getElementById('no-notifications').style.display = 'none';
          document.getElementById('notifications-container').style.display = 'block';
      }
  })
  .catch(error => console.error('Error fetching notifications:', error));
}

// Function to close the notifications container
function closeNotifications() {
  document.getElementById('notifications-container').style.display = 'none';
}




document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("go-to-homepage").addEventListener("click", function(event) {
      event.preventDefault();
      logout();
  });
});

function logout() {
  // Redirect to the Flask route
  window.location.href = '/';
}



// Add event listener for "Track Progress" button
document.getElementById("track-progress").addEventListener("click", function(event) {
  event.preventDefault();
  performSentimentAnalysis();
});

// dashboards

document.addEventListener("DOMContentLoaded", function() {
  // Function to refresh the page when "New Chat" is clicked
  document.getElementById("refresh-page").addEventListener("click", function(event) {
      event.preventDefault();
      location.reload();
  });


})

  
  


 
