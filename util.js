// Example util.js
module.exports.doSomeHeavyTask = () => {
    return new Promise((resolve) => {
        const start = Date.now();
        // Simulate heavy task
        setTimeout(() => {
            const end = Date.now();
            resolve(end - start);
        }, 2000); // simulate 2 seconds task
    });
};
