




export function waitTimeout(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

// 要求浏览器在下次重绘之前调用指定的回调函数更新动画
// 参考链接：https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame
export function waitAnimationFrame(callback?: FrameRequestCallback): Promise<void> {
    return new Promise((resolve) => {
        window.requestAnimationFrame((time) => {
            callback?.(time)
            resolve()
        })
    })
}

// 函数将在浏览器空闲时期被调用
// 参考链接：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
export function waitIdleCallback(
    callback?: (deadline?: IdleDeadline) => void,
    options?: IdleRequestOptions
): Promise<void> {
    return new Promise((resolve) => {
        requestIdleCallback((deadline) => {
            callback?.(deadline)
            resolve()
        }, options)
    })
}