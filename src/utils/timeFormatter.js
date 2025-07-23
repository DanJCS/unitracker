// src/utils/timeFormatter.js

export const formatTimeSpent = (seconds) => {
    if (!seconds) return 'Not started';

    const hours = Math.round(seconds / 3600);

    if (hours === 0) {
        return '< 30 mins';
    }
    if (hours === 1) {
        return '~ 1 hour';
    }
    return `~ ${hours} hours`;
};