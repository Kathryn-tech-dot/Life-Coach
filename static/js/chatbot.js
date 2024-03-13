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
// Function to send user input to the server and receive bot response
function sendMessage() {
    // Get user input
    const input = inputField.value;

    // Clear input field
    inputField.value = '';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

    // Add user input to conversation
    let message = document.createElement('div');
    message.classList.add('chatbot-message', 'user-message');
    message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
    conversation.appendChild(message);

    // Send user input to server for processing
    fetch('/process_input', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_input: input })
    })
    .then(response => response.json())
    .then(data => {
        // Add bot response to conversation
        let botMessage = document.createElement('div');
        botMessage.classList.add('chatbot-message', 'chatbot');
        botMessage.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${data.response}</p>`;
        conversation.appendChild(botMessage);
        botMessage.scrollIntoView({ behavior: "smooth" });
    })
    .catch(error => console.error('Error:', error));
}
// Function to update circular chart
function updateChart(data) {
  var layout = {
      height: 400,
      width: 400,
      title: 'Sentiment Distribution',
      showlegend: true
  };
  var trace = {
      values: [data.positive, data.neutral, data.negative],
      labels: ['Positive', 'Neutral', 'Negative'],
      type: 'pie'
  };
  Plotly.newPlot('sentiment-chart', [trace], layout);
}

// Add event listener to input form
$('#input-form').submit(function(event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input
  var input = $('#input-field').val();

  // Clear input field
  $('#input-field').val('');

  // Perform AJAX request to track progress
  $.ajax({
      type: 'POST',
      url: '/track_progress',
      contentType: 'application/json',
      data: JSON.stringify({ user_input: input, bot_response: 'Bot response' }),
      success: function(response) {
          // Update circular chart with sentiment distribution
          updateChart(response);
      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });

  // Add user input to conversation (omitted for brevity)
});

// Initial rendering of circular chart
updateChart({ positive: 0, neutral: 0, negative: 0 });
// objective RECOMMENDATION 
// Get references to recommendation, notification, and relaxation sections
const recommendationsSection = document.getElementById('recommendations-section');
const notificationsSection = document.getElementById('notifications-section');
const relaxationSection = document.getElementById('relaxation-section');

// Get references to toggle buttons
const toggleRecommendations = document.getElementById('toggle-recommendations');
const toggleNotifications = document.getElementById('toggle-notifications');
const toggleRelaxation = document.getElementById('toggle-relaxation');

// Add event listeners to toggle buttons
toggleRecommendations.addEventListener('click', () => {
    toggleVisibility(recommendationsSection);
    hideOthers(recommendationsSection);
});

toggleNotifications.addEventListener('click', () => {
    toggleVisibility(notificationsSection);
    hideOthers(notificationsSection);
});

toggleRelaxation.addEventListener('click', () => {
    toggleVisibility(relaxationSection);
    hideOthers(relaxationSection);
});

// Function to toggle visibility of a section
function toggleVisibility(element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

// Function to hide other sections when one section is displayed
function hideOthers(currentSection) {
    const sections = [recommendationsSection, notificationsSection, relaxationSection];
    sections.forEach(section => {
        if (section !== currentSection && section.style.display !== 'none') {
            section.style.display = 'none';
        }
    });
}
