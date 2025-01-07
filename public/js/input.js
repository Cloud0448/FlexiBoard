// 연도 추가 (현재 연도 -2부터 +1까지)
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1
const currentDay = new Date().getDate(); // 오늘 날짜

const yearSelect = document.getElementById('date-year');
for (let i = currentYear - 2; i <= currentYear + 1; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  yearSelect.appendChild(option);
}

// 월 추가 (1~12)
const monthSelect = document.getElementById('date-month');
for (let i = 1; i <= 12; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  monthSelect.appendChild(option);
}

// 일자 입력 필드 유효성 검사 및 최대값 조정
const dayInput = document.getElementById('date-day');
const dateInput = document.querySelector('input[type="date"]');

const getDaysInMonth = (year, month) => {
  if (!month) return 31; // 월이 선택되지 않은 경우 기본 31일
  if (!year) year = 2024; // 기본 연도 (윤년 고려)
  return new Date(year, month, 0).getDate();
};

dayInput.addEventListener('blur', () => {
  const year = yearSelect.value || null;
  const month = monthSelect.value || null;
  const maxDays = getDaysInMonth(year, month);
  let day = parseInt(dayInput.value, 10);

  if (isNaN(day) || day < 1) {
    day = 1; // 최소값으로 설정
  } else if (day > maxDays) {
    day = maxDays; // 최대값으로 조정
  }

  dayInput.value = day;
  syncDate();
});

// 연월일 선택 시 캘린더 동기화
yearSelect.addEventListener('change', syncDate);
monthSelect.addEventListener('change', syncDate);
dayInput.addEventListener('input', syncDate);

function syncDate() {
  const year = yearSelect.value;
  const month = monthSelect.value.padStart(2, '0');
  const day = dayInput.value.padStart(2, '0');
  if (year && month && day && !isNaN(day)) {
    dateInput.value = `${year}-${month}-${day}`;
  }
}

// 캘린더 선택 시 셀렉트박스와 일자 입력 필드 동기화
dateInput.addEventListener('change', () => {
  const [year, month, day] = (dateInput.value || '').split('-');
  yearSelect.value = year || '';
  monthSelect.value = month ? parseInt(month, 10) : ''; // 문자열을 숫자로 변환
  dayInput.value = day || '';
});

// 기본값으로 오늘 날짜 설정
yearSelect.value = currentYear;
monthSelect.value = currentMonth;
dayInput.value = currentDay;

// 날짜 동기화
syncDate();


// 처리할 요소들의 id를 배열로 관리
const elementsToHandle = ['number-type', 'date-day'];

// 공통 이벤트 리스너
function restrictToNumbers(event) {
  // 숫자가 아닌 문자를 제거
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

// 배열에 있는 모든 요소에 대해 이벤트 리스너 추가
elementsToHandle.forEach(i => {
  const element = document.getElementById(i);
  if (element) {
    element.addEventListener('input', restrictToNumbers);
  }
});