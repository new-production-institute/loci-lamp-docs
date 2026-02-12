import { useContext, useState, useEffect } from 'react'
import { ModelContext } from './ModelContext.jsx'
import useInterface from '../stores/useInterface.jsx'

    let btnTitlePrevious
    let btnTitleNext

export default function ButtonNext() {

    let { setStepPosition, stepCount, stepList } = useContext(ModelContext)
    const language = useInterface((state) => { return state.language })

    
     useEffect(()=>{
        if (language == 'EN'){
                    btnTitlePrevious = "Previous Step"
                    btnTitleNext = "Next Step"
        }
            if (language == 'DE'){
                    btnTitlePrevious = "Vorheriger Schritt" 
                    btnTitleNext = "Nächster Schritt"
   
        }
            console.log(language)

     },[language])

    const buttonClickNext = () => {

        stepCount++
        setStepPosition(stepCount)

    }
    const buttonClickPrevious = () => {

        stepCount--
        setStepPosition(stepCount)

    }

    return <>
        {stepCount >= 1 ?
            <button onClick={buttonClickPrevious} className="btn" id="nextStep" > &#10094; {btnTitlePrevious} &nbsp;</button> : null}

        {stepList && stepCount + 1 <= stepList.length - 1 ? <button onClick={buttonClickNext} className="btn" id="nextStep">{btnTitleNext} &#10095; </button> : null}
    </>
}

