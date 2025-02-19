let secretNumber = '7086';  // 정답 예시
let attempts = parseInt(localStorage.getItem('attempts')) || 10;  // 저장된 시도 횟수 불러오기
let resultsData = JSON.parse(localStorage.getItem('results')) || [];  // 저장된 결과 불러오기

// DOM 요소
const resultsElement = document.getElementById('results');
const attemptsLeftElement = document.getElementById('attemptsLeft');
const welcomeMessage = document.getElementById('welcomeMessage');
const userGuessInput = document.getElementById('userGuess');
const submitButton = document.getElementById('submitGuessButton');

// 🔄 이전 결과가 있다면 화면에 렌더링
window.onload = function() {
    attemptsLeftElement.textContent = `남은 시도 횟수: ${attempts}`;
    resultsData.forEach(renderResult);

    if (localStorage.getItem('gameCompleted') === 'true') {
        endGame();  // 게임 종료 처리
    }
};

// 🎯 제출 버튼 이벤트
submitButton.addEventListener('click', submitGuess);

// 📝 결과 렌더링 함수
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

// 🎉 게임 종료 처리 (입력 차단 + 메시지 표시)
function endGame() {
    userGuessInput.disabled = true;
    submitButton.disabled = true;
    welcomeMessage.style.display = 'block';
    welcomeMessage.textContent = '보안코드 승인: 관리자님 환영합니다';
    localStorage.setItem('gameCompleted', 'true');  // 게임 완료 상태 저장
}

// 🕹️ 메인 게임 로직
function submitGuess() {
    const userGuess = userGuessInput.value;

    // ❌ 게임 완료 시 입력 차단
    if (localStorage.getItem('gameCompleted') === 'true') {
        alert('이미 정답을 맞추셨습니다!');
        return;
    }

    if (attempts <= 0) {
        alert('더 이상 시도할 수 없습니다. 게임 오버!');
        return;
    }

    if (userGuess.length !== 4) {
        alert('오류: 네 자리 숫자를 입력해 주세요.');
        return;
    }

    // 🎯 정답 시 즉시 게임 종료
    if (userGuess === secretNumber) {
        resultsData.push([...userGuess].map(num => ({ num: num, class: 'correct' })));
        localStorage.setItem('results', JSON.stringify(resultsData));
        renderResult(resultsData[resultsData.length - 1]);
        endGame();  // ✅ 정답 맞췄을 때 즉시 입력 차단
        return;
    }

    attempts--;
    attemptsLeftElement.textContent = `남은 시도 횟수: ${attempts}`;
    localStorage.setItem('attempts', attempts);  // 시도 횟수 저장

    let feedback = [];
    let secretUsed = Array(4).fill(false);
    let guessUsed = Array(4).fill(false);

    // ✅ 정확한 위치
    for (let i = 0; i < 4; i++) {
        if (userGuess[i] === secretNumber[i]) {
            feedback[i] = { num: userGuess[i], class: 'correct' };
            secretUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // ⚠️ 숫자는 맞지만 위치가 잘못된 경우
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

    // ❌ 틀린 숫자
    for (let i = 0; i < 4; i++) {
        if (!guessUsed[i]) {
            feedback[i] = { num: userGuess[i], class: 'wrong-number' };
        }
    }

    resultsData.push(feedback);
    localStorage.setItem('results', JSON.stringify(resultsData));  // 결과 로컬 스토리지에 저장
    renderResult(feedback);

    if (attempts <= 0) {
        endGame();  // 💀 시도 횟수 소진 시 게임 종료
    }
}
