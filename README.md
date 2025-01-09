# 仿米塔无声系打字特效前端

本项目为纯前端项目，不存在任何库调用和第三方代码。

实现效果模仿米塔的Unity实现，还原80%以上

本项目API基于Echo-Live实现，后端打字部分可使用Echo-Live或自行参照实现Websocket Server

## 运行

1. 开启websocket服务端
2. 检查`script.js`第`2`行：`const wsUrl = "ws://localhost:4005/ws";`的websocket地址是否正确
3. 在需要的地方打开`index.html`

## Websocket格式
> 可参照Echo-Live项目文档
~~~json
{
    "data": {
        "action": "message_data",
        "data": {
            "messages": [
                {
                    "message": [
                        {
                            "text": "你好，我是米塔"
                        }
                    ]
                }
            ]
        }
    }
}
~~~

## 资源文件说明
1. 音频文件：本项目不附带音频文件，打字音频文件命名为type.ogg，放置在sounds文件夹下
> 可修改`script.js`第`180`行`TextAnimator.init(textBox, "sounds/type.ogg");`来修改文件类型和名称
2. 字体文件：本项目不附带字体文件，演示用字体为猫啃什锦黑体，放置在fonts文件夹下
> 可修改`style.css`第`4`行`url("/fonts/MaokenAssortedSans.ttf") format("ttf");`来修改字体类型和名称并应用自定义字体
