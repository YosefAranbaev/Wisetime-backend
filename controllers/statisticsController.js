const axios = require('axios');
const User = require('../models/users');

const buildChart = () => {
    return {  
        "backgroundColor": "transparent",
        "width": 150,
        "height": 200,
        "format": "svg",
        "chart": {
            "type": "bar",
            "data": {
                "labels": ["Study", "Work", "Chores", "Hobby", "Other"],
                "datasets": [
                {
                    "label": "Tasks created",
                    "data": [1, 5, 8, 0, 20],
                    "backgroundColor": "rgba(54, 162, 235, 0.5)",
                    "borderColor": "rgb(54, 162, 235)",
                    "borderWidth": 1
                }
                ]
            },
            "options": {
                "plugins": {
                "datalabels": {
                    "anchor": "center",
                    "align": "center",
                    "color": "#fff",
                    "font": {
                        "weight": "bold",
                        "size": 6
                    }
                }
                }
            }
        }
    }
};

const buildGauge = () => {
    return {
        "backgroundColor": "transparent",
        "width": 150,
        "height": 180,
        "format": "svg",
        "chart":{
        "type": "doughnut",
        "data": {
            "datasets": [{
            "label": "foo",
            "data": [12, 88],
            "backgroundColor": [
                "rgba(255, 99, 132, 0.2)",
                "rgba(0, 0, 0, 0.1)"
            ],
            "textcolor":["#000555","#555555"],
            "borderWidth": 0
            }] 
        },
        "options": {
            "rotation": 3.14,
            "circumference": 3.14,
            "cutoutPercentage": 75,
            "plugins": {
            "datalabels": { "display": true },
            "doughnutlabel": {
                "labels": [
                            {
                                "text": "\nTasks Done",
                                "color": "#aaa",
                                "font": {
                                "size": "10"
                                }
                            },
                            {
                                "text": "\n12%",
                                "font": {
                                "size": "20"
                                }
                            }
                        ]
                    }
                }		
            }
        }
    }
};

exports.statisticsController = {
    getChart(req, res) {
        axios.post('https://quickchart.io/chart', buildChart() )
        .then(response => {
            res.status(200).json({'chart': response.data});
        }).catch(error => {
            res.status(500).json({'error': error});
        })
    },
    getGauge(req, res) {
        axios.post('https://quickchart.io/chart', buildGauge() )
        .then(response => {
            res.status(200).json({'chart': response.data});
        }).catch(error => {
            res.status(500).json({'error': error});
        })
    }
}