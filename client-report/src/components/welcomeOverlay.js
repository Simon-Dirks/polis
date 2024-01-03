import React, { useState } from 'react'

const WelcomeOverlay = () => {
    const [isShown, setIsShown] = useState(true)

    return (
        isShown && (
            <div
                className={
                    'fixed w-screen h-screen bg-[rgba(255,255,255,0.95)] z-[99] p-8 flex items-center justify-center'
                }
            >
                <div className={'w-3/4'}>
                    <p className={'text-5xl font-bold mb-4'}>Welkom bij de resultaten</p>
                    <p className={'mb-2'}>
                        Via onze interactieve tool doen we onderzoek naar de vraag: ‘Hoe moeten we
                        omgaan met het aanpassen van embryo-DNA?’ Alle resultaten vind je in deze
                        interactieve omgeving.
                    </p>
                    <p className={'mb-2'}>
                        Via de navigatie aan de bovenkant beweeg je door de resultaten heen. Is het
                        niet duidelijk? Via het vraagteken rechtsonder krijg je informatie over waar
                        je precies naar kijkt.
                    </p>
                    <p>Heb je nog niet gestemd? ...</p>

                    <div className={'mt-8 text-center'}>
                        <button
                            className={'btn bg-white border border-kennislink-light-gray uppercase'}
                            onClick={() => setIsShown(false)}
                        >
                            Ontdek nu
                        </button>
                        <span className={'mx-4'}> of </span>
                        <a
                            className={'btn bg-white border border-kennislink-light-gray uppercase'}
                            href={'https://www.nemokennislink.nl/pagina/polis-hoe-werkt-het/'}
                            target={'_blank'}
                        >
                            Eerst stemmen
                        </a>
                    </div>
                </div>
            </div>
        )
    )
}
export default WelcomeOverlay
