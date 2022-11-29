export type ScheduledTask = () => void
export type onFlushUpdate = () => void

export type Scheduler = {
    nextTick: Promise<void>
    enqueue: (task: ScheduledTask) => void
    flush: () => void
    flushSync: () => void
    onFlush: (callback: () => void) => onFlushUpdate
}

export function createScheduler(): Scheduler {
    const queue = new Set<ScheduledTask>()
    const microtask = Promise.resolve()
    const callbacks = new Set<() => void>()
    // 兼容实现：默认使用浏览器的 window.queueMicrotask
    // 参考链接：https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide
    const queueTask = typeof queueMicrotask !== "undefined" ? queueMicrotask : microtask.then

    function enqueue(task: ScheduledTask) {
        queue.add(task)
        flush()
    }

    let flushing = false;
    function flush() {
        if (!flushing) {
            flushing = true
            queueTask(flushSync)
        }
    }

    function flushSync() {
        for (const task of queue) {
            task()
            queue.delete(task)
        }

        flushing = false
        for (const callback of callbacks) {
            callback()
        }
    }

    return {
        nextTick: microtask,
        enqueue: enqueue,
        flush: flush,
        flushSync: flushSync,
        onFlush: (callback) => {
            callbacks.add(callback)
            return () => callbacks.delete(callback)
        }
    }
}