import axios from "axios"
import { useState, useEffect, useContext } from "react";
import { ModelContext } from "/Components/ModelContext";


let filteredArr = new Array();
let tempArray = [];
 let counter = 0;
                let laserArray = new Array();

export default function LaserText() {

    const [laserTitle, setLaserTitle] = useState([]);
    const [laserTextArray, setLaserTextArray] = useState([]);
    const [sectionArray, setSectionArray] = useState([])
    let {path, laserTitleArray, setLaserTitleArray, laserMenuCount, setLaserCount, setClickedPath} = useContext(ModelContext)

useEffect(() =>{

        axios.get('https://sheets.googleapis.com/v4/spreadsheets/11ayVTVvDEbOezJJSL6N2_ct-rm7NgKWlpBPqqtvVh5U/values/Laser?key=AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM')
            .then(response => {
                let bufferArray = new Array();
                const ourData = response.data.values || [];
                for (const row of ourData) {
                    if (counter > 0 && row[0] != '') {
                        bufferArray = new Array();
                        bufferArray.push(row);
                        laserArray.push(bufferArray);

                    } else {
                        bufferArray.push(row);
                    }
                    ++counter;                    
                }
  let textArray = []
                  let tempSectionArray = []

                const tempLaserTitle = laserArray.reduce((title, arr) => {
                    if (arr[0].includes(`${laserArray[0][0][0]}`)) {
                        const currentTitle = arr[0][1]
                         for (const row of arr){
                            tempSectionArray.push(row)

                            textArray.push(row[2])
                         }
setSectionArray(tempSectionArray)

                        title.push(currentTitle)
                    }

                    return title
                }, [])

                setLaserTitle(tempLaserTitle[0])
                setLaserTextArray(textArray);  
                            })
                            .catch(error => {
                console.error('Error fetching data:', error);
            }); 


}, [])
       

    useEffect(() => {
                let textArray = []
                let tempSectionArray = []
if (path){ 
  let index = laserTitleArray.indexOf(`${path}`)
setLaserCount(index)
}
                                 
                const tempLaserTitle = laserArray.reduce((title, arr, index) => {
                    if (arr[0].includes(`${path}`)) {
                        
                        const currentTitle = arr[0][1]
                         for (const row of arr){
tempSectionArray.push(row)
                            textArray.push(row[2])
                         }
setSectionArray(tempSectionArray)
                        title.push(currentTitle)
                        setLaserTitle(title)
                    }
                    return title
                }, [])

                setLaserTextArray(textArray);  
    }, [path]);

    useEffect(() =>{
setClickedPath(`${laserTitleArray[laserMenuCount]}`)
    }, [laserMenuCount])

    return <>
        <div className="sectionLaser">
            <ul>
                {sectionArray ? sectionArray.map((name, index) => <li key={index}> 
                                <h1 className='sectionTitle' style={{marginTop : "30px"}}>{name[1] ? `${name[1]}` : null}</h1>
{name[2]} 
{name[3]  ? <img src={name[3]} className="sectionImage" style={{height: "450px", display: "block"}}/>: null} 
{name[4]? <a href={name[4]} style={{textDecoration: "none"}} target="blank"><button className="btn" style={{display: "block", margin: "auto", marginTop: "30px", textDecoration: "none"}}>Download</button></a>: null}
</li>) : null}
            </ul>
        </div>
    </>
}