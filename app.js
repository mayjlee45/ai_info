"use strict";

/* ---------------------------------------------------------------------------
 * 시간표 데이터
 * 원본: 육군정보통신학교 AI 실무과정(초/중급) 시간표 안내
 * 셀 값 규칙: "수업" | "X"(수업없음) | 그 외(입교식/수료식/점심식사 등 이벤트)
 * -------------------------------------------------------------------------*/

var PERIODS = [
  "1교시 (08:50~09:30)",
  "2교시 (09:40~10:20)",
  "3교시 (10:30~11:10)",
  "4교시 (11:20~12:00)",
  "점심시간 (12:00~13:10)",
  "5교시 (13:10~13:50)",
  "6교시 (14:00~14:40)",
  "7교시 (14:50~15:30)",
  "8교시 (15:40~16:20)",
  "9교시 (16:30~17:10)"
];

var DAYS = ["월", "화", "수", "목", "금"];

// 초급(1주차) 표 — 각 행은 [월,화,수,목,금]
var BASIC_WEEK = [
  ["X", "수업", "수업", "수업", "수업"],            // 1교시
  ["X", "수업", "수업", "수업", "수업"],            // 2교시
  ["X", "수업", "수업", "수업", "수료식(11시)"],    // 3교시
  ["입교식(11시)", "수업", "수업", "수업", "X"],    // 4교시
  ["LUNCH"],                                         // 점심시간
  ["수업", "수업", "수업", "수업", "X"],            // 5교시
  ["수업", "수업", "수업", "수업", "X"],            // 6교시
  ["수업", "수업", "수업", "수업", "X"],            // 7교시
  ["수업", "수업", "수업", "수업", "X"],            // 8교시
  ["수업", "수업", "수업", "수업", "X"]             // 9교시
];

// 중급 1주차
var INTER_WEEK1 = [
  ["X", "수업", "수업", "수업", "수업"],
  ["X", "수업", "수업", "수업", "수업"],
  ["X", "수업", "수업", "수업", "수업"],
  ["입교식(11시)", "수업", "수업", "수업", "수업"],
  ["LUNCH"],
  ["수업", "수업", "수업", "수업", "수업"],
  ["수업", "수업", "수업", "수업", "수업"],
  ["수업", "수업", "수업", "수업", "수업"],
  ["수업", "수업", "수업", "수업", "X"],
  ["수업", "수업", "수업", "수업", "X"]
];

// 중급 2주차
var INTER_WEEK2 = [
  ["수업", "수업", "수업", "수업", "수업"],
  ["수업", "수업", "수업", "수업", "수업"],
  ["수업", "수업", "수업", "수업", "수료식(11시)"],
  ["수업", "수업", "수업", "수업", "X"],
  ["LUNCH"],
  ["수업", "수업", "수업", "수업", "X"],
  ["수업", "수업", "수업", "수업", "X"],
  ["수업", "수업", "수업", "수업", "X"],
  ["수업", "수업", "수업", "수업", "X"],
  ["수업", "수업", "수업", "수업", "X"]
];

var COURSES = {
  basic: {
    name: "AI실무 초급과정",
    period: "1주 과정",
    notes: [
      "1일차(월요일): 수업은 11시부터 입니다.",
      "5일차(금요일): 수업은 11시까지 입니다.",
      "병과학교라 매 교시마다 수업 시작/종료 안내벨이 울리지만, 초빙강사님은 타종에 관계없이 수업 가능합니다. 😀"
    ],
    weeks: [{ title: "초급 (1주차)", rows: BASIC_WEEK }]
  },
  intermediate: {
    name: "AI실무 중급과정",
    period: "2주 과정",
    notes: [
      "1일차(1주차 월요일): 수업은 11시부터 입니다.",
      "5일차(1주차 금요일): 수업은 15:30까지 입니다.",
      "6일차(2주차 월요일): 수업은 08:50부터 입니다.",
      "10일차(2주차 금요일): 수업은 11시까지 입니다.",
      "병과학교라 매 교시마다 수업 시작/종료 안내벨이 울리지만, 초빙강사님은 타종에 관계없이 수업 가능합니다. 😀"
    ],
    weeks: [
      { title: "중급 (1주차)", rows: INTER_WEEK1 },
      { title: "중급 (2주차)", rows: INTER_WEEK2 }
    ]
  },
  bigdata: {
    name: "AI/빅데이터분석 과정",
    period: "1주 과정",
    notes: [
      "1일차(월요일): 수업은 11시부터 입니다.",
      "5일차(금요일): 수업은 11시까지 입니다.",
      "병과학교라 매 교시마다 수업 시작/종료 안내벨이 울리지만, 초빙강사님은 타종에 관계없이 수업 가능합니다. 😀"
    ],
    weeks: [{ title: "AI/빅데이터분석 (1주차)", rows: BASIC_WEEK }]
  }
};

