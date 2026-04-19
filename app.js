// App State
let appState = {
  currentPlan: 365,
  completedReadings: {},
  notes: {},
  streak: 0,
  totalVersesRead: 0,
  totalChaptersRead: 0,
  bookmarks: [],
  bibleSettings: {
    fontSize: 18,
    lineHeight: 1.8,
    showVerseNumbers: true,
    readingMode: "verse", // 'verse' or 'scroll'
  },
  lastRead: null,
  currentBook: null,
  currentChapter: null,
  maxChapter: 0,
};

// Bible Books Database
const bibleBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

// Chapter counts for each book
const chapterCounts = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Kings": 22,
  "2 Kings": 25,
  "1 Chronicles": 29,
  "2 Chronicles": 36,
  Ezra: 10,
  Nehemiah: 13,
  Esther: 10,
  Job: 42,
  Psalms: 150,
  Proverbs: 31,
  Ecclesiastes: 12,
  "Song of Solomon": 8,
  Isaiah: 66,
  Jeremiah: 52,
  Lamentations: 5,
  Ezekiel: 48,
  Daniel: 12,
  Hosea: 14,
  Joel: 3,
  Amos: 9,
  Obadiah: 1,
  Jonah: 4,
  Micah: 7,
  Nahum: 3,
  Habakkuk: 3,
  Zephaniah: 3,
  Haggai: 2,
  Zechariah: 14,
  Malachi: 4,
  Matthew: 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  Romans: 16,
  "1 Corinthians": 16,
  "2 Corinthians": 13,
  Galatians: 6,
  Ephesians: 6,
  Philippians: 4,
  Colossians: 4,
  "1 Thessalonians": 5,
  "2 Thessalonians": 3,
  "1 Timothy": 6,
  "2 Timothy": 4,
  Titus: 3,
  Philemon: 1,
  Hebrews: 13,
  James: 5,
  "1 Peter": 5,
  "2 Peter": 3,
  "1 John": 5,
  "2 John": 1,
  "3 John": 1,
  Jude: 1,
  Revelation: 22,
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  setupEventListeners();
  setupNavigation();
  loadTodayReading();
  updateUI();
  setupTheme();
  loadBooksDrawer();
  applyBibleSettings();
});

// Load saved state
function loadState() {
  const saved = localStorage.getItem("bibleApp");
  if (saved) {
    const parsed = JSON.parse(saved);
    appState = { ...appState, ...parsed };
  }
}

function saveState() {
  localStorage.setItem("bibleApp", JSON.stringify(appState));
}

// Setup Event Listeners
function setupEventListeners() {
  // Existing listeners
  document
    .getElementById("markCompleteBtn")
    ?.addEventListener("click", markReadingComplete);
  document.getElementById("saveNoteBtn")?.addEventListener("click", saveNote);
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);
  document.getElementById("audioBtn")?.addEventListener("click", playAudio);
  document
    .getElementById("prevMonth")
    ?.addEventListener("click", () => changeMonth(-1));
  document
    .getElementById("nextMonth")
    ?.addEventListener("click", () => changeMonth(1));

  // Bible navigation
  document
    .getElementById("openBookMenu")
    ?.addEventListener("click", openDrawer);
  document.getElementById("menuToggle")?.addEventListener("click", openDrawer);
  document
    .getElementById("closeDrawer")
    ?.addEventListener("click", closeDrawer);
  document
    .getElementById("drawerOverlay")
    ?.addEventListener("click", closeDrawer);
  document
    .getElementById("prevChapterBtn")
    ?.addEventListener("click", prevChapter);
  document
    .getElementById("nextChapterBtn")
    ?.addEventListener("click", nextChapter);
  document
    .getElementById("chapterMenuBtn")
    ?.addEventListener("click", openChapterMenu);
  document
    .getElementById("closeJumpMenu")
    ?.addEventListener("click", closeChapterMenu);
  document
    .getElementById("readingSettingsBtn")
    ?.addEventListener("click", toggleSettingsPanel);
  document
    .getElementById("quickStartBtn")
    ?.addEventListener("click", quickStart);

  // Settings
  document
    .getElementById("fontIncrease")
    ?.addEventListener("click", () => adjustFontSize(2));
  document
    .getElementById("fontDecrease")
    ?.addEventListener("click", () => adjustFontSize(-2));
  document
    .getElementById("spacingIncrease")
    ?.addEventListener("click", () => adjustLineSpacing(0.2));
  document
    .getElementById("spacingDecrease")
    ?.addEventListener("click", () => adjustLineSpacing(-0.2));
  document
    .getElementById("verseModeBtn")
    ?.addEventListener("click", () => setReadingMode("verse"));
  document
    .getElementById("scrollModeBtn")
    ?.addEventListener("click", () => setReadingMode("scroll"));
  document
    .getElementById("showVerseNumbersToggle")
    ?.addEventListener("change", toggleVerseNumbers);

  // Footer actions
  document
    .getElementById("bookmarkCurrentBtn")
    ?.addEventListener("click", bookmarkCurrentChapter);
  document
    .getElementById("shareVerseBtn")
    ?.addEventListener("click", shareCurrentVerse);
  document
    .getElementById("copyVerseBtn")
    ?.addEventListener("click", copyCurrentVerse);

  // Drawer search
  document
    .getElementById("drawerSearch")
    ?.addEventListener("input", filterBooks);
}

