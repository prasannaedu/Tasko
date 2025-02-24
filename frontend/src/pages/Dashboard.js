import React,{ useEffect,useState} from "react";
import api from "../api/api";
import UpdateTaskModal from "../components/UpdateTaskModal";
import CreateTaskModal from '../components/CreateTaskModal';


const Dashboard=()=>{

    const [tasks,setTasks]=useState([]);
    const [selectedTask,setSelectedTask]=useState(null);
    const [taskToUpdate,setTaskToUpdate]=useState(null);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

    useEffect(()=>{
        const fetchTasks=async()=>{
            try{
                const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const response = await api.get('/tasks/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
                // console.log(response.data);
            }catch(error){
                console.error('Error fetching tasks:',error);
            }
        };
        fetchTasks();
        
    },[]);
    const handleCreateTask = async (taskData) => {
        try {
          const response = await api.post('/tasks/', taskData);
          setTasks([...tasks, response.data]); // Add the new task to the list
        } catch (error) {
          console.error('Error creating task:', error);
        }
      };
    
        const handleUpdate=async(updatedTask)=>{
            try{
                await api.put(`/tasks/${updatedTask.id}/`,updatedTask);
                setTasks(tasks.map(task=>task.id===updatedTask.id ? updatedTask:task));
            }catch(error){
                console.error('Error updating task:',error);
                console.error(error.response.data);
            }
        };
        const handleComplete = async (taskId) => {
            try {
              const task = tasks.find(task => task.id === taskId);
              const updatedTask = { ...task, completed: !task.completed }; // Toggle completed status
          
              if (updatedTask.completed) {
                // Mark as complete using the /tasks/{id}/complete/ endpoint
                await api.put(`/tasks/${taskId}/complete/`);
              } else {
                // Unmark as complete using the generic update endpoint (/tasks/{id}/)
                await api.put(`/tasks/${taskId}/`, updatedTask);
              }
          
              setTasks(tasks.map(task => 
                task.id === taskId ? updatedTask : task
              ));
            } catch (error) {
              console.error('Error completing task:', error);
            }
          };
        const handleDelete=async(taskId)=>{
            try{
                await api.delete(`/tasks/${taskId}/delete/`);
                setTasks(tasks.filter(task=>task.id!==taskId));
                alert('Task deleted successfully');
            }
            catch(error){
                console.error('Error deleting task:',error);
            }
        };

        const handleTaskClick=(task)=>{
            setSelectedTask(task);
        }

    return(
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl text-white font-bold mb-4">Dashboard</h1>
            {/* <p className="text-gray-700">Track your tasks and progress.</p> */}
            <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6">
                Create Task
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.sort((a,b)=> a.completed - b.completed).map(task=>(
                    <div key={task.id} className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${task.completed ? 'bg-gray-900 border dark:border-gray-600' : 'bg-gray-800 border-y dark:border-gray-600'} border-y dark:border-gray-600`} onClick={()=>handleTaskClick(task)}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-white font-semibold">{task.title}</h2>
                            <input type="checkbox" checked={task.completed} onChange={(e) => {e.stopPropagation(); handleComplete(task.id);}}  className="ml-4 w-4 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" onClick={(e) => e.stopPropagation()}/>
                        </div>
                        <p className="text-gray-100 mt-2">{task.description}</p>
                        <p className="text-gray-100 mt-2"><strong>Priority: </strong>{task.priority}</p>
                        <p className="text-gray-100 mt-2"><strong>Due Date: </strong>{new Date(task.due_date).toLocaleDateString()}{" "}{new Date(task.due_date).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>

                        <div className="mt-4 flex space-x-2">
                            <button onClick={(e)=>{e.stopPropagation();handleDelete(task.id)}} className="text-blue-100 py-2 px-3 rounded-md bg-red-700 hover:text-white">
                                Delete
                            </button>
                            <button onClick={(e)=>{
                                e.stopPropagation();
                                setTaskToUpdate(task);
                            }} className="text-blue-100 py-2 px-4 bg-blue-500 rounded-md hover:text-white" >
                                Edit
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            {selectedTask&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-black p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-xl text-white font-bold mb-4">{selectedTask.title}</h2>
                        <p className="text-white mb-4" >{selectedTask.description}</p>
                        <p className="text-white mb-4"><strong>Priority: </strong>{selectedTask.priority}</p>
                        <p className="text-white mb-4"><strong>Due Date: </strong>{new Date(selectedTask.due_date).toLocaleDateString()}{" "}{new Date(selectedTask.due_date).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <button onClick={()=>setSelectedTask(null)} className="bg-gray-800 text-white px-4 py-2 mt-2 rounded-md hover:bg-gray-700 "> Close</button>
                    </div>
                </div>
            )}

            {taskToUpdate &&(
                <UpdateTaskModal task={taskToUpdate} onClose={()=>setTaskToUpdate(null)} onUpdate={handleUpdate}/>
            )}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => setIsCreateTaskModalOpen(false)}
                onCreate={handleCreateTask}
            />
        </div>
    );
};
export default Dashboard;