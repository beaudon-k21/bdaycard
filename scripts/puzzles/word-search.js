// Word Search Puzzle - Personalized Word Game
class WordSearchPuzzle {
    constructor() {
        this.words = this.getPersonalizedWords();
        this.foundWords = new Set();
        this.grid = [];
        this.gridSize = 12;
        this.selectedCells = [];
        this.isSelecting = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateGrid();
        this.updateWordList();
    }

    getPersonalizedWords() {
        // Shorter words to ensure they fit in the grid
        return [
            { word: "LOVE", found: false },
            { word: "LAUGH", found: false },
            { word: "FUN", found: false },
            { word: "JOY", found: false },
            { word: "HUG", found: false },
            { word: "KISS", found: false },
            { word: "DATE", found: false },
            { word: "TIME", found: false }
        ];
    }

    initializeElements() {
        this.gridElement = document.getElementById('wordsearchGrid');
        this.wordListElement = document.querySelector('.word-list');
        this.wordsFoundElement = document.getElementById('wordsFound');
        this.checkProgressBtn = document.getElementById('checkWordSearch');
        this.completeWordSearchBtn = document.getElementById('completeWordSearch');
        this.resetBtn = document.getElementById('resetWordSearch');
        this.hintBtn = document.getElementById('hintButton');
    }

    setupEventListeners() {
        if (this.checkProgressBtn) {
            this.checkProgressBtn.addEventListener('click', () => this.checkProgress());
        }
        if (this.completeWordSearchBtn) {
            this.completeWordSearchBtn.addEventListener('click', () => this.completePuzzle());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetPuzzle());
        }
        if (this.hintBtn) {
            this.hintBtn.addEventListener('click', () => this.provideHint());
        }
    }

    generateGrid() {
        let gridGenerated = false;
        let attempts = 0;
        
        // Keep trying to generate a grid that accommodates all words
        while (!gridGenerated && attempts < 50) {
            attempts++;
            this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
            
            if (this.placeWords()) {
                gridGenerated = true;
                this.fillEmptySpaces();
                this.renderGrid();
            }
        }
        
        if (!gridGenerated) {
            console.error('Failed to generate grid after 50 attempts');
            // Fallback: Create a simple grid
            this.createFallbackGrid();
        }
    }

    findWordPosition(word) {
    const directions = [
        { x: 1, y: 0 },   // Horizontal
        { x: 0, y: 1 },   // Vertical
        { x: 1, y: 1 },   // Diagonal down-right
        { x: 1, y: -1 }   // Diagonal up-right
    ];
    
    for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
            for (let direction of directions) {
                if (this.checkWordAtPosition(word, x, y, direction)) {
                    return { startX: x, startY: y, direction: direction, word: word };
                }
            }
        }
    }
    return null;
}

