const hours = {
     "07:00":"s" ,
     "07:15":"sf",
     "07:30":"st",
     "07:45":"sff",
     "08:00":"e",
     "08:15":"ef",
     "08:30":"et",
     "08:45":"eff",
    "09:00":"n",
    "09:15":"nf",
    "09:30":"nt",
      "09:45":"nff",
    "10:00":"t",
    "10:15":"tf",
    "10:30":"tt",
    "10:45":"tff"
}
const do_ = () => {
    get_time_set().then(res => {
        const j = res.json().then(result => {
            console.log("dd"+result);
            console.log("08:01" < "09:00");
            result.forEach(element => {
                console.log(element.hour_end_time);
            $(".schedule").append(
                '<div class="schedule-item'
                + ' schedule-' + element.day
                + ' time-from-' + hours[element.hour_start_time]
                + ' time-to-' + hours[element.hour_end_time]
                + ' nt bg-' + element.color + '">'
                + element.name
                + '</div>'
            )
            })
        });
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const get_time_set = async () => {
    try {
        const response = fetch('/api/tasks', { method: 'GET' })
        if (response) {
            const jsonRes = response;
            // console.log(response);
            return jsonRes;
        }
        return false;
    }
    catch (e) {
        console.log("fetch failed", e);
        return false;
    }
}
//     console.log("jjj");
//     fetch('/api/tasks', {
//         method: 'GET'
//     }).then(response => response.json())
//         .then(async (result) => {
//             console.log("iii");
//             // console.log(result[2]);
//             return await result[2];
//         }).catch(error => {
//             console.error('Error:', error);
//         });
// }
// const do1_ = () => {
//     get_time_set().then(res => {
//         console.log(res)
//         const j = res.json().then(result => { console.log(result[2]); });
//         console.log(j);
//     })
// }
// do1_();