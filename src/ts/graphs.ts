import Plotly from 'plotly.js-dist';
import { Pendulum } from './Pendulum';

const xData: number[] = [];
const yData: number[] = [];
let xAxis = 'angle1';
let yAxis = 'angle2';

// Initial trace
const trace1: Plotly.Data = {
    x: xData,
    y: yData,
    type: 'scatter',
    mode: 'lines',
    line: { shape: 'spline', color: 'rgb(164, 194, 244)', width: 2, }  
};

const data: Plotly.Data[] = [trace1];
const layout: Partial<Plotly.Layout> = {
    xaxis: { title: xAxis, autorange: true},
    yaxis: { title: yAxis, autorange: true}
};

// Initial plot
Plotly.newPlot('phase-portrait', data, layout);

// Function to update the plot with new data
export function updatePlot(pendulum1: Pendulum, pendulum2: Pendulum) {
    xAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-1')).value;
    yAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-2')).value;

    let newX: number;
    let newY: number;

    switch(xAxis) {
        case 'angle1':
            newX = pendulum1.angle
          break;
        case 'velocity1':
            newX = pendulum1.angularVelocity
          break;
        case 'angle2':
            newX = pendulum2.angle
          break;
        case 'velocity2':
            newX = pendulum2.angularVelocity
          break;
        default:
            newX = 0
    }

    switch(yAxis) {
        case 'angle1':
            newY = pendulum1.angle
          break;
        case 'velocity1':
            newY = pendulum1.angularVelocity
          break;
        case 'angle2':
            newY = pendulum2.angle
          break;
        case 'velocity2':
            newY = pendulum2.angularVelocity
          break;
        default:
            newY = 0
    }

    if (xData.length > 0 && yData.length > 0) {
        const lastX = xData[0];
        const lastY = yData[0];
        Plotly.extendTraces('phase-portrait', {
            x: [[lastX, newX]],
            y: [[lastY, newY]]
        }, [0]);
    }
    xData[0] = newX;
    yData[0] = newY;
}

export function clearGraph() {
    xAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-1')).value;
    yAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-2')).value;
    
    Plotly.newPlot('phase-portrait', [{
        x: xData,
        y: yData,
        type: 'scatter',
        mode: 'lines',
        line: { shape: 'spline', color: 'rgb(164, 194, 244)', width: 2, }  
    }], {
        xaxis: { title: xAxis, autorange: true},
        yaxis: { title: yAxis, autorange: true}
    });

}

document.getElementById('dropdown-parameters-1')?.addEventListener('change', () => {
    clearGraph();
});

document.getElementById('dropdown-parameters-2')?.addEventListener('change', () => {
    clearGraph();
});