checkWordAtPosition(word, startX, startY, direction) {
    let x = startX;
    let y = startY;
    
    // Check if word fits in this position and direction
    for (let i = 0; i < word.length; i++) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return false;
        }
        if (this.grid[y][x] !== word[i]) {
            return false;
        }
        x += direction.x;
        y += direction.y;
    }
    return true;
}

    placeWords() {
        const directions = [
            { x: 1, y: 0 },   // Horizontal
            { x: 0, y: 1 },   // Vertical
            { x: 1, y: 1 },   // Diagonal down-right
            { x: 1, y: -1 }   // Diagonal up-right
        ];

        let allPlaced = true;

        for (let wordObj of this.words) {
            let placed = false;
            let attempts = 0;
            const word = wordObj.word;
            
            while (!placed && attempts < 100) {
                attempts++;
                
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startX = Math.floor(Math.random() * this.gridSize);
                const startY = Math.floor(Math.random() * this.gridSize);
                
                if (this.canPlaceWord(word, startX, startY, direction)) {
                    this.placeWordInGrid(word, startX, startY, direction);
                    placed = true;
                }
            }
            
            if (!placed) {
                console.warn(`Could not place word: ${word}`);
                allPlaced = false;
            }
        }
        
        return allPlaced;
    }

    createFallbackGrid() {
        // Simple fallback grid with some pre-placed words
        this.grid = [
            ['L', 'O', 'V', 'E', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E'],
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
            ['F', 'U', 'N', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F'],
            ['G', 'H', 'I', 'J', 'O', 'Y', 'K', 'L', 'M', 'N', 'O', 'P'],
            ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'],
            ['L', 'A', 'U', 'G', 'H', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D'],
            ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
            ['D', 'A', 'T', 'E', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E'],
            ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
            ['H', 'U', 'G', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F'],
            ['K', 'I', 'S', 'S', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E'],
            ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']
        ];
        
        this.renderGrid();
    }

    canPlaceWord(word, startX, startY, direction) {
        let x = startX;
        let y = startY;
        
        for (let i = 0; i < word.length; i++) {
            if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
                return false;
            }
            
            if (this.grid[y][x] !== '' && this.grid[y][x] !== word[i]) {
                return false;
            }
            
            x += direction.x;
            y += direction.y;
        }
        
        return true;
    }

    placeWordInGrid(word, startX, startY, direction) {
        let x = startX;
        let y = startY;
        
        for (let i = 0; i < word.length; i++) {
            this.grid[y][x] = word[i];
            x += direction.x;
            y += direction.y;
        }
    }

    fillEmptySpaces() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x] === '') {
                    this.grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }

    renderGrid() {
        if (!this.gridElement) return;
        
        this.gridElement.innerHTML = '';
        
        // Adjust grid template for 12x12
        this.gridElement.style.gridTemplateColumns = `repeat(12, 1fr)`;
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[y][x];
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                cell.addEventListener('mousedown', (e) => this.startSelection(e, x, y));
                cell.addEventListener('mouseenter', (e) => this.extendSelection(e, x, y));
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.startSelection(e, x, y);
                });
                
                this.gridElement.appendChild(cell);
            }
        }
        
        document.addEventListener('mouseup', () => this.endSelection());
        document.addEventListener('touchend', () => this.endSelection());
    }

    startSelection(event, x, y) {
        this.isSelecting = true;
        this.selectedCells = [{ x, y }];
        this.updateSelectionUI();
    }

    extendSelection(event, x, y) {
        if (!this.isSelecting) return;
        
        const lastCell = this.selectedCells[this.selectedCells.length - 1];
        const dx = x - lastCell.x;
        const dy = y - lastCell.y;
        
        if (this.selectedCells.length === 1 || 
            (dx === this.selectedCells[1].x - this.selectedCells[0].x && 
             dy === this.selectedCells[1].y - this.selectedCells[0].y)) {
            
            if (!this.selectedCells.some(cell => cell.x === x && cell.y === y)) {
                this.selectedCells.push({ x, y });
                this.updateSelectionUI();
            }
        }
    }

    endSelection() {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        this.checkSelectedWord();
        
        setTimeout(() => {
            this.clearSelection();
        }, 1000);
    }

    updateSelectionUI() {
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        this.selectedCells.forEach(cell => {
            const cellElement = this.getCellElement(cell.x, cell.y);
            if (cellElement) {
                cellElement.classList.add('selected');
            }
        });
    }

    clearSelection() {
        this.selectedCells = [];
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
    }

    getCellElement(x, y) {
        return document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
    }

    checkSelectedWord() {
        if (this.selectedCells.length < 2) return;
        
        const selectedWord = this.selectedCells.map(cell => 
            this.grid[cell.y][cell.x]
        ).join('');
        
        this.checkWordMatch(selectedWord);
        this.checkWordMatch(selectedWord.split('').reverse().join(''));
    }

    checkWordMatch(word) {
        const matchedWordObj = this.words.find(w => 
            w.word === word && !w.found
        );
        
        if (matchedWordObj) {
            this.markWordAsFound(matchedWordObj.word);
        }
    }

    markWordAsFound(word) {
        const wordObj = this.words.find(w => w.word === word);
        if (wordObj && !wordObj.found) {
            wordObj.found = true;
            this.foundWords.add(word);
            
            // Highlight the found word in the grid (no sparkles)
            this.highlightFoundWordInGrid();
            this.updateWordList();
            this.updateProgress();
            
            // Check if all words are found
            if (this.allWordsFound()) {
                this.showCompletionButton();
            }
        }
    }

    highlightFoundWordInGrid() {
        // Permanently highlight the found word cells
        this.selectedCells.forEach(cell => {
            const cellElement = this.getCellElement(cell.x, cell.y);
            if (cellElement) {
                cellElement.classList.add('found');
                cellElement.classList.remove('selected');
            }
        });
        
        // Show success message
        const foundWord = this.selectedCells.map(cell => this.grid[cell.y][cell.x]).join('');
        this.showTempMessage(`✅ Found: ${foundWord}`, 'success');
    }

    updateWordList() {
        if (!this.wordListElement) return;
        
        this.wordListElement.innerHTML = '';
        
        this.words.forEach(wordObj => {
            const li = document.createElement('li');
            li.textContent = wordObj.word;
            li.dataset.word = wordObj.word;
            
            if (wordObj.found) {
                li.classList.add('found');
            }
            
            this.wordListElement.appendChild(li);
        });
    }

    updateProgress() {
        const foundCount = this.foundWords.size;
        const totalCount = this.words.length;
        
        if (this.wordsFoundElement) {
            this.wordsFoundElement.textContent = `${foundCount}/${totalCount}`;
        }
    }

