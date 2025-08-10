// end_game_modal.js
(function() {
    if (window.endGameModalLoaded) return;
    window.endGameModalLoaded = true;

    // 1. โหลด CSS ของ Modal เข้าไปในหน้าเว็บอัตโนมัติ
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'modal.css';
    document.head.appendChild(link);

    // 2. สร้างโครงสร้าง HTML ของ Modal และเพิ่มเข้าไปในหน้าเว็บ
    const modalHTML = `
        <div id="end-game-modal" class="modal-overlay">
          <div class="modal-content">
            <h2>สรุปผลการแข่งขัน</h2>
            <table>
              <thead>
                <tr>
                  <th>อันดับ</th>
                  <th>ชื่อผู้เล่น</th>
                  <th>Progress</th>
                  <th>เวลา</th>
                </tr>
              </thead>
              <tbody id="end-game-body">
                </tbody>
            </table>
            <button id="modal-exit-btn">ออกจากห้อง</button>
          </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. ฟังก์ชันสำหรับแปลง Milliseconds เป็นรูปแบบ mm:ss.ms
    const formatTime = (ms) => {
        if (typeof ms !== 'number') return '-';
        const totalSeconds = ms / 1000;
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        const milliseconds = (ms % 1000).toString().padStart(3, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    };

    // 4. ทำให้ฟังก์ชันแสดงผลเป็นแบบ Global เพื่อให้ไฟล์อื่นเรียกใช้ได้
    window.showEndGameResults = (playersArray) => {
        const tableBody = document.getElementById('end-game-body');
        const modal = document.getElementById('end-game-modal');
        if (!tableBody || !modal) return;
        
        tableBody.innerHTML = '';
        playersArray.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.username || 'ผู้เล่นนิรนาม'}</td>
                <td>${player.progress || 0}%</td>
                <td>${formatTime(player.timeMs)}</td>
            `;
            tableBody.appendChild(row);
        });
        
        modal.classList.add('visible');
    };

    // 5. จัดการปุ่มออกจากห้อง
    const exitBtn = document.getElementById('modal-exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            // ไปยังหน้าแรก ไม่ต้องลบข้อมูลผู้เล่นออกจากห้อง
            // เพื่อให้คนที่ยังอยู่สามารถเห็นผลการแข่งขันได้
            window.location.href = 'index.html';
        });
    }

})();