// 날짜 유효성 검사 초기화 함수
export function initializeDateValidation(container) {
  const yearSelect = container.querySelector('#date-year');
  const monthSelect = container.querySelector('#date-month');
  const dayInput = container.querySelector('#date-day');
  const dateInput = container.querySelector('#date-calendar');

  // 연도 추가 (현재 연도 -2부터 +1까지)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  // 연도 옵션 추가
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }

  // 월 옵션 추가
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    monthSelect.appendChild(option);
  }

  // 일자 입력 필드 유효성 검사
  const getDaysInMonth = (year, month) => {
    if (!month) return 31;
    if (!year) year = 2024;
    return new Date(year, month, 0).getDate();
  };

  dayInput.addEventListener('blur', () => {
    const year = yearSelect.value || null;
    const month = monthSelect.value || null;
    const maxDays = getDaysInMonth(year, month);
    let day = parseInt(dayInput.value, 10);

    if (isNaN(day) || day < 1) {
      day = 1;
    } else if (day > maxDays) {
      day = maxDays;
    }

    dayInput.value = day;
    syncDate();
  });

  // 날짜 동기화 함수
  function syncDate() {
    const year = yearSelect.value;
    const month = monthSelect.value.padStart(2, '0');
    const day = dayInput.value.padStart(2, '0');
    if (year && month && day && !isNaN(day)) {
      dateInput.value = `${year}-${month}-${day}`;
    }
  }

  // 이벤트 리스너 추가
  yearSelect.addEventListener('change', syncDate);
  monthSelect.addEventListener('change', syncDate);
  dayInput.addEventListener('input', syncDate);

  dateInput.addEventListener('change', () => {
    const [year, month, day] = (dateInput.value || '').split('-');
    yearSelect.value = year || '';
    monthSelect.value = month ? parseInt(month, 10) : '';
    dayInput.value = day || '';
  });

  // 기본값 설정
  yearSelect.value = currentYear;
  monthSelect.value = currentMonth;
  dayInput.value = currentDay;
  syncDate();
}

// 숫자 유효성 검사 초기화 함수
export function initializeNumberValidation(container) {
  const numberInput = container.querySelector('#number-type');
  if (numberInput) {
    let isNegative = false;

    // 숫자만 입력 가능하도록 제한하고 음수 처리
    numberInput.addEventListener('input', (event) => {
      let value = event.target.value;
      
      // - 입력 시 토글 처리
      if (value.includes('-')) {
        isNegative = !isNegative;
        value = value.replace(/-/g, '');
      }
      
      // 숫자가 아닌 문자 제거
      value = value.replace(/[^0-9]/g, '');
      
      // 숫자가 있는 경우에만 천단위 구분기호 추가
      if (value) {
        value = parseInt(value).toLocaleString();
        if (isNegative) {
          value = '-' + value;
        }
      }
      
      event.target.value = value;
    });

    // 포커스를 잃을 때 숫자만 남기고 천단위 구분기호 제거
    numberInput.addEventListener('blur', (event) => {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, '');
      
      if (value) {
        value = parseInt(value).toLocaleString();
        if (isNegative) {
          value = '-' + value;
        }
      }
      event.target.value = value;
    });

    // 포커스를 받을 때도 천단위 구분기호 유지
    numberInput.addEventListener('focus', (event) => {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, '');
      
      if (value) {
        value = parseInt(value).toLocaleString();
        if (isNegative) {
          value = '-' + value;
        }
      }
      event.target.value = value;
    });
  }
}

// 입력 위젯 로드 및 유효성 검사 초기화 함수
export function loadInputWidget(type, container) {
  let filePath = '';
  switch (type) {
    case 'date-type':
      filePath = 'components/date-type.html';
      break;
    case 'text-type':
      filePath = 'components/text-type.html';
      break;
    case 'textarea-type':
      filePath = 'components/textarea-type.html';
      break;
    case 'number-type':
      filePath = 'components/number-type.html';
      break;
    case 'code-type':
      filePath = 'components/code-type.html';
      break;
    default:
      container.innerHTML = '알 수 없는 타입';
      return;
  }

  fetch(filePath)
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html; // 불러온 HTML을 container에 삽입
      
      // 컴포넌트 로드 후 유효성 검사 로직 초기화
      if (type === 'date-type') {
        initializeDateValidation(container);
      } else if (type === 'number-type') {
        initializeNumberValidation(container);
      }
    })
    .catch(error => {
      console.error('입력 위젯 로드 실패:', error);
      container.innerHTML = '위젯 로드 실패';
    });
} 