provideHint() {
    const unfoundWords = this.words.filter(w => !w.found);
    if (unfoundWords.length === 0) return;
    
    const randomUnfoundWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    const word = randomUnfoundWord.word;
    
    // Find the actual position of the word in the grid
    const wordPosition = this.findWordPosition(word);
    
    if (wordPosition) {
        // Highlight ONLY the first letter of the actual word position
        this.highlightFirstLetterPosition(wordPosition, word);
    } else {
        // Fallback: highlight any first letter occurrence
        this.highlightFirstLetter(word[0], word);
    }
}

highlightFirstLetterPosition(wordPosition, word) {
    // Highlight ONLY the first letter (start position) - NO ZOOM
    const firstLetterX = wordPosition.startX;
    const firstLetterY = wordPosition.startY;
    
    const cellElement = this.getCellElement(firstLetterX, firstLetterY);
    if (cellElement && !cellElement.classList.contains('found')) {
        // Add highlight style WITHOUT transform/scale
        cellElement.style.backgroundColor = '#ffeb3b';
        cellElement.style.color = '#333';
        cellElement.style.fontWeight = 'bold';
        cellElement.style.border = '2px solid #ff9800';
        cellElement.style.boxShadow = '0 0 8px rgba(255, 152, 0, 0.6)';
        
        // Remove highlight after 4 seconds
        setTimeout(() => {
            if (!cellElement.classList.contains('found')) {
                cellElement.style.backgroundColor = '';
                cellElement.style.color = '';
                cellElement.style.fontWeight = '';
                cellElement.style.border = '';
                cellElement.style.boxShadow = '';
            }
        }, 4000);
        
        this.showTempMessage(`💡 Hint: Look for "${word}" - the first letter is highlighted!`, 'info');
    }
}

// Keep the fallback method but remove zoom
highlightFirstLetter(firstLetter, word) {
    let found = false;
    
    // Try to find a first letter that's not already found
    for (let y = 0; y < this.gridSize && !found; y++) {
        for (let x = 0; x < this.gridSize && !found; x++) {
            if (this.grid[y][x] === firstLetter) {
                const cellElement = this.getCellElement(x, y);
                if (cellElement && !cellElement.classList.contains('found')) {
                    // Highlight WITHOUT transform/scale
                    cellElement.style.backgroundColor = '#ffeb3b';
                    cellElement.style.color = '#333';
                    cellElement.style.fontWeight = 'bold';
                    cellElement.style.border = '2px solid #ff9800';
                    
                    setTimeout(() => {
                        if (!cellElement.classList.contains('found')) {
                            cellElement.style.backgroundColor = '';
                            cellElement.style.color = '';
                            cellElement.style.fontWeight = '';
                            cellElement.style.border = '';
                        }
                    }, 4000);
                    
                    this.showTempMessage(`💡 Hint: Look for "${word}" - a possible first letter is highlighted!`, 'info');
                    found = true;
                    break;
                }
            }
        }
    }
    
    if (!found) {
        this.showTempMessage(`💡 Hint: Look for "${word}" somewhere in the grid!`, 'info');
    }
}

