import { useEffect, useState } from 'react'
import useInterface from '/stores/useInterface.jsx';
import { MdClose } from "react-icons/md";

function getMenuButtonTitle(language) {
    return language === 'DE' ? 'Schritte' : 'Steps'
}

function useResetMenuOnResize(setIsShown) {
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 890) {
                setIsShown(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [setIsShown])
}

function LaserMenuItem({ isActive, name, onSelect }) {
    const style = isActive ? { backgroundColor: '#000000', color: '#ffffff' } : undefined
    return (
        <li>
            <button type="button" className="stepNaviBtn" style={style} onClick={() => onSelect(name)}>
                {name}
            </button>
        </li>
    )
}

export default function LaserMenu({ activePath, laserTitles, onSelectPath }) {
    const language = useInterface((state) => state.language)
    const [isShown, setIsShown] = useState(false)

    useResetMenuOnResize(setIsShown)

    function handleToggleMenu() {
        setIsShown((currentValue) => !currentValue)
    }

    function handleSelectPath(path) {
        onSelectPath(path)
        setIsShown(false)
    }

    return <>
        <button className='hamburgerStepNavi' onClick={handleToggleMenu}>
            {isShown ? <MdClose /> : getMenuButtonTitle(language)}
        </button>
        <aside className={isShown ? 'stepNaviMobile' : 'stepNavi'} style={{ width: '280px' }}>
            <ul>
                {laserTitles.map((name) => (
                    <LaserMenuItem
                        key={name}
                        isActive={activePath === name}
                        name={name}
                        onSelect={handleSelectPath}
                    />
                ))}
            </ul>
        </aside>
    </>
}
