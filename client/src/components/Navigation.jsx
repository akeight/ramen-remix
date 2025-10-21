import React from 'react'
import '../App.css'
import '../css/Navigation.css'

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><h1>RAMEN REMIX <img src='../public/ramen.svg' alt='Ramen Bowl' width={75} /></h1></li>
            </ul>

            <ul>
                <li><a href='/' role='button'>Home</a></li>
                <li><a href='/menu' role='button'>Build-A-Bowl</a></li>
                <li><a href='/bowls' role='button'>View Ramen Bowls</a></li>
            </ul>
            
        </nav>
    )
}

export default Navigation