
// Seleção de elementos
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const restartTimer = document.getElementById('restart');
const alarmOFF = document.getElementById('alarmoff');
const timerDisplay = document.getElementById('timer');
const cyclecount = document.getElementById('Cycles');
const alarmAudioElement = document.getElementById('AlarmSong');
const StudyAudio = document.getElementById('StudySong');
const StudyAudioOff = document.querySelector(".SoundOff");

// Configurações iniciais
let remainingTimeInSeconds = 30 * 60;
let isTimerRunning = false;
let isStudyPhase = true;
let timerInterval;
let currentCycle = 0;
let isAudioPlaying = false;
let autoPlayAudio = true;

// Áudio configurações
StudyAudio.volume = 0.02;
alarmAudioElement.volume = 0.5;

// Função para atualizar o display do cronômetro
const updateTimerDisplay = () => {
  const minutes = String(Math.floor(remainingTimeInSeconds / 60)).padStart(2, '0');
  const seconds = String(remainingTimeInSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
};

// Inicia ou pausa o cronômetro
startButton.addEventListener('click', () => {
  if (!isTimerRunning) {
    startButton.textContent = "Pausar";
    startButton.disabled = true;
    pauseButton.style.display = "inline-block";
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      if (remainingTimeInSeconds > 0) {
        remainingTimeInSeconds--;
        updateTimerDisplay();
        if (isStudyPhase && !isAudioPlaying && autoPlayAudio) {
          StudyAudio.play();
          isAudioPlaying = true;
        }
      } else {
        clearInterval(timerInterval);
        handleAlarm();
        StudyAudio.pause();
        StudyAudio.currentTime = 0;
        if (isStudyPhase) {
          currentCycle++;
          setRestTime();
          updateCycleDisplay();
        } else {
          setStudyTime();
        }
      }
    }, 1000);
  }
});

// Pausa o cronômetro
pauseButton.addEventListener('click', () => {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    StudyAudio.pause();
    isAudioPlaying = false;
    isTimerRunning = false;
    startButton.textContent = "Iniciar";
    startButton.disabled = false;
  }
});

// Desativa o alarme e reinicia o cronômetro
alarmOFF.addEventListener('click', () => {
  alarmAudioElement.pause();
  document.getElementById('alarmoff').classList.remove('blinking');
  document.getElementById('alarmoff').style.display = "none";
  isTimerRunning = false;
  startButton.disabled = false;
  startButton.textContent = "Iniciar";
});

// Função que toca o alarme e ativa a animação de piscar
const handleAlarm = () => {
  alarmAudioElement.play();
  document.getElementById('alarmoff').classList.add('blinking');
  document.getElementById('alarmoff').style.display = "block";
};

// Reinicia o cronômetro
restartTimer.addEventListener('click', () => {
  clearInterval(timerInterval);
  StudyAudio.pause();
  StudyAudio.currentTime = 0;
  alarmAudioElement.pause();
  alarmAudioElement.currentTime = 0;
  remainingTimeInSeconds = 30 * 60;
  currentCycle = 0;
  updateTimerDisplay();
  updateCycleDisplay();
  document.getElementById('alarmoff').style.display = "none";
  startButton.textContent = "Iniciar";
  startButton.disabled = false;
  isAudioPlaying = false;
  isTimerRunning = false;
});

// Botão para pausar/reativar o áudio
StudyAudioOff.addEventListener('click', () => {
  isAudioPlaying = !isAudioPlaying;
  autoPlayAudio = !autoPlayAudio;
  if (isAudioPlaying) {
    StudyAudio.play();
  } else {
    StudyAudio.pause();
    StudyAudio.currentTime = 0;
  }
});

// Atualiza o display do ciclo
const updateCycleDisplay = () => {
  cyclecount.textContent = `${currentCycle}/4`;
};

// Define o tempo de descanso
const setRestTime = () => {
  if (currentCycle === 4) {
    remainingTimeInSeconds = 15 * 60;
    alarmAudioElement.currentTime = 0;
  } else {
    remainingTimeInSeconds = 5 * 60;
    alarmAudioElement.currentTime = 0;
  }
  isStudyPhase = false;
  updateTimerDisplay();
};

// Define o tempo de estudo
const setStudyTime = () => {
  remainingTimeInSeconds = 30 * 60;
  isStudyPhase = true;
  updateTimerDisplay();
};