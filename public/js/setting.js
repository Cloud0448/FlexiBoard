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
  } else {
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
      itemDiv.setAttribute('draggable', 'false'); // 기본적으로 드래그 불가능

      // 드래그 핸들(화살표 아이콘) 추가
      const dragHandle = document.createElement('span');
      dragHandle.classList.add('drag-handle');
      
      // Font Awesome 아이콘 추가
      dragHandle.innerHTML = '<i class="fas fa-ellipsis-v"></i>'; 
      
      itemDiv.appendChild(dragHandle);

      // 항목명
      const itemName = document.createElement('div');
      itemName.textContent = item.name;
      itemName.classList.add('prop-name');
      itemDiv.appendChild(itemName);

      // 항목의 입력 위젯 추가
      const inputWidget = document.createElement('div');
      inputWidget.classList.add('input-widget');
      loadInputWidget(item.type, inputWidget);
      itemDiv.appendChild(inputWidget);

      // 삭제 버튼
      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-item');

      // Font Awesome X 모양 아이콘 추가
      const icon = document.createElement('i');
      icon.classList.add('fas', 'fa-times');
      removeButton.appendChild(icon);

      // 클릭 이벤트 추가
      removeButton.addEventListener('click', () => {
        items.splice(index, 1); // 항목 삭제
        renderItemList(); // 항목 리스트 다시 그리기
      });

      itemDiv.appendChild(removeButton);

      // 드래그 핸들 클릭 시 드래그 시작
      dragHandle.addEventListener('mousedown', (event) => {
        itemDiv.setAttribute('draggable', 'true'); // 드래그 가능하게 설정
        itemDiv.classList.add('dragging'); // 드래그 중인 항목에 테두리 추가
      });

      itemDiv.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', index); // 드래그 시작 시 항목의 인덱스를 저장
      });

      itemDiv.addEventListener('dragend', (event) => {
        itemDiv.classList.remove('dragging'); // 드래그가 끝나면 테두리 제거
        itemDiv.setAttribute('draggable', 'false'); // 드래그 불가능하게 설정
      });

      itemDiv.addEventListener('dragover', (event) => {
        event.preventDefault(); // 드래그한 항목이 다른 항목 위에 있을 때 기본 동작을 허용
        itemDiv.classList.add('drag-over'); // 다른 항목 위에 있을 때 테두리 추가
      });

      itemDiv.addEventListener('dragleave', (event) => {
        itemDiv.classList.remove('drag-over'); // 드래그가 벗어나면 테두리 제거
      });

      itemDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        const draggedIndex = event.dataTransfer.getData('text/plain'); // 드래그된 항목의 인덱스
        const targetIndex = index; // 드랍된 위치의 인덱스

        if (draggedIndex !== targetIndex) {
          const draggedItem = items[draggedIndex];
          items.splice(draggedIndex, 1); // 원래 위치에서 항목 제거
          items.splice(targetIndex, 0, draggedItem); // 새로운 위치에 항목 삽입
          renderItemList(); // 항목 리스트 다시 그리기
        }
      });

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
