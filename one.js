
const crossBtn = document.querySelectorAll(".crossbtn");
const leftPanel = document.querySelector(".left");
const rightPanel = document.querySelector(".right");
const secbtnx = document.getElementById("secbtnx");
const dummy = document.getElementById("dummy");
const placeholderLogo = document.getElementById("placeholder-logo");
const chatBox = document.getElementById("chat-box");
const topHeading = document.getElementById("top-heading");
let nowDate;
let API_KEY;
let a=0;

let isHidden = false;
crossBtn.forEach(btn=> {
    btn.addEventListener("click", () => {
    if (!isHidden) {
        leftPanel.style.left = "-100%";
        rightPanel.style.width = "100vw";
        isHidden = true;
        secbtnx.style.display = "block";
        dummy.style.display="none";
    } else {
        leftPanel.style.left = "0";
        rightPanel.style.width = "75vw";
        isHidden = false;
        secbtnx.style.display = "none";
        dummy.style.display="block";
    }
    });
})

const popBoxBg = document.getElementById("pop-box-bg");

popBoxBg.addEventListener("click", (event) => {
    if (event.target === popBoxBg) {
        popBoxBg.style.display = "none";
        document.getElementById("chat-name").value = "";
        event.stopPropagation();
    }
});

const createChat = document.getElementById("chatbtn");

createChat.addEventListener("click", () => {
    popBoxBg.style.display = "flex";
})

function getChat(){
    let chatCounter = document.querySelector(".chat-counter");
    chatCounter.innerHTML="";
    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    chats.forEach((ch)=>{
        let chathist = document.createElement("div");
        chathist.classList.add("chathist");
        chathist.textContent = ch.content;
        chathist.id = ch.id;
        chatCounter.append(chathist);
        chathist.style.backgroundColor="#efeae7";
        document.querySelectorAll(".chathist").forEach((chatb)=>{
            chatb.addEventListener("click", ()=> {
                document.querySelectorAll(".chathist").forEach((box)=>{
                    box.style.backgroundColor="#efeae7";
                })
                chatb.style.backgroundColor="#ded9d6";
                let val = chatb.textContent;
                topHeading.innerHTML = `<h3>${val}</h3>`;
                placeholderLogo.style.display="none";
                chatBox.style.display="block";
            })
        })
    })
    if(a!=0){
        document.getElementById(chats[chats.length-1].id).style.backgroundColor = "#ded9d6";
    }
}


async function callGemini(prompt) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await res.json();
  if(data.error){
    return "incorrect API KEY!!"
  }
  return data.candidates[0].content.parts[0].text;
}

function createHistory(val){
    nowDate = Date.now();
    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    let newChat = { id: `chat-${nowDate}`, content: val };
    chats.push(newChat);
    a=1;
    localStorage.setItem("chats", JSON.stringify(chats));
    getChat();
}


function createAPIKey(val2){
    if(val2.trim().length==0){
        document.getElementById("key-error").textContent = "Enter correct API Key";
    }
    else{
        API_KEY=val2;
        document.getElementById("keybox-bg").style.display="none";
        document.getElementById("chat-box").style.display="block";
    }
}

document.getElementById("name-btn").addEventListener("click", () => {
    let val = document.getElementById("chat-name").value;
    createHistory(val);
    document.getElementById("chat-name").value = "";
    topHeading.innerHTML = `<h3>${val}</h3>`;
    popBoxBg.style.display = "none";
    placeholderLogo.style.display = "none";

    document.getElementById("keybox-bg").style.display="flex";
    document.getElementById("key-btn").addEventListener("click", () => {
        let val2 = document.getElementById("key-name").value;
        createAPIKey(val2);
    })
})


const chatSection = document.getElementById("chat-section");

async function addMessage(msg) {
    const newMsg = document.createElement("div");
    newMsg.textContent = msg;
    newMsg.classList.add("chat-sender");
    chatSection.appendChild(newMsg);
    chatSection.scrollTop = chatSection.scrollHeight;
    let val = await callGemini(msg);
    const newRes = document.createElement("div");
    newRes.textContent = val;
    newRes.classList.add("chat-receiver");
    chatSection.appendChild(newRes);
    chatSection.scrollTop = chatSection.scrollHeight;
}
const chatSubmit = document.getElementById("chat-submit");

chatSubmit.addEventListener("click", ()=> {
    addMessage(document.getElementById("chat-container").value);
    document.getElementById("chat-container").value="";
})



function main() {
  getChat();
}

main();
