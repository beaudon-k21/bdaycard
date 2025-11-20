document.addEventListener('DOMContentLoaded', () => {
  const flames = document.querySelectorAll('.flame');
  const instruction = document.querySelector('.instruction');

  // Ask for microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const mic = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      mic.connect(analyser);

      function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        // Calculate average volume
        let values = 0;
        for (let i = 0; i < dataArray.length; i++) {
          values += dataArray[i];
        }
        let average = values / dataArray.length;

        // Debug (you can see live mic input in console)
        // console.log(average);

        // Threshold: tweak this value to match real blowing sensitivity
        if (average > 40) {
          blowOutCandles();
        }

        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    })
    .catch(err => {
      console.error('Microphone access denied:', err);
      instruction.textContent = "Please allow mic access to blow out the candles 🎤";
    });

  // Function to extinguish flames
  function blowOutCandles() {
    flames.forEach(f => {
      f.style.animation = 'none';
      f.style.opacity = '0';
      f.style.transition = 'opacity 1s ease-out';
    });
    instruction.textContent = "🎉 The candles are out! Opening your card...";
    setTimeout(openCard, 2000);
  }

  // Simulate card opening animation
function openCard() {
    const card = document.getElementById("birthdayCard");
    const scene = document.getElementById("scene");
    
    card.classList.add("open");
    scene.classList.add("open");
    
    // Show continue button instead of auto-redirect
    setTimeout(() => {
        showContinueButton();
    }, 2000);
}

function showContinueButton() {
    // Create continue button
    const continueBtn = document.createElement('button');
    continueBtn.textContent = 'Continue to Puzzles 🎯';
    continueBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff6b8b, #ff8e53);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1.2rem;
        font-family: "Kranky", cursive;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        animation: bounce 2s infinite;
    `;
    
    continueBtn.addEventListener('click', () => {
        // Add fade out animation
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'pages/puzzle-section.html';
        }, 500);
    });
    
    continueBtn.addEventListener('mouseenter', () => {
        continueBtn.style.transform = 'translateX(-50%) scale(1.05)';
    });
    
    continueBtn.addEventListener('mouseleave', () => {
        continueBtn.style.transform = 'translateX(-50%) scale(1)';
    });
    
    document.body.appendChild(continueBtn);
}

// Add bounce animation to CSS
const continueButtonStyle = document.createElement('style');
continueButtonStyle.textContent = `
    @keyframes bounce {
        0%, 100% {
            transform: translateX(-50%) translateY(0);
        }
        50% {
            transform: translateX(-50%) translateY(-5px);
        }
    }
`;
document.head.appendChild(continueButtonStyle);
});
