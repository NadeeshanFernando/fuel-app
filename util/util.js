export function isNumericString(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

export function awaitable(promise) {
    return promise.then(data => [data]).catch(err => [null, err]);
}