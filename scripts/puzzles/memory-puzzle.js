// Memory Puzzle - Personal Q&A Game
class MemoryPuzzle {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 3;
        this.userAnswers = {};
        this.questions = this.getQuestions();
        
        this.initializeElements();
        this.setupEventListeners();
        this.showQuestion(1);
    }

    getQuestions() {
        // These would ideally come from a database or user input
        // For now, using default personalized questions
        return [
            {
                id: 1,
                question: "Where did we first meet?",
                answer: "coffee shop",
                hints: ["We had our first conversation here", "It's a place with caffeine"]
            },
            {
                id: 2,
                question: "What's your favorite color?",
                answer: "blue",
                hints: ["It's the color of the sky", "Think of the ocean"]
            },
            {
                id: 3,
                question: "What's our special song?",
                answer: "perfect",
                hints: ["Ed Sheeran sings it", "It starts with 'P'"]
            }
        ];
    }

    initializeElements() {
        // Question elements
        this.questionCards = document.querySelectorAll('.question-card');
        this.answerInputs = document.querySelectorAll('.answer-input');
        this.feedbackElements = document.querySelectorAll('.feedback');
        
        // Control buttons
        this.prevQuestionBtn = document.getElementById('prevQuestion');
        this.nextQuestionBtn = document.getElementById('nextQuestion');
        this.completeMemoryBtn = document.getElementById('completeMemory');
        
        // Progress
        this.currentQuestionDisplay = document.getElementById('currentQuestion');
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevQuestionBtn) {
            this.prevQuestionBtn.addEventListener('click', () => this.previousQuestion());
        }
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        }
        if (this.completeMemoryBtn) {
            this.completeMemoryBtn.addEventListener('click', () => this.completePuzzle());
        }

        // Input events - check answer on Enter key or input change
        this.answerInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer(parseInt(input.closest('.question-card').dataset.question));
                }
            });
            
            input.addEventListener('blur', () => {
                this.checkAnswer(parseInt(input.closest('.question-card').dataset.question));
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousQuestion();
            } else if (e.key === 'ArrowRight') {
                this.nextQuestion();
            }
        });
    }

    showQuestion(questionNumber) {
        // Hide all questions
        this.questionCards.forEach(card => {
            card.classList.remove('active');
        });

        // Show current question
        const currentCard = document.querySelector(`[data-question="${questionNumber}"]`);
        if (currentCard) {
            currentCard.classList.add('active');
        }

        // Update current question
        this.currentQuestion = questionNumber;
        
        // Update UI
        this.updateNavigation();
        this.updateProgressDisplay();
        
        // Focus on input if it exists and doesn't have an answer yet
        const currentInput = currentCard?.querySelector('.answer-input');
        if (currentInput && !this.userAnswers[questionNumber]) {
            currentInput.focus();
        }

        // Scroll to question
        currentCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    previousQuestion() {
        if (this.currentQuestion > 1) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.showQuestion(this.currentQuestion + 1);
        } else {
            // If on last question and all are answered, allow completion
            if (this.allQuestionsAnswered()) {
                this.showCompletionButton();
            }
        }
    }

    checkAnswer(questionNumber) {
        const questionCard = document.querySelector(`[data-question="${questionNumber}"]`);
        const input = questionCard?.querySelector('.answer-input');
        const feedback = questionCard?.querySelector('.feedback');
        
        if (!input || !feedback) return;

        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = this.questions.find(q => q.id === questionNumber)?.answer.toLowerCase();
        
        if (!userAnswer) {
            this.clearFeedback(questionNumber);
            return;
        }

        // Check if answer is correct (allowing for minor variations)
        const isCorrect = this.isAnswerCorrect(userAnswer, correctAnswer);
        
        // Store user answer
        this.userAnswers[questionNumber] = {
            answer: userAnswer,
            isCorrect: isCorrect
        };

        // Update UI
        this.updateAnswerUI(questionNumber, isCorrect);
        this.showFeedback(questionNumber, isCorrect, userAnswer, correctAnswer);
        this.updateNavigation();

        // If this was the last question and all are answered, show completion button
        if (questionNumber === this.totalQuestions && this.allQuestionsAnswered()) {
            this.showCompletionButton();
        }
    }

    isAnswerCorrect(userAnswer, correctAnswer) {
        // More flexible matching - allows for minor spelling mistakes or variations
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = correctAnswer.toLowerCase().trim();
        
        // Exact match
        if (normalizedUser === normalizedCorrect) return true;
        
        // Contains match (for longer answers)
        if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length >= 3) return true;
        if (normalizedUser.includes(normalizedCorrect) && normalizedCorrect.length >= 3) return true;
        
        // Common variations
        const variations = {
            'coffee shop': ['cafe', 'coffeehouse', 'starbucks', 'coffee store'],
            'blue': ['navy', 'sky blue', 'light blue', 'dark blue'],
            'perfect': ['perfect by ed sheeran', 'ed sheeran perfect']
        };
        
        if (variations[correctAnswer]?.includes(normalizedUser)) {
            return true;
        }
        
        return false;
    }

    updateAnswerUI(questionNumber, isCorrect) {
        const input = document.querySelector(`[data-question="${questionNumber}"] .answer-input`);
        if (!input) return;
        
        // Remove existing classes
        input.classList.remove('correct', 'incorrect');
        
        // Add appropriate class
        if (isCorrect) {
            input.classList.add('correct');
        } else {
            input.classList.add('incorrect');
        }
    }

    showFeedback(questionNumber, isCorrect, userAnswer, correctAnswer) {
        const feedback = document.querySelector(`[data-question="${questionNumber}"] .feedback`);
        if (!feedback) return;
        
        // Clear existing feedback
        feedback.textContent = '';
        feedback.classList.remove('correct', 'incorrect');
        
        if (isCorrect) {
            feedback.textContent = '✅ Correct! Great memory!';
            feedback.classList.add('correct');
        } else {
            feedback.textContent = `❌ Not quite. Try again! Hint: ${this.getHint(questionNumber)}`;
            feedback.classList.add('incorrect');
        }
        
        // Show feedback temporarily
        setTimeout(() => {
            if (feedback.textContent.includes('❌')) {
                feedback.textContent = '';
                feedback.classList.remove('incorrect');
            }
        }, 3000);
    }

    clearFeedback(questionNumber) {
        const feedback = document.querySelector(`[data-question="${questionNumber}"] .feedback`);
        const input = document.querySelector(`[data-question="${questionNumber}"] .answer-input`);
        
        if (feedback) {
            feedback.textContent = '';
            feedback.classList.remove('correct', 'incorrect');
        }
        
        if (input) {
            input.classList.remove('correct', 'incorrect');
        }
    }

    getHint(questionNumber) {
        const question = this.questions.find(q => q.id === questionNumber);
        return question?.hints?.[0] || 'Think about our special moments together!';
    }

    allQuestionsAnswered() {
        return Object.keys(this.userAnswers).length === this.totalQuestions;
    }

    allQuestionsCorrect() {
        return Object.values(this.userAnswers).every(answer => answer.isCorrect);
    }

    updateNavigation() {
        // Update previous button
        if (this.prevQuestionBtn) {
            this.prevQuestionBtn.style.visibility = this.currentQuestion > 1 ? 'visible' : 'hidden';
        }

        // Update next button text and state
        if (this.nextQuestionBtn) {
            if (this.currentQuestion < this.totalQuestions) {
                this.nextQuestionBtn.textContent = 'Next Question →';
                this.nextQuestionBtn.classList.remove('hidden');
            } else if (this.allQuestionsAnswered()) {
                this.nextQuestionBtn.textContent = 'Review Answers';
                this.nextQuestionBtn.classList.remove('hidden');
            } else {
                this.nextQuestionBtn.classList.add('hidden');
            }
        }

        // Update question counter
        if (this.currentQuestionDisplay) {
            this.currentQuestionDisplay.textContent = this.currentQuestion;
        }
    }

    updateProgressDisplay() {
        // You could add a progress indicator within the memory puzzle if desired
        const answeredCount = Object.keys(this.userAnswers).length;
        const progress = (answeredCount / this.totalQuestions) * 100;
        
        // Optional: Update a mini progress bar within the memory puzzle
        const miniProgress = document.getElementById('memoryProgress');
        if (miniProgress) {
            miniProgress.style.width = `${progress}%`;
        }
    }

    showCompletionButton() {
        if (this.completeMemoryBtn) {
            this.completeMemoryBtn.classList.remove('hidden');
            this.nextQuestionBtn.classList.add('hidden');
        }
    }

   completePuzzle() {
    if (!this.allQuestionsAnswered()) {
        this.showTempMessage('Please answer all questions before completing!', 'warning');
        return;
    }

    const correctCount = Object.values(this.userAnswers).filter(answer => answer.isCorrect).length;
    
    if (correctCount === this.totalQuestions) {
        this.showSuccessAnimation();
        
        // Auto-progress after celebration
        setTimeout(() => {
            if (window.puzzleManager) {
                completePuzzle(1);
                // Auto-move to next puzzle
                setTimeout(() => {
                    window.puzzleManager.nextPuzzle();
                }, 1000);
            }
        }, 2000);
    } else {
        this.showResults(correctCount);
    }
}

