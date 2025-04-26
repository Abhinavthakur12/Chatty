import React from 'react'
import {Line,Doughnut} from "react-chartjs-2";
import {
Chart as ChartJS,
Tooltip,
Filler,
CategoryScale,
LinearScale,
PointElement,
LineElement,
ArcElement,
Legend,
plugins,
scales
} from "chart.js";
import { purple, purpleLight,orange, orangeLight } from '../../constants/color';
import { getLast7Days } from '../../lib/features';

ChartJS.register(CategoryScale,
    Tooltip,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    ArcElement,
    Legend
);
const labels = getLast7Days();
const lineChartOptions = {
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false
        },
    },
    scales:{
        x:{
            grid:{
                display:false
            }
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false
            }
        }
    }
}
const LineChart = ({value=[]})=>{
    const data = {
        labels,
        datasets:[
            {
                data:value,
                label:"Messages",
                fill:true,
                backgroundColor:purpleLight,
                BorderColor:purple
            },
        ],
    }

    return <Line data={data} options={lineChartOptions}/>
}

const doughnutChartOptions = {
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
    },
    cutout:120
}
const DoughnutChart = ({value=[],labels=[]})=>{
    const data = {
        labels,
        datasets:[
            {
                data:value,
                label:"total chats vs Group Chats",
                backgroundColor:[purpleLight,orangeLight],
                hoverBackgroundColor:[purple,orange],
                borderColor:[purple,orange],
                offset:30
            }
        ]
    }
    return <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions}/>
}
export {LineChart,DoughnutChart}