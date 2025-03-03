import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
    const [state, setState] = React.useState({
      
        series: [{
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100],
        }],
        options: {
          chart: {
            height: 200,
            type: 'area',
            toolbar: {
                show: false, // Hides the toolbar
              },
            
          },
          
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
            labels: {
                style: {
                  colors: "white", // Set X-axis labels to white
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  colors: "white", // Set Y-axis labels to white
                },
              },
            },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
        },
      
      
    });

    

    return (
      <div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="area" height={200} />
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }

export default ApexChart;
