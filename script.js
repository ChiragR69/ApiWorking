const apiUrl = 'https://636ba9207f47ef51e136cb22.mockapi.io/getdata';

        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
        const sortSelect = document.getElementById('sort');
        const filterSelect = document.getElementById('filter');

        document.addEventListener('DOMContentLoaded', () => {
            fetchTasks();
        });

        addButton.addEventListener('click', () => {
            const taskName = taskInput.value;
            if (taskName) {
                addTask(taskName);
            }
        });

        sortSelect.addEventListener('change', () => {
            fetchTasks();
        });

        filterSelect.addEventListener('change', () => {
            fetchTasks();
        });

        function fetchTasks() {
            axios.get(apiUrl)
                .then(response => {
                    displayTasks(response.data);
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error);
                });
        }

        function addTask(task) {
            const newTask = { task, completed: false, createdAt: new Date().toISOString() };
            axios.post(apiUrl, newTask)
                .then(() => {
                    taskInput.value = ''; // Clear the input field
                    fetchTasks();
                })
                .catch(error => {
                    console.error('Error adding task:', error);
                });
        }

        function deleteTask(id) {
            axios.delete(`${apiUrl}/${id}`)
                .then(() => {
                    fetchTasks();
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                });
        }


        function updateTask(id, updatedTask) {
            axios.put(`${apiUrl}/${id}`, updatedTask)
                .then(() => {
                    fetchTasks();
                })
                .catch(error => {
                    console.error('Error updating task:', error);
                });
        }

        function displayTasks(tasks) {
            taskTable.innerHTML = '';
            const filteredTasks = filterTasks(tasks);
            const sortedTasks = sortTasks(filteredTasks);
            sortedTasks.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.task}</td>
                    <td>${task.completed ? 'Completed' : 'Incomplete'}</td>
                    <td>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                        <button onclick="toggleTaskCompletion(${task.id}, ${task.completed})">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                    </td>
                `;
                taskTable.appendChild(row);
            });
        }

        function toggleTaskCompletion(id, currentStatus) {
            const updatedTask = { completed: !currentStatus };
            updateTask(id, updatedTask);
        }

        function sortTasks(tasks) {
            const sortBy = sortSelect.value;
            if (sortBy === 'name') {
                return tasks.sort((a, b) => a.task.localeCompare(b.task));
            } else if (sortBy === 'date') {
                return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else if (sortBy === 'id') {
                return tasks.sort((a, b) => a.id - b.id);
            }
            return tasks;
        }

        function filterTasks(tasks) {
            const filterBy = filterSelect.value;
            if (filterBy === 'completed') {
                return tasks.filter(task => task.completed);
            } else if (filterBy === 'incomplete') {
                return tasks.filter(task => !task.completed);
            }
            return tasks;
        }