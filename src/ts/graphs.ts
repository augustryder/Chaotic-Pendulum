import Plotly from 'plotly.js-dist';
import { Pendulum } from './Pendulum';

let xData: number[] = [];
let yData: number[] = [];
let xAxis = 'angle1';
let yAxis = 'angle2';
let currentColor = '#00ff00'
export let graphMode: "lines" | "markers" = (document.getElementById('dropdown-graph-mode') as HTMLSelectElement).value as "lines" | "markers"
const MAX_POINTS = 10000;

// Initial trace
const trace1: Plotly.Data = {
    x: xData,
    y: yData,
    type: 'scatter',
    mode: graphMode,
    line: { shape: 'spline', color: currentColor, width: 2, }  
};

const data: Plotly.Data[] = [trace1];
let layout: Partial<Plotly.Layout> = {
    xaxis: { title: xAxis, range: [-0.1, 0.1], color: '#ffffff'},
    yaxis: { title: yAxis, range: [-0.1, 0.1], color: '#ffffff'},
    paper_bgcolor: '#232852', // Background color of the entire plotting area
    plot_bgcolor: '#232852',  // Background color of the plotting area
};

// Initial plot
Plotly.newPlot('phase-portrait', data, layout, { responsive: true });

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

    if (xData.length >= MAX_POINTS) {
      xData.shift()
      yData.shift()
    }
    xData.push(newX);
    yData.push(newY);
    
    checkRange(newX, newY);

    Plotly.animate('phase-portrait', {

      data: [{x: xData, y: yData}],
      layout
  
    }, {
  
      transition: {
        duration: 0
      },
  
      frame: {
        duration: 0,
        redraw: false
      }
  
    });
    
}

function checkRange(x: number, y: number) {
  const xRange = layout.xaxis?.range;
  const yRange = layout.yaxis?.range;
  if (layout.xaxis && xRange && (x < xRange[0] || x > xRange[1])) {
    layout.xaxis.range = [
      Math.min(xRange[0], x),
      Math.max(xRange[1], x)
    ];
    Plotly.react('phase-portrait', [{
      x: xData,
      y: yData,
      type: 'scatter',
      mode: graphMode,
      line: { shape: 'spline', color: currentColor, width: 2, }  
  }], layout);
  }
  if (layout.yaxis && yRange && (y < yRange[0] || y > yRange[1])) {
    layout.yaxis.range = [
      Math.min(yRange[0], y),
      Math.max(yRange[1], y)
    ];
    Plotly.react('phase-portrait', [{
      x: xData,
      y: yData,
      type: 'scatter',
      mode: graphMode,
      line: { shape: 'spline', color: currentColor, width: 2, }  
  }], layout);
  }
}
export function clearGraph() {
    xAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-1')).value;
    yAxis = (<HTMLSelectElement>document.getElementById('dropdown-parameters-2')).value;
    xData = []
    yData = []
    layout = {
      xaxis: { title: xAxis, range: [-0.1, 0.1], color: '#ffffff'},
      yaxis: { title: yAxis, range: [-0.1, 0.1], color: '#ffffff'},
      paper_bgcolor: '#232852', // Background color of the entire plotting area
      plot_bgcolor: '#232852',  // Background color of the plotting area
    };
    Plotly.react('phase-portrait', [{
        x: xData,
        y: yData,
        type: 'scatter',
        mode: graphMode,
        line: { shape: 'spline', color: currentColor, width: 2, }  
    }], layout);
}

export function resizePlot() {
  const graphContent = document.getElementById('phase-portrait') as HTMLElement;

  if (graphContent) {
    const width = graphContent.clientWidth;
    const height = graphContent.clientHeight;
  
    Plotly.relayout('phase-portrait', {
        width: width,
        height: height
    });
  }

}

document.getElementById('graph-tab')?.addEventListener('click', () => {
  requestAnimationFrame(() => {
    setTimeout(resizePlot, 10);
    resizePlot();
  });
});

document.getElementById('theory-tab')?.addEventListener('click', () => {
  clearGraph();
});

window.addEventListener('resize', resizePlot);

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
      Plotly.restyle('phase-portrait', {
        mode: graphMode,
        line: { shape: 'spline', color: currentColor, width: 2, }  
      });
  });
});
