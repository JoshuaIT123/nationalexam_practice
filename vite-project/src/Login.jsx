import React, { useEffect, useState } from "react";

function Login() {
  const [name , setName] = useState();
  const [ className , setClassName] = useState();
  const [age , setAge] = useState(0);
  const [students , setStudents] = useState([]);

  const sendRequest = async()=>{
    try {
      const res = await fetch("http://localhost:3000/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          name, 
          age,
          className
        })
      })

      if (res.status !== 201){
        alert("Failed to register");
        console.log(res.status);
        return;
      }
      const data = await res.json();
      console.log(data);
      filter();
    } catch (error) {
      console.error(error.message);
    }
  }

      async function filter() {
      try {
         const res = await fetch("http://localhost:3000/")
         if(res.status !== 200){
          console.log(res.status)
          alert("error fetching")
         }
         const data = await res.json();
         setStudents(data.student);
         console.log(data.student)
      } catch (error) {
        console.error(error.message)
      }
      
    }

  // fetching students
  useEffect(()=>{
    filter();
  },[])

  //making request for deleting on the server 
  const deletestudent= async(id)=>{
    try {
        const res= await fetch(`http://localhost:3000/${id}`,{
          method:"DELETE"
        })

        if(res.status !==200){
          alert("an error occured")
          console.log(res.status)
          return
        }
        //refresh the students automatically after delete
        filter();
        const data = await res.json();
        console.log(data);
    }catch(e){
      console.error(e.message);
    }
  }
  //making request for updating on the server
  const updatingstudent= async(id)=>{
    try {
        const res= await fetch(`http://localhost:3000/${id}`,{
    method:"PUT"
  })
  if(res.status !==201){
    alert("an error occured")
    console.log(res.status)
  }
   filter();
  const data= await res.json();
  console.log(data)
  }
    catch (error) {
      console.error(error.message)
      
    }
  }

  



  return (
    <>
    <div className="flex justify-center items-center bg-gray-100 w-full p-5 h-screen">
        <div className="w-full max-w-md bg-blue-950  p-6  shadow-lg h-full flex items-center justify-center rounded-l-2xl">
    <p className="text-white text-lg animate-pulse">
      Welcome to the Student Management System! <br />
      Add students, edit details, and view all your students here.
    </p>
  </div>
      <div className="bg-white p-8  shadow-lg w-full max-w-md  space-y-13.5 rounded-r-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Student Management System
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <input
            type="text"
            value={className}
            onChange={(e)=> setClassName(e.target.value)}
            placeholder="Enter your class"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            onChange={(e)=> setAge(e.target.value)}
            placeholder="Enter your age"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button onClick={sendRequest} className="bg-white hover:bg-pink-500 text-black border border-black font-medium py-2 px-6 rounded-xl shadow-md transition animate-bounce">
          Submit
        </button>

      </div>
    </div>
    <div className="p-5 bg-gray-50 ">
      <div className="">
        {students.map((student)=>(
 <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 shadow-sm animate-fade-in">
  <span className="text-2xl font-semibold text-gray-900">
    {student.name}
  </span>
  <span className="text-lg font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
    {student.age}
  </span>
        <button onClick={()=> deletestudent(student._id)} className="bg-pink-700 hover:bg-white  text-black font-medium py-2 px-6 rounded-xl shadow-md transition ml-50">
          Delete
        </button>

                <button onClick={()=>updatingstudent(student._id)} className="bg-pink-700 hover:bg-white  text-black font-medium py-2 px-6 rounded-xl shadow-md transition ml-50">
          update
        </button>
</div>

        ))}
      </div>
    </div>
    </>
  );
  
  }


export default Login;
