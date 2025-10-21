import React from 'react'
import '../App.css'
import Bowl from '../components/Bowl'

const ViewAllBowls = () => {
    // const [bowls, setBowls] = useState([]);

    // useEffect(() => {
    //     //fetch bowls from server
    // }, []);

    return (
          <section className="container-fluid">
      <header className="all-bowls-header">
        <h1>All Ramen Bowls</h1>
      </header>
      <div className="card-grid">
        {/* {bowls.map((bowl) => (
          <Bowl key={bowl.id} bowl={bowl} />
        ))} */}
      </div>
    </section>
  );
}

export default ViewAllBowls