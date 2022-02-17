$(function () {
    var conn = null
    var c1 = { s: 0, m: 0, h: 0 }
    var c2 = 0
    var c3 = 0
    var offset

    function log(msg) {
        var control = $('#log')
        control.html(control.html() + msg + '<br/>')
        control.scrollTop(control.scrollTop() + 1000)
    }

    function connect() {
        disconnect()
        var wsUri =
            ((window.location.protocol == 'https:' && 'wss://') || 'ws://') +
            window.location.host +
            '/ws/'
        conn = new WebSocket(wsUri)
        log('Connecting...')

        conn.onopen = function () {
            offset = Date.now()
            log('Connected.')
            update_ui()
        }

        conn.onmessage = function (e) {
            if (e.data == '1') {
                const t = (Date.now() - offset) / 1000
                if (t > 59) {
                    c1['s'] = 0
                    c1['m'] += 1
                    offset = Date.now()
                } else {
                    c1['s'] = Math.round(t)
                }

                console.log(`${c1['h']}:${c1['m']}:${c1['s']}`)
            }

            log('Received: ' + e.data)
        }

        conn.onclose = function () {
            log('Disconnected.')
            conn = null
            update_ui()
        }
    }

    function disconnect() {
        if (conn != null) {
            log('Disconnecting...')
            conn.close()
            conn = null
            update_ui()
        }
    }

    function update_ui() {
        var msg = ''
        if (conn == null) {
            $('#status').text('disconnected')
            $('#connect').html('Connect')
        } else {
            $('#status').text('connected (' + conn.protocol + ')')
            $('#connect').html('Disconnect')
        }
    }

    $('#connect').click(function () {
        if (conn == null) {
            connect()
        } else {
            disconnect()
        }
        update_ui()
        return false
    })

    $('#send').click(function () {
        var text = $('#text').val()
        log('Sending: ' + text)
        conn.send(text)
        $('#text').val('').focus()
        return false
    })

    $('#text').keyup(function (e) {
        if (e.keyCode === 13) {
            $('#send').click()
            return false
        }
    })
})
