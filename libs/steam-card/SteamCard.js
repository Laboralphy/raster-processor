/* steam-card.js */
const ROTATION_AMPLITUDE = 30
const BRIGHTNESS_AMPLITUDE = 45
const ZOOM_AMPLITUDE = 0.4

class SteamCard {
    loadCSS () {
        const sCSS =
            `/* steam card css */

div.steam-card {
    --head-padding: 0.5em;
    --head-size: 80%;
    --card-width: 12em;
    --card-height: 15em;
    --mark-size: 1.25em;
}

div.steam-card.blue {
    --color-bg-inner-card: #7db1d2;
    --color-bg-grad-1: rgba(4, 8, 14, 1);
    --color-bg-grad-2: rgba(32, 62, 108, 1);
    --color-stripes: rgba(52, 116, 210, 0.08);
}

div.steam-card.red {
    --color-bg-inner-card: #d27d7d;
    --color-bg-grad-1: rgb(14, 4, 4);
    --color-bg-grad-2: rgb(108, 32, 32);
    --color-stripes: rgba(210, 52, 52, 0.08);
}

div.steam-card.orange {
    --color-bg-inner-card: #d29e7d;
    --color-bg-grad-1: rgb(14, 7, 4);
    --color-bg-grad-2: rgb(108, 55, 32);
    --color-stripes: rgba(210, 94, 52, 0.08);
}

div.steam-card.yellow {
    --color-bg-inner-card: #d2c77d;
    --color-bg-grad-1: rgb(14, 12, 4);
    --color-bg-grad-2: rgb(108, 93, 32);
    --color-stripes: rgba(210, 178, 52, 0.08);
}

div.steam-card.green {
    --color-bg-inner-card: #95d27d;
    --color-bg-grad-1: rgb(6, 14, 4);
    --color-bg-grad-2: rgb(46, 108, 32);
    --color-stripes: rgba(91, 210, 52, 0.08);
}

div.steam-card.purple {
    --color-bg-inner-card: #b07dd2;
    --color-bg-grad-1: rgb(10, 4, 14);
    --color-bg-grad-2: rgb(78, 32, 108);
    --color-stripes: rgba(147, 52, 210, 0.08);
}

div.steam-card.gray {
    --color-bg-inner-card: #d7d7d7;
    --color-bg-grad-1: rgb(16, 16, 16);
    --color-bg-grad-2: rgb(110, 110, 110);
    --color-stripes: rgba(211, 211, 211, 0.08);
}

div.steam-card.cyan {
    --color-bg-inner-card: #7dd2bb;
    --color-bg-grad-1: rgb(4, 14, 12);
    --color-bg-grad-2: rgb(32, 108, 90);
    --color-stripes: rgba(52, 210, 173, 0.08);
}

div.steam-card {
    transform: translateZ(50px);
    transition: transform 0.15s;
    cursor: default;
}

div.steam-card {
    width: var(--card-width);
    height: var(--card-height);
    padding: 0;
    border-radius: 0.35em;
    border: solid thin var(--color-bg-grad-2);
    background: linear-gradient(
        0deg, var(--color-bg-grad-1) 0%,
        var(--color-bg-grad-2) 100%
    );
    box-shadow: rgba(0, 0, 0, 0.35) 0 0.2em 1em;
}

div.steam-card > div.sc-stripes {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: repeating-linear-gradient(
        -45deg,
        var(--color-stripes),
        transparent 2px,
        var(--color-stripes) 4px
    );
}

div.steam-card > div.sc-stripes > div.sc-head {
    width: calc(100% - 2 * var(--head-padding));
    height: calc(var(--head-size) - 2 * var(--head-padding));
    padding: var(--head-padding);
    margin: 0;
}

div.steam-card > div.sc-stripes > div.sc-head > div.sc-inner-card {
    background-color: var(--color-bg-inner-card);
    width: 100%;
    height: 100%;
    border-radius: 0.2em;
    padding: 0;
    margin: 0;
}

div.steam-card > div.sc-stripes > div.sc-head > div.sc-inner-card > div.sc-title {
    font-family: Arial, sans-serif;
    font-size: 0.85em;
    margin-left: 0.4em;
    height: 10%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #080808;
}

div.steam-card > div.sc-stripes > div.sc-head > div.sc-inner-card > div.sc-image {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 87%;
    text-align: center;
}

div.steam-card > div.sc-stripes > div.sc-head > div.sc-inner-card > div.sc-image > img {
    border: thin solid rgba(0, 0, 0, 0.5);
    border-radius: 0.25em;
    max-width: 95%;
    max-height: 100%;
    object-fit: contain;
}

div.steam-card > div.sc-stripes > div.sc-bottom {
    width: 100%;
    height: calc(100% - var(--head-size));
    padding: 0;
    margin: 0;
    background: radial-gradient(
        ellipse at bottom, 
        var(--color-bg-grad-2),
        transparent 70%,
        transparent 100%
    );
}

div.steam-card > div.sc-stripes > div.sc-bottom > div.sc-mark {
    font-family: "Georgia", serif;
    font-size: var(--mark-size);
    font-weight: bold;
    font-style: italic;
    color: #EEE;
    text-shadow: black 0.05em 0.05em 0.15em, black -0.05em -0.05em 0.15em;
    position: absolute;
    bottom: 0.25em;
    width: 100%;
    text-align: center;
}

div.steam-card > div.sc-stripes > div.sc-bottom > div.sc-logo {
    width: 100%;
    position: absolute;
    bottom: 0.05em;
}

div.steam-card > div.sc-stripes > div.sc-bottom > div.sc-logo > img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

@keyframes blinker {
  from { 
    border-color: #FFF; 
  }
  to { 
    border-color: var(--color-bg-grad-2);
  }
}

div.steam-card.flash {
    border-size: thick;
    animation-name: blinker;
    animation-iteration-count: 4;
    animation-timing-function: linear;
    animation-duration: 200ms;
}
`
        if (!document.getElementById('steam-card-stylesheet')) {
            const oCSS = this.createElement('style', { id: 'steam-card-stylesheet', type: 'text/css' }, sCSS)
            const oHead = document.querySelector('head')
            oHead.appendChild(oCSS)
        }
    }

