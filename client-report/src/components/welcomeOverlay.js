import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import { updateWelcomeShown } from '../store/actions'

const WelcomeOverlay = ({ updateWelcomeShown }) => {
    return (
        <div
            className={
                'fixed w-screen h-screen bg-[rgba(255,255,255,0.6)] z-[99] p-8 flex items-center justify-center'
            }
        >
            <div
                className={
                    'w-9/12 max-w-[80rem] bg-kennislink-dark-blue text-white p-16 rounded-xl text-2xl'
                }
            >
                <p className={'text-5xl font-inter font-medium mb-6'}>
                    Hoe moeten we omgaan met het aanpassen van embryo-DNA?
                </p>
                <p className={'mb-4 font-inter'}>
                    Ontdek hoe bezoekers van Kennislink hebben gestemd op stellingen over het
                    aanpassen van embryo-DNA. Waar zijn we het over eens, en waar verschillen we van
                    mening?
                </p>
                <p className={'mb-4 font-inter'}>
                    Let op: behaalde resultaten bieden geen garantie voor de toekomst – elke nieuwe
                    uitgebrachte stem kan de resultaten beïnvloeden!
                </p>
                <p className={'font-inter'}>Heb je nog niet gestemd? Doe dat dan eerst.</p>

                <div className={'mt-8 text-center'}>
                    <button
                        className={
                            'font-inter btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-bold text-xl'
                        }
                        onClick={() => updateWelcomeShown(false)}
                    >
                        Ontdek nu
                    </button>
                    <span className={'mx-4 font-inter'}> of </span>
                    <a
                        className={
                            'font-inter btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-bold text-xl'
                        }
                        href={'https://www.nemokennislink.nl/pagina/polis-hoe-werkt-het/'}
                        target={'_blank'}
                    >
                        Eerst stemmen
                    </a>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, {
    updateWelcomeShown,
})(WelcomeOverlay)
