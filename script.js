const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButon = document.querySelector("#theme-btn");
const deleteButon = document.querySelector("#delete-btn");
// console.log(sendButton);

let userText = null;

const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;
// sayfa yuklendiginde yerel depodan veri yukler
const loadDateFromLocalStorage = () => {
  // tema rengini kontrol eder gecerli temayi uygular
  const themeColor = localStorage.getItem("theme-color");
  document.body.classList.toggle("light-mode", themeColor === "light-mode");
  // tema rengini yerel depoda gunceller
  localStorage.setItem("theme-color", themeButon.innerText);
  themeButon.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
  const defaultText = `<div class="default-text"
    <h1>ChatGPT Clone</h1>
    </div>`;
  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scroll(0, chatContainer.scrollHeight);
};

loadDateFromLocalStorage();
const createElement = (html, className) => {
  //yeni div olusturma ve belirtilen chat sinifini ekleme
  //div'in html icerigini ayarlama
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};
const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");
  // api talebi için özelliklerini ve verileri tanımlama
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };
  //
  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    console.log(response);
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
    console.log(error);
    pElement.textContent = "Opppss";
    pElement.style.color = "red";
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const showTypingAnimation = () => {
  const html = ` <div class="chat-content">
    <div class="chat-details">
      <img src="img/chatgpt.png" alt="chat-images" />
      <div class="typing-animation">
        <div class="typing-dot" style="--delay: 0.2s"></div>
        <div class="typing-dot" style="--delay: 0.3s"></div>
        <div class="typing-dot" style="--delay: 0.4s"></div>
      </div>
    </div>
    <span class="material-symbols-outlined"> content_copy </span>
  </div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const heandleQutGoingChat = () => {
  userText = chatInput.value.trim(); // chat Input degerini alir ve fazladan bosluklari siler

  if (!userText) return; //chatInputun ici bos ise calismasin
  const html = `<div class="chat-content">
  <div class="chat-details">
    <img src="img/user.png" alt="user-images" />
    <p>
     ${userText}
    </p>
  </div>
</div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

themeButon.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButon.innerText);

  themeButon.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButon.addEventListener("click", () => {
  if (confirm("Silmek Istediginize emin misiniz?")) {
    localStorage.removeItem("all-chats");
    loadDateFromLocalStorage();
  }
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    heandleQutGoingChat();
  }
});
sendButton.addEventListener("click", heandleQutGoingChat);