provideHint() {
    console.log('Hint button clicked'); // Debug log
    
    const unfoundWords = this.words.filter(w => !w.found);
    console.log('Unfound words:', unfoundWords); // Debug log
    
    if (unfoundWords.length === 0) {
        this.showTempMessage('All words found! No hints needed.', 'info');
        return;
    }
    
    const randomUnfoundWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    const word = randomUnfoundWord.word;
    console.log('Selected word for hint:', word); // Debug log
    
    // Find the actual position of the word in the grid
    const wordPosition = this.findWordPosition(word);
    console.log('Word position found:', wordPosition); // Debug log
    
    if (wordPosition) {
        // Highlight ONLY the first letter of the actual word position
        this.highlightFirstLetterPosition(wordPosition, word);
    } else {
        console.log('Could not find word position, using fallback'); // Debug log
        // Fallback: highlight any first letter occurrence
        this.highlightFirstLetter(word[0], word);
    }
}

highlightFirstLetterPosition(wordPosition, word) {
    const firstLetterX = wordPosition.startX;
    const firstLetterY = wordPosition.startY;
    
    console.log('Highlighting first letter at:', firstLetterX, firstLetterY); // Debug log
    
    const cellElement = this.getCellElement(firstLetterX, firstLetterY);
    if (cellElement && !cellElement.classList.contains('found')) {
        console.log('Cell element found, applying highlight'); // Debug log
        
        // Add highlight style WITHOUT transform/scale
        cellElement.style.backgroundColor = '#ffeb3b';
        cellElement.style.color = '#333';
        cellElement.style.fontWeight = 'bold';
        cellElement.style.border = '2px solid #ff9800';
        cellElement.style.boxShadow = '0 0 8px rgba(255, 152, 0, 0.6)';
        
        // Remove highlight after 4 seconds
        setTimeout(() => {
            if (!cellElement.classList.contains('found')) {
                cellElement.style.backgroundColor = '';
                cellElement.style.color = '';
                cellElement.style.fontWeight = '';
                cellElement.style.border = '';
                cellElement.style.boxShadow = '';
            }
        }, 4000);
        
        this.showTempMessage(`💡 Hint: Look for "${word}" - the first letter is highlighted!`, 'info');
    } else {
        console.log('Cell element not found or already found'); // Debug log
    }
}

// Keep the fallback method for cases where we can't find the exact position
highlightFirstLetter(firstLetter, word) {
    let found = false;
    
    // Try to find a first letter that's not already found
    for (let y = 0; y < this.gridSize && !found; y++) {
        for (let x = 0; x < this.gridSize && !found; x++) {
            if (this.grid[y][x] === firstLetter) {
                const cellElement = this.getCellElement(x, y);
                if (cellElement && !cellElement.classList.contains('found')) {
                    cellElement.style.backgroundColor = '#ffeb3b';
                    cellElement.style.color = '#333';
                    cellElement.style.fontWeight = 'bold';
                    cellElement.style.transform = 'scale(1.2)';
                    
                    setTimeout(() => {
                        if (!cellElement.classList.contains('found')) {
                            cellElement.style.backgroundColor = '';
                            cellElement.style.color = '';
                            cellElement.style.fontWeight = '';
                            cellElement.style.transform = '';
                        }
                    }, 4000);
                    
                    this.showTempMessage(`💡 Hint: Look for "${word}" - a possible first letter is highlighted!`, 'info');
                    found = true;
                    break;
                }
            }
        }
    }
    
    if (!found) {
        this.showTempMessage(`💡 Hint: Look for "${word}" somewhere in the grid!`, 'info');
    }
}

checkWordAtPosition(word, startX, startY, direction) {
    let x = startX;
    let y = startY;
    
    // Check if word fits in this position and direction
    for (let i = 0; i < word.length; i++) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return false;
        }
        if (this.grid[y][x] !== word[i]) {
            return false;
        }
        x += direction.x;
        y += direction.y;
    }
    return true;
}

