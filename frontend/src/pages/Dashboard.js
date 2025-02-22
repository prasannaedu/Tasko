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
                await api.put(`/tasks/${updatedTask.id}/complete/`,updatedTask);
                setTasks(tasks.map(task=>task.id===updatedTask.id ? updatedTask:task));
            }catch(error){
                console.error('Error updating task:',error);
            }
        };
        const handleComplete=async(taskId)=>{
            try{
                await api.put(`/tasks/${taskId}/complete/`);
                setTasks(tasks.map(task=>task.id===taskId ? {...task,completed:true}:task));
            }catch(error){
                console.error('Error completing task:',error);
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
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {/* <p className="text-gray-700">Track your tasks and progress.</p> */}
            <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6">
                Create Task
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task=>(
                    <div key={task.id} className="bg-sky-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={()=>handleTaskClick(task)}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">{task.title}</h2>
                            <input type="checkbox" checked={task.completed} onChange={()=>handleComplete(task.id)} className="ml-2"/>
                        </div>
                        <p className="text-gray-600 mt-2">{task.description}</p>
                        <p className="text-gray-600 mt-2"><strong>Priority: </strong>{task.priority}</p>
                        <p className="text-gray-600 mt-2"><strong>Due Date: </strong>{new Date(task.due_date).toLocaleString()}</p>

                        <div className="mt-4 flex space-x-2">
                            <button onClick={(e)=>{e.stopPropagation();handleDelete(task.id)}} className="text-red-500 hover:text-red-700">
                                Delete
                            </button>
                            <button onClick={(e)=>{
                                e.stopPropagation();
                                setTaskToUpdate(task);
                            }} className="text-blue-500 hover:text-blue-700">
                                Edit
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            {selectedTask&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
                        <p className="text-gray-600 mb-4" >{selectedTask.description}</p>
                        <p className="text-gray-600 mb-4"><strong>Priority:</strong>{selectedTask.priority}</p>
                        <p><strong>Due Date:</strong>{new Date(selectedTask.due_date).toLocaleString()}</p>

                        <button onClick={()=>setSelectedTask(null)} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"> Close</button>
                    </div>
                </div>
            )}

            {taskToUpdate &&(
                <UpdateTaskModal task={taskToUpdate} onClose={()=>setTaskToUpdate(null)} onUpdate={handleUpdate}/>
            )}
{/* 
            <ul>
                {tasks.map(task=>(
                    <li key={task.id} className="text-gray-700">
                        {task.title} - {task.completed ? '✅ Completed' : '⏱️ Pending'}
                        </li>
                    ))}
            </ul> */}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => setIsCreateTaskModalOpen(false)}
                onCreate={handleCreateTask}
            />
        </div>
    );
};
export default Dashboard;