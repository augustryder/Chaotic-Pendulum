import Plotly from 'plotly.js-dist';

const xData: number[] = [];
const yData: number[] = [];
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
    title: 'Continuous Phase Portrait',
    xaxis: { title: 'Angle 1', range: [-2, 2]},
    yaxis: { title: 'Angle 2', range: [-2, 2]}
};

// Initial plot
Plotly.newPlot('phase-portrait', data, layout);

// Function to update the plot with new data
export function updatePlot(newX: number, newY: number) {
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
    // xData.push(newX);
    // yData.push(newY);
    // Plotly.animate('phase-portrait', {
	// 	data: [{x: xData, y: yData}]
	//   }, {
	// 	transition: {
	// 	  duration: 0
	// 	},
	// 	frame: {
	// 	  duration: 0,
	// 	  redraw: false
	// 	}
	//   });
}