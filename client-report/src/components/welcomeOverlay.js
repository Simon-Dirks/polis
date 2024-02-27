import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import _ from 'lodash'

const WelcomeOverlay = ({ math, ptptCountTotal }) => {
    const computeVoteTotal = (users) => {
        let voteTotal = 0

        _.each(users, (count) => {
            voteTotal += count
        })

        return voteTotal
    }
    const closeModalButtonRef = useRef()

    return (
        <dialog id="welcome_overlay_modal" className="modal">
            <div className="modal-box p-8 md:p-12 text-base md:text-lg bg-kennislink-dark-blue text-white max-w-5xl">
                <p className={'text-xl md:text-3xl font-medium mb-6'}>
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
                <p className={'mb-4'}>Heb je nog niet gestemd? Doe dat dan eerst.</p>

                <div className={'block xl:hidden'}>
                    <p className={'font-bold'}>Huidige statistieken:</p>
                    <ul className={'list-disc pl-4'}>
                        <li>
                            <strong>{ptptCountTotal}</strong>&nbsp;deelnemers
                        </li>
                        {/*<span className={'ml-4'}>*/}
                        {/*    <strong>{ptptCount}</strong>&nbsp;gegroepeerd*/}
                        {/*</span>*/}
                        <li>
                            <strong>{computeVoteTotal(math['user-vote-counts'])}</strong>
                            &nbsp;stemmen
                        </li>
                        <li>
                            <strong>{math['n-cmts']}</strong>&nbsp;stellingen
                        </li>
                    </ul>
                </div>

                <div className={'mt-8 text-left'}>
                    <form method="dialog" className={'inline-block'}>
                        <button
                            className={
                                'btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-normal text-base md:text-lg block md:inline-block mb-2 md:mb-0'
                            }
                        >
                            Ontdek nu
                        </button>
                    </form>

                    <span className={'hidden md:inline-block mx-4'}> of </span>
                    <button
                        className={
                            'btn btn-outline text-white rounded-full border border-white hover:border-white hover:bg-white hover:text-kennislink-dark-blue font-normal text-base md:text-lg block md:inline-block'
                        }
                        onClick={() => {
                            closeModalButtonRef.current?.click()
                            document.getElementById('open_vote_modal_btn')?.click()
                        }}
                    >
                        Eerst stemmen
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button ref={closeModalButtonRef}>close</button>
            </form>
        </dialog>
    )
}

export default connect(mapStateToProps, {})(WelcomeOverlay)
