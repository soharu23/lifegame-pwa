const KEY = "life-game-app-v1";
const app = document.getElementById("app");
const toastBox = document.getElementById("toastBox");
const resetBtn = document.getElementById("resetBtn");
const importFile = document.getElementById("importFile");
let introStep = 0;
let introTypingToken = 0;
const skills = ["語言能力", "美術能力", "身體能力", "表達能力", "創作能力", "生活掌控能力", "心靈穩定能力", "打扮能力"];
const skillIds = ["language", "art", "body", "expression", "creation", "life", "mind", "style"];
const skillClassById = {
  language: "language",
  art: "art",
  body: "body",
  expression: "expression",
  creation: "creation",
  life: "life",
  mind: "mind",
  style: "style",
};
const defaultSkillLabels = {
  language: "語言能力",
  art: "美術能力",
  body: "身體能力",
  expression: "表達能力",
  creation: "創作能力",
  life: "生活掌控能力",
  mind: "心靈穩定能力",
  style: "打扮能力",
};
const defaultSkillByName = Object.fromEntries(Object.entries(defaultSkillLabels).map(([id, label]) => [label, id]));
const levelRules = [
  [1, 0, "剛開始接觸"], [2, 10, "開始熟悉"], [3, 26, "養成習慣"], [4, 45, "穩定練習"],
  [5, 70, "可以持續"], [6, 105, "進入專精"], [7, 150, "能夠輸出"], [8, 210, "形成風格"],
].map(([level, threshold, note]) => ({ level, label: `Lv.${level}`, threshold, note }));
const worldRules = [
  {
    level: 1,
    threshold: 0,
    title: "新手村",
    badge: "村",
    intro: "你會什麼呢？你只是個新手，對自己寬容點。",
    buffs: ["未知抗性buff：降低對陌生主題的排斥感"],
    items: ["背包", "筆記本", "開始的勇氣與好奇心"],
  },
  {
    level: 2,
    threshold: 10,
    title: "踏上旅途",
    badge: "旅",
    intro: "",
    buffs: ["快樂buff：大幅提升幸福感，更容易從生活中獲得快樂"],
    items: ["《未點亮的地圖》（每週首次探索額外 +1pt）"],
  },
  {
    level: 3,
    threshold: 25,
    title: "晨霧中的行者",
    badge: "霧",
    intro: "",
    buffs: ["迷霧抗性buff：降低自我懷疑，不輕易否定自己"],
    items: ["提燈（晨霧不會立刻散去，你卻能在其中前行）"],
  },
  {
    level: 4,
    threshold: 45,
    title: "燈塔下的石板路",
    badge: "塔",
    intro: "我透過燈塔的光的指引，終於逐漸靠近了燈塔。能夠站在距離燈塔近的地方，能夠看清光，表達自己的感謝，已經是相當大的榮幸了。",
    buffs: [
      "自我buff：提升保持自我的能力。憧憬是好事。但你可以成為理想中的自己，而非成為第二個某人",
      "感知buff：提升對他人的幫助的感知力。抱持對知識、分享者與旅途中微小善意的感謝與尊重",
    ],
    items: ["《口袋裡的糖》（燈塔主人送你的禮物，可以帶到下一張地圖）"],
  },
  {
    level: 5,
    threshold: 75,
    title: "聆聽鐵橋震鳴的旅客",
    badge: "橋",
    intro: "世界開始擴展。離開舒適圈未必平靜順利，但發動的列車在抵達目的地之前，是不會停下的。",
    buffs: ["外出耐力buff：提升對外界的探索意願"],
    items: ["《舊車票》（非必要的外出額外+1pt）"],
  },
  {
    level: 6,
    threshold: 110,
    title: "借宿圖書館的造訪者",
    badge: "書",
    intro: "",
    buffs: ["閱讀耐性buff：提升從閱讀中整理自己的觀點的能力"],
    items: ["《借閱證》（閱讀類任務額外 +1pt）"],
  },
  {
    level: 7,
    threshold: 160,
    title: "踏上晚鐘漸遠的原野",
    badge: "鐘",
    intro: "",
    buffs: ["內耗抗性buff：降低心中的內耗，相信自己是最重要的"],
    items: ["《旅人的摺疊帳篷》（不管走到哪裡，都能自主創造讓自己舒服的空間）"],
  },
  {
    level: 8,
    threshold: 220,
    title: "望向群山外的世界",
    badge: "山",
    intro: "",
    buffs: ["思考buff：提升思考深度，更容易產生自己的價值觀，但也尊重他人"],
    items: ["《望遠鏡》（能夠看清更遠的地方）"],
  },
  {
    level: 9,
    threshold: 300,
    title: "月桂冠未授者",
    badge: "桂",
    intro: "",
    buffs: ["謙虛buff：你明白了在不同領域，都有許多專精的強者"],
    items: ["《月桂枝》"],
  },
  {
    level: 10,
    threshold: 400,
    title: "世界的旅人",
    badge: "界",
    intro: "你未必抵達了世界盡頭，卻已經能帶著自己，平靜地走向世界的任何地方。",
    buffs: [
      "內核加固buff：大幅提升精神穩定度",
      "旅行者之心：永不迷失自我",
      "83億種活法：不再輕易否定自己，對「必須成為某種人」的焦慮下降，更容易依照自己的步調生活",
      "遠方的風：曾經閱讀過、看見過、感受過的事物，會在未來某一天，悄悄成為支撐你的東西",
      "地圖之外：有些問題沒有答案，有些旅程沒有終點。幸運的是，你已經有了點亮地圖的經驗和能力",
    ],
    items: ["《寫滿的日記》（翻開後又捨不得丟掉）", "《舊指南針》（陪伴你一路的指南針）"],
  },
];
const taskSeed = [
  ["喝水", "每天", "1500cc", "身體能力", 1, 0], ["伸展運動", "每天", "10分鐘", "身體能力", 1, 0],
  ["塗身體乳液", "每天", "", "打扮能力", 1, 0], ["簡易日記", "每天", "1篇", "表達能力", 1, 0],
  ["紀錄天氣", "每天", "", "生活掌控能力", 1, 0], ["朗讀簡易日記", "每天", "1篇", "表達能力", 2, 0],
  ["學習英語單字", "英語周", "5個", "語言能力", 1, 0], ["朗讀英語句子", "英語周", "3句", "語言能力", 2, 0],
  ["閱讀英語短文", "英語周", "1篇", "語言能力", 3, 0], ["朗讀日語句子", "日語周", "3句", "語言能力", 2, 0],
  ["閱讀日語短文", "日語周", "1篇", "語言能力", 3, 0], ["英語複習", "英語周", "", "語言能力", 2, 0],
  ["日語複習", "日語周", "", "語言能力", 2, 0], ["速寫練習", "周任務", "1張", "美術能力", 1, 0],
  ["速寫練習", "周任務", "5人", "美術能力", 1, 0], ["唸經", "周任務", "3次", "心靈穩定能力", 1, 0],
  ["朗讀中文", "周任務", "", "表達能力", 2, 0], ["學習新知識", "周任務", "1個", "生活掌控能力", 3, 1],
  ["整理手機相簿", "周任務", "", "生活掌控能力", 1, 0], ["書法練習", "周3次", "3張", "美術能力", 1, 0],
  ["靜坐10分鐘", "周3次", "", "心靈穩定能力", 1, 0], ["不喝手搖飲", "周4次", "", "身體能力", 3, 0],
  ["不吃甜點", "周4次", "", "身體能力", 3, 0], ["探索新店", "月任務", "", "世界探索", 0, 3],
  ["認識一位創作者", "月任務", "", "世界探索", 0, 3], ["整理房間", "月任務", "", "生活掌控能力", 2, 0],
  ["跟讀(發音糾正)", "小任務", "", "語言能力", 3, 0], ["分析說話方式", "小任務", "", "表達能力", 3, 0],
  ["聽寫句子", "小任務", "", "語言能力", 2, 0], ["完成規劃一件事", "不定時", "", "生活掌控能力", 1, 0],
  ["整理作業區", "不定時", "", "生活掌控能力", 1, 0], ["小說相關", "小任務", "", "創作能力", 1, 0],
  ["聽一個講座", "小任務", "", "生活掌控能力", 1, 1], ["分享一個知識", "小任務", "", "表達能力", 1, 1],
  ["連續四周書法", "BONUS", "", "美術能力", 5, 0], ["連續兩周速寫", "BONUS", "", "美術能力", 5, 0],
  ["超額不喝手搖飲", "BONUS", "", "身體能力", 5, 0], ["超額不吃甜點", "BONUS", "", "身體能力", 5, 0],
  ["連續7天日記", "BONUS", "", "表達能力", 3, 0],
].map((row, i) => ({ id: `TASK-${String(i + 1).padStart(3, "0")}`, name: row[0], category: row[1], target: row[2], skill: row[3], exp: row[4], worldExp: row[5], deleted: false }));
const dungeonSeed = [];
const defaultProfile = () => ({
  name: "麗晴",
  sign: "魔羯座",
  age: "26歲",
  tags: ["慢熱型", "只知舊番的老宅宅", "人生是場旅程"],
  freeLine: "將知識溶入血肉，具有強韌的內核、充實的內心、溫良的性格、健康的身體。",
  goal: "用喜歡的方式，把生活一點一點撿回來。",
  goals: ["用喜歡的方式，把生活一點一點撿回來。", "", "", "", ""],
});
const base = () => ({ introDone: false, profile: defaultProfile(), skillLabels: { ...defaultSkillLabels }, tasks: taskSeed, weeklyBoard: taskSeed.slice(0, 6).map(task => task.id), dungeons: dungeonSeed, checkins: [], dungeonLogs: [], worldLogs: [] });
let state = load();
let selectedDungeon = state.dungeons[0]?.id;
function load() {
  try {
    const loaded = { ...base(), ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    loaded.profile = { ...defaultProfile(), ...(loaded.profile || {}) };
    if (!Array.isArray(loaded.profile.goals)) {
      loaded.profile.goals = [loaded.profile.goal || "", "", "", "", ""];
    }
    loaded.skillLabels = { ...defaultSkillLabels, ...(loaded.skillLabels || {}) };
    loaded.tasks = loaded.tasks.map(task => ({ deleted: false, ...task }));
    if (!Array.isArray(loaded.weeklyBoard)) loaded.weeklyBoard = loaded.tasks.filter(task => !task.deleted).slice(0, 6).map(task => task.id);
    loaded.weeklyBoard = loaded.weeklyBoard.filter(taskId => loaded.tasks.some(task => task.id === taskId && !task.deleted));
    return loaded;
  } catch {
    return base();
  }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function date() { return new Date().toISOString().slice(0, 10); }
function weekStart(value = new Date()) {
  const d = new Date(value);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function id(p) { return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
function esc(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function pct(a, b) { return b ? Math.round(Math.min(Math.max(a / b, 0), 1) * 100) : 0; }
function lv(exp, rules = levelRules) { return rules.reduce((x, r) => exp >= r.threshold ? r : x, rules[0]); }
function nextLv(exp, rules = levelRules) { return rules.find(r => r.threshold > exp) || null; }
function skillStats() {
  const m = Object.fromEntries(skills.map(s => [s, 0]));
  state.checkins.forEach(e => { if (m[e.skill] !== undefined) m[e.skill] += +e.exp || 0; });
  state.dungeonLogs.forEach(e => { if (m[e.skill] !== undefined) m[e.skill] += +e.exp || 0; });
  return Object.entries(m).map(([skill, exp]) => ({ skill, exp, level: lv(exp), next: nextLv(exp) }));
}
function world() {
  const exp = state.checkins.reduce((s, e) => s + (+e.worldExp || 0), 0) + state.dungeonLogs.reduce((s, e) => s + (+e.worldExp || 0), 0) + state.worldLogs.reduce((s, e) => s + (+e.exp || 0), 0);
  return { exp, level: lv(exp, worldRules), next: nextLv(exp, worldRules), unlocked: worldRules.filter(r => exp >= r.threshold) };
}
function bar(p) { return `<div class="bar"><span style="--p:${p}%"></span></div>`; }
function stat(k, v, n = "") { return `<div class="stat"><small>${esc(k)}</small><b>${esc(v)}</b>${n ? `<div class="muted">${esc(n)}</div>` : ""}</div>`; }
function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; toastBox.append(t); setTimeout(() => t.remove(), 3000); }
function introText(id) {
  const texts = {
    one: `▓▓▓▓▓▓▓▓▓▓▓▓▓\n\n歡迎你，未來的旅行者。\n\n你的日子或許晴朗而安穩，\n也或許像晨霧裡的石板路，\n看不清前方，\n不知道自己究竟走了多遠。\n\n而此刻，\n為重新站在旅途起點的你，\n我準備了一點點的禮物。`,
    two: `旅行者，\n希望你喜歡這份心意。\n\n或許在未來的旅途中，\n你還會收到更多不同的禮物。\n\n現在，\n請在筆記本中寫下你的名字，\n作為旅途的開始吧。`,
  };
  return texts[id] || "";
}
function typeText(el, text, done, speed = 42) {
  const token = ++introTypingToken;
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (token !== introTypingToken) return;
    el.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) {
      const char = text[i - 2] || "";
      const delay = char === "\n" ? speed * 4 : /[，。]/.test(char) ? speed * 7 : speed;
      setTimeout(tick, delay);
    } else if (done) {
      done();
    }
  };
  tick();
}
function renderIntro() {
  document.body.classList.add("intro-active");
  app.innerHTML = introPage();
  bindIntro();
}
function introPage() {
  if (introStep === 1) {
    return `<section class="intro-screen intro-step-2"><div class="intro-panel intro-panel-narrow"><div class="intro-lines reward-lines" id="introRewards"></div><div class="intro-type" id="introText"></div><button class="intro-next hidden" data-intro-next>筆記本自動翻開了 <span>→</span></button></div></section>`;
  }
  if (introStep === 2) {
    return `<section class="intro-screen intro-step-3"><div class="notebook-wrap"><form id="introNameForm" class="notebook"><div class="paper-wear"></div><div class="journal-emblem" aria-hidden="true">✧</div><label class="notebook-label">請寫下你的名字……</label><div class="name-line"><input name="name" autocomplete="name" maxlength="24" required autofocus><span class="cursor"></span></div><p class="record-message" id="introRecord"></p><button class="intro-next notebook-submit" type="submit">建立旅途紀錄 <span>→</span></button></form></div></section>`;
  }
  return `<section class="intro-screen intro-step-1"><div class="intro-road"></div><div class="intro-panel"><div class="intro-type" id="introText"></div><button class="intro-next hidden" data-intro-next>伸出手 <span>→</span></button></div></section>`;
}
function bindIntro() {
  const textEl = document.getElementById("introText");
  const next = document.querySelector("[data-intro-next]");
  if (introStep === 0 && textEl) {
    typeText(textEl, introText("one"), () => next?.classList.remove("hidden"));
  }
  if (introStep === 1) {
    const rewards = document.getElementById("introRewards");
    const lines = ["──你獲得了背包。", "──你獲得了道具：筆記本", "──你獲得了道具：開始的勇氣與好奇心"];
    rewards.innerHTML = lines.map(line => `<p>${esc(line)}</p>`).join("");
    rewards.querySelectorAll("p").forEach((line, index) => {
      line.style.animationDelay = `${0.8 + index * 1.7}s`;
    });
    setTimeout(() => typeText(textEl, introText("two"), () => next?.classList.remove("hidden"), 40), 6300);
  }
  if (introStep === 2) {
    setTimeout(() => document.querySelector("#introNameForm input")?.focus(), 80);
  }
  document.querySelectorAll("[data-intro-next]").forEach(button => button.addEventListener("click", () => {
    introStep += 1;
    renderIntro();
  }));
  const introNameForm = document.getElementById("introNameForm");
  const finishIntro = form => {
    if (!form || form.dataset.done === "true") return;
    const name = new FormData(form).get("name").trim();
    if (!name) {
      form.reportValidity?.();
      return;
    }
    form.dataset.done = "true";
    form.querySelector(".notebook-submit")?.setAttribute("disabled", "true");
    state.profile = { ...state.profile, name };
    state.introDone = true;
    save();
    const message = document.getElementById("introRecord");
    message.textContent = "新的旅途紀錄已建立。";
    setTimeout(() => {
      document.body.classList.remove("intro-active");
      location.hash = "#today";
      render("today");
    }, 950);
  };
  introNameForm?.addEventListener("submit", event => {
    event.preventDefault();
    finishIntro(event.currentTarget);
  });
  introNameForm?.querySelector(".notebook-submit")?.addEventListener("click", event => {
    event.preventDefault();
    finishIntro(introNameForm);
  });
}
function skillId(skill) {
  if (skill === "世界探索") return "world";
  if (defaultSkillByName[skill]) return defaultSkillByName[skill];
  return Object.entries(state.skillLabels || {}).find(([, label]) => label === skill)?.[0] || "default";
}
function skillLabel(skill) {
  const id = skillId(skill);
  if (id === "world") return "世界探索";
  return state.skillLabels?.[id] || skill || defaultSkillLabels[id] || skill;
}
function skillClass(skill) { return `skill-${skillClassById[skillId(skill)] || skillId(skill)}`; }
function skillOptions(selected = "") {
  return skillIds.map(id => {
    const label = state.skillLabels?.[id] || defaultSkillLabels[id];
    return `<option value="${esc(defaultSkillLabels[id])}" ${selected === defaultSkillLabels[id] ? "selected" : ""}>${esc(label)}</option>`;
  }).join("");
}
function skillTag(skill) { return `<span class="chip skill-tag ${skillClass(skill)}">${esc(skillLabel(skill))}</span>`; }
function activeTasks() { return state.tasks.filter(task => !task.deleted); }
function todayCompleted(taskId) { return state.checkins.some(entry => entry.taskId === taskId && entry.date === date()); }
function weeklyCount(taskId) {
  const start = weekStart();
  return state.checkins.filter(entry => entry.taskId === taskId && entry.date >= start).length;
}
function weeklyGoal(task) {
  const text = `${task.category || ""} ${task.target || ""}`;
  const match = text.match(/周\s*(\d+)\s*次|週\s*(\d+)\s*次|(\d+)\s*次/);
  if (match) return Number(match[1] || match[2] || match[3]);
  if (text.includes("每天")) return 7;
  if (text.includes("周") || text.includes("週")) return 1;
  return 1;
}
function playCompleteSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    gain.connect(ctx.destination);
    [523.25, 659.25].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.07);
      osc.connect(gain);
      osc.start(ctx.currentTime + index * 0.07);
      osc.stop(ctx.currentTime + 0.24);
    });
    setTimeout(() => ctx.close(), 360);
  } catch {}
}
function checkin(taskId) {
  const t = state.tasks.find(x => x.id === taskId); if (!t) return;
  if (todayCompleted(taskId)) {
    toast(`${t.name} 今天已經完成了，明天會自動恢復`);
    return;
  }
  state.checkins.unshift({ id: id("CHK"), date: date(), taskId, taskName: t.name, skill: t.skill, exp: t.exp, worldExp: t.worldExp });
  save(); playCompleteSound(); toast(`${t.name} 完成，EXP 已累積`); render();
}
function setProgress(did, value) {
  const d = state.dungeons.find(x => x.id === did); if (!d) return;
  const before = d.current; d.current = Math.min(Math.max(+value || 0, 0), d.total);
  const delta = Math.max(0, d.current - before);
  if (delta) {
    const done = !d.rewardClaimed && d.current >= d.total;
    if (done) d.rewardClaimed = true;
    state.dungeonLogs.unshift({ id: id("DLOG"), date: date(), dungeonId: did, dungeonName: d.name, skill: d.skill, units: delta, exp: d.skill === "世界探索" ? 0 : delta, worldExp: done ? d.worldReward : 0, note: done ? "副本完成獎勵" : "副本進度更新" });
  }
  save(); toast(`${d.name} 進度更新為 ${pct(d.current, d.total)}%`); render("dungeon");
}
function deleteDungeon(did) {
  const d = state.dungeons.find(item => item.id === did);
  if (!d) return;
  if (!confirm(`確定刪除副本「${d.name}」嗎？已累積的副本紀錄會保留在報告中。`)) return;
  state.dungeons = state.dungeons.filter(item => item.id !== did);
  selectedDungeon = state.dungeons[0]?.id;
  save(); toast("副本已刪除，過去紀錄已保留"); render("dungeon");
}
function taskForm(form) {
  const f = new FormData(form);
  const task = { id: `TASK-${String(state.tasks.length + 1).padStart(3, "0")}`, name: f.get("name").trim(), category: f.get("category") || "自訂", target: f.get("target") || "", skill: f.get("skill"), exp: +f.get("exp") || 0, worldExp: +f.get("worldExp") || 0, deleted: false };
  state.tasks.push(task);
  if (f.get("showOnBoard") === "on") state.weeklyBoard.push(task.id);
  save(); form.reset(); toast("任務已新增"); render("checkin");
}
function editTask(taskId) {
  const task = state.tasks.find(item => item.id === taskId && !item.deleted);
  if (!task) return;
  const name = prompt("任務名稱", task.name);
  if (name === null) return;
  const category = prompt("分類 / 頻率", task.category);
  if (category === null) return;
  const target = prompt("目標量", task.target || "");
  if (target === null) return;
  const skill = prompt(`能力（可填：世界探索、${skills.join("、")}）`, task.skill);
  if (skill === null) return;
  const exp = prompt("技能 EXP", task.exp);
  if (exp === null) return;
  const worldExp = prompt("世界 EXP", task.worldExp);
  if (worldExp === null) return;
  Object.assign(task, {
    name: name.trim() || task.name,
    category: category.trim() || "自訂",
    target: target.trim(),
    skill: skill.trim() || task.skill,
    exp: Number(exp) || 0,
    worldExp: Number(worldExp) || 0,
  });
  save(); toast("任務已更新，過去打卡紀錄不受影響"); render("checkin");
}
function deleteTask(taskId) {
  const task = state.tasks.find(item => item.id === taskId && !item.deleted);
  if (!task) return;
  if (!confirm(`確定刪除「${task.name}」嗎？過去累積的經驗值會保留。`)) return;
  task.deleted = true;
  state.weeklyBoard = state.weeklyBoard.filter(id => id !== taskId);
  save(); toast("任務已刪除，過去 EXP 已保留"); render();
}
function addWeeklyTask(taskId) {
  if (!taskId || state.weeklyBoard.includes(taskId)) return;
  state.weeklyBoard.push(taskId);
  save(); toast("已加入本周任務板"); render("today");
}
function removeWeeklyTask(taskId) {
  state.weeklyBoard = state.weeklyBoard.filter(id => id !== taskId);
  save(); toast("已從本周任務板移除"); render("today");
}
function dungeonForm(form) {
  const f = new FormData(form);
  const d = { id: `DUN-${String(state.dungeons.length + 1).padStart(3, "0")}`, name: f.get("name").trim(), skill: f.get("skill"), total: Math.max(+f.get("total") || 1, 1), current: 0, worldReward: +f.get("worldReward") || 0, notes: f.get("notes") || "", rewardClaimed: false };
  state.dungeons.push(d); selectedDungeon = d.id; save(); form.reset(); toast("副本已新增"); render("dungeon");
}
function worldForm(form) {
  const f = new FormData(form);
  state.worldLogs.unshift({ id: id("WLOG"), date: date(), title: f.get("title").trim(), exp: +f.get("exp") || 1, note: f.get("note") || "" });
  save(); form.reset(); toast("世界探索已新增"); render("world");
}
function profileForm(form) {
  const f = new FormData(form);
  const goals = [1, 2, 3, 4, 5].map(index => String(f.get(`goal${index}`) || "").trim());
  state.profile = {
    name: f.get("name").trim() || "未命名旅人",
    sign: f.get("sign").trim(),
    age: f.get("age").trim(),
    tags: [f.get("tag1"), f.get("tag2"), f.get("tag3")].map(v => String(v || "").trim()).filter(Boolean),
    freeLine: f.get("freeLine").trim(),
    goal: goals.filter(Boolean)[0] || "",
    goals,
  };
  save(); toast("角色頁面已更新"); render("profile");
}
function skillLabelsForm(form) {
  const f = new FormData(form);
  skillIds.forEach(id => {
    const next = String(f.get(id) || "").trim();
    state.skillLabels[id] = next || defaultSkillLabels[id];
  });
  save(); toast("技能名稱已更新，世界探索維持固定名稱"); render("profile");
}
function exportData() {
  const payload = {
    app: "人生養成遊戲 PWA",
    exportedAt: new Date().toISOString(),
    version: 1,
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `life-rpg-save-${date()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("存檔已匯出");
}
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const nextState = parsed.state || parsed;
      if (!Array.isArray(nextState.tasks) || !Array.isArray(nextState.dungeons)) {
        throw new Error("invalid save");
      }
      state = { ...base(), ...nextState };
      selectedDungeon = state.dungeons[0]?.id;
      save();
      render();
      toast("存檔已匯入");
    } catch {
      toast("匯入失敗：檔案格式不正確");
    }
  };
  reader.readAsText(file);
}
function view() { return ["today", "profile", "checkin", "dungeon", "world", "bag", "report"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "today"; }
function render(v = view()) {
  if (!state.introDone) {
    renderIntro();
    return;
  }
  document.body.classList.remove("intro-active");
  document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${v}`));
  document.querySelectorAll(".bottom-tabs a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${v}`));
  app.innerHTML = pages[v]();
  bind();
}
function todayPage() {
  const w = world(), ss = skillStats(), top = [...ss].sort((a,b)=>b.exp-a.exp)[0], todayRows = state.checkins.filter(e => e.date === date());
  const boardTasks = state.weeklyBoard.map(taskId => state.tasks.find(task => task.id === taskId && !task.deleted)).filter(Boolean);
  const addableTasks = activeTasks().filter(task => !state.weeklyBoard.includes(task.id));
  return `<section class="view">
    <div class="hero"><div class="panel hero-main"><p class="eyebrow">人生養成遊戲 / PWA 封測</p><h1>主頁</h1><p class="note">設定好任務，成為養成系主人宮，慢慢變得更喜歡自己吧!</p><p class="note mobile-app-note">部署到 HTTPS 後，可用手機瀏覽器加入主畫面，像 App 一樣開啟。</p><div class="chips"><span class="chip strong">${w.level.title}</span><span class="chip">世界 EXP ${w.exp}</span><span class="chip">今日完成 ${todayRows.length}</span></div></div>
    <div class="panel"><div class="title-line"><div><h2>世界等級</h2><p class="note">${w.next ? `距離 ${w.next.title} 還差 ${w.next.threshold - w.exp}` : "世界獎勵已全數解鎖"}</p></div><span class="badge">${w.level.badge}</span></div>${bar(w.next ? pct(w.exp - w.level.threshold, w.next.threshold - w.level.threshold) : 100)}<div class="stats" style="margin-top:14px">${stat("目前稱號", w.level.title)}${stat("最高技能", top.skill, `${top.level.label} / ${top.exp} EXP`)}</div></div></div>
    <section class="panel"><div class="title-line"><div><h2>本周任務板</h2><p class="note">按完成後自動加 EXP。每日任務隔天會自動恢復顏色，並顯示本周已達成次數。</p></div><a class="ghost" href="#checkin">管理任務</a></div>
      <form id="weeklyBoardForm" class="inline-form">
        <label>加入任務
          <select name="taskId">
            <option value="">選擇要顯示在本周任務板的任務</option>
            ${addableTasks.map(task => `<option value="${task.id}">${esc(task.name)} / ${esc(task.category)}</option>`).join("")}
          </select>
        </label>
        <button class="ghost" type="submit">加入本周</button>
      </form>
      <div class="list">${boardTasks.length ? boardTasks.map(task => taskRow(task, { board: true })).join("") : `<div class="empty">本周任務板還沒有任務。從上方選單加入一個任務開始。</div>`}</div>
    </section>
    <section class="grid2"><div class="panel"><h2>技能樹</h2><div class="list">${ss.map(skillRow).join("")}</div></div><div class="panel"><h2>今日紀錄</h2><div class="timeline">${todayRows.length ? todayRows.map(e => `<div class="event"><b>${esc(e.taskName)}</b><div class="muted">${esc(e.skill)} +${e.exp} / 世界 +${e.worldExp}</div></div>`).join("") : `<div class="empty">今天還沒有打卡。</div>`}</div></div></section>
  </section>`;
}
function taskRow(t, options = {}) {
  const doneToday = todayCompleted(t.id);
  const count = weeklyCount(t.id);
  const goal = weeklyGoal(t);
  return `<div class="row task ${doneToday ? "completed" : ""}">
    <div><b>${esc(t.name)}</b><div class="muted">${esc(t.category)} ${t.target ? ` / ${esc(t.target)}` : ""}<br>本周已達成 ${count}/${goal} 次</div></div>
    ${skillTag(t.skill)}
    <b>技能 +${t.exp}<br>世界 +${t.worldExp}</b>
    <div class="row-actions">
      <button class="${doneToday ? "ghost" : "btn"}" data-checkin="${t.id}" ${doneToday ? "disabled" : ""}>${doneToday ? "今日完成" : "完成"}</button>
          ${options.board ? `<button class="ghost" data-remove-weekly="${t.id}" type="button">移出</button>` : `<button class="icon-btn" data-edit-task="${t.id}" type="button" title="編輯" aria-label="編輯 ${esc(t.name)}">✎</button><button class="icon-btn danger-icon" data-delete-task="${t.id}" type="button" title="刪除" aria-label="刪除 ${esc(t.name)}">×</button>`}
    </div>
  </div>`;
}
function skillRow(s) { const p = s.next ? pct(s.exp - s.level.threshold, s.next.threshold - s.level.threshold) : 100; return `<div class="row skill"><b>${esc(s.skill)}</b>${bar(p)}<span class="chip ${skillClass(s.skill)}">${s.level.label} / ${s.exp}</span></div>`; }
function profilePage() {
  const w = world(), ss = skillStats(), top = [...ss].sort((a,b)=>b.exp-a.exp)[0], p = state.profile;
  const titles = w.unlocked.map(rule => rule.title);
  const items = w.unlocked.flatMap(rule => rule.items || []);
  const buffs = w.unlocked.flatMap(rule => rule.buffs || []);
  const goalRows = (p.goals || []).filter(Boolean);
  const buffRows = w.unlocked.flatMap(r => (r.buffs || []).map(buff => ({ ...r, text: buff })));
  const itemRows = w.unlocked.flatMap(r => (r.items || []).map(item => ({ ...r, text: item })));
  return `<section class="view">
    <section class="panel profile-hero">
      <div>
        <p class="eyebrow">角色頁面</p>
        <h1>${esc(p.name)}${p.sign || p.age ? `｜${esc([p.sign, p.age].filter(Boolean).join("｜"))}` : ""}</h1>
        <div class="chips">${p.tags.map(tag => `<span class="chip">${esc(tag)}</span>`).join("") || `<span class="chip">尚未設定 tag</span>`}</div>
        <p class="profile-line">${esc(p.freeLine || "尚未填寫角色介紹。")}</p>
      </div>
      <div class="profile-card">
        <span class="badge">${esc(w.level.badge)}</span>
        <h2>${esc(w.level.title)}</h2>
        <p class="note">世界探索 Lv.${w.level.level} / ${w.exp} EXP</p>
        ${bar(w.next ? pct(w.exp - w.level.threshold, w.next.threshold - w.level.threshold) : 100)}
      </div>
    </section>
    <section class="grid2">
      <section class="panel">
        <details class="editor-details">
          <summary class="ghost">編輯角色資料</summary>
          <form id="profileForm" class="form-grid3">
          <label>名字<input name="name" value="${esc(p.name)}" placeholder="名字"></label>
          <label>星座<input name="sign" value="${esc(p.sign)}" placeholder="星座"></label>
          <label>年齡<input name="age" value="${esc(p.age)}" placeholder="年齡"></label>
          <label>tag 1<input name="tag1" value="${esc(p.tags[0] || "")}" placeholder="例：慢熱型"></label>
          <label>tag 2<input name="tag2" value="${esc(p.tags[1] || "")}" placeholder="例：只知舊番的老宅宅"></label>
          <label>tag 3<input name="tag3" value="${esc(p.tags[2] || "")}" placeholder="例：人生是場旅程"></label>
          <label class="wide-field">自由描述<textarea name="freeLine">${esc(p.freeLine)}</textarea></label>
          ${[1, 2, 3, 4, 5].map(index => `<label>理想的小目標 ${index}<input name="goal${index}" value="${esc((p.goals || [])[index - 1] || "")}" placeholder="${index === 1 ? "例：每天先完成一個最小任務" : ""}"></label>`).join("")}
          <button class="btn">儲存角色頁</button>
          </form>
        </details>
      </section>
      <section class="panel">
        <h2>理想的小目標</h2>
        ${goalRows.length ? `<ol class="goal-list">${goalRows.map(goal => `<li>${esc(goal)}</li>`).join("")}</ol>` : `<div class="empty">尚未填寫。</div>`}
        <div class="stats" style="margin-top:14px">
          ${stat("最高技能", top.skill, `${top.level.label} / ${top.exp} EXP`)}
          ${stat("已解鎖稱號", titles.length)}
          ${stat("背包道具", items.length)}
          ${stat("Buff", buffs.length)}
        </div>
      </section>
    </section>
    <section class="panel">
      <details class="editor-details">
        <summary class="ghost">技能名稱設定</summary>
        <p class="note">可自由修改技能顯示名稱。世界探索是獨立系統，名稱固定不可修改。</p>
        <form id="skillLabelsForm" class="form-grid">
        ${skillIds.map(id => `<label>${esc(defaultSkillLabels[id])}<input name="${id}" value="${esc(state.skillLabels[id] || defaultSkillLabels[id])}"></label>`).join("")}
        <label>世界探索<input value="世界探索" disabled></label>
        <button class="btn">儲存技能名稱</button>
        </form>
      </details>
    </section>
    <section class="grid2">
      <section class="panel">
        <h2>已解鎖稱號</h2>
        <div class="list">${w.unlocked.map(rule => `<div class="row reward"><span class="badge">${esc(rule.badge)}</span><div><b>Lv.${rule.level}｜${esc(rule.title)}</b><div class="muted">${esc(rule.intro || "稱號已解鎖。")}</div></div><span class="chip">${rule.threshold} EXP</span></div>`).join("")}</div>
      </section>
      <section class="panel">
        <h2>技能標籤色</h2>
        <p class="note">可行。現在不同技能已套用不同顏色標籤，任務、角色頁、報告都可以沿用這套視覺。</p>
        <div class="chips">${["世界探索", ...skills].map(skill => skillTag(skill)).join("")}</div>
      </section>
    </section>
    <section class="bag">
      <section class="panel"><h2>Buff</h2><div class="list">${buffRows.map(r=>`<div class="row reward"><span class="badge">${r.badge}</span><div><b>${r.title}</b><div class="muted">${esc(r.text)}</div></div><span class="chip">Lv.${r.level}</span></div>`).join("") || `<div class="empty">尚未解鎖 Buff。</div>`}</div></section>
      <section class="panel"><h2>道具</h2><div class="list">${itemRows.map(r=>`<div class="row reward"><span class="badge">${r.badge}</span><div><b>${esc(r.text)}</b><div class="muted">${r.title} 解鎖獎勵</div></div><span class="chip">${r.threshold} EXP</span></div>`).join("") || `<div class="empty">尚未獲得道具。</div>`}</div></section>
    </section>
  </section>`;
}
function checkinPage() { return `<section class="view"><section class="form"><h1>任務與打卡</h1><p class="note">可自行新增、編輯、刪除任務。刪除任務不會影響過去已累積的 EXP。</p><form id="taskForm" class="form-grid"><label>任務名稱<input name="name" required placeholder="例：閱讀英文短文"></label><label>分類 / 頻率<input name="category" placeholder="例：每天 / 周3次 / 英語周"></label><label>目標量<input name="target" placeholder="例：1篇"></label><label>能力<select name="skill"><option value="世界探索">世界探索</option>${skillOptions()}</select></label><label>技能 EXP<input name="exp" type="number" min="0" value="1"></label><label>世界 EXP<input name="worldExp" type="number" min="0" value="0"></label><label class="checkbox-label"><input name="showOnBoard" type="checkbox" checked> 加入本周任務板</label><button class="btn">新增任務</button></form></section><section class="panel"><h2>任務資料庫</h2><div class="list">${activeTasks().map(task => taskRow(task)).join("")}</div></section><section class="panel"><h2>最近打卡</h2><div class="timeline">${state.checkins.slice(0,12).map(e=>`<div class="event"><b>${e.date}｜${esc(e.taskName)}</b><div class="muted">${esc(skillLabel(e.skill))} +${e.exp} / 世界 +${e.worldExp}</div></div>`).join("") || `<div class="empty">還沒有打卡紀錄。</div>`}</div></section></section>`; }
function dungeonPage() { const sel = state.dungeons.find(d=>d.id===selectedDungeon) || state.dungeons[0]; return `<section class="view"><section class="panel">${sel ? `<div class="title-line"><div><h1>任務詳情</h1><p class="note">點選副本列表中的名稱會切換到這裡。</p></div><span class="chip strong">${pct(sel.current, sel.total)}%</span></div><div class="card"><h3>${esc(sel.name)}</h3><p class="note">${esc(sel.notes || "尚未填寫備註")}</p>${bar(pct(sel.current, sel.total))}<div class="stats" style="margin-top:14px">${stat("目前進度", `${sel.current}/${sel.total}`)}${stat("對應能力", skillLabel(sel.skill))}${stat("完成獎勵", `世界 +${sel.worldReward}`)}${stat("技能獲得", `${sel.skill === "世界探索" ? 0 : sel.current} EXP`)}</div></div>` : `<div class="empty">尚未建立副本。請到下方新增第一個主線副本。</div>`}</section><section class="panel"><h2>副本列表</h2><div class="list">${state.dungeons.length ? state.dungeons.map(d=>`<div class="row dungeon"><div><button class="linkbtn" data-select="${d.id}">${esc(d.name)}</button><div class="muted">${esc(skillLabel(d.skill))} / ${d.current} of ${d.total}</div></div><div>${bar(pct(d.current,d.total))}<div class="muted">${pct(d.current,d.total)}%</div></div><input type="number" min="0" max="${d.total}" value="${d.current}" data-progress="${d.id}"><div class="row-actions"><button class="btn" data-save-progress="${d.id}">更新</button><button class="icon-btn danger-icon" data-delete-dungeon="${d.id}" type="button" title="刪除" aria-label="刪除 ${esc(d.name)}">×</button></div></div>`).join("") : `<div class="empty">副本列表目前是空的。</div>`}</div></section><section class="form"><h2>新增任務主線副本</h2><p class="note">一本書、一套課程或一個企劃都可以是一個副本。可自行設定總等分與目前進度。</p><form id="dungeonForm" class="form-grid"><label>副本名稱<input name="name" required placeholder="例：英文閱讀訓練2"></label><label>對應能力<select name="skill"><option value="世界探索">世界探索</option>${skillOptions()}</select></label><label>總等分<input name="total" type="number" min="1" value="24"></label><label>完成獎勵世界 EXP<input name="worldReward" type="number" min="0" value="1"></label><label>備註<input name="notes" placeholder="例：一本書分成24章"></label><button class="btn">新增副本</button></form></section></section>`; }
function worldPage() { const w = world(); return `<section class="view"><div class="hero"><section class="panel hero-main"><p class="eyebrow">世界探索 / 獨立等級</p><h1>${esc(w.level.title)}</h1><p class="note">${esc(w.level.intro || "世界探索不混入一般技能。每次達到新門檻，就會授予徽章、稱號，並把道具與 Buff 放入背包。")}</p><div class="chips"><span class="chip strong">Lv.${w.level.level}</span><span class="chip">世界 EXP ${w.exp}</span></div></section><section class="panel"><div class="title-line"><div><h2>下一次升等</h2><p class="note">${w.next ? `還差 ${w.next.threshold - w.exp} EXP` : "目前世界獎勵全解鎖。"}</p></div><span class="badge">${w.level.badge}</span></div>${bar(w.next ? pct(w.exp - w.level.threshold, w.next.threshold - w.level.threshold) : 100)}</section></div><section class="form"><h2>新增世界探索紀錄</h2><form id="worldForm" class="form-grid3"><label>探索名稱<input name="title" required placeholder="例：去一間沒去過的店"></label><label>世界 EXP<input name="exp" type="number" min="1" value="1"></label><label>心得<input name="note" placeholder="例：比想像中不可怕"></label><button class="btn">加入探索紀錄</button></form></section><section class="grid2"><div class="panel"><h2>已解鎖世界等級</h2><div class="list">${w.unlocked.map(r=>`<div class="row reward"><span class="badge">${r.badge}</span><div><b>Lv.${r.level}｜${r.title}</b><div class="muted">${r.threshold} EXP / ${esc(r.intro || "稱號已解鎖")}</div></div><span class="chip">已解鎖</span></div>`).join("")}</div></div><div class="panel"><h2>探索紀錄</h2><div class="timeline">${state.worldLogs.slice(0,10).map(e=>`<div class="event"><b>${e.date}｜${esc(e.title)}</b><div class="muted">世界探索 +${e.exp} ${e.note ? ` / ${esc(e.note)}` : ""}</div></div>`).join("") || `<div class="empty">尚未新增世界探索紀錄。</div>`}</div></div></section></section>`; }
function bagPage() { location.hash = "#profile"; return ""; }
function reportPage() { const ss = skillStats(), w = world(), done = state.dungeons.filter(d=>d.current>=d.total).length; const events = [...state.checkins.map(e=>[e.date,e.taskName,`${e.skill} +${e.exp}`]), ...state.dungeonLogs.map(e=>[e.date,e.dungeonName,e.note]), ...state.worldLogs.map(e=>[e.date,e.title,`世界探索 +${e.exp}`])].slice(0,14); return `<section class="view"><section class="panel"><div class="title-line"><div><h1>封測報告</h1><p class="note">彙整目前累積狀態，適合截圖當 SNS 打卡週報。也可以匯出存檔，避免更換瀏覽器時資料遺失。</p></div><div class="chips"><button class="ghost" data-export>匯出存檔</button><button class="ghost" data-import>匯入存檔</button></div></div><div class="stats">${stat("總打卡", state.checkins.length)}${stat("副本數", state.dungeons.length)}${stat("完成副本", done)}${stat("世界稱號", w.level.title, `${w.exp} EXP`)}</div></section><section class="grid2"><div class="panel"><h2>能力排行榜</h2><div class="list">${ss.sort((a,b)=>b.exp-a.exp).map(skillRow).join("")}</div></div><div class="panel"><h2>最近事件</h2><div class="timeline">${events.map(e=>`<div class="event"><b>${e[0]}｜${esc(e[1])}</b><div class="muted">${esc(e[2])}</div></div>`).join("") || `<div class="empty">目前還沒有事件紀錄。</div>`}</div></div></section></section>`; }
const pages = { today: todayPage, profile: profilePage, checkin: checkinPage, dungeon: dungeonPage, world: worldPage, bag: bagPage, report: reportPage };
function bind() {
  document.querySelectorAll("[data-checkin]").forEach(b => b.onclick = () => checkin(b.dataset.checkin));
  document.querySelector("#taskForm")?.addEventListener("submit", e => { e.preventDefault(); taskForm(e.currentTarget); });
  document.querySelector("#weeklyBoardForm")?.addEventListener("submit", e => { e.preventDefault(); addWeeklyTask(new FormData(e.currentTarget).get("taskId")); });
  document.querySelector("#dungeonForm")?.addEventListener("submit", e => { e.preventDefault(); dungeonForm(e.currentTarget); });
  document.querySelector("#worldForm")?.addEventListener("submit", e => { e.preventDefault(); worldForm(e.currentTarget); });
  document.querySelector("#profileForm")?.addEventListener("submit", e => { e.preventDefault(); profileForm(e.currentTarget); });
  document.querySelector("#skillLabelsForm")?.addEventListener("submit", e => { e.preventDefault(); skillLabelsForm(e.currentTarget); });
  document.querySelectorAll("[data-edit-task]").forEach(b => b.onclick = () => editTask(b.dataset.editTask));
  document.querySelectorAll("[data-delete-task]").forEach(b => b.onclick = () => deleteTask(b.dataset.deleteTask));
  document.querySelectorAll("[data-delete-dungeon]").forEach(b => b.onclick = () => deleteDungeon(b.dataset.deleteDungeon));
  document.querySelectorAll("[data-remove-weekly]").forEach(b => b.onclick = () => removeWeeklyTask(b.dataset.removeWeekly));
  document.querySelectorAll("[data-select]").forEach(b => b.onclick = () => { selectedDungeon = b.dataset.select; render("dungeon"); });
  document.querySelectorAll("[data-save-progress]").forEach(b => b.onclick = () => setProgress(b.dataset.saveProgress, document.querySelector(`[data-progress="${b.dataset.saveProgress}"]`).value));
  document.querySelector("[data-export]")?.addEventListener("click", exportData);
  document.querySelector("[data-import]")?.addEventListener("click", () => importFile.click());
}
resetBtn.onclick = () => { if (confirm("確定要重置本機封測資料嗎？")) { state = base(); selectedDungeon = state.dungeons[0]?.id; save(); render(); toast("已重置封測資料"); } };
importFile.addEventListener("change", () => {
  importData(importFile.files?.[0]);
  importFile.value = "";
});
window.addEventListener("hashchange", () => render());
if (!location.hash) location.hash = "#today";
render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
