const fs = require('fs');
const PATH = require('path');
const GROUPS_DB = require('../data/grupos.json');
const TAREAS_DB = require('../data/tareas.json');

let CURRENT_ID = 0;

let ids = GROUPS_DB.map((obj) => {
    return parseInt(obj.id)
});
CURRENT_ID = Math.max(...ids) + 1;
console.log(`Current id: ${CURRENT_ID}`);


class GruposController {
    generateID() {
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    getList() {
        return GROUPS_DB;
    }
    getListTareas() {
        return TAREAS_DB;
    }
    persist(){
        let path = PATH.join(__dirname,'..','data','grupos.json');
        console.log(path);
        fs.writeFileSync(path,JSON.stringify(GROUPS_DB));
    }
    getTarea(tarea) {
        let champ = TAREAS_DB.find(ele=>ele.tarea ===campeon);
        return champ;
    }
}

module.exports = GruposController;