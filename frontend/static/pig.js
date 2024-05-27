'use strict';

const resetSession = () => {
    fetch('/reset')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '/';
        }
    });
};
