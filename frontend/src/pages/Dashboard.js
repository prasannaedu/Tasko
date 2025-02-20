import React,{ useEffect,useState} from "react";
import api from "../api/api";


const Dashboard=()=>{

    const [tasks,setTasks]=useState([]);
    useEffect(()=>{
        const fetchTasks=async()=>{
            try{
                const response=await api.get('tasks/');
                setTasks(response.data);
                // console.log(response.data);
            }catch(error){
                console.error('Error fetching tasks:',error);
            }
        };
        fetchTasks();
            
        },[]);
    return(
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-700">Track your tasks and progress.</p>
            <ul>
                {tasks.map(task=>(
                    <li key={task.id} className="text-gray-700">
                        {task.title} - {task.completed ? '✅ Completed' : '⏱️ Pending'}
                        </li>
                    ))}
            </ul>
        </div>
    );
};
export default Dashboard;