    rotateElement(oElement, x100, y100) {
        const w = oElement.offsetWidth
        const h = oElement.offsetHeight
        const nAmp = ROTATION_AMPLITUDE
        const xDeg = -(x100 - 0.5) * nAmp
        const yDeg = (y100 - 0.5) * nAmp
        const nTranslateZ = w * ZOOM_AMPLITUDE
        const sTransform = `perspective(350px) translateZ(${nTranslateZ}px) rotateY(${xDeg}deg) rotateX(${yDeg}deg)`
        const nBright = 100 * ((1 - y100) * (BRIGHTNESS_AMPLITUDE / 100) + 1)
        oElement.setAttribute('style', `transform: ${sTransform}; filter: brightness(${nBright}%)`)
    }

    resetElementRotation(oElement) {
        oElement.__willBeReset = setTimeout(() => {
            oElement.setAttribute('style', ``)
            delete oElement.__willBeReset
        }, 100)
    }

    continueElementRotation(oElement) {
        if (oElement.__willBeReset) {
            clearTimeout(oElement.__willBeReset)
            delete oElement.__willBeReset
        }
    }

    getParentSteamCard(oElement, x, y) {
        let e = {
            element: oElement,
            x,
            y
        }
        while (e.element) {
            e.x += e.element.offsetLeft
            e.y += e.element.offsetTop
            if ([...e.element.classList].includes('steam-card')) {
                e.x -= e.element.offsetLeft
                e.y -= e.element.offsetTop
                return e
            }
            e.element = e.element.offsetParent
        }
        return e
    }

    declareElement(oElement) {
        oElement.addEventListener('mousemove', oEvent => {
            this.continueElementRotation(oElement)
            const {element, x, y} = this.getParentSteamCard(oEvent.target, oEvent.offsetX, oEvent.offsetY)
            const x100 = x / element.offsetWidth
            const y100 = y / element.offsetHeight
            this.rotateElement(element, x100, y100)

        }, {capture: true})
        oElement.addEventListener('mouseout', oEvent => {
            this.resetElementRotation(oElement)
        }, {capture: true})
    }

    declareElements(aElements) {
        aElements.forEach(e => {
            this.declareElement(e)
        })
    }

    createElement(tag, attributes, aChildren) {
        const oElement = document.createElement(tag)
        for (const sAttr in attributes) {
            oElement.setAttribute(sAttr, attributes[sAttr])
        }
        if (Array.isArray(aChildren)) {
            aChildren.forEach(c => oElement.appendChild(c))
        } else if (typeof aChildren === 'string') {
            oElement.appendChild(document.createTextNode(aChildren))
        }
        return oElement
    }

    buildCard({
        title = '',
        mark = '',
        image = '',
        logo = '',
        theme = 'blue',
        click = null
    }) {
        const oCard = this.createElement('div', {class: 'steam-card ' + theme }, [
            this.createElement('div', {class: 'sc-stripes'}, [
                this.createElement('div', {class: 'sc-head'}, [
                    this.createElement('div', {class: 'sc-inner-card'}, [
                        this.createElement('div', {class: 'sc-title'}, title),
                        this.createElement('div', {class: 'sc-image'}, [
                            this.createElement('img', {src: image}, [])
                        ]),
                    ])
                ]),
                this.createElement('div', {class: 'sc-bottom'}, [
                    logo !== ''
                        ? this.createElement('div', {class: 'sc-logo'}, [
                            this.createElement('img', {src: logo}, [])
                        ])
                        : this.createElement('div', {class: 'sc-mark'}, mark)
                ])
            ])
        ])
        if (click) {
            oCard.addEventListener('click', event => {
                oCard.classList.add('flash')
                setTimeout(() => {
                    oCard.classList.remove('flash')
                    click(event)
                }, 700)
            })
        }
        return oCard
    }
}

export default SteamCard
