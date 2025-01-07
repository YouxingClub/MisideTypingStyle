// function showText(inputText) {
//     textBox.innerHTML = ''; // 清空已有文字

//     // 创建隐藏文字容器，用于测量宽度
//     hiddenTextContainer = document.createElement('div');
//     hiddenTextContainer.className = 'hidden-text';
//     hiddenTextContainer.textContent = inputText;
//     textBox.appendChild(hiddenTextContainer);

//     // 创建可见文字容器，用于逐字显示
//     visibleTextContainer = document.createElement('div');
//     visibleTextContainer.className = 'visible-text';
//     textBox.appendChild(visibleTextContainer);
//     textBox.style.visibility = 'visible'; // 显示文字容器

//     const totalWidth = hiddenTextContainer.offsetWidth;
//     startTypingAnimation(inputText, totalWidth);
// }

// function startTypingAnimation(inputText, totalWidth) {
//     const letters = Array.from(inputText);
//     visibleTextContainer.style.width = '0px'; // 初始宽度为 0
//     let currentWidth = 0;

//     letters.forEach((letter, index) => {
//         setTimeout(() => {
//             // 添加新字符到可见容器
//             const span = document.createElement('span');
//             span.textContent = letter;
//             visibleTextContainer.appendChild(span);
//             hiddenTextContainer = document.getElementsByClassName('hidden-text');

//             // 更新容器宽度
//             console.log(hiddenTextContainer.children);
//             currentWidth += hiddenTextContainer.children[index]?.offsetWidth || 0;
//             console.log(currentWidth);
//             visibleTextContainer.style.width = `${currentWidth}px`;

//             // 添加弹跳效果
//             span.style.animationDelay = `${index * 0.1}s`;
//         }, index * 100);
//     });

//     // 全部显示完成后启动掉落动画
//     // setTimeout(() => startFalling(inputText), letters.length * 100 + 1000);
// }


function startFalling() {
    const letters = Array.from(textBox.children);
    let fallenCount = 0;
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const rect = letter.getBoundingClientRect(); // 获取文字的绝对位置

        const paper = document.createElement('span');
        paper.style.color = '#66CCFF';
        paper.textContent = letter.textContent;
        paper.classList.add('paper');

        // 设置掉落文字的初始位置，与原文字位置一致
        paper.style.left = `${rect.left}px`;
        paper.style.top = `${rect.top}px`;
        paper.style.width = `${rect.width}px`;
        paper.style.height = `${rect.height}px`;
        paper.style.lineHeight = `${rect.height}px`;
        paper.style.animationDelay = `${Math.random() * 2}s`; // 随机掉落时间

        // 监听动画结束事件
        paper.addEventListener('animationend', () => {
            paper.remove(); // 移除掉落的字母
            fallenCount++;

            // 所有文字都掉落后清空 text-box
            if (text != undefined && text != null && fallenCount === text.length) {
                textBox.innerHTML = ''; // 清空文字占用空间
            }
        });

        document.body.appendChild(paper); // 将掉落文字添加到 body
        letter.style.visibility = 'hidden'; // 隐藏原始文字
    }
}

const textBox = document.getElementById('text-box');

