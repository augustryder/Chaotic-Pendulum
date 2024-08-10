import { Chart, ChartItem } from 'chart.js/auto';

let phasePortraitChart: Chart;

export function setupPhasePortrait() {
    const canvas = document.getElementById('phase-portrait');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas as ChartItem;
    if (!ctx) {
        console.error('Failed to get 2D context');
        return;
    }

    try {
        phasePortraitChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Phase Portrait',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    showLine: true
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Angle 1'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Angle 2'
                        }
                    }
                }
            }
        });
        console.log('Phase portrait chart setup complete');
    } catch (error) {
        console.error('Error setting up phase portrait chart:', error);
    }
}

export function updatePhasePortrait(angle1: number, angle2: number) {
    if (!phasePortraitChart) {
        console.error('Phase portrait chart not initialized');
        return;
    }

    phasePortraitChart.data.datasets[0].data.push({ x: angle1, y: angle2 });
    phasePortraitChart.update();
}

export function resetPhasePortrait() {
    if (!phasePortraitChart) {
        console.error('Phase portrait chart not initialized');
        return;
    }

    phasePortraitChart.data.datasets[0].data = [];
    phasePortraitChart.update();
}