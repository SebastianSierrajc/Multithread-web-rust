$(function () {
    var conn = null
    let c1 = { id: 'c1', s: 0, m: 0, h: 0, offset: 0 }
    let c2 = { id: 'c2', s: 0, m: 0, h: 0, offset: 0 }
    let c3 = { id: 'c3', s: 0, m: 0, h: 0, offset: 0 }

    function connect() {
        disconnect()
        var wsUri =
            ((window.location.protocol == 'https:' && 'wss://') || 'ws://') +
            window.location.host +
            '/ws/'
        conn = new WebSocket(wsUri)

        conn.onopen = function () {
            console.log('Websocket connected')
            conn.send('start')
            c1.offset = Date.now()
            c2.offset = Date.now()
            c3.offset = Date.now()
        }

        conn.onmessage = function (e) {
            if (e.data == '1') {
                calcTime(c1, () => paint_count(c1))
            } else if (e.data === '2') {
                calcTime(c2, () => paint_count(c2))
            } else if (e.data === '3') {
                calcTime(c3, () => paint_count(c3))
            }
        }

        conn.onclose = function () {
            conn = null
        }
    }

    function disconnect() {
        if (conn != null) {
            conn.close()
            conn = null
        }
    }

    function calcTime(c, callback) {
        const t = (Date.now() - c.offset) / 1000
        if (t > 59) {
            c.s = 0
            if (c.m + 1 > 59) {
                c.m = 0
                c.h += 1
            } else {
                c.m += 1
            }
            c.offset = Date.now()
        } else {
            c.s = Math.round(t)
        }

        callback()
    }

    function paint_count(c) {
        const s = c.s < 10 ? `0${c.s}` : `${c.s}`
        const m = c.m < 10 ? `0${c.m}` : `${c.m}`
        const h = c.h < 10 ? `0${c.h}` : `${c.h}`
        const time = `${h}:${m}:${s}`
        $(`#${c.id}`).html(time)
    }

    $('#start').click(() => {
        if (conn == null) {
            connect()
        }
    })

    $('#kill').click(() => {
        disconnect()
        c1 = { id: 'c1', s: 0, m: 0, h: 0, offset: 0 }
        c2 = { id: 'c2', s: 0, m: 0, h: 0, offset: 0 }
        c3 = { id: 'c3', s: 0, m: 0, h: 0, offset: 0 }
        paint_count(c1)
        paint_count(c2)
        paint_count(c3)
    })
})
