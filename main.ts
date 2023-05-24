input.onButtonEvent(Button.AB, ButtonEvent.Click, function () {
    if (modus == "setzen") {
        if (schiffe[fadenkreuz_y][fadenkreuz_x] == 0) {
            schiffe[fadenkreuz_y][fadenkreuz_x] = 9
            schiffe_gesetzt += 1
            music.playTone(262, music.beat(BeatFraction.Sixteenth))
        } else {
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
    } else if (modus == "angriff") {
        if (schuesse[fadenkreuz_y][fadenkreuz_x] == 0) {
            music.playTone(262, music.beat(BeatFraction.Sixteenth))
            modus = "senden_angriff"
        } else {
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
    }
})
input.onButtonEvent(Button.A, ButtonEvent.Click, function () {
    if (modus == "setzen" || modus == "angriff") {
        fadenkreuz_y += 1
        if (fadenkreuz_y == 5) {
            fadenkreuz_y = 0
        }
    }
})
function LED_Setzen () {
    basic.setLedColor(Colors.Blue)
    basic.clearScreen()
    led.plot(fadenkreuz_x, fadenkreuz_y)
    basic.pause(100)
    anschalten_array = schiffe
    anschalten_wert = 9
    doAnschalten()
    basic.pause(100)
}
input.onButtonEvent(Button.B, ButtonEvent.Click, function () {
    if (modus == "setzen" || modus == "angriff") {
        fadenkreuz_x += 1
        if (fadenkreuz_x == 5) {
            fadenkreuz_x = 0
        }
    }
})
function AufAngriffPruefen () {
    if (angriff_x >= 0 && angriff_y >= 0) {
        if (schiffe[angriff_y][angriff_x] == 0) {
            schiffe[angriff_y][angriff_x] = 1
            ergebnis = 1
        } else {
            schiffe[angriff_y][angriff_x] = 2
            treffer += 1
            ergebnis = 9
        }
        if (treffer == schiffe_max) {
            ergebnis = 99
            modus = "verloren"
        } else {
            modus = "senden_verteidigung"
        }
    }
}
function LED_Angriff () {
    basic.setLedColor(Colors.Red)
    basic.clearScreen()
    led.plot(fadenkreuz_x, fadenkreuz_y)
    basic.pause(100)
    anschalten_array = schuesse
    anschalten_wert = 9
    doAnschalten()
    basic.pause(300)
    anschalten_wert = 1
    doAnschalten()
    basic.pause(300)
}
function doAnschalten () {
    for (let y = 0; y <= 4; y++) {
        for (let x = 0; x <= 4; x++) {
            if (anschalten_array[y][x] == anschalten_wert) {
                led.plot(x, y)
            }
        }
    }
}
function LED_Verteidigung () {
    basic.setLedColor(Colors.Green)
    basic.clearScreen()
    anschalten_array = schiffe
    anschalten_wert = 9
    doAnschalten()
    basic.pause(100)
    anschalten_wert = 2
    doAnschalten()
    basic.pause(300)
    anschalten_wert = 1
    doAnschalten()
    basic.pause(300)
}
let treffer = 0
let ergebnis = 0
let anschalten_wert = 0
let anschalten_array: number[][] = []
let schiffe_max = 0
let modus = ""
let angriff_y = 0
let angriff_x = 0
let fadenkreuz_y = 0
let fadenkreuz_x = 0
let schuesse: number[][] = []
let schiffe: number[][] = []
schiffe = [
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
]
]
schuesse = [
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
],
[
0,
0,
0,
0,
0,
0
]
]
fadenkreuz_x = 2
fadenkreuz_y = 2
angriff_x = -1
angriff_y = -1
modus = "setzen"
let schiffe_gesetzt = 0
schiffe_max = 5
basic.forever(function () {
    if (modus == "setzen") {
        if (schiffe_gesetzt == schiffe_max) {
            modus = "teamwahl"
            fadenkreuz_x = 2
            fadenkreuz_y = 2
        }
        LED_Setzen()
    } else if (modus == "angriff") {
        LED_Angriff()
    } else if (modus == "verteidigung") {
        radio.sendValue("funk_ende", 0)
        AufAngriffPruefen()
        LED_Verteidigung()
    } else if (modus == "gewonnen") {
        basic.showIcon(IconNames.Happy)
    } else if (modus == "verloren") {
        radio.sendValue("a_rueckgabe", ergebnis)
        basic.showIcon(IconNames.Sad)
    } else if (modus == "senden_angriff") {
        basic.setLedColor(Colors.Orange)
        radio.sendValue("a_feld_y", fadenkreuz_y)
        radio.sendValue("a_feld_x", fadenkreuz_x)
    } else if (modus == "senden_verteidigung") {
        basic.setLedColor(Colors.Blue)
        for (let i = 0; i <= 20; i++) {
            led.toggle(angriff_x, angriff_y)
            basic.pause(50)
        }
        angriff_x = -1
        angriff_y = -1
        radio.sendValue("a_rueckgabe", ergebnis)
    } else if (modus == "teamwahl") {
        let team = 0
        if (team == 1) {
            modus = "verteidigung"
        } else {
            radio.sendValue("team", 1)
        }
    }
})