// Setup Navigation
function setupNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.tab === tabName) {
      btn.classList.add("active");
    }
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabName}Tab`).classList.add("active");

  if (tabName === "notes") {
    loadNotes();
  } else if (tabName === "progress") {
    updateProgressTab();
    renderCalendar();
  } else if (tabName === "bible") {
    loadBookmarks();
  }
}

// ========== IMPROVED BIBLE READING FUNCTIONS ==========

// Load books into drawer
function loadBooksDrawer() {
  const booksList = document.getElementById("booksList");
  booksList.innerHTML = bibleBooks
    .map(
      (book) => `
        <div class="book-item" data-book="${book}">
            ${book}
        </div>
    `,
    )
    .join("");

  document.querySelectorAll(".book-item").forEach((item) => {
    item.addEventListener("click", () => {
      const book = item.dataset.book;
      selectBook(book);
      closeDrawer();
    });
  });
}

function filterBooks() {
  const searchTerm = document
    .getElementById("drawerSearch")
    .value.toLowerCase();
  const books = document.querySelectorAll(".book-item");

  books.forEach((book) => {
    const bookName = book.dataset.book.toLowerCase();
    if (bookName.includes(searchTerm)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}

function openDrawer() {
  document.getElementById("sideDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("open");
}

function closeDrawer() {
  document.getElementById("sideDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("open");
}

function selectBook(book) {
  appState.currentBook = book;
  appState.maxChapter = chapterCounts[book] || 30;
  appState.currentChapter = 1;

  document.getElementById("currentChapterDisplay").textContent = `Chapter 1`;
  document.getElementById("prevChapterBtn").disabled = true;
  document.getElementById("nextChapterBtn").disabled = appState.maxChapter <= 1;

  loadChapter();
}

async function loadChapter() {
  if (!appState.currentBook || !appState.currentChapter) return;

  const bibleContent = document.getElementById("bibleContent");
  bibleContent.innerHTML = '<div class="loading-spinner"></div>';
  document.getElementById("readingFooter").style.display = "block";

  try {
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(appState.currentBook)} ${appState.currentChapter}?translation=kjv`,
    );
    const data = await response.json();

    if (data.verses) {
      displayBeautifulContent(data);

      // Save last read
      appState.lastRead = {
        book: appState.currentBook,
        chapter: appState.currentChapter,
      };
      saveState();

      // Update chapter navigation
      updateChapterNavigation();
    } else {
      bibleContent.innerHTML =
        '<p class="error-message">Unable to load chapter. Please try again.</p>';
    }
  } catch (error) {
    bibleContent.innerHTML =
      '<p class="error-message">Error loading. Please check your connection.</p>';
  }
}

function displayBeautifulContent(data) {
  const bibleContent = document.getElementById("bibleContent");
  const showNumbers = appState.bibleSettings.showVerseNumbers;

  bibleContent.innerHTML = data.verses
    .map(
      (verse) => `
        <div class="bible-verse" data-verse="${verse.verse}" data-reference="${appState.currentBook} ${appState.currentChapter}:${verse.verse}">
            ${showNumbers ? `<span class="verse-number">${verse.verse}</span>` : ""}
            <span class="verse-text">${verse.text}</span>
            <div class="verse-actions">
                <button class="verse-action-btn" onclick="copyVerse('${appState.currentBook} ${appState.currentChapter}:${verse.verse}', '${verse.text.replace(/'/g, "\\'")}')">📋</button>
                <button class="verse-action-btn" onclick="shareVerse('${appState.currentBook} ${appState.currentChapter}:${verse.verse}', '${verse.text.replace(/'/g, "\\'")}')">📤</button>
                <button class="verse-action-btn" onclick="bookmarkVerse('${appState.currentBook}', ${appState.currentChapter}, ${verse.verse})">⭐</button>
            </div>
        </div>
    `,
    )
    .join("");

  // Update reading progress
  updateReadingProgressBar();
}

