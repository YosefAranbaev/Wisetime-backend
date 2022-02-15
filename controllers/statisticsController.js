const axios = require('axios');
const User = require('../models/users');

const buildChart = (tasksDone, allTasks) => {
    return {  
        "backgroundColor": "transparent",
        "width": 198,
        "height": 180,
        "format": "svg",
        "chart": {
            type: 'bar',
            data: {
              labels: ['Study', 'Work', 'Chores', 'Hobby'],
              datasets: [
                {
                  label: 'Done',
                  backgroundColor: 'rgb(32,178,170)',
                  data: allTasks,
                },
                {
                  label: 'All Tasks',
                  backgroundColor: 'rgb(238,211,211)',
                  data: tasksDone,
                }
              ],
            },
            options: {
              scales: {
                xAxes: [
                  {
                    stacked: true,
                  },
                ],
                yAxes: [
                  {
                    stacked: true,
                  },
                ],
              },
            },
        }
    }
};

const buildGauge = (tasksDone, allTasks) => {
    const percent = allTasks === 0 ? 0 : (tasksDone/allTasks*100).toFixed(1);
    
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
            "data": [tasksDone, allTasks-tasksDone],
            "backgroundColor": [
                "rgba(32, 178, 170, 1)",
                "rgba(238,211,211, 1)"
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
                                "text": `\n${percent}%`,
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
        User.findById(req.userId).populate({ path: 'tasks' })
            .then(user => {
                const tasksDone = [0, 0, 0, 0];
                const allTasks = [0, 0, 0, 0];

                for(const task of user.tasks) {
                    if(task.category) {
                        if(task.category === 'study') {
                            allTasks[0]++;
                            if(task.is_done)    tasksDone[0]++;
                        } else if(task.category === 'work') {
                            allTasks[1]++;
                            if(task.is_done)    tasksDone[1]++;
                        } else if(task.category === 'chores') {
                            allTasks[2]++;
                            if(task.is_done)    tasksDone[2]++;
                        } else if(task.category === 'hobby') {
                            allTasks[3]++;
                            if(task.is_done)    tasksDone[3]++;
                        }
                    }
                }
                for(let i=0; i<allTasks.length; i++) {
                    allTasks[i] -= tasksDone;
                }

                axios.post('https://quickchart.io/chart', buildChart(tasksDone, allTasks) )
                    .then(response => {
                        res.status(200).json({'chart': response.data});
                    }).catch(error => {
                        res.status(500).json({'error': error});
                    })

            })
            .catch(err => res.status(500).json({'error': 'error while getting user'}));
    },
    getGauge(req, res) {
        User.findById(req.userId).populate({ path: 'tasks' })
            .then(user => {
                let tasksNumber = user.tasks.length;
                let tasksDoneNumber = 0;
                for(const task of user.tasks) {
                    if(task.is_done === true) {
                        tasksDoneNumber++;
                    }
                }
                axios.post('https://quickchart.io/chart', buildGauge(tasksDoneNumber, tasksNumber))
                    .then(response => {
                        res.status(200).json({'chart': response.data});
                    })
                    .catch(error => {
                        res.status(500).json({'error': error});
                    })

            })
            .catch(err => res.status(500).json({'error': 'error while getting user'}));
    }
}