'use strict'

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function sortComparator(a, b) {
    return parseInt(b.priority, 10) - parseInt(a.priority, 10);
}

let tasks = [
    { id: 1, text: 'task with priority: 10', priority: '10' }, { id: 2, text: 'task with priority: 1', priority: '1' }, { id: 3, text: 'task with priority: 12', priority: '12' },
    { id: 4, text: 'task with priority: 5', priority: '5' }, { id: 5, text: 'task with priority: 2', priority: '2' }, { id: 6, text: 'task with priority: 7', priority: '7' },
    { id: 7, text: 'task with priority: 10', priority: '10' }, { id: 8, text: 'task with priority: 10', priority: '10' }, { id: 9, text: 'task with priority: 2', priority: '2' },
    { id: 10, text: 'task with priority: 4', priority: '4' }, { id: 11, text: 'task with priority: 7', priority: '7' }, { id: 12, text: 'task with priority: 3', priority: '3' },
    { id: 13, text: 'task with priority: 1', priority: '1' }, { id: 14, text: 'task with priority: 8', priority: '8' }, { id: 15, text: 'task with priority: 8', priority: '8' }
]


let compiler = {
    queuedTasks: tasks.sort(sortComparator),
    activeTasks: [],
    completedTasks: [],
    isProcess: false,
    timeoutElement: '',
    initTasks: () => {
        while (compiler.activeTasks.length < 10 && compiler.queuedTasks.length > 0) { // Taking first 10 active Tasks
            compiler.activeTasks.push(compiler.queuedTasks[0])
            compiler.queuedTasks.splice(0, 1)
        }
    },
    processTask: () => {
        let timeOfTask = randomIntFromInterval(5000, 10000)
        compiler.isProcess = true
        compiler.show()

        compiler.timeoutElement = setTimeout(() => {
            if (compiler.activeTasks.length > 0) { // Push completed Task to stack 
                compiler.completedTasks.push(compiler.activeTasks[0])
                compiler.activeTasks.splice(0, 1)
                console.log(`Zadanie wykonane po ${timeOfTask} czasu`)
            }

            if (compiler.queuedTasks.length > 0) { // Taking new Task to process
                compiler.activeTasks.push(compiler.queuedTasks[0])
                compiler.queuedTasks.splice(0, 1)
            }

            if (compiler.activeTasks.length > 0) { // Launch new iteration
                compiler.processTask()
            } else { // final view change and iteration stop
                compiler.show()
                compiler.isProcess = false
            }

        }, timeOfTask)
    },
    show: () => {

        const display = (category, array) => {
            let item = document.getElementById(category)
            let arr = ''
            array.forEach(el => {
                arr = arr + '<div class="' + category + ' item"><span>' + el.text + '</span><button onclick="compiler.deleteTask(' + el.id + ', `' + category + '`)">delete</button></div>'
            })
            item.innerHTML = arr
        }

        display('queue', compiler.queuedTasks)
        display('active', compiler.activeTasks)
        display('complete', compiler.completedTasks)

    },
    addNewTask: (priority) => {

        compiler.stopIteration()

        Array.prototype.push.apply(compiler.queuedTasks, compiler.activeTasks) // compare all not completed tasks and sort tasks by priority
        compiler.activeTasks = []
        compiler.queuedTasks.push({ id: Date.now(), text: `new task with priority: ${priority}`, priority: `${priority}` })
        compiler.queuedTasks.sort(sortComparator)
        compiler.initTasks()

        compiler.startIteration()
    },
    deleteTask: (id, category) => {
        compiler.stopIteration()

        if (category === 'queue') { // delete element by id
            compiler.queuedTasks = compiler.queuedTasks.filter(el => el.id != id)
        } else if (category === 'active') {
            compiler.activeTasks = compiler.activeTasks.filter(el => el.id != id)
        } else if (category === 'complete') {
            compiler.completedTasks = compiler.completedTasks.filter(el => el.id != id)
        }

        compiler.startIteration()

    },
    stopIteration: () => {
        for (let i = 0; i <= compiler.timeoutElement; i++) { // stop iteration
            clearTimeout(i)
        }
        compiler.isProcess = false
    },
    startIteration: () => {
        compiler.show()
        compiler.processTask()
    }
}

compiler.initTasks()
compiler.processTask()

document.getElementById('button').addEventListener('click', () => {
    let val = document.getElementById('priority').value
    compiler.addNewTask(val ? val : '1')
})
