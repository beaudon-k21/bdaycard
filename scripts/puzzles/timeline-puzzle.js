// Timeline Puzzle - Drag and Drop Memories in Order
class TimelinePuzzle {
    constructor() {
        this.memories = this.getPersonalizedMemories();
        this.correctOrder = ['text', 'encounter', 'love']; // Correct chronological order
        this.userOrder = [];
        this.draggedItem = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderMemoryItems();
        this.updateProgress();
    }

    getPersonalizedMemories() {
        return [
            {
                id: 'text',
                emoji: '💬',
                title: 'First conversation',
                description: 'Where it all began',
                date: '21 February 2025'
            },
            {
                id: 'encounter',
                emoji: '👩🏾‍🤝‍👨🏽',
                title: 'First link',
                description: 'When we first shared a breath',
                date: '29 March 2025'
            },
            {
                id: 'love',
                emoji: '👩🏾‍❤‍👨🏽',
                title: 'The word love',
                description: 'When you knew you where a gone girl',
                date: '26 April 2025'
            }
        ];
    }

    initializeElements() {
        this.timelineSlots = document.querySelectorAll('.timeline-slot');
        this.memoryItemsContainer = document.querySelector('.memory-items');
        this.checkTimelineBtn = document.getElementById('checkTimeline');
        this.resetTimelineBtn = document.getElementById('resetTimeline');
        this.completeTimelineBtn = document.getElementById('completeTimeline');
    }

