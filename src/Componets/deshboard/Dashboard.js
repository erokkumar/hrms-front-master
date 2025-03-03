import React, {useState, useEffect} from 'react'
import Chart1 from './Charts/chart1'
import Chart2 from './Charts/chart2'
import Sidebar from '../Sidebar/Sidebar'
import { useNavigate } from 'react-router-dom'
export default function Dashboard() {
const [Leaves, setLeaves] = useState([]);
const emp_id = localStorage.getItem("emp_id");
console.log(emp_id,"show id")
    const emp_name = localStorage.getItem("user_name"); // Example employee name
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);
    const getISTTime = () => {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 5, now.getUTCMinutes() + 30); // Convert UTC to IST
    
        const date = now.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        const time = now.toISOString().split('T')[1].slice(0, 5); // Extract HH:MM (no seconds)
    
        return `${date} ${time}`; // Format: YYYY-MM-DD HH:MM
    };
 const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn"); // Remove login status
        navigate("/login"); // Redirect to login page
      };
    
    let timerId = null; // Store interval ID globally

    const Timmer = (status = true) => {
        let sec = document.getElementById('sec');
        let min = document.getElementById('min');
        let hour = document.getElementById('hour');
    
        if (status) {
            if (timerId) return; // Prevent multiple intervals
            
            timerId = setInterval(() => {
                let seconds = parseInt(sec.innerHTML);
                let minutes = parseInt(min.innerHTML);
                let hours = parseInt(hour.innerHTML);
    
                seconds += 1;
                if (seconds === 60) {
                    seconds = 0;
                    minutes += 1;
                }
                if (minutes === 60) {
                    minutes = 0;
                    hours += 1;
                }
    
                sec.innerHTML = seconds;
                min.innerHTML = minutes;
                hour.innerHTML = hours;
            }, 1000);
        } else {
            clearInterval(timerId);
            timerId = "finished";
        }
    };
    
 
   
    
        const handleClockIn = () => {
            const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });
            setClockInTime(currentTime);
    
            fetch("http://localhost:5000/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emp_id,
                    emp_name,
                    clock_in: currentTime,
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Clock In Response:", data);
                alert("Clocked In Successfully at " + currentTime);
            })
            .catch((err) => console.error("Error:", err));
        };
    
        const handleClockOut = () => {
            const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });
            setClockOutTime(currentTime);
    
            fetch("http://localhost:5000/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emp_id,
                    emp_name,
                    clock_in: clockInTime,
                    clock_out: currentTime,
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Clock Out Response:", data);
                alert("Clocked Out Successfully at " + currentTime);
            })
            .catch((err) => console.error("Error:", err));
        };
    
    

    useEffect(() => {
      fetch('http://localhost:5000/leaves')
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched users:", data); // Debugging
          setLeaves(data);
        })
        .catch((error) => console.error('Error fetching users:', error));
    }, []);
  return (
    <div style={{display:'flex',justifyContent:'space-between',  width:'100%'}}>
        <Sidebar/>
    <div className="container-fluid" style={{width:'92%', overflowX:'hidden', overflow:'auto'}}>
        <div className="row mt-2">
            <div className="col-md-7">
                <div className='mx-auto' style={{width:'90%'}} >
                    <div className="card" id='idcard' style={{height:'300px', backgroundImage:'url(Assets/img/icard.png)', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center center'}}>
                    </div>
                    <div>
                    <p className='text-left'>Shortcuts</p>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <div className='bg-primary' style={{height:'100px', width: '100px', borderRadius:'50%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <img src="/Assets/svg/s-1.svg" alt="" style={{height:'40%'}} />
                        </div>
                        <div className='bg-primary' style={{height:'100px', width: '100px', borderRadius:'50%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <img src="/Assets/svg/s-2.svg" alt="" style={{height:'60%'}} />
                        </div>
                        <div className='bg-primary' style={{height:'100px', width: '100px', borderRadius:'50%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <img src="/Assets/svg/s-3.png" alt="" style={{height:'60%'}} />
                        </div>
                        <div className='bg-primary' style={{height:'100px', width: '100px', borderRadius:'50%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <img src="/Assets/svg/s-4.png" alt="" style={{height:'60%'}} />
                        </div>
                    </div>
                    </div>
                    <div>
                        <div style={{width:'100%',backgroundColor:'#ff5757',borderRadius:'10px',marginTop:'10px'}}>
                            <div className="row">
                                <div className="col-md-6" style={{borderRight:'1px solid white'}}>
                                    <p className='text-white mt-2'><strong>Attendance Rate</strong></p>
                                    <Chart1/>
                                </div>
                                <div className="col-md-6">
                                <p className='text-white mt-2'><strong>Efficiency</strong></p>
                                <Chart2 style={{width:'100px'}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-5">
                <div className='mx-auto' style={{width:'95%', height:'5%', display:'flex',justifyContent:'center',alignItems:'center', borderBottom:'1px solid rgb(0, 0, 0)'}}>
                    <div style={{width:'50%', display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                            <h3><span id='hour'>00</span>:<span id='min'>00</span>:<span id='sec'>00</span></h3>
                        
                    </div>
                    <div style={{width:'50%',height:"80%",alignItems:'center', justifyContent:'flex-end', display:'flex'}}>
                    <div style={{width:'50%',height:"100%", justifyContent:'space-between', display:'flex'}}>
                       <img src="/Assets/svg/icon/bell.svg" alt="" style={{height:'100%'}}/>
                       <img src="/Assets/svg/icon/setting.svg" alt="" style={{height:'100%'}}/>
                       <img src="/Assets/svg/icon/exit.svg" alt="" onClick={()=>handleLogout()} style={{height:'100%', cursor:'pointer'}}/>
                       </div>
                    </div>
                </div>
                <div className='mx-auto mt-3' style={{width:'95%', height:'5%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{width:'50%', display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <button onClick={handleClockIn} disabled={clockInTime} style={{width:'80%'}} className="btn btn-success">
                {/* {clockInTime ? `Clocked In at ${clockInTime}` : "Clock In"} */}
                Clock In
            </button>

                        
                    </div>
                    <div style={{width:'50%', display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <button onClick={handleClockOut} disabled={!clockInTime || clockOutTime} style={{width:'80%'}} className="btn btn-danger">
                {/* {clockOutTime ? `Clocked Out at ${clockOutT/ime}` : "Clock Out"} */}
                Clock Out
            </button>
                        
                    </div>
                    <div style={{width:'50%', display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <button className='btn btn-primary' style={{width:'80%'}}>Apply Leave</button>
                        
                    </div>
                    
                </div>
                <div className='mx-auto mt-3' style={{width:'95%', height:'25%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{width:'50%', height:'100%',display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <div className='btn btn-danger' style={{width:'80%', height:'100%'}}><h5>Total Leaves</h5>
                        <div className='mt-4' style={{lineHeight:'60%'}}>
                            {Leaves.map((leave)=>(
                                leave.type.map((l)=>(
                                    <p style={{fontSize:'1.4vw', fontWeight:'100'}}>{l.name} : {l.days}</p>
                                ))

                            ))}
                            
                     
                        </div>
                    </div>
                  
                        
                    </div>
                    <div style={{width:'50%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <div className='btn btn-primary' style={{width:'80%', height:'100%'}}><h5>Productive Hours</h5>
                    <p style={{fontSize:'3.5vw', fontWeight:'100', lineHeight:'100%'}}>100/
                        <br/><span style={{fontSize:'4vw',fontWeight:'400'}}>200</span></p></div>
                   
                    </div>
                    
                    
                </div>
                <div className='mx-auto mt-3' style={{width:'95%', height:'25%', display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{width:'50%', height:'100%',display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <div className='btn btn-success' style={{width:'80%', height:'100%'}}><h5>Tickets</h5>
                    
                    <div className='mt-4'>
                        <p style={{fontSize:'1.8vw', fontWeight:'100'}}>Active : 10</p>
                        <p style={{fontSize:'1.8vw', fontWeight:'100'}}>Closed : 10</p>
                        </div>
                    
                    </div>

                        
                    </div>
                    <div style={{width:'50%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}} >
                        
                    <div className='btn btn-danger' style={{width:'80%', height:'100%'}}><h5>Today’s Tasks</h5>
                    <div className='mt-4'>
                        <p style={{fontSize:'1.8vw', fontWeight:'100'}}>Pending : 10</p>
                        <p style={{fontSize:'1.8vw', fontWeight:'100'}}>Completed : 10</p>
                        </div>
                    </div>
                        
                    </div>
                    
                    
                </div>
                <div>
                        <div className='btn-primary' style={{width:'100%' ,height:"200px",borderRadius:'10px',marginTop:'10px', overflowY:'auto', overflowX:'hidden'}}>
                            <div className="row">
                                <div className="col-md-12 py-2" style={{borderRight:'1px solid white'}}>
                                    <p className='text-white'><strong>Today's Meetings</strong></p>

                                    <table style={{width:'90%', textAlign:'left', marginLeft:'auto', marginRight:'auto', color:'white'}}>
  <tr style={{border: "1px solid #dddddd"}}>
    <th>Meeting title</th>
    <th>Meeting Date</th>
    <th>Meeting Time</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  
</table>
                                  
                                </div>
                               
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    </div>
  )
}
