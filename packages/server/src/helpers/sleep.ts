const sleep = (secondsToSleep: number) => {
    return new Promise((resolve, _) => {
        setTimeout(() => {
            resolve(1)
        }, 1000 * secondsToSleep)
    })
}

export default sleep
