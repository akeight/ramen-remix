import {useEffect, useState} from 'react';
import '../App.css';

//import services API

const Bowl = () => {
    const [bowls, setBowls] = useState([])
    
    useEffect(() => {
        //fetch bowls from server
    }, [])

    return ( 
        <div className="grid">
            <article className="card">
              <header>
                <h3>Bowl Title</h3>
              </header>
              <p>
                {/* <i class="fa-utility-duo fa-semibold fa-calendar"></i> */}
                <br/>
                
              </p>
              
            
              <p>Bowl Item Details</p>
              <p>Bowl Description</p>
                <small>Additional Bowl Info</small>
            </article>
            </div>
     );
}

export default Bowl;