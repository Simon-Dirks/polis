import React from 'react'

const helpButton = () => {
    return (
        <div className={'fixed bottom-4 right-4'}>
            <div className="dropdown dropdown-top dropdown-end">
                <div
                    tabIndex="0"
                    role="button"
                    className="btn btn-circle bg-kennislink-light-gray border-none text-white text-3xl"
                >
                    <span>?</span>
                </div>
                <div
                    tabIndex="0"
                    className="dropdown-content z-[1] w-64 mb-2 text-xs sm:text-sm !bg-[#333740] !border-none !rounded-md p-6 text-white"
                >
                    <div tabIndex="0">
                        <p className={'font-bold mb-2'}>Waar kijk ik naar?</p>
                        <p className={'mb-2'}>
                            Je kijkt nu naar het overzicht van alle deelnemers. Ieder bolletje is
                            iemand die gestemd heeft en de positie wordt bepaald op basis van
                            stemgedrag. Deelnemers die eenzelfde stemgedrag hebben, worden met
                            elkaar in een groep geplaatst en krijgen de kleur van die groep.
                        </p>
                        <p className={'font-mono text-red-500'}>TODO: Groepen hier</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default helpButton
