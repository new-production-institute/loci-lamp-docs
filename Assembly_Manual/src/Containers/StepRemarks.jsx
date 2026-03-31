import { useContext, useEffect, useMemo, useState } from 'react'
import { ModelContext } from '/Components/ModelContext.jsx';
import { LuAlertCircle } from "react-icons/lu";
import useInterface from '/stores/useInterface.jsx';
import { fetchWorkbookSteps } from './workbookData.js'

function getRemarksTitle(language) {
    return language === 'DE' ? 'Bemerkungen' : 'Remarks'
}

function getCurrentStepRows(language, stepCount, stepGroups) {
    const groups = language === 'DE' ? stepGroups.DE : stepGroups.EN
    return groups[stepCount] || []
}

function getStepRemarks(rows) {
    return rows.map((row) => row[10]).filter(Boolean)
}

function useStepGroups() {
    const [stepGroups, setStepGroups] = useState({ EN: [], DE: [] })

    useEffect(() => {
        let isCurrent = true

        async function loadStepGroups() {
            try {
                const [enSteps, deSteps] = await Promise.all([
                    fetchWorkbookSteps('Workbook'),
                    fetchWorkbookSteps('Workbook-DE'),
                ])
                if (!isCurrent) return
                setStepGroups({ EN: enSteps, DE: deSteps })
            } catch (error) {
                if (!isCurrent) return
                setStepGroups({ EN: [], DE: [] })
                console.error('Error fetching step remarks data:', error)
            }
        }

        loadStepGroups()
        return () => { isCurrent = false }
    }, [])

    return stepGroups
}

export default function StepRemarks() {
    const { stepCount } = useContext(ModelContext)
    const boxVisibility = useInterface((state) => { return state.isVisible })
    const language = useInterface((state) => { return state.language })
    const isNotVisibleToggle = useInterface((state) => { return state.isNotVisibleToggle })
    const isVisibleToggle = useInterface((state) => { return state.isVisibleToggle })
    const stepGroups = useStepGroups()
    const stepRemarks = useMemo(() => {
        const currentRows = getCurrentStepRows(language, stepCount, stepGroups)
        return getStepRemarks(currentRows)
    }, [language, stepCount, stepGroups])

    useEffect(() => {
        if (stepRemarks.length === 0) {
            isNotVisibleToggle()
            return
        }

        isVisibleToggle()
    }, [isNotVisibleToggle, isVisibleToggle, stepRemarks])

    return <>
        {stepRemarks.length > 0 ? <div>
            <div id='RemarksTitle' style={{ alignContent: 'baseline', visibility: `${boxVisibility}` }} >
                <h3> <LuAlertCircle /> {getRemarksTitle(language)}</h3> <br />
            </div>
            <ul>
                {stepRemarks.map((name, index) => <li key={index}> {name}</li>)}
            </ul>
        </div> : null}
    </>
}
