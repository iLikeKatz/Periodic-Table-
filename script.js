document.addEventListener('DOMContentLoaded', () => {

    // --- DATA: Periodic Table Elements ---
    const elements = [
        { number: 1, symbol: 'H', name: 'ไฮโดรเจน', mass: 1.008, x: 1, y: 1 },
        { number: 2, symbol: 'He', name: 'ฮีเลียม', mass: 4.0026, x: 18, y: 1 },
        { number: 3, symbol: 'Li', name: 'ลิเทียม', mass: 6.94, x: 1, y: 2 },
        { number: 4, symbol: 'Be', name: 'เบริลเลียม', mass: 9.0122, x: 2, y: 2 },
        { number: 5, symbol: 'B', name: 'โบรอน', mass: 10.81, x: 13, y: 2 },
        { number: 6, symbol: 'C', name: 'คาร์บอน', mass: 12.011, x: 14, y: 2 },
        { number: 7, symbol: 'N', name: 'ไนโตรเจน', mass: 14.007, x: 15, y: 2 },
        { number: 8, symbol: 'O', name: 'ออกซิเจน', mass: 15.999, x: 16, y: 2 },
        { number: 9, symbol: 'F', name: 'ฟลูออรีน', mass: 18.998, x: 17, y: 2 },
        { number: 10, symbol: 'Ne', name: 'นีออน', mass: 20.180, x: 18, y: 2 },
        { number: 11, symbol: 'Na', name: 'โซเดียม', mass: 22.990, x: 1, y: 3 },
        { number: 12, symbol: 'Mg', name: 'แมกนีเซียม', mass: 24.305, x: 2, y: 3 },
        { number: 13, symbol: 'Al', name: 'อะลูมิเนียม', mass: 26.982, x: 13, y: 3 },
        { number: 14, symbol: 'Si', name: 'ซิลิคอน', mass: 28.085, x: 14, y: 3 },
        { number: 15, symbol: 'P', name: 'ฟอสฟอรัส', mass: 30.974, x: 15, y: 3 },
        { number: 16, symbol: 'S', name: 'กำมะถัน', mass: 32.06, x: 16, y: 3 },
        { number: 17, symbol: 'Cl', name: 'คลอรีน', mass: 35.45, x: 17, y: 3 },
        { number: 18, symbol: 'Ar', name: 'อาร์กอน', mass: 39.948, x: 18, y: 3 },
        { number: 19, symbol: 'K', name: 'โพแทสเซียม', mass: 39.098, x: 1, y: 4 },
        { number: 20, symbol: 'Ca', name: 'แคลเซียม', mass: 40.078, x: 2, y: 4 },
        // ... สามารถเพิ่มธาตุอื่นๆ ต่อได้ตาม format นี้
        // { number: 21, symbol: 'Sc', name: 'สแกนเดียม', mass: 44.956, x: 3, y: 4 },
    ];

    // --- DOM Element References ---
    const periodicTable = document.getElementById('periodic-table');
    const selectionScreen = document.getElementById('selection-screen');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');
    const flashcard = document.getElementById('flashcard');
    const cardFront = document.getElementById('card-front');
    const cardBack = document.getElementById('card-back');
    const flipCardBtn = document.getElementById('flip-card-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const backToSelectionBtn = document.getElementById('back-to-selection-btn');

    let selectedElements = [];
    let currentCardIndex = 0;

    // --- Phase 1: Create and Display the Periodic Table ---
    function createPeriodicTable() {
        elements.forEach(el => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.style.gridColumnStart = el.x;
            elementDiv.style.gridRowStart = el.y;
            elementDiv.dataset.number = el.number;
            elementDiv.innerHTML = `
                <div class="atomic-number">${el.number}</div>
                <div class="symbol">${el.symbol}</div>
                <div class="name">${el.name}</div>
            `;
            elementDiv.addEventListener('click', () => {
                elementDiv.classList.toggle('selected');
            });
            periodicTable.appendChild(elementDiv);
        });
    }

    // --- Phase 2: Game Logic ---

    function startGame() {
        const selectedDivs = document.querySelectorAll('.element.selected');
        if (selectedDivs.length === 0) {
            alert('กรุณาเลือกธาตุอย่างน้อย 1 ธาตุเพื่อเริ่มเกม!');
            return;
        }

        selectedElements = Array.from(selectedDivs).map(div => {
            const elementNumber = parseInt(div.dataset.number);
            return elements.find(el => el.number === elementNumber);
        });

        // Shuffle the selected elements using Fisher-Yates algorithm
        for (let i = selectedElements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selectedElements[i], selectedElements[j]] = [selectedElements[j], selectedElements[i]];
        }

        currentCardIndex = 0;
        selectionScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        displayCard();
    }

    function displayCard() {
        if (currentCardIndex >= selectedElements.length) {
            // Game Over
            cardFront.innerHTML = `<div class="card-front-symbol">🎉</div>`;
            cardBack.innerHTML = `<h2>จบเกมแล้ว!</h2><p>คุณทบทวนครบ ${selectedElements.length} ธาตุ</p>`;
            nextCardBtn.disabled = true;
            return;
        }

        const currentElement = selectedElements[currentCardIndex];
        flashcard.classList.remove('flipped'); // Reset card to front
        nextCardBtn.disabled = false;

        // Populate front of the card
        cardFront.innerHTML = `<div class="card-front-symbol">${currentElement.symbol}</div>`;

        // Populate back of the card
        cardBack.innerHTML = `
            <h2>${currentElement.name} (${currentElement.symbol})</h2>
            <p><strong>เลขอะตอม:</strong> ${currentElement.number}</p>
            <p><strong>มวลอะตอม:</strong> ${currentElement.mass}</p>
        `;
    }

    function flipCard() {
        flashcard.classList.toggle('flipped');
    }

    function nextCard() {
        currentCardIndex++;
        displayCard();
    }

    function backToSelection() {
        gameScreen.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', startGame);
    flipCardBtn.addEventListener('click', flipCard);
    nextCardBtn.addEventListener('click', nextCard);
    backToSelectionBtn.addEventListener('click', backToSelection);

    selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.element').forEach(el => el.classList.add('selected'));
    });

    deselectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.element').forEach(el => el.classList.remove('selected'));
    });

    // --- Initial Call ---
    createPeriodicTable();
});