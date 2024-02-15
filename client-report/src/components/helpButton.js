import React from 'react'
import { Tooltip } from './tooltip'

const helpButton = ({ math }) => {
    const getNumberOfGroups = () => {
        return Object.keys(math['group-votes']).length
    }

    const getGroupIds = () => {
        return [...Array(getNumberOfGroups()).keys()]
    }

    return (
        <div className={'fixed bottom-4 right-4 z-50'}>
            <Tooltip
                renderOpener={({ ref, ...props }) => (
                    <button
                        ref={ref}
                        {...props}
                        className="btn btn-circle bg-kennislink-light-gray border-none text-white text-3xl font-normal"
                    >
                        ?
                    </button>
                )}
                placement="top"
                color={'#333740'}
            >
                <div
                    className={
                        'w-64 sm:w-96 rounded-lg p-6 mr-4 bg-kennislink-dark-blue text-white'
                    }
                >
                    <p className={'font-semibold text-sm md:text-base mb-2'}>Waar kijk ik naar?</p>
                    <p className={'text-sm md:text-base'}>
                        Elke cirkel is een stelling. Klik op een stelling om te zien hoe er gestemd
                        is. Als de meeste mensen hetzelfde hebben gestemd (meerderheid ‘eens’ of
                        ‘oneens’), is er veel overeenstemming. Die stellingen staan links.
                        Stellingen waar juist heel verschillend op is gestemd, verschijnen rechts.
                        Dat zijn stellingen met meer verdeeldheid. Gebruik de knop rechtsboven om
                        zelf te stemmen.
                    </p>

                    {/*<div className={'grid grid-cols-2'}>*/}
                    {/*    {getGroupIds().map((groupId) => {*/}
                    {/*        return (*/}
                    {/*            <p className={'mb-2'} key={groupId}>*/}
                    {/*                <svg*/}
                    {/*                    viewBox="0 0 20 20"*/}
                    {/*                    xmlns="http://www.w3.org/2000/svg"*/}
                    {/*                    className={'h-6 inline-block mr-3'}*/}
                    {/*                    fill={groupColor(groupId)}*/}
                    {/*                >*/}
                    {/*                    <circle cx="10" cy="10" r="10" />*/}
                    {/*                </svg>*/}
                    {/*                <span>Groep {groupLabels[groupId]}</span>*/}
                    {/*            </p>*/}
                    {/*        )*/}
                    {/*    })}*/}

                    {/*    <p className={'mb-2'}>*/}
                    {/*        <svg*/}
                    {/*            viewBox="0 0 20 20"*/}
                    {/*            xmlns="http://www.w3.org/2000/svg"*/}
                    {/*            className={'h-6 inline-block mr-3 fill-[#A8A8A8]'}*/}
                    {/*        >*/}
                    {/*            <circle cx="10" cy="10" r="10" />*/}
                    {/*        </svg>*/}
                    {/*        <span>Geen</span>*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                </div>
            </Tooltip>
        </div>
    )
}
export default helpButton