function updateChapterNavigation() {
  document.getElementById("currentChapterDisplay").textContent =
    `Chapter ${appState.currentChapter}`;
  document.getElementById("prevChapterBtn").disabled =
    appState.currentChapter <= 1;
  document.getElementById("nextChapterBtn").disabled =
    appState.currentChapter >= appState.maxChapter;
}

function prevChapter() {
  if (appState.currentChapter > 1) {
    appState.currentChapter--;
    loadChapter();
  }
}

function nextChapter() {
  if (appState.currentChapter < appState.maxChapter) {
    appState.currentChapter++;
    loadChapter();
  }
}

function openChapterMenu() {
  const menu = document.getElementById("chapterJumpMenu");
  const chapterList = document.getElementById("chapterList");

  chapterList.innerHTML = "";
  for (let i = 1; i <= appState.maxChapter; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "chapter-item";
    if (i === appState.currentChapter) btn.classList.add("active");
    btn.onclick = () => {
      appState.currentChapter = i;
      loadChapter();
      closeChapterMenu();
    };
    chapterList.appendChild(btn);
  }

  menu.style.display = "block";
}

function closeChapterMenu() {
  document.getElementById("chapterJumpMenu").style.display = "none";
}

function toggleSettingsPanel() {
  const panel = document.getElementById("readingSettingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function adjustFontSize(delta) {
  let newSize = appState.bibleSettings.fontSize + delta;
  if (newSize >= 14 && newSize <= 28) {
    appState.bibleSettings.fontSize = newSize;
    applyBibleSettings();
    saveState();
    document.getElementById("fontSizeDisplay").textContent = `${newSize}px`;
  }
}

function adjustLineSpacing(delta) {
  let newSpacing = appState.bibleSettings.lineHeight + delta;
  if (newSpacing >= 1.4 && newSpacing <= 2.4) {
    appState.bibleSettings.lineHeight = newSpacing;
    applyBibleSettings();
    saveState();
  }
}

function setReadingMode(mode) {
  appState.bibleSettings.readingMode = mode;
  document
    .getElementById("verseModeBtn")
    .classList.toggle("active", mode === "verse");
  document
    .getElementById("scrollModeBtn")
    .classList.toggle("active", mode === "scroll");
  applyBibleSettings();
  saveState();
}

function applyBibleSettings() {
  const bibleContent = document.querySelector(".bible-content");
  if (bibleContent) {
    bibleContent.style.fontSize = `${appState.bibleSettings.fontSize}px`;
    bibleContent.style.lineHeight = appState.bibleSettings.lineHeight;
  }
}

function toggleVerseNumbers() {
  appState.bibleSettings.showVerseNumbers = document.getElementById(
    "showVerseNumbersToggle",
  ).checked;
  saveState();
  if (appState.currentBook && appState.currentChapter) {
    loadChapter();
  }
}

function updateReadingProgressBar() {
  const progress = (appState.currentChapter / appState.maxChapter) * 100;
  const progressBar = document.getElementById("readingProgressBar");
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
}

// Verse Actions
function copyVerse(reference, text) {
  navigator.clipboard.writeText(`${reference}\n\n${text}`);
  showToast("Copied to clipboard! 📋");
}

function shareVerse(reference, text) {
  if (navigator.share) {
    navigator.share({
      title: reference,
      text: text,
    });
  } else {
    copyVerse(reference, text);
  }
}

function bookmarkVerse(book, chapter, verse) {
  const bookmarkRef = `${book} ${chapter}:${verse}`;

  if (appState.bookmarks.some((b) => b.reference === bookmarkRef)) {
    showToast("Already bookmarked! ⭐");
    return;
  }

  appState.bookmarks.push({
    id: Date.now(),
    reference: bookmarkRef,
    book,
    chapter,
    verse,
    dateAdded: new Date().toISOString(),
  });

  saveState();
  loadBookmarks();
  showToast(`Bookmarked: ${bookmarkRef} ⭐`);
}

function bookmarkCurrentChapter() {
  if (appState.currentBook && appState.currentChapter) {
    const bookmarkRef = `${appState.currentBook} ${appState.currentChapter}`;
    showToast(`Bookmarked ${bookmarkRef} ⭐`);
    // Add to bookmarks as a chapter bookmark
    appState.bookmarks.push({
      id: Date.now(),
      reference: bookmarkRef,
      book: appState.currentBook,
      chapter: appState.currentChapter,
      verse: null,
      dateAdded: new Date().toISOString(),
    });
    saveState();
    loadBookmarks();
  }
}

function shareCurrentVerse() {
  const activeVerse = document.querySelector(".bible-verse");
  if (activeVerse) {
    const reference = activeVerse.dataset.reference;
    const text = activeVerse.querySelector(".verse-text").textContent;
    shareVerse(reference, text);
  }
}

function copyCurrentVerse() {
  const activeVerse = document.querySelector(".bible-verse");
  if (activeVerse) {
    const reference = activeVerse.dataset.reference;
    const text = activeVerse.querySelector(".verse-text").textContent;
    copyVerse(reference, text);
  }
}

function loadBookmarks() {
  const bookmarksList = document.getElementById("bookmarksList");
  if (!bookmarksList) return;

  if (!appState.bookmarks || appState.bookmarks.length === 0) {
    bookmarksList.innerHTML =
      "<p>No bookmarks yet. Click the ⭐ next to any verse!</p>";
    return;
  }

  bookmarksList.innerHTML = appState.bookmarks
    .map(
      (bookmark) => `
        <div class="bookmark-item" onclick="loadBookmark('${bookmark.book}', ${bookmark.chapter})">
            <div>
                <div class="bookmark-ref">${bookmark.reference}</div>
                <small>${new Date(bookmark.dateAdded).toLocaleDateString()}</small>
            </div>
            <button class="bookmark-delete" onclick="event.stopPropagation(); deleteBookmark(${bookmark.id})">Delete</button>
        </div>
    `,
    )
    .join("");
}

function loadBookmark(book, chapter) {
  switchTab("bible");
  selectBook(book);
  setTimeout(() => {
    appState.currentChapter = chapter;
    loadChapter();
  }, 100);
  closeDrawer();
}

function deleteBookmark(id) {
  appState.bookmarks = appState.bookmarks.filter((b) => b.id !== id);
  saveState();
  loadBookmarks();
  showToast("Bookmark removed");
}

function quickStart() {
  selectBook("John");
}

function showToast(message) {
  const toast = document.getElementById("verseToast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ========== TODAY'S READING FUNCTIONS ==========

async function loadTodayReading() {
  const today = getTodayDate();
  document.getElementById("currentDate").textContent = formatDate(today);

  try {
    const readings = await loadReadings();
    const reading = readings[today] || getFallbackReading(today);

    document.getElementById("readingTitle").textContent = reading.title;
    document.getElementById("versesReference").textContent = reading.verses;

    await fetchBibleVerses(reading.verses);

    if (appState.completedReadings[today]) {
      document.getElementById("completedStatus").style.display = "block";
      document.getElementById("markCompleteBtn").style.display = "none";
    } else {
      document.getElementById("completedStatus").style.display = "none";
      document.getElementById("markCompleteBtn").style.display = "block";
    }
  } catch (error) {
    console.error("Error loading reading:", error);
  }
}

async function loadReadings() {
  try {
    const response = await fetch("data/readings.json");
    return await response.json();
  } catch (error) {
    return getFallbackReadings();
  }
}

async function fetchBibleVerses(reference) {
  const versesContent = document.getElementById("versesContent");
  versesContent.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`,
    );
    const data = await response.json();

    if (data.text) {
      versesContent.innerHTML = `<p>${data.text.replace(/\n/g, "<br>")}</p>`;
    } else {
      versesContent.innerHTML =
        "<p>Unable to fetch verses. Please try again later.</p>";
    }
  } catch (error) {
    versesContent.innerHTML = "<p>Error loading verses.</p>";
  }
}

function markReadingComplete() {
  const today = getTodayDate();
  appState.completedReadings[today] = true;
  appState.totalVersesRead++;

  updateStreak();
  saveState();

  document.getElementById("completedStatus").style.display = "block";
  document.getElementById("markCompleteBtn").style.display = "none";

  showToast("Great job! Keep up the good work! 📖");
  updateUI();
}

function updateStreak() {
  const dates = Object.keys(appState.completedReadings).sort();
  let currentStreak = 0;
  let today = getTodayDate();

  for (let i = dates.length - 1; i >= 0; i--) {
    const date = new Date(dates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i));

    if (date.toDateString() === expectedDate.toDateString()) {
      currentStreak++;
    } else {
      break;
    }
  }

  appState.streak = currentStreak;
}

// ========== NOTES FUNCTIONS ==========

function saveNote() {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const today = getTodayDate();

  if (!title && !content) {
    showToast("Please write something before saving!");
    return;
  }

  if (!appState.notes[today]) {
    appState.notes[today] = [];
  }

  appState.notes[today].push({
    id: Date.now(),
    title: title || "Untitled Note",
    content: content,
    date: new Date().toISOString(),
  });

  saveState();
  showToast("Note saved! ✨");

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  loadNotes();
}

function loadNotes() {
  const notesList = document.getElementById("notesList");
  const noteDate = document.getElementById("noteDate");
  const today = getTodayDate();

  noteDate.textContent = formatDate(today);

  if (!appState.notes || Object.keys(appState.notes).length === 0) {
    notesList.innerHTML =
      "<p>No notes yet. Start writing your reflections!</p>";
    return;
  }

  const recentNotes = Object.entries(appState.notes)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(0, 10);

  notesList.innerHTML = recentNotes
    .map(
      ([date, notes]) => `
        <div class="note-item">
            <h4>${formatDate(date)}</h4>
            ${notes
              .slice(0, 2)
              .map(
                (note) => `
                <div style="margin-top: 10px;">
                    <strong>${escapeHtml(note.title)}</strong>
                    <p>${escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? "..." : ""}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    `,
    )
    .join("");
}

// ========== PROGRESS FUNCTIONS ==========

function updateProgressTab() {
  const totalDays = Object.keys(appState.completedReadings).filter((key) =>
    key.includes("-"),
  ).length;
  const completionRate = Math.min(100, Math.round((totalDays / 30) * 100));

  document.getElementById("totalRead").textContent = totalDays;
  document.getElementById("completionRate").textContent = `${completionRate}%`;
  document.getElementById("totalVerses").textContent =
    appState.totalVersesRead || 0;
  document.getElementById("totalChapters").textContent =
    appState.totalChaptersRead || 0;
  document.getElementById("streakCount").textContent = appState.streak || 0;
}

let currentCalendarDate = new Date();

function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  document.getElementById("currentMonthYear").textContent =
    `${firstDay.toLocaleString("default", { month: "long" })} ${year}`;

  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";

  ["S", "M", "T", "W", "T", "F", "S"].forEach((day) => {
    const dayLabel = document.createElement("div");
    dayLabel.textContent = day;
    dayLabel.style.fontWeight = "bold";
    dayLabel.style.textAlign = "center";
    calendarGrid.appendChild(dayLabel);
  });

  for (let i = 0; i < startingDay; i++) {
    const emptyCell = document.createElement("div");
    calendarGrid.appendChild(emptyCell);
  }

  const today = getTodayDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    if (appState.completedReadings[dateStr]) {
      dayCell.classList.add("completed");
    }
    if (dateStr === today) {
      dayCell.classList.add("today");
    }
    dayCell.textContent = day;
    calendarGrid.appendChild(dayCell);
  }
}

function changeMonth(delta) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
  renderCalendar();
}

function updateUI() {
  updateProgressTab();
  if (document.getElementById("progressTab").classList.contains("active")) {
    renderCalendar();
  }
}

// ========== PLANS FUNCTIONS ==========

function selectPlan(days) {
  appState.currentPlan = days;
  saveState();

  const planInfo = document.getElementById("currentPlanInfo");
  planInfo.innerHTML = `<div class="plan-card" style="margin-top: 20px;">
        <h3>Current Plan: ${days}-Day Reading Plan</h3>
        <p>You're on a ${days}-day journey through God's Word!</p>
    </div>`;

  showToast(`Switched to ${days}-day reading plan!`);
}

// ========== HELPER FUNCTIONS ==========

function playAudio() {
  showToast("Audio feature coming soon! 🎧");
}

function setupTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    document.getElementById("themeToggle").textContent = "☀️";
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    document.getElementById("themeToggle").textContent = "🌙";
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.getElementById("themeToggle").textContent = "☀️";
  }
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getWordCount(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

document.getElementById("noteContent")?.addEventListener("input", (e) => {
  const count = getWordCount(e.target.value);
  document.getElementById("wordCount").textContent = `${count} words`;
});

function getFallbackReadings() {
  const readings = {};
  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    readings[dateStr] = {
      title: `Day ${i + 1}: God's Word`,
      verses: `Psalm ${(i % 150) + 1}`,
    };
  }
  return readings;
}

function getFallbackReading(date) {
  return {
    title: "God's Daily Word",
    verses: "John 3:16",
  };
}

// Make functions global
window.selectPlan = selectPlan;
window.copyVerse = copyVerse;
window.shareVerse = shareVerse;
window.bookmarkVerse = bookmarkVerse;
window.loadBookmark = loadBookmark;
window.deleteBookmark = deleteBookmark;
