import './style.css'
import ReactDOM from 'react-dom/client'
import React from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import Main from './main.jsx';
import Intro from './intro.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>


	<Router>
		   <Routes>
 								<Route path='/' element={<Intro />} />
								<Route path='/main' element={<Main />} />
        </Routes>
	   
	</Router> 
     </>

)

