import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import { updateWelcomeShown } from '../store/actions'

const WelcomeOverlay = ({ updateWelcomeShown }) => {
    return (
        <div
            className={
                'fixed w-screen h-screen bg-[rgba(255,255,255,0.6)] z-[99] p-4 md:p-8 flex items-center justify-center'
            }
        >
            <div
                className={
                    'w-11/12 md:w-9/12 max-w-[80rem] bg-kennislink-dark-blue text-white p-8 md:p-16 rounded-xl text-base md:text-2xl max-h-full overflow-y-auto'
                }
            >
                <p className={'text-xl md:text-5xl font-medium mb-6'}>
                    Hoe moeten we omgaan met het aanpassen van embryo-DNA?
                </p>
                <p className={'mb-4'}>
                    Ontdek hoe bezoekers van Kennislink hebben gestemd op stellingen over het
                    aanpassen van embryo-DNA. Waar zijn we het over eens, en waar verschillen we van
                    mening?
                </p>
                <p className={'mb-4'}>
                    Let op: behaalde resultaten bieden geen garantie voor de toekomst – elke nieuwe
                    uitgebrachte stem kan de resultaten beïnvloeden!
                </p>
                <p>Heb je nog niet gestemd? Doe dat dan eerst.</p>

                <div className={'mt-8 text-left md:text-center'}>
                    <button
                        className={
                            'btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-normal text-base md:text-xl block md:inline-block mb-2 md:mb-0'
                        }
                        onClick={() => updateWelcomeShown(false)}
                    >
                        Ontdek nu
                    </button>
                    <span className={'hidden md:inline-block mx-4'}> of </span>
                    <button
                        className={
                            'btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-normal text-base md:text-xl block md:inline-block'
                        }
                        href={'https://www.nemokennislink.nl/pagina/polis-hoe-werkt-het/'}
                        target={'_blank'}
                    >
                        Eerst stemmen
                    </button>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, {
    updateWelcomeShown,
})(WelcomeOverlay)
