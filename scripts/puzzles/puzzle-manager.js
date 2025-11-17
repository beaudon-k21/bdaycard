// Puzzle Manager - Controls the flow between all puzzles
class PuzzleManager {
    constructor() {
        this.currentPuzzle = 1;
        this.totalPuzzles = 3;
        this.completedPuzzles = new Set();
        this.progress = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.showPuzzle(1); // Start with first puzzle
        this.updateProgress();
    }

    initializeElements() {
        // Puzzle containers
        this.puzzleContainers = {
            1: document.getElementById('memoryPuzzle'),
            2: document.getElementById('wordSearchPuzzle'),
            3: document.getElementById('timelinePuzzle')
        };

        // Navigation elements
        this.prevPuzzleBtn = document.getElementById('prevPuzzle');
        this.nextPuzzleBtn = document.getElementById('nextPuzzle');
        this.currentPuzzleNumber = document.getElementById('currentPuzzleNumber');
        
        // Progress elements
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Puzzle indicators
        this.puzzleIndicators = document.querySelectorAll('.puzzle-indicator');
        
        // Completion screen
        this.completionScreen = document.getElementById('completionScreen');
        this.revealSurpriseBtn = document.getElementById('revealSurprise');
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevPuzzleBtn) {
            this.prevPuzzleBtn.addEventListener('click', () => this.previousPuzzle());
        }
        if (this.nextPuzzleBtn) {
            this.nextPuzzleBtn.addEventListener('click', () => this.nextPuzzle());
        }

        // Completion screen
        if (this.revealSurpriseBtn) {
            this.revealSurpriseBtn.addEventListener('click', () => this.revealSurprise());
        }

        // Listen for puzzle completion events
        document.addEventListener('puzzleCompleted', (event) => {
            this.handlePuzzleCompletion(event.detail.puzzleId);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.previousPuzzle();
            } else if (event.key === 'ArrowRight') {
                this.nextPuzzle();
            }
        });
    }

    showPuzzle(puzzleNumber) {
    // Prevent jumping ahead to puzzles that shouldn't be accessible yet
    if (puzzleNumber > 1 && !this.completedPuzzles.has(puzzleNumber - 1)) {
        this.showTempMessage('Complete the previous puzzle first!', 'warning');
        return;
    }
    
    // Hide all puzzles
    Object.values(this.puzzleContainers).forEach(container => {
        if (container) container.classList.remove('active');
    });

    // Show selected puzzle
    if (this.puzzleContainers[puzzleNumber]) {
        this.puzzleContainers[puzzleNumber].classList.add('active');
    }

    // Update current puzzle
    this.currentPuzzle = puzzleNumber;
    
    // Update UI
    this.updateNavigation();
    this.updatePuzzleIndicators();
    
    // Update puzzle number display
    if (this.currentPuzzleNumber) {
        this.currentPuzzleNumber.textContent = puzzleNumber;
    }

    // Scroll to top of puzzle
    window.scrollTo(0, 0);
}

   nextPuzzle() {
    if (this.currentPuzzle < this.totalPuzzles) {
        this.showPuzzle(this.currentPuzzle + 1);
    } else {
        // Only show completion screen if ALL puzzles are completed
        if (this.allPuzzlesCompleted()) {
            this.showCompletionScreen();
        } else {
            // If not all puzzles are completed, stay on current puzzle
            this.showTempMessage('Complete all puzzles to unlock the surprise!', 'info');
        }
    }
}

    previousPuzzle() {
        if (this.currentPuzzle > 1) {
            this.showPuzzle(this.currentPuzzle - 1);
        }
    }

 handlePuzzleCompletion(puzzleId) {
    console.log(`Puzzle ${puzzleId} completed. Current completed:`, Array.from(this.completedPuzzles));
    
    // Mark puzzle as completed
    this.completedPuzzles.add(puzzleId);
    
    // Update progress
    this.updateProgress();
    
    // Update puzzle indicators
    this.updatePuzzleIndicators();
    
    // Show completion message for current puzzle
    this.showPuzzleCompletionFeedback(puzzleId);
    
    console.log(`After completion - Completed puzzles:`, Array.from(this.completedPuzzles), `All completed:`, this.allPuzzlesCompleted());
    
    // Check if ALL puzzles are completed
    if (this.allPuzzlesCompleted()) {
        console.log('ALL PUZZLES COMPLETED! Showing completion screen...');
        // Only show completion screen if ALL puzzles are done
        setTimeout(() => {
            this.showCompletionScreen();
        }, 1500);
    } else {
        console.log('Not all puzzles completed. Auto-progressing to next puzzle...');
        // Auto-progress to next puzzle if available
        setTimeout(() => {
            if (this.currentPuzzle < this.totalPuzzles) {
                this.nextPuzzle();
            } else {
                console.log('Already on last puzzle, but not all are completed. Staying here.');
                // We're on the last puzzle but not all are completed
                // This can happen if user jumps to puzzle 3 without completing 1 and 2
                this.showTempMessage('Complete the other puzzles to unlock the surprise!', 'info');
            }
        }, 1000);
    }
}

