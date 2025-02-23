import React,{useState} from "react";

const UpdateTaskModal=({task,onClose,onUpdate})=>{
    const [title,setTitle]=useState(task.title);
    const [description,setDescription]=useState(task.description);
    const [priority,setPriority]=useState(task.priority);
    const [dueDate,setDueDate]=useState(task.due_date);


    const handleSubmit=(e)=>{
        e.preventDefault();
        onUpdate({
            ...task,
            title,
            description,
            priority,
            due_date:dueDate,
        });
        onClose();
    };
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Update Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            className="w-full p-2 border rounded-md"
                         />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Priority</label>
                        <select
                            value={priority}
                            onChange={(e)=>setPriority(e.target.value)}
                            className="w-full p-2 border rounded-md">
                                <option value="H">High</option>
                                <option value="M">Medium</option>
                                <option value="L">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" >Current Due date</label>
                        {/* <p>{new Date(task.due_date).toLocaleString()}</p> */}
                        <p>{new Date(task.due_date).toLocaleDateString()}{" "}{new Date(task.due_date).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Due Date</label>
                        <input type="datetime-local"
                                value={dueDate}
                                onChange={(e)=>setDueDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type='button' onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update</button>
                    </div>
                </form>

            </div>

        </div>
    )};
export default UpdateTaskModal