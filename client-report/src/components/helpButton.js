import React, { useRef } from 'react'
import { Tooltip } from './tooltip'

const helpButton = () => {
    const buttonRef = useRef(null)

    return (
        <div className={'fixed bottom-4 right-4 z-50'}>
            <Tooltip
                renderOpener={({ ref, ...props }) => (
                    <button
                        ref={ref}
                        {...props}
                        className="btn btn-circle bg-kennislink-light-gray border-none text-white text-3xl"
                    >
                        ?
                    </button>
                )}
                placement="top"
                color={'#333740'}
            >
                {/*TODO: Make help content dynamic*/}
                <div className={'w-64 sm:w-96 rounded-lg p-6 mr-4 bg-[#333740] text-white'}>
                    <p className={'font-bold mb-2'}>Waar kijk ik naar?</p>
                    <p className={'mb-2'}>
                        Je kijkt nu naar het overzicht van alle deelnemers. Ieder bolletje is iemand
                        die gestemd heeft en de positie wordt bepaald op basis van stemgedrag.
                        Deelnemers die eenzelfde stemgedrag hebben, worden met elkaar in een groep
                        geplaatst en krijgen de kleur van die groep.
                    </p>
                    <p className={'font-mono text-red-500'}>TODO: Groepen hier</p>
                </div>
            </Tooltip>
        </div>
    )
}
export default helpButton
