import { db, storage } from './firebase-config.js';
import {
  ref as dbRef,
  push,
  onValue,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";



const certRef = dbRef(db, "certificates");


onValue(certRef, snap => {
  const list = document.getElementById("user-list");
  const count = document.getElementById("user-count");

  list.innerHTML = "";
  let total = 0;

  const data = snap.val();
  if (data) {
    Object.keys(data).forEach(key => {
      const { name } = data[key];
      const li = document.createElement("li");
      li.textContent = name || key;
      list.appendChild(li);
      total++;
    });
  }

  count.textContent = total;
});


// Upload Article
window.uploadArticle = async function () {
  const titleInput = document.getElementById("articleTitle");
  const contentInput = document.getElementById("articleContent");

  const title = titleInput.value;
  const content = contentInput.value;

  const ref = push(dbRef(db, "articles"));
  await set(ref, { title, content, timestamp: Date.now() });

  alert("Article uploaded.");

  // Clear inputs
  titleInput.value = "";
  contentInput.value = "";
};


// Upload Infographic (no fetch check)
window.uploadInfographic = async function () {
  const urlInput = document.getElementById("infographicUrl");
  const captionInput = document.getElementById("infographicCaption");

  const imageUrl = urlInput.value.trim();
  const caption = captionInput.value.trim();

  if (!imageUrl || !caption) {
    alert("Please fill in both the image URL and caption.");
    return;
  }

  // ✅ Basic check: Does it look like an image URL?
  if (!imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
    alert("Invalid image URL. Make sure it ends with .jpg, .png, .webp, etc.");
    return;
  }

  try {
    // ✅ Upload to Firebase DB without fetch check
    const ref = push(dbRef(db, "infographics"));
    await set(ref, { imageUrl, caption });

    alert("Infographic uploaded.");

    // Clear inputs
    urlInput.value = "";
    captionInput.value = "";
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed. Check console.");
  }
};



// Upload Video
window.uploadVideo = async function () {
  const titleInput = document.getElementById("videoTitle");
  const videoInput = document.getElementById("videoUrl");

  const title = titleInput.value;
  const videoUrl = videoInput.value;

  const ref = push(dbRef(db, "videos"));
  await set(ref, { title, videoUrl });

  alert("Video uploaded.");

  // Clear inputs
  titleInput.value = "";
  videoInput.value = "";
};


// Upload Quiz
window.uploadQuiz = async function () {
  const questionInput = document.getElementById("quizQuestion");
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");
  const option3 = document.getElementById("option3");
  const answerSelect = document.getElementById("answerSelect");

  const question = questionInput.value;
  const options = [option1.value, option2.value, option3.value];
  const answerIndex = parseInt(answerSelect.value) - 1; // 0-based index

  // Validate
  if (!question || options.some(opt => !opt) || isNaN(answerIndex)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const answer = options[answerIndex];

  const ref = push(dbRef(db, "quizzes"));
  await set(ref, { question, options, answer });

  alert("Quiz uploaded.");

  // Clear inputs
  questionInput.value = "";
  option1.value = "";
  option2.value = "";
  option3.value = "";
  answerSelect.value = "1"; // reset to default
};

function createDeletableItem(key, text, parentRef, listElement) {
  const li = document.createElement("li");
  li.textContent = text + " ";

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.style.marginLeft = "10px";
  delBtn.onclick = async () => {
    if (confirm("Delete this item?")) {
      await remove(dbRef(db, `${parentRef}/${key}`));
    }
  };

  li.appendChild(delBtn);
  listElement.appendChild(li);
}

function renderDeletableList(path, listElementId, getTextFromItem) {
  const ref = dbRef(db, path);
  const list = document.getElementById(listElementId);
  
  onValue(ref, snap => {
    list.innerHTML = "";
    const data = snap.val();
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        const text = getTextFromItem(value);
        createDeletableItem(key, text, path, list);
      });
    }
  });
}

// Setup all lists
renderDeletableList("articles", "articles-list", item => item.title);
renderDeletableList("infographics", "infographics-list", item => item.caption);
renderDeletableList("videos", "videos-list", item => item.title);
renderDeletableList("quizzes", "quizzes-list", item => item.question);


