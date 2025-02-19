let secretNumber = '7086';  // 정답 예시
let attempts = parseInt(localStorage.getItem('attempts')) || 10;  // 저장된 시도 횟수 불러오기
let resultsData = JSON.parse(localStorage.getItem('results')) || [];  // 저장된 결과 불러오기

// DOM 요소
const resultsElement = document.getElementById('results');
const attemptsLeftElement = document.getElementById('attemptsLeft');
const welcomeMessage = document.getElementById('welcomeMessage');

// 이전 결과가 있다면 화면에 렌더링
window.onload = function() {
    attemptsLeftElement.textContent = `남은 시도 횟수: ${attempts}`;
    resultsData.forEach(renderResult);

    if (localStorage.getItem('gameCompleted') === 'true') {
        showSuccessMessage();
    }
};

// 제출 버튼 이벤트
document.getElementById('submitGuessButton').addEventListener('click', submitGuess);

// 결과 렌더링 함수
function renderResult(feedback) {
    let resultLine = document.createElement('div');
    feedback.forEach(item => {
        let span = document.createElement('span');
        span.className = item.class;
        span.textContent = item.num;
        resultLine.appendChild(span);
    });
    resultsElement.appendChild(resultLine);
}

// 성공 메시지 표시
function showSuccessMessage() {
    resultsElement.innerHTML = '';
    welcomeMessage.style.display = 'block';
    welcomeMessage.textContent = '보안코드 승인: 관리자님 환영합니다';
}

// 메인 게임 로직
function submitGuess() {
    const userGuess = document.getElementById('userGuess').value;

    if (attempts <= 0) {
        alert('더 이상 시도할 수 없습니다. 게임 오버!');
        return;
    }

    if (userGuess.length !== 4) {
        alert('오류: 네 자리 숫자를 입력해 주세요.');
        return;
    }

    if (userGuess === secretNumber) {
        localStorage.setItem('gameCompleted', 'true');
        showSuccessMessage();
        return;
    }

    attempts--;
    attemptsLeftElement.textContent = `남은 시도 횟수: ${attempts}`;
    localStorage.setItem('attempts', attempts);  // 시도 횟수 저장

    let feedback = [];
    let secretUsed = Array(4).fill(false);
    let guessUsed = Array(4).fill(false);

    // 정확한 위치
    for (let i = 0; i < 4; i++) {
        if (userGuess[i] === secretNumber[i]) {
            feedback[i] = { num: userGuess[i], class: 'correct' };
            secretUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // 잘못된 위치
    for (let i = 0; i < 4; i++) {
        if (!guessUsed[i]) {
            for (let j = 0; j < 4; j++) {
                if (userGuess[i] === secretNumber[j] && !secretUsed[j]) {
                    feedback[i] = { num: userGuess[i], class: 'wrong-place' };
                    secretUsed[j] = true;
                    guessUsed[i] = true;
                    break;
                }
            }
        }
    }

    // 틀린 숫자
    for (let i = 0; i < 4; i++) {
        if (!guessUsed[i]) {
            feedback[i] = { num: userGuess[i], class: 'wrong-number' };
        }
    }

    resultsData.push(feedback);  // 결과 배열에 추가
    localStorage.setItem('results', JSON.stringify(resultsData));  // 결과 로컬 스토리지에 저장
    renderResult(feedback);
}

// 데이터 초기화 함수 (테스트용)
/*
function resetGame() {
    localStorage.removeItem('attempts');
    localStorage.removeItem('results');
    localStorage.removeItem('gameCompleted');
    location.reload();
}
*/
