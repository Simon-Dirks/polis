import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'

const WelcomeOverlay = ({}) => {
    return (
        <dialog id="welcome_overlay_modal" className="modal">
            <div className="modal-box p-8 md:p-12 text-base md:text-2xl bg-kennislink-dark-blue text-white max-w-5xl">
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
                    <form method="dialog" className={'inline-block'}>
                        <button
                            className={
                                'btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-normal text-base md:text-xl block md:inline-block mb-2 md:mb-0'
                            }
                        >
                            Ontdek nu
                        </button>
                    </form>

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
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}

export default connect(mapStateToProps, {})(WelcomeOverlay)
