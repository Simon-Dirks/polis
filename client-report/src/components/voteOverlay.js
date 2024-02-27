import React, { useEffect } from 'react'

const VoteOverlay = () => {
    const iframeHeightReduction = 10

    // TODO: Replace with dynamic link to embed.js
    useEffect(() => {
        !(function () {
            var t = (window.polis = window.polis || {}),
                e = !window.polis._hasRun
            t._hasRun = 1
            var i = [],
                a = window.location.protocol + '//localhost'
            function o(t, e) {
                if ('string' != typeof e) return {}
                e.charAt(0) === t && (e = e.slice(1))
                for (var i = e.split('&'), a = {}, o = 0; o < i.length; o++) {
                    var r = i[o].split('=')
                    a[r[0]] = decodeURIComponent(r[1])
                }
                return a
            }
            ;(t.on = t.on || {}),
                (t.on.vote = t.on.vote || []),
                (t.on.doneVoting = t.on.doneVoting || []),
                (t.on.write = t.on.write || []),
                (t.on.resize = t.on.resize || []),
                (t.on.init = t.on.init || [])
            var r = o('#', window.location.hash),
                d = o('?', window.location.search),
                n = r.xid || d.xid
            function u(t) {
                return {
                    conversation_id: t.getAttribute('data-conversation_id'),
                    site_id: t.getAttribute('data-site_id'),
                    page_id: t.getAttribute('data-page_id'),
                    parent_url: t.getAttribute('data-parent_url'),
                    xid: t.getAttribute('data-xid') || n,
                    x_name: t.getAttribute('data-x_name'),
                    x_profile_image_url: t.getAttribute('data-x_profile_image_url'),
                    border: t.getAttribute('data-border'),
                    border_radius: t.getAttribute('data-border_radius'),
                    padding: t.getAttribute('data-padding'),
                    height: t.getAttribute('data-height'),
                    demo: t.getAttribute('data-demo'),
                    ucv: t.getAttribute('data-ucv'),
                    ucw: t.getAttribute('data-ucw'),
                    ucsh: t.getAttribute('data-ucsh'),
                    ucst: t.getAttribute('data-ucst'),
                    ucsd: t.getAttribute('data-ucsd'),
                    ucsv: t.getAttribute('data-ucsv'),
                    ucsf: t.getAttribute('data-ucsf'),
                    build: t.getAttribute('data-build'),
                    ui_lang: t.getAttribute('data-ui_lang'),
                    subscribe_type: t.getAttribute('data-subscribe_type'),
                    show_vis: t.getAttribute('data-show_vis'),
                    show_share: t.getAttribute('data-show_share'),
                    bg_white: t.getAttribute('data-bg_white'),
                    auth_needed_to_vote: t.getAttribute('data-auth_needed_to_vote'),
                    auth_needed_to_write: t.getAttribute('data-auth_needed_to_write'),
                    auth_opt_fb: t.getAttribute('data-auth_opt_fb'),
                    auth_opt_tw: t.getAttribute('data-auth_opt_tw'),
                    auth_opt_allow_3rdparty: t.getAttribute('data-auth_opt_allow_3rdparty'),
                    dwok: t.getAttribute('data-dwok'),
                    topic: t.getAttribute('data-topic'),
                }
            }
            function s(t, e) {
                var o = document.createElement('iframe'),
                    r = []
                e.parent_url = e.parent_url || window.location + ''
                var d = 'polis_',
                    n = []
                function u(t) {
                    null !== e[t] && void 0 !== e[t] && n.push(t + '=' + encodeURIComponent(e[t]))
                }
                if (e.conversation_id)
                    e.demo && r.push('demo'), r.push(e.conversation_id), (d += e.conversation_id)
                else {
                    if (!e.site_id)
                        return void alert('Error: need data-conversation_id or data-site_id')
                    if ((r.push(e.site_id), (d += e.site_id), !e.page_id))
                        return void alert('Error: need data-page_id when using data-site_id')
                    r.push(e.page_id), (d += '_' + e.page_id), u('demo')
                }
                var s = a + '/' + r.join('/')
                u('parent_url'),
                    e.parent_url && n.push('referrer=' + encodeURIComponent(document.referrer)),
                    u('build'),
                    u('xid'),
                    u('x_name'),
                    u('x_profile_image_url'),
                    u('ucv'),
                    u('ucw'),
                    u('ucsh'),
                    u('ucst'),
                    u('ucsd'),
                    u('ucsv'),
                    u('ucsf'),
                    u('ui_lang'),
                    u('subscribe_type'),
                    u('show_vis'),
                    u('show_share'),
                    u('bg_white'),
                    u('auth_needed_to_vote'),
                    u('auth_needed_to_write'),
                    u('auth_opt_fb'),
                    u('auth_opt_tw'),
                    u('auth_opt_allow_3rdparty'),
                    u('dwok'),
                    u('topic'),
                    n.length && (s += '?' + n.join('&')),
                    (o.src = s),
                    (o.width = '100%'),
                    (o.style.maxWidth = window.innerWidth + 'px'),
                    (o.height = e.height || 930),
                    (o.style.height = (e.height || 930) + 'px !important'),
                    (o.style.border = e.border || '1px solid #ccc'),
                    (o.style.borderRadius = e.border_radius || '4px'),
                    (o.style.padding = e.padding || '4px'),
                    (o.style.backgroundColor = 'white'),
                    (o.id = d),
                    o.setAttribute('data-test-id', 'polis-iframe'),
                    t.appendChild(o),
                    i.push(o)
            }
            e &&
                window.addEventListener(
                    'message',
                    function (e) {
                        var i = e.data || {}
                        if (e.origin.replace(/^https?:\/\//, '').match(/(^|\.)localhost$/)) {
                            for (var o = t.on[i.name] || [], r = [], d = 0; d < o.length; d++)
                                r.push(
                                    o[d]({
                                        iframe: document.getElementById('polis_' + i.polisFrameId),
                                        data: i,
                                    })
                                )
                            if (i && 'init' === i.name)
                                for (var n = 0; n < t.on.init.length; n++) t.on.init[n](i)
                            if (i && 'showResults' === i.name) {
                                document.getElementById('close_vote_overlay_modal_btn').click()
                            }
                            if (
                                ('cookieRedirect' === i &&
                                    (function () {
                                        var t = new Date(Date.now() + 1e3).toUTCString(),
                                            e = '_polistest_cookiesenabled'
                                        document.cookie = e + '=1; expires=' + t
                                        var i = -1 != document.cookie.indexOf(e)
                                        return (
                                            (document.cookie =
                                                e + '=; expires=' + new Date(0).toUTCString()),
                                            i
                                        )
                                    })() &&
                                    (window.location =
                                        a +
                                        '/api/v3/launchPrep?dest=' +
                                        (function (t) {
                                            var e,
                                                i = ''
                                            for (e = 0; e < t.length; e++)
                                                i += ('000' + t.charCodeAt(e).toString(16)).slice(
                                                    -4
                                                )
                                            return i
                                        })(window.location + '')),
                                'resize' === i.name)
                            ) {
                                for (var u = !1, s = 0; s < r.length; s++) !0 === r[s] && (u = !0)
                                if (!u) {
                                    console.log(i.polisFrameId)
                                    var _ = 'polis_' + i.polisFrameId,
                                        l = document.getElementById(_),
                                        c = i.height
                                    {
                                        let t =
                                            'max-width: 100%; border: 0; padding: 0; transition: height 0.25s; border-radius: .66rem;'
                                        c &&
                                            (t +=
                                                'height: ' +
                                                (c - iframeHeightReduction).toString() +
                                                'px !important;'),
                                            l.setAttribute('style', t)
                                    }
                                }
                            }
                        }
                    },
                    !1
                )
            for (var _ = document.getElementsByClassName('polis'), l = 0; l < _.length; l++) {
                var c = _[l]
                if (c.children && c.children.length);
                else s(c, u(c))
            }
        })()
    }, [])

    return (
        <dialog id="vote_overlay_modal" className="modal">
            <div className="modal-box p-0 max-w-3xl bg-kennislink-dark-blue">
                <div className="polis" data-conversation_id="6tfhikcfmr"></div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button id={'close_vote_overlay_modal_btn'}>close</button>
            </form>
        </dialog>
    )
}

export default VoteOverlay
