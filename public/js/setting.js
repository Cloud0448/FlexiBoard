const itemList = document.getElementById('item-list');
const addItemButton = document.getElementById('add-item');
const propNameInput = document.getElementById('prop-name');
const propTypeSelect = document.getElementById('prop-type');
const noDataMessage = document.getElementById('no-data-message');

let items = [];

// 항목 추가 버튼 클릭 시 이벤트 처리
addItemButton.addEventListener('click', function () {
  const propName = propNameInput.value;
  const propType = propTypeSelect.value;

  if (propName && propType) {
    const newItem = {
      name: propName,
      type: propType
    };
    
    // 항목 배열에 추가
    items.push(newItem);

    // 리스트를 다시 그려줌
    renderItemList();
    
    // 입력 필드 초기화
    propNameInput.value = '';
    propTypeSelect.value = '';
  }
  else {
    alert("항목명을 입력하고 유형을 선택해주세요!")
  }
});

function renderItemList() {
  itemList.innerHTML = ''; // 기존 항목 지우기

  if (items.length === 0) {
    noDataMessage.style.display = 'block';
  } else {
    noDataMessage.style.display = 'none';

    items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-to-add');
      
      // 항목명
      const itemName = document.createElement('div');
      itemName.textContent = item.name;
      itemName.classList.add('prop-name');
      itemDiv.appendChild(itemName);

      // 항목의 입력 위젯 추가
      const inputWidget = document.createElement('div');
      inputWidget.classList.add('input-widget');

      // prop-type에 맞는 입력 위젯을 외부 HTML 파일에서 불러오기
      loadInputWidget(item.type, inputWidget);
      itemDiv.appendChild(inputWidget);

      // 삭제 버튼
      const removeButton = document.createElement('button');
      removeButton.textContent = '삭제';
      removeButton.classList.add('remove-item');
      removeButton.addEventListener('click', () => {
        items.splice(index, 1); // 항목 삭제
        renderItemList(); // 항목 리스트 다시 그리기
      });
      itemDiv.appendChild(removeButton);

      // item-list에 추가
      itemList.appendChild(itemDiv);
    });
  }
}

function loadInputWidget(type, container) {
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
    })
    .catch(error => {
      console.error('입력 위젯 로드 실패:', error);
      container.innerHTML = '위젯 로드 실패';
    });
}