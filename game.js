let secretNumber = '7086';  // 정답 예시
let attempts = 10;  // 남은 시도 횟수

document.getElementById('submitGuessButton').addEventListener('click', submitGuess);

function submitGuess() {
    const userGuess = document.getElementById('userGuess').value;
    const resultsElement = document.getElementById('results');
    const attemptsLeftElement = document.getElementById('attemptsLeft');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (attempts <= 0) {
        alert('더 이상 시도할 수 없습니다. 게임 오버!');
        return;
    }

    if (userGuess.length !== 4) {
        alert('오류: 네 자리 숫자를 입력해 주세요.');
        return;
    }

    if (userGuess === secretNumber) {
        resultsElement.innerHTML = '';
        welcomeMessage.style.display = 'block';
        welcomeMessage.textContent = '보안코드 승인: 관리자님 환영합니다';
        return;
    }

    attempts--;
    attemptsLeftElement.textContent = `남은 시도 횟수: ${attempts}`;
    
    let feedback = [];
    let secretUsed = Array(4).fill(false);
    let guessUsed = Array(4).fill(false);

    // 정확한 위치의 숫자를 먼저 찾습니다.
    for (let i = 0; i < 4; i++) {
        if (userGuess[i] === secretNumber[i]) {
            feedback[i] = { num: userGuess[i], class: 'correct' }; // 정확한 자리
            secretUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // 숫자는 맞지만 위치가 잘못된 경우
    for (let i = 0; i < 4; i++) {
        if (!guessUsed[i]) {
            for (let j = 0; j < 4; j++) {
                if (userGuess[i] === secretNumber[j] && !secretUsed[j]) {
                    feedback[i] = { num: userGuess[i], class: 'wrong-place' }; // 잘못된 자리
                    secretUsed[j] = true;
                    guessUsed[i] = true;
                    break;
                }
            }
        }
    }

    // 나머지는 틀린 숫자
    for (let i = 0; i < 4; i++) {
        if (!guessUsed[i]) {
            feedback[i] = { num: userGuess[i], class: 'wrong-number' }; // 틀린 숫자
        }
    }

    // 결과 라인 추가
    let resultLine = document.createElement('div');
    feedback.forEach(item => {
        let span = document.createElement('span');
        span.className = item.class;
        span.textContent = item.num;
        resultLine.appendChild(span);
    });

    resultsElement.appendChild(resultLine);
}
