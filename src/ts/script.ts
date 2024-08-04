
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

function synchronizeTextAndSlider(sliderId: string, textboxId: string) {
    const slider = document.getElementById(sliderId) as HTMLInputElement;
    const textbox = document.getElementById(textboxId) as HTMLInputElement;
    textbox.value = slider.value
    
    slider.addEventListener('input', () => {
        textbox.value = slider.value;
    });

    textbox.addEventListener('input', () => {
        slider.value = textbox.value;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const pairs = [
        { sliderId: 'angle1-slider', textboxId: 'angle1-number' },
        { sliderId: 'velocity1-slider', textboxId: 'velocity1-number' },
        { sliderId: 'length1-slider', textboxId: 'length1-number' },
        { sliderId: 'mass1-slider', textboxId: 'mass1-number' },
        { sliderId: 'angle2-slider', textboxId: 'angle2-number' },
        { sliderId: 'velocity2-slider', textboxId: 'velocity2-number' },
        { sliderId: 'length2-slider', textboxId: 'length2-number' },
        { sliderId: 'mass2-slider', textboxId: 'mass2-number' },
        { sliderId: 'time-rate-slider', textboxId: 'time-rate-number' }
    ];

    pairs.forEach(({ sliderId, textboxId }) => synchronizeTextAndSlider(sliderId, textboxId));

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