/* ---------------------------------------------------------------------------
 * 렌더링
 * -------------------------------------------------------------------------*/

function classifyCell(value) {
  if (value === "수업") return { cls: "cell-class", text: "수업" };
  if (value === "X") return { cls: "cell-off", text: "-" };
  return { cls: "cell-event", text: value };
}

function buildWeekTable(week) {
  var html = "";
  html += '<p class="week-title">' + week.title + "</p>";
  html += '<div class="table-scroll"><table class="schedule">';

  // header
  html += "<thead><tr><th>교시</th>";
  for (var d = 0; d < DAYS.length; d++) {
    html += "<th>" + DAYS[d] + "</th>";
  }
  html += "</tr></thead><tbody>";

  // rows
  for (var i = 0; i < PERIODS.length; i++) {
    var row = week.rows[i];
    html += "<tr><th>" + PERIODS[i] + "</th>";

    if (row && row.length === 1 && row[0] === "LUNCH") {
      html += '<td class="cell-lunch" colspan="' + DAYS.length + '">점심식사</td>';
    } else {
      for (var c = 0; c < DAYS.length; c++) {
        var cell = classifyCell(row ? row[c] : "X");
        html += '<td class="' + cell.cls + '">' + cell.text + "</td>";
      }
    }
    html += "</tr>";
  }

  html += "</tbody></table></div>";
  return html;
}

function renderCourse(key) {
  var course = COURSES[key];
  var out = document.getElementById("schedule-output");
  if (!course) {
    out.innerHTML = '<p class="placeholder">위에서 과정을 선택해 주세요.</p>';
    return;
  }

  var html = "";
  html += '<p class="schedule-head">' + course.name + " · " + course.period + "</p>";

  html += '<div class="schedule-notes"><ul>';
  for (var n = 0; n < course.notes.length; n++) {
    html += "<li>" + course.notes[n] + "</li>";
  }
  html += "</ul></div>";

  for (var w = 0; w < course.weeks.length; w++) {
    html += buildWeekTable(course.weeks[w]);
  }

  // 범례
  html += '<div class="schedule-legend">' +
    '<span><i class="lg-class"></i>수업</span>' +
    '<span><i class="lg-event"></i>행사(입교식·수료식)</span>' +
    '<span><i class="lg-lunch"></i>점심식사</span>' +
    '<span><i class="lg-off"></i>수업 없음</span>' +
    '</div>';

  out.innerHTML = html;
}

/* ---------------------------------------------------------------------------
 * 이벤트 바인딩
 * -------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function () {
  // 과정 선택 → 시간표 렌더링
  var buttons = document.querySelectorAll(".course-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderCourse(btn.getAttribute("data-course"));
    });
  });

  // 이미지 확대 보기(라이트박스) — 여러 개 지원
  var openBoxes = [];

  function bindLightbox(thumbId, boxId, closeId) {
    var thumbBtn = document.getElementById(thumbId);
    var box = document.getElementById(boxId);
    var closeBtn = document.getElementById(closeId);

    function open() {
      if (thumbBtn && thumbBtn.classList.contains("img-missing")) return; // 이미지 없으면 무시
      if (box) {
        box.hidden = false;
        document.body.style.overflow = "hidden";
      }
    }
    function close() {
      if (box) box.hidden = true;
      document.body.style.overflow = "";
    }

    if (thumbBtn) thumbBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (box) {
      box.addEventListener("click", function (e) { if (e.target === box) close(); });
    }
    openBoxes.push(close);
  }

  bindLightbox("signboard-btn", "lightbox", "lightbox-close");
  bindLightbox("qr-btn", "qr-lightbox", "qr-lightbox-close");

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      openBoxes.forEach(function (close) { close(); });
    }
  });

  // 스크롤 시 상단 탭바에 그림자
  var tabbar = document.querySelector(".tabbar");
  if (tabbar) {
    var onScroll = function () {
      if (window.scrollY > 8) tabbar.classList.add("scrolled");
      else tabbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 기본으로 초급 과정 시간표를 미리 표시 (빈 화면 방지)
  var first = document.querySelector('.course-btn[data-course="basic"]');
  if (first) first.click();
});