const TextAnimator = {
    hiddenTextContainer: null,
    visibleTextContainer: null,

    init(textBox) {
        this.textBox = textBox;
    },

    showText(inputText) {
        this.textBox.innerHTML = '';

        // 创建隐藏文字容器，用于测量宽度
        this.hiddenTextContainer = document.createElement('div');
        this.hiddenTextContainer.className = 'hidden-text';
        // this.hiddenTextContainer.textContent = inputText;
        this.hiddenTextContainer.innerHTML = '';
        for (const letter of inputText) {
            const span = document.createElement('span');
            span.textContent = letter;
            this.hiddenTextContainer.appendChild(span);
        }
        this.textBox.appendChild(this.hiddenTextContainer);

        // 创建可见文字容器，用于逐字显示
        this.visibleTextContainer = document.createElement('div');
        this.visibleTextContainer.className = 'visible-text';
        this.textBox.appendChild(this.visibleTextContainer);
        this.textBox.style.visibility = 'visible'; // 显示文字容器

        const totalWidth = this.hiddenTextContainer.offsetWidth;
        const hiddenRect = this.hiddenTextContainer.getBoundingClientRect();
        console.log(hiddenRect);
        this.visibleTextContainer.style.left = hiddenRect.x;
        this.visibleTextContainer.style.top = hiddenRect.y;
        this.startTypingAnimation(inputText, totalWidth);
    },

    startTypingAnimation(inputText) {
        const letters = Array.from(inputText);
        // this.visibleTextContainer.style.width = '0px'; // 初始宽度为 0
        // let currentWidth = 0;
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                // 添加新字符到可见容器
                const span = document.createElement('span');
                span.textContent = letter;
                this.visibleTextContainer.appendChild(span);
    
                // 更新容器宽度
                // currentWidth += this.hiddenTextContainer.children[index]?.offsetWidth || 0;
                // this.visibleTextContainer.style.width = `${currentWidth}px`;
    
                // 添加弹跳效果
                // span.style.animationDelay = `${index * 0.1}s`;
            }, index * 100);
        });

        this.hiddenTextContainer.remove();
    
        // 全部显示完成后启动掉落动画
        setTimeout(() => this.startJumpAndFall(), inputText.length * 100 + 1000);
    },

    startJumping() {
        const letters = Array.from(this.visibleTextContainer.children);

        letters.forEach((letter, index) => {
            // 添加跳跃动画
            letter.style.animation = `jump 0.5s ease forwards`;
            letter.style.animationDelay = `${index * 0.1}s`;

            letter.addEventListener('animationend', (event) => {
                if (event.animationName === 'jump') {
                    // 跳跃完成后开始掉落动画
                    this.startFalling();
                }
            });
        });
    },

    startFalling() {
        const letters = Array.from(this.visibleTextContainer.children);
        let fallenCount = 0;
        letters.forEach((letter, index) => {
            // 添加掉落动画
            letter.style.animation = `fall 2s forwards`;
            letter.style.animationDelay = `${index * 0.1}s`;

            letter.addEventListener('animationend', () => {
                fallenCount++;
                if (fallenCount === letters.length) {
                    // 清除内容
                    this.textBox.innerHTML = '';
                }
            });
        });
    },

    startJumpAndFall() {
        const letters = Array.from(this.visibleTextContainer.children);

        letters.forEach((letter, index) => {
            const randomAngle = Math.floor(Math.random() * 60) - 30;
            letter.style.setProperty('--random-angle', randomAngle);
            // 添加跳跃+掉落动画
            letter.style.animation = `jumpAndFall 1s ease forwards`;
            letter.style.animationDelay = `${index * 0.1}s`;
            

            // 在动画结束后移除元素
            letter.addEventListener('animationend', () => {
                letter.remove();
                // 检查是否是最后一个字母
                if (!this.visibleTextContainer.children.length) {
                    this.visibleTextContainer.remove();
                    this.visibleTextContainer = null;
                }
            });
        });
    },
}

TextAnimator.init(textBox);
const wsUrl = "ws://localhost:4005/ws"; // 替换为你的 WebSocket 服务器地址

let index = 0;
let fallingLetters = [];

// 初始化 WebSocket
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
    console.log("WebSocket 已连接");
};

ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data); // 假设接收到的是 JSON 数据
        console.log("收到数据：", data);
        if (data.action == "message_data") {
            TextAnimator.showText(data.data.messages[0].message[0].text);
        }
    } catch (error) {
        console.error("JSON 解析错误", error);
    }
};

ws.onclose = () => {
    console.log("WebSocket 已关闭");
};