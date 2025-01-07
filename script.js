const textBox = document.getElementById('text-box');

const TextAnimator = {
    hiddenTextContainer: null,
    visibleTextContainer: null,
    animationQueue: [], // 消息队列
    isAnimating: false, // 动画状态标志
    audio: null, // 音效对象
    printTime: 0,
    timer: null,

    init(textBox, audioSrc) {
        this.textBox = textBox;

        // 初始化音效
        if (audioSrc) {
            this.audio = new Audio(audioSrc);
        }
    },

    playSound() {
        if (this.audio) {
            this.audio.currentTime = 0; // 重置音效时间
            this.audio.play().catch((error) => {
                console.error('音效播放失败:', error);
            });
        }
    },

    showText(inputText) {
        this.printTime = 0;
        this.timer = setInterval(function() {
            this.printTime++;
        }, 1000);
        if (this.isAnimating) {
            // 如果正在动画中，将新消息加入队列
            this.animationQueue.push(inputText);
            return;
        }
        this.textBox.innerHTML = '';
        this.isAnimating = true; // 标记动画开始

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
                this.playSound();
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
        clearInterval(this.timer);
        // 全部显示完成后启动掉落动画
        setTimeout(() => this.startJumpAndFall(), (inputText.length * 1000 * 0.15 - this.printTime) < 3000 ? 3000 : (inputText.length * 1000 * 0.15 - this.printTime));
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

                    // 标记动画结束，并检查队列
                    this.isAnimating = false;
                    if (this.animationQueue.length > 0) {
                        // 处理队列中的下一条消息
                        const nextMessage = this.animationQueue.shift();
                        this.showText(nextMessage);
                    }
                }
            });
        });
    },
}

TextAnimator.init(textBox, "sounds/type.ogg");
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