highlightWordHint(wordPosition, word) {
    let x = wordPosition.startX;
    let y = wordPosition.startY;
    
    // Highlight each letter of the word
    for (let i = 0; i < word.length; i++) {
        const cellElement = this.getCellElement(x, y);
        if (cellElement) {
            cellElement.style.backgroundColor = '#ffeb3b';
            cellElement.style.color = '#333';
            cellElement.style.fontWeight = 'bold';
            cellElement.style.transform = 'scale(1.1)';
            
            // Remove highlight after 4 seconds
            setTimeout(() => {
                if (!cellElement.classList.contains('found')) {
                    cellElement.style.backgroundColor = '';
                    cellElement.style.color = '';
                    cellElement.style.fontWeight = '';
                    cellElement.style.transform = '';
                }
            }, 4000);
        }
        
        x += wordPosition.direction.x;
        y += wordPosition.direction.y;
    }
    
    this.showTempMessage(`💡 Hint: "${word}" is highlighted! Look carefully!`, 'info');
}
    checkProgress() {
        const foundCount = this.foundWords.size;
        const totalCount = this.words.length;
        
        if (foundCount === totalCount) {
            this.showTempMessage('🎉 Amazing! You found all the words!', 'success');
            this.showCompletionButton();
        } else {
            this.showTempMessage(`You've found ${foundCount} out of ${totalCount} words. Keep going!`, 'info');
        }
    }

    allWordsFound() {
        return this.foundWords.size === this.words.length;
    }

    showCompletionButton() {
        if (this.completeWordSearchBtn) {
            this.completeWordSearchBtn.classList.remove('hidden');
            this.checkProgressBtn.classList.add('hidden');
        }
    }

   completePuzzle() {
    if (!this.allWordsFound()) {
        this.showTempMessage('Find all words first!', 'warning');
        return;
    }

    this.triggerConfetti();
    
    // Auto-progress after celebration
    setTimeout(() => {
        if (window.puzzleManager) {
            completePuzzle(2);
            // Auto-move to next puzzle
            setTimeout(() => {
                window.puzzleManager.nextPuzzle();
            }, 1000);
        }
    }, 2000);
}

    triggerConfetti() {
        // Use the same confetti system as memory puzzle
        if (typeof window.puzzleManager !== 'undefined') {
            window.puzzleManager.triggerCelebration();
        } else {
            this.displayConfettiGif();
        }
    }

    displayConfettiGif() {
        const puzzleContainer = document.querySelector('.puzzle-container.active') || document.querySelector('.puzzle-main');
        const containerRect = puzzleContainer.getBoundingClientRect();
        
        // Create very large, highly visible pieces (same as memory puzzle)
        const pieceCount = 8;
        
        for (let i = 0; i < pieceCount; i++) {
            setTimeout(() => {
                this.createContainerConfettiPiece(containerRect);
            }, i * 150);
        }
    }

    createContainerConfettiPiece(containerRect) {
        const confettiGif = document.createElement('img');
        confettiGif.src = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWVmZHQxaXYzMHNzdzY2Nnc0a2R3Y3M5M3Z6njZ0ZWxza3YzYnN2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9u2VQAwIgpMZKT6qTV/giphy.gif';
        
        const size = Math.random() * 80 + 100; // 100-180px
        
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

        const puzzleContainer = document.querySelector('.puzzle-container.active') || document.querySelector('.puzzle-main');
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
        this.foundWords.clear();
        this.words.forEach(word => word.found = false);
        this.generateGrid();
        this.updateWordList();
        this.updateProgress();
        
        if (this.completeWordSearchBtn) {
            this.completeWordSearchBtn.classList.add('hidden');
        }
        if (this.checkProgressBtn) {
            this.checkProgressBtn.classList.remove('hidden');
        }
        
        // Clear any found cell highlights
        document.querySelectorAll('.grid-cell.found').forEach(cell => {
            cell.classList.remove('found');
        });
        
        this.showTempMessage('Word search reset! Try again!', 'info');
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

// Initialize Word Search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const wordSearchContainer = document.getElementById('wordSearchPuzzle');
    if (wordSearchContainer) {
        const wordSearchPuzzle = new WordSearchPuzzle();
        console.log('🔍 Word Search Puzzle initialized!');
    }
});

// Add CSS for animations
const wordSearchStyle = document.createElement('style');
wordSearchStyle.textContent = `
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
    
    .grid-cell.selected {
        background: #ffeb3b !important;
        color: #333 !important;
        transform: scale(1.1);
        transition: all 0.2s ease;
    }
    
    .grid-cell.found {
        background: #4CAF50 !important;
        color: white !important;
        font-weight: bold;
    }
    
    /* Adjust grid for 12x12 */
    .wordsearch-grid {
        grid-template-columns: repeat(12, 1fr) !important;
    }
    
    .grid-cell {
        font-size: 0.9rem !important;
    }
    
    @media (max-width: 768px) {
        .grid-cell {
            font-size: 0.8rem !important;
        }
    }
`;
document.head.appendChild(wordSearchStyle);

