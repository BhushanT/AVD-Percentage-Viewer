function parseTime(timeStr) {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return { minutes, seconds };
}

function timeToSeconds({ minutes, seconds }) {
    if (isNaN(minutes) || isNaN(seconds)) {
        throw new Error("Non-numeric values encountered in time.");
    }
    return minutes * 60 + seconds;
}

function calcAVD(viewDuration, totalDuration) {
    try {
        const avdSeconds = timeToSeconds(parseTime(viewDuration));
        const totalSeconds = timeToSeconds(parseTime(totalDuration));
        
        if (totalSeconds === 0) throw new Error("Total duration is zero. Cannot calculate AVD.");
        
        return (avdSeconds / totalSeconds).toFixed(3);
    } catch (error) {
        console.error(error.message);
        return 0;
    }
}


function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

waitForElement('#AVERAGE_WATCH_TIME-tab', (element) => {
    const regex = /[^0-9:]/g;
    let raw_avd = (element.textContent || element.innerText).replace(regex, '').trim();

    waitForElement('.label.style-scope.ytcp-thumbnail', (element) => {
        let total_duration = element.textContent.trim() || element.innerText.trim();
        let avd = calcAVD(raw_avd, total_duration);
        
        const avd_formatted = (avd * 100) + "%";
        
        const badge = document.createElement("p");
        badge.classList.add("style-scope", "yta-key-metric-block");
        badge.textContent = avd_formatted;
        
        const parentElement = document.getElementById("AVERAGE_WATCH_TIME-tab");
        if (parentElement) {
            parentElement.appendChild(badge);
        } else {
            console.error("Parent element to append the badge is not found.");
        }
    });
});