showSuccessAnimation() {
    const currentCard = document.querySelector(`[data-question="${this.currentQuestion}"]`);
    if (currentCard) {
        // Add celebration class
        currentCard.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
        currentCard.style.borderLeftColor = '#28a745';
        
        // Use confetti instead of sparkles
        this.triggerConfetti();
    }
    
    this.showTempMessage('🎉 Perfect! All answers correct!', 'success');
}

    triggerConfetti() {
    // Use the puzzle manager's celebration system
    if (typeof window.puzzleManager !== 'undefined') {
        window.puzzleManager.triggerCelebration();
    }
    // Fallback: Direct GIF display
    else {
        this.displayConfettiGif();
    }
}

// Add this fallback method too
displayConfettiGif() {
    const confettiGif = document.createElement('img');
    confettiGif.src = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWVmZHQxaXYzMHNzdzY2Nnc0a2R3Y3M5M3Z6bjZ0ZWxza3YzYnN2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9u2VQAwIgpMZKT6qTV/giphy.gif';
    confettiGif.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 60%;
        max-height: 60%;
        z-index: 9999;
        pointer-events: none;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(confettiGif);

    // Remove after animation
    setTimeout(() => {
        confettiGif.style.opacity = '0';
        confettiGif.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (confettiGif.parentNode) {
                document.body.removeChild(confettiGif);
            }
        }, 500);
    }, 3000);
}

    showResults(correctCount) {
        const message = `You got ${correctCount} out of ${this.totalQuestions} correct! ` +
                       `${correctCount === this.totalQuestions ? 'Perfect! 🎉' : 'Keep trying!'}`;
        
        this.showTempMessage(message, correctCount === this.totalQuestions ? 'success' : 'warning');
        
        // Highlight incorrect answers
        this.highlightIncorrectAnswers();
    }

    highlightIncorrectAnswers() {
        Object.entries(this.userAnswers).forEach(([questionNum, answer]) => {
            if (!answer.isCorrect) {
                const questionCard = document.querySelector(`[data-question="${questionNum}"]`);
                const input = questionCard?.querySelector('.answer-input');
                
                if (input) {
                    input.classList.add('incorrect');
                    input.focus();
                }
                
                // Show the correct answer hint
                const feedback = questionCard?.querySelector('.feedback');
                if (feedback) {
                    const correctAnswer = this.questions.find(q => q.id === parseInt(questionNum))?.answer;
                    feedback.textContent = `💡 Hint: ${this.getHint(parseInt(questionNum))}`;
                    feedback.classList.add('incorrect');
                }
            }
        });
    }


    showTempMessage(message, type = 'info') {
        // Reuse the temp message function from puzzle manager or create one
        const tempMsg = document.createElement('div');
        tempMsg.textContent = message;
        tempMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            tempMsg.style.opacity = '0';
            tempMsg.style.transition = 'opacity 0.5s ease';
            setTimeout(() => tempMsg.remove(), 500);
        }, 3000);
    }
}

// Initialize Memory Puzzle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the memory puzzle
    const memoryPuzzleContainer = document.getElementById('memoryPuzzle');
    if (memoryPuzzleContainer) {
        const memoryPuzzle = new MemoryPuzzle();
        console.log('🧠 Memory Puzzle initialized!');
    }
});

// Add CSS for sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-20px) scale(1.5);
        }
    }
`;
document.head.appendChild(style);