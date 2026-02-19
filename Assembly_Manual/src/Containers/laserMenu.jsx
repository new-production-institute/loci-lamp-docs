import { useState, useEffect, useContext } from 'react'
import { NavLink, Link } from "react-router-dom";
import { ModelContext } from '../Components/ModelContext';
import axios from 'axios';


let counter = 0;
let laserMenuArray = new Array();
let howToTitleArray = new Array();
let arrayNumber = 0;
let filteredArr = new Array();
let howTos;



export default function LaserMenu() {

    let { setClickedPath, path, laserTitleArray, setLaserTitleArray } = useContext(ModelContext)

    useEffect(() => {
        //Get data from the Workbook 
        axios.get('https://sheets.googleapis.com/v4/spreadsheets/11ayVTVvDEbOezJJSL6N2_ct-rm7NgKWlpBPqqtvVh5U/values/Laser?key=AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM')
            .then(response => {

                let ourData = response.data.values;
                let bufferArray = new Array();
                let tempTitleArray = [];

                for (const row of ourData) {
                    if (counter > 0 && row[0] != '') {
                        bufferArray = new Array();
                        bufferArray.push(row);
                        laserMenuArray.push(bufferArray);

                    } else {
                        bufferArray.push(row);
                    }

                    ++counter;
                }

                for (const row of laserMenuArray) {
                    if (row[0] != '') {
                        filteredArr = new Array();
                        //howToTitleArray.push(row[0][1]);
                        filteredArr.push(row[0][0]);
                        tempTitleArray.push(filteredArr[0]);
                    }
                }
                setLaserTitleArray(tempTitleArray);
setClickedPath(tempTitleArray[0])
            })

            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    return <>
        <aside  className="stepNavi" style={{width: "200px"}}>
            <ul>
               {laserTitleArray ? laserTitleArray.map((name, index) => <li key={index}>
                {path && path == name ?
                            <button type="button" className='stepNaviBtn' style={{ backgroundColor: '#000000', color: '#ffffff' }}    onClick={()=>{setClickedPath(name)}}   >
                                {name}
                            </button> :
                              <button type="button" className='stepNaviBtn' onClick={()=>{setClickedPath(name)}}>
                                {name}
                            </button>}
                            

                </li>) : null}
            </ul>

        </aside>
 
    </>


}