    setupEventListeners() {
        if (this.checkTimelineBtn) {
            this.checkTimelineBtn.addEventListener('click', () => this.checkOrder());
        }
        if (this.resetTimelineBtn) {
            this.resetTimelineBtn.addEventListener('click', () => this.resetPuzzle());
        }
        if (this.completeTimelineBtn) {
            this.completeTimelineBtn.addEventListener('click', () => this.completePuzzle());
        }

        // Setup drop zones
        this.timelineSlots.forEach(slot => {
            slot.addEventListener('dragover', this.handleDragOver.bind(this));
            slot.addEventListener('drop', this.handleDrop.bind(this));
            slot.addEventListener('dragenter', this.handleDragEnter.bind(this));
            slot.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    renderMemoryItems() {
        if (!this.memoryItemsContainer) return;
        
        this.memoryItemsContainer.innerHTML = '';
        
        // Shuffle memories for initial display
        const shuffledMemories = [...this.memories].sort(() => Math.random() - 0.5);
        
        shuffledMemories.forEach(memory => {
            const memoryElement = this.createMemoryElement(memory);
            this.memoryItemsContainer.appendChild(memoryElement);
        });
    }

    createMemoryElement(memory) {
        const memoryDiv = document.createElement('div');
        memoryDiv.className = 'memory-item';
        memoryDiv.draggable = true;
        memoryDiv.dataset.memoryId = memory.id;
        
        memoryDiv.innerHTML = `
            <span class="memory-emoji">${memory.emoji}</span>
            <div class="memory-details">
                <strong>${memory.title}</strong>
                <span>${memory.description}</span>
                <small>${memory.date}</small>
            </div>
        `;

        // Drag event listeners
        memoryDiv.addEventListener('dragstart', this.handleDragStart.bind(this));
        memoryDiv.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        // Touch support for mobile
        memoryDiv.addEventListener('touchstart', this.handleTouchStart.bind(this));
        memoryDiv.addEventListener('touchend', this.handleTouchEnd.bind(this));

        return memoryDiv;
    }

    handleDragStart(event) {
        this.draggedItem = event.target;
        event.target.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', event.target.dataset.memoryId);
        
        // Add slight delay for better visual feedback
        setTimeout(() => {
            event.target.style.opacity = '0.4';
        }, 0);
    }

    handleDragEnd(event) {
        event.target.classList.remove('dragging');
        event.target.style.opacity = '1';
        this.draggedItem = null;
        
        // Remove all drag-over styles
        this.timelineSlots.forEach(slot => {
            slot.classList.remove('drag-over');
        });
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(event) {
        event.preventDefault();
        event.target.closest('.timeline-slot').classList.add('drag-over');
    }

    handleDragLeave(event) {
        // Only remove class if leaving the actual slot, not just moving between children
        if (!event.target.closest('.timeline-slot').contains(event.relatedTarget)) {
            event.target.closest('.timeline-slot').classList.remove('drag-over');
        }
    }

    handleDrop(event) {
    event.preventDefault();
    const slot = event.target.closest('.timeline-slot');
    
    if (slot && this.draggedItem) {
        slot.classList.remove('drag-over');
        
        const slotContent = slot.querySelector('.slot-content');
        const memoryId = this.draggedItem.dataset.memoryId;
        const slotNumber = parseInt(slot.dataset.slot);
        
        console.log('Dropped memory', memoryId, 'into slot', slotNumber);
        
        // Clear slot if it already has an item
        if (slotContent.hasChildNodes()) {
            const existingItem = slotContent.firstChild;
            this.memoryItemsContainer.appendChild(existingItem);
            console.log('Cleared existing item from slot', slotNumber);
        }
        
        // Add the dragged item to the slot
        slotContent.appendChild(this.draggedItem);
        slotContent.classList.add('has-item');
        
        // Update user order
        this.updateUserOrder(slotNumber, memoryId);
        
        // Check if all slots are filled (this should show the check button)
        this.checkAllSlotsFilled();
        
        console.log('Current user order:', this.userOrder);
    }
}
    handleTouchStart(event) {
        const memoryItem = event.target.closest('.memory-item');
        if (memoryItem) {
            this.draggedItem = memoryItem;
            memoryItem.classList.add('dragging');
            
            // Create a ghost image for visual feedback
            const rect = memoryItem.getBoundingClientRect();
            memoryItem.style.width = rect.width + 'px';
            memoryItem.style.height = rect.height + 'px';
        }
    }

    handleTouchEnd(event) {
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
            this.draggedItem.style.width = '';
            this.draggedItem.style.height = '';
            
            // Find which slot we're over (simplified touch targeting)
            const touch = event.changedTouches[0];
            const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
            const slot = elementUnderTouch?.closest('.timeline-slot');
            
            if (slot) {
                const slotContent = slot.querySelector('.slot-content');
                const memoryId = this.draggedItem.dataset.memoryId;
                const slotNumber = parseInt(slot.dataset.slot);
                
                if (slotContent.hasChildNodes()) {
                    const existingItem = slotContent.firstChild;
                    this.memoryItemsContainer.appendChild(existingItem);
                }
                
                slotContent.appendChild(this.draggedItem);
                slotContent.classList.add('has-item');
                
                this.updateUserOrder(slotNumber, memoryId);
                this.checkAllSlotsFilled();
            }
            
            this.draggedItem = null;
        }
    }

    updateUserOrder(slotNumber, memoryId) {
        // Update the user's order array
        this.userOrder[slotNumber - 1] = memoryId;
        
        // Remove any undefined entries
        this.userOrder = this.userOrder.filter(item => item !== undefined);
        
        this.updateProgress();
    }

    updateProgress() {
        const filledSlots = this.userOrder.length;
        const totalSlots = this.timelineSlots.length;
        
        // Visual progress indicator
        this.timelineSlots.forEach((slot, index) => {
            if (index < filledSlots) {
                slot.classList.add('filled');
            } else {
                slot.classList.remove('filled');
            }
        });
    }

 checkAllSlotsFilled() {
    const allFilled = this.userOrder.length === this.timelineSlots.length;
    
    console.log('Slots filled:', this.userOrder.length, '/', this.timelineSlots.length, 'All filled:', allFilled);
    
    if (this.checkTimelineBtn) {
        if (allFilled) {
            this.checkTimelineBtn.classList.remove('hidden');
            console.log('Check button should be visible now');
        } else {
            this.checkTimelineBtn.classList.add('hidden');
        }
    }
    
    return allFilled;
}

    checkOrder() {
    console.log('Check Order button clicked');
    
    if (!this.checkAllSlotsFilled()) {
        this.showTempMessage('Please place all memories in the timeline!', 'warning');
        return;
    }

    const isCorrect = this.isOrderCorrect();
    console.log('Order is correct:', isCorrect);
    
    if (isCorrect) {
        this.showSuccess();
        // Show completion button immediately when order is correct
        this.showCompletionButton();
    } else {
        this.showIncorrectFeedback();
        // Keep check button visible so user can try again
        if (this.checkTimelineBtn) {
            this.checkTimelineBtn.classList.remove('hidden');
        }
    }
}

    isOrderCorrect() {
        return JSON.stringify(this.userOrder) === JSON.stringify(this.correctOrder);
    }

    showSuccess() {
        // Visual success feedback
        this.timelineSlots.forEach(slot => {
            slot.classList.add('correct');
        });
        
        this.showTempMessage('🎉 Perfect! You got the timeline right!', 'success');
        
        // Celebrate with confetti
        this.triggerConfetti();
    }
showIncorrectFeedback() {
    // Visual feedback for incorrect order
    this.timelineSlots.forEach(slot => {
        slot.classList.add('incorrect');
    });
    
    this.showTempMessage('Not quite right. Try rearranging the memories!', 'warning');
    
    // Remove incorrect class after a delay but KEEP the check button visible
    setTimeout(() => {
        this.timelineSlots.forEach(slot => {
            slot.classList.remove('incorrect');
        });
    }, 2000);
    
    // DO NOT hide the check button - let user try again
}

   showCompletionButton() {
    console.log('Showing completion button');
    if (this.completeTimelineBtn) {
        this.completeTimelineBtn.classList.remove('hidden');
        if (this.checkTimelineBtn) {
            this.checkTimelineBtn.classList.add('hidden');
        }
        console.log('Completion button should be visible now');
    } else {
        console.error('Complete timeline button element not found!');
    }
}

 completePuzzle() {
    console.log('Complete button clicked. Current order:', this.userOrder, 'Correct order:', this.correctOrder);
    
    // First check if all slots are filled
    if (!this.checkAllSlotsFilled()) {
        this.showTempMessage('Please place all memories in the timeline first!', 'warning');
        return;
    }

    // Then check if the order is correct
    if (!this.isOrderCorrect()) {
        this.showTempMessage('The order is not correct yet. Use "Check Order" first!', 'warning');
        return;
    }

    console.log('Puzzle completed successfully!');
    
    // Final celebration
    this.celebrateCompletion();
    
    setTimeout(() => {
        if (window.puzzleManager) {
            completePuzzle(3); // Puzzle ID 3 for Timeline
        }
    }, 2000);
}

    celebrateCompletion() {
        if (typeof window.puzzleManager !== 'undefined') {
            window.puzzleManager.triggerCelebration();
        }
        
        this.showTempMessage('🌟 Timeline Complete! You perfectly arranged our memories!', 'success');
    }

    triggerConfetti() {
        // Use the same confetti system as other puzzles
        if (typeof window.puzzleManager !== 'undefined') {
            window.puzzleManager.triggerCelebration();
        } else {
            this.displayConfettiGif();
        }
    }

    displayConfettiGif() {
        const puzzleContainer = document.querySelector('.puzzle-container.active');
        const containerRect = puzzleContainer.getBoundingClientRect();
        
        const pieceCount = 8;
        
        for (let i = 0; i < pieceCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(containerRect);
            }, i * 150);
        }
    }

    createConfettiPiece(containerRect) {
        const confettiGif = document.createElement('img');
        confettiGif.src = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWVmZHQxaXYzMHNzdzY2Nnc0a2R3Y3M5M3Z6bjZ0ZWxza3YzYnN2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9u2VQAwIgpMZKT6qTV/giphy.gif';
        
        const size = Math.random() * 80 + 100;
        const startLeft = Math.random() * (containerRect.width - size);
        
        confettiGif.style.cssText = `
            position: absolute;
            top: -${size}px;
            left: ${startLeft}px;
            width: ${size}px;
            height: ${size}px;
            z-index: 9998;
            pointer-events: none;
            border-radius: 12px;
            animation: fallInContainer 3s ease-in forwards;
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4));
            transform: scale(1.2);
        `;

        const puzzleContainer = document.querySelector('.puzzle-container.active');
        puzzleContainer.style.position = 'relative';
        puzzleContainer.appendChild(confettiGif);

        setTimeout(() => {
            confettiGif.style.opacity = '0';
            confettiGif.style.transition = 'opacity 0.7s ease';
            setTimeout(() => {
                if (confettiGif.parentNode) {
                    confettiGif.parentNode.removeChild(confettiGif);
                }
            }, 700);
        }, 3000);
    }

    resetPuzzle() {
        // Clear all slots
        this.timelineSlots.forEach(slot => {
            const slotContent = slot.querySelector('.slot-content');
            slotContent.innerHTML = '';
            slotContent.classList.remove('has-item');
            slot.classList.remove('correct', 'incorrect', 'filled');
        });
        
        // Reset user order
        this.userOrder = [];
        
        // Re-render memory items
        this.renderMemoryItems();
        
        // Hide completion button
        if (this.completeTimelineBtn) {
            this.completeTimelineBtn.classList.add('hidden');
        }
        if (this.checkTimelineBtn) {
            this.checkTimelineBtn.classList.add('hidden');
        }
        
        this.showTempMessage('Timeline reset! Try again!', 'info');
    }

    showTempMessage(message, type = 'info') {
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

// Initialize Timeline Puzzle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.getElementById('timelinePuzzle');
    if (timelineContainer) {
        const timelinePuzzle = new TimelinePuzzle();
        console.log('📅 Timeline Puzzle initialized!');
    }
});

// Add CSS for timeline animations
const timelineStyle = document.createElement('style');
timelineStyle.textContent = `
    @keyframes fallInContainer {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(500px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .timeline-slot.drag-over {
        background: rgba(255, 235, 59, 0.2);
        border: 2px dashed #ffeb3b;
    }
    
    .timeline-slot.correct .slot-content {
        border-color: #4CAF50;
        background: #f0fff0;
    }
    
    .timeline-slot.incorrect .slot-content {
        border-color: #ff4444;
        background: #fff0f0;
        animation: shake 0.5s ease-in-out;
    }
    
    .timeline-slot.filled .slot-number {
        background: #4CAF50;
    }
    
    .memory-item.dragging {
        opacity: 0.6;
        transform: scale(0.95);
        cursor: grabbing;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .slot-content.has-item {
        border-color: #4dabf7;
        background: #f0f8ff;
    }
`;
document.head.appendChild(timelineStyle);