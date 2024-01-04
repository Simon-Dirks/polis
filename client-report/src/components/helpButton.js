import React from 'react'
import { Tooltip } from './tooltip'
import { groupColor, groupLabels } from './globals'

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
                    <p className={'mb-4'}>
                        Je kijkt nu naar het overzicht van alle deelnemers. Ieder bolletje is iemand
                        die gestemd heeft en de positie wordt bepaald op basis van stemgedrag.
                        Deelnemers die eenzelfde stemgedrag hebben, worden met elkaar in een groep
                        geplaatst en krijgen de kleur van die groep.
                    </p>

                    <div className={'grid grid-cols-2'}>
                        {getGroupIds().map((groupId) => {
                            return (
                                <p className={'mb-2'} key={groupId}>
                                    <svg
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={'h-6 inline-block mr-3'}
                                        fill={groupColor(groupId)}
                                    >
                                        <circle cx="10" cy="10" r="10" />
                                    </svg>
                                    <span>Groep {groupLabels[groupId]}</span>
                                </p>
                            )
                        })}

                        <p className={'mb-2'}>
                            <svg
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                className={'h-6 inline-block mr-3 fill-[#A8A8A8]'}
                            >
                                <circle cx="10" cy="10" r="10" />
                            </svg>
                            <span>Geen</span>
                        </p>
                    </div>
                </div>
            </Tooltip>
        </div>
    )
}
export default helpButton
