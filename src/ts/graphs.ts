import Plotly from 'plotly.js-dist';
import { Pendulum } from './Pendulum';

let xData: number[] = [];
let yData: number[] = [];
let xAxis = 'angle1';
let yAxis = 'angle2';
let currentColor = '#ff0000'
let graphMode: "lines" | "markers" = "lines";

// Initial trace
const trace1: Plotly.Data = {
    x: xData,
    y: yData,
    type: 'scatter',
    mode: graphMode,
    line: { shape: 'spline', color: currentColor, width: 2, }  
};

const data: Plotly.Data[] = [trace1];
const layout: Partial<Plotly.Layout> = {
    xaxis: { title: xAxis, autorange: true},
    yaxis: { title: yAxis, autorange: true}
};

// Initial plot
Plotly.newPlot('phase-portrait', data, layout);

// Function to update the plot with new data
export function updatePlot(pendulum1: Pendulum, pendulum2: Pendulum, time: number) {
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
        case 'time':
            newX = time;
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
        case 'time':
            newY = time;
          break;
        default:
            newY = 0
    }

    Plotly.restyle('phase-portrait', {
      mode: graphMode,
      line: { shape: 'spline', color: currentColor, width: 2, }  
    });

    if (xData.length > 0 && yData.length > 0) {
      Plotly.extendTraces('phase-portrait', {
        x: [[xData[0], newX]],
        y: [[yData[0], newY]]
      }, [0], 10000);
    }

    // Update last point values
    xData[0] = newX;
    yData[0] = newY;
}

export function clearGraph() {
    xAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-1')).value;
    yAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-2')).value;
    xData = []
    yData = []
    Plotly.react('phase-portrait', [{
        x: xData,
        y: yData,
        type: 'scatter',
        mode: graphMode,
        line: { shape: 'spline', color: currentColor, width: 2, }  
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

document.getElementById('dropdown-graph-mode')?.addEventListener('change', (event) => {
  graphMode = (event.target as HTMLSelectElement).value as "lines" | "markers";
  clearGraph();
});

document.addEventListener('DOMContentLoaded', () => {
  const colorBox = document.getElementById('color-box') as HTMLDivElement;
  const colorInput = document.getElementById('color-input') as HTMLInputElement;

  // Set initial color box background
  colorBox.style.backgroundColor = currentColor;

  // Handle color box click
  colorBox.addEventListener('click', () => {
      colorInput.click();
  });

  // Handle color input change
  colorInput.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      currentColor = input.value;
      colorBox.style.backgroundColor = currentColor;
  });
});
