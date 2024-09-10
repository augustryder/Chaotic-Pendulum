import { clearGraph } from "./graphs";

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.getElementById('theory-content')?.classList.add('active');
});

// tabs
document.getElementById('graph-tab')?.addEventListener('click', () => {
    document.getElementById('graph-content')?.classList.add('active');
    document.getElementById('theory-content')?.classList.remove('active');
});

document.getElementById('theory-tab')?.addEventListener('click', () => {
    document.getElementById('graph-content')?.classList.remove('active');
    document.getElementById('theory-content')?.classList.add('active');
});

// Adding event listener to the settings button
document.getElementById('settings-btn')?.addEventListener('click', () => {
    const settingsTab = document.getElementById('settings-tab');
    if (settingsTab) {
        if (settingsTab.style.display === 'none' || settingsTab.style.display === '') {
            settingsTab.style.display = 'block';
        } else {
            settingsTab.style.display = 'none';
        }
    }
});

// Clear Graph Button
document.getElementById('clear-graph-btn')?.addEventListener('click', () => {
    clearGraph();
});

// // Drag functionality for the settings tab
// const settingsTab = document.getElementById('settings-tab');
// let isDragging = false;
// let offsetX = 0;
// let offsetY = 0;

// settingsTab?.addEventListener('mousedown', (e) => {
//     isDragging = true;
//     offsetX = e.clientX - (settingsTab.getBoundingClientRect().left || 0);
//     offsetY = e.clientY - (settingsTab.getBoundingClientRect().top || 0);
// });

// document.addEventListener('mousemove', (e) => {
//     if (isDragging && settingsTab) {
//         settingsTab.style.left = `${e.clientX - offsetX}px`;
//         settingsTab.style.top = `${e.clientY - offsetY}px`;
//     }
// });

// document.addEventListener('mouseup', () => {
//     isDragging = false;
// });
