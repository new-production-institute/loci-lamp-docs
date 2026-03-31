import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Containers/Header";
import H1 from './pages/H1.jsx';
import H2 from './pages/H2.jsx';
import LaserMenu from "./Containers/laserMenu.jsx";
import LaserText from "./Containers/laserText.jsx";
import useInterface from './stores/useInterface.jsx'
import {
    fetchLaserSections,
    getFirstLaserPath,
    getLaserSectionByPath,
    getLaserTitles,
} from './Containers/laserData.js'

function useLaserSections(language) {
    const [laserSections, setLaserSections] = useState([])
    const [activePath, setActivePath] = useState('')

    useEffect(() => {
        let isCurrent = true
        setLaserSections([])
        setActivePath('')

        async function loadLaserSections() {
            try {
                const sections = await fetchLaserSections(language)
                if (!isCurrent) return
                setLaserSections(sections)
                setActivePath(getFirstLaserPath(sections))
            } catch (error) {
                if (!isCurrent) return
                setLaserSections([])
                setActivePath('')
                console.error('Error fetching laser instructions:', error)
            }
        }

        loadLaserSections()
        return () => { isCurrent = false }
    }, [language])

    return { laserSections, activePath, setActivePath }
}

function getAdjacentPath(laserTitles, activeIndex, direction) {
    return laserTitles[activeIndex + direction] ?? ''
}

export default function LaserInstructions() {
    const language = useInterface((state) => state.language)
    const { laserSections, activePath, setActivePath } = useLaserSections(language)
    const laserTitles = useMemo(() => getLaserTitles(laserSections), [laserSections])
    const activeIndex = laserTitles.indexOf(activePath)
    const sectionRows = useMemo(() => {
        return getLaserSectionByPath(laserSections, activePath)
    }, [activePath, laserSections])

    return <>
        <div className='header'>
            <Header />
        </div>
        <div id='app'>
            <LaserMenu activePath={activePath} laserTitles={laserTitles} onSelectPath={setActivePath} />
            <section id="currentLaserArea">
                <h2 id="laserTitleArea">{activePath}</h2>
                <nav className='currentStepBar' style={{ zIndex: 1 }}>
                    <div className="laserNavi">
                        {activeIndex > 0 ? <button className="btn" id="nextStep" onClick={() => setActivePath(getAdjacentPath(laserTitles, activeIndex, -1))}> &#10094; </button> : null}
                        {activeIndex >= 0 && activeIndex < laserTitles.length - 1 ? <button className="btn" id="nextStep" onClick={() => setActivePath(getAdjacentPath(laserTitles, activeIndex, 1))}>&#10095; </button> : null}
                    </div>
                </nav>
                <article className="textArea">
                    <LaserText sectionRows={sectionRows} />
                    <Routes>
                        <Route path='/H1' element={<H1 />} />
                        <Route path='/H2' element={<H2 />} />
                    </Routes>
                </article>
            </section>
        </div>
    </>
}
