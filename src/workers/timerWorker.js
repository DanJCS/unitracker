// This worker runs the timer in a separate thread to keep it accurate even when the tab is inactive
let intervalId = null;
let seconds = 0;

self.onmessage = function(e) {
    const { command } = e.data;
    
    switch (command) {
        case 'start':
            if (!intervalId) {
                seconds = e.data.seconds || 0;
                intervalId = setInterval(() => {
                    seconds++;
                    self.postMessage({ seconds });
                }, 1000);
            }
            break;
            
        case 'pause':
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                self.postMessage({ seconds });
            }
            break;
            
        case 'reset':
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            seconds = 0;
            self.postMessage({ seconds });
            break;
            
        case 'getSeconds':
            self.postMessage({ seconds });
            break;
    }
};