// Add this method to debug puzzle completion
debugPuzzleState() {
    console.log('=== PUZZLE STATE DEBUG ===');
    console.log('Current puzzle:', this.currentPuzzle);
    console.log('Completed puzzles:', Array.from(this.completedPuzzles));
    console.log('All completed?', this.allPuzzlesCompleted());
    console.log('Progress:', this.progress + '%');
}

    showPuzzleCompletionFeedback(puzzleId) {
        // You can add specific feedback for each puzzle type
        const puzzleNames = {
            1: "Memory Quiz",
            2: "Word Search", 
            3: "Timeline Challenge"
        };
        
        console.log(`🎉 ${puzzleNames[puzzleId]} completed!`);
        
        // Optional: Show a temporary success message
        this.showTempMessage(`✅ ${puzzleNames[puzzleId]} completed!`, 'success');
    }

    showTempMessage(message, type = 'info') {
        const tempMsg = document.createElement('div');
        tempMsg.textContent = message;
        tempMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            tempMsg.remove();
        }, 3000);
    }

    updateProgress() {
        const completedCount = this.completedPuzzles.size;
        this.progress = (completedCount / this.totalPuzzles) * 100;
        
        // Update progress bar
        if (this.progressFill) {
            this.progressFill.style.width = `${this.progress}%`;
        }
        
        // Update progress text
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(this.progress)}%`;
        }
    }

   updateNavigation() {
    // Show/hide previous button
    if (this.prevPuzzleBtn) {
        if (this.currentPuzzle > 1) {
            this.prevPuzzleBtn.classList.remove('hidden');
        } else {
            this.prevPuzzleBtn.classList.add('hidden');
        }
    }

    // Show/hide next button and update its text
    if (this.nextPuzzleBtn) {
        if (this.currentPuzzle < this.totalPuzzles) {
            this.nextPuzzleBtn.classList.remove('hidden');
            this.nextPuzzleBtn.textContent = 'Next Puzzle →';
        } else if (this.allPuzzlesCompleted()) {
            // Only show "See Results" if ALL puzzles are completed
            this.nextPuzzleBtn.classList.remove('hidden');
            this.nextPuzzleBtn.textContent = 'See Results →';
        } else {
            this.nextPuzzleBtn.classList.add('hidden');
        }
    }
}

    updatePuzzleIndicators() {
        this.puzzleIndicators.forEach((indicator, index) => {
            const puzzleNumber = index + 1;
            
            // Remove all classes first
            indicator.classList.remove('active', 'completed');
            
            // Add appropriate classes
            if (puzzleNumber === this.currentPuzzle) {
                indicator.classList.add('active');
            }
            
            if (this.completedPuzzles.has(puzzleNumber)) {
                indicator.classList.add('completed');
            }
        });
    }

    allPuzzlesCompleted() {
        return this.completedPuzzles.size === this.totalPuzzles;
    }

    showCompletionScreen() {
        // Hide all puzzle containers
        Object.values(this.puzzleContainers).forEach(container => {
            if (container) container.classList.remove('active');
        });
        
        // Hide navigation
        if (this.prevPuzzleBtn) this.prevPuzzleBtn.classList.add('hidden');
        if (this.nextPuzzleBtn) this.nextPuzzleBtn.classList.add('hidden');
        
        // Show completion screen
        if (this.completionScreen) {
            this.completionScreen.classList.remove('hidden');
            this.completionScreen.classList.add('active');
        }
        
        // Trigger confetti celebration
        this.triggerCelebration();
    }

   triggerCelebration() {
    this.displayConfettiGif();
}

displayConfettiGif() {
    const puzzleContainer = document.querySelector('.puzzle-container.active') || document.querySelector('.puzzle-main');
    const containerRect = puzzleContainer.getBoundingClientRect();
    
    // Create a mix of large and extra-large pieces
    const largePieces = 6;  // 80-120px
    const xlargePieces = 4; // 120-180px
    
    for (let i = 0; i < largePieces; i++) {
        this.createConfettiPiece(containerRect, 'large');
    }
    
    for (let i = 0; i < xlargePieces; i++) {
        setTimeout(() => {
            this.createConfettiPiece(containerRect, 'xlarge');
        }, i * 200);
    }
}

createConfettiPiece(containerRect, sizeType = 'large') {
    const confettiGif = document.createElement('img');
    confettiGif.src = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWVmZHQxaXYzMHNzdzY2Nnc0a2R3Y3M5M3Z6bjZ0ZWxza3YzYnN2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9u2VQAwIgpMZKT6qTV/giphy.gif';
    
    let size;
    if (sizeType === 'xlarge') {
        size = Math.random() * 60 + 120; // 120-180px
    } else {
        size = Math.random() * 40 + 80;  // 80-120px
    }
    
    const startLeft = Math.random() * (containerRect.width - size);
    
    confettiGif.style.cssText = `
        position: absolute;
        top: -${size}px;
        left: ${startLeft}px;
        width: ${size}px;
        height: ${size}px;
        z-index: 9998;
        pointer-events: none;
        border-radius: ${sizeType === 'xlarge' ? '15px' : '10px'};
        animation: fallInContainer ${sizeType === 'xlarge' ? '3.5s' : '2.5s'} ease-in forwards;
        filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
    `;

    const puzzleContainer = document.querySelector('.puzzle-container.active') || document.querySelector('.puzzle-main');
    puzzleContainer.style.position = 'relative';
    puzzleContainer.appendChild(confettiGif);

    const duration = sizeType === 'xlarge' ? 3500 : 2500;
    
    setTimeout(() => {
        confettiGif.style.opacity = '0';
        confettiGif.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (confettiGif.parentNode) {
                confettiGif.parentNode.removeChild(confettiGif);
            }
        }, 500);
    }, duration);
}

    revealSurprise() {
        // Navigate to final surprise page
        window.location.href = '../pages/final-surprise.html';
        
        // Or if you want to show it on the same page:
        // this.showFinalSurprise();
    }

    showFinalSurprise() {
        // This would show the final birthday message/invitation
        alert('🎁 Your surprise is revealed! This would show your final birthday message or invitation.');
        
        // In a real implementation, you would:
        // 1. Show a beautiful final message
        // 2. Display personalized content
        // 3. Maybe play celebratory music
        // 4. Show the actual birthday surprise
    }
}

// Initialize the puzzle manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const puzzleManager = new PuzzleManager();
    
    // Make it globally available for other puzzle scripts
    window.puzzleManager = puzzleManager;
    
    console.log('🎯 Puzzle Manager initialized!');
});

// Utility function for other puzzle scripts to signal completion
function completePuzzle(puzzleId) {
    const completionEvent = new CustomEvent('puzzleCompleted', {
        detail: { puzzleId: puzzleId }
    });
    document.dispatchEvent(completionEvent);
}