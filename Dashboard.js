let canvas
let markets
let ecosystem = newEcosystem()

let viewPort
try {
  viewPort = newViewPort()
} catch (e) {
  setTimeout(() => {
    console.log('Loading deferred.')
    viewPort = newViewPort()
  }, 1000)
}

function newDashboard () {
  const MODULE_NAME = 'Dashboard'
  const ERROR_LOG = true
  const INTENSIVE_LOG = false
  const logger = newWebDebugLog()
  logger.fileName = MODULE_NAME

  let thisObject = {
    start: start
  }

  const DEBUG_START_UP_DELAY = 0 // 3000; // This is a waiting time in case there is a need to debug the very first steps of initialization, to be able to hit F12 on time.

  let userProfileChangedEventSubscriptionId
  let browserResizedEventSubscriptionId

  return thisObject

  function start () {
    try {
      /* If this method is executed for a second time, it should finalize the current execution structure */

      if (canvas !== undefined) { canvas.finalize() }

      /* Here we check where we are executing. In case we are Local we need to create a Local Dummy User and Team. */

      if (window.canvasApp.executingAt === 'Local') {
        window.localStorage.setItem(LOGGED_IN_ACCESS_TOKEN_LOCAL_STORAGE_KEY, 'Local Access Token')       // Dummy Access Token
        window.localStorage.setItem(LOGGED_IN_USER_LOCAL_STORAGE_KEY, '{"authId":"x|x","alias":"user"}')  // Dummy Local User
      }

      /* Here we will setup the global eventHandler that will enable the Canvas App to react to events happening outside its execution scope. */

      window.canvasApp.eventHandler = newEventHandler()
      userProfileChangedEventSubscriptionId = window.canvasApp.eventHandler.listenToEvent('User Profile Changed', userProfileChanged)
      browserResizedEventSubscriptionId = window.canvasApp.eventHandler.listenToEvent('Browser Resized', browserResized)

      /* Here we used to have a call to the Teams Module to get the profile pictures. That was removed but to keep things working, we do this: */

      window.canvasApp.context.teamProfileImages = new Map()
      window.canvasApp.context.fbProfileImages = new Map()

      setTimeout(delayedStart, DEBUG_START_UP_DELAY)
    } catch (err) {
      if (ERROR_LOG === true) { logger.write('[ERROR] start -> err = ' + err.stack) }
    }
  }

  function delayedStart () {
    try {
            /* For now, we are supporting only one market. */

      let market = {
        id: 2,
        assetA: 'USDT',
        assetB: 'BTC'
      }

      markets = new Map()

      markets.set(market.id, market)

      canvas = newCanvas()
      canvas.initialize()
    } catch (err) {
      if (ERROR_LOG === true) { logger.write('[ERROR] delayedStart -> err = ' + err.stack) }
    }
  }

  function userProfileChanged () {
    try {
      canvas.topSpace.initialize()
    } catch (err) {
      if (ERROR_LOG === true) { logger.write('[ERROR] userProfileChanged -> err = ' + err.stack) }
    }
  }

  function browserResized () {
    try {
      browserCanvas = document.getElementById('canvas')

      browserCanvas.width = window.innerWidth
      browserCanvas.height = window.innerHeight - CURRENT_TOP_MARGIN

      viewPort.initialize()
    } catch (err) {
      if (ERROR_LOG === true) { logger.write('[ERROR] browserResized -> err = ' + err.stack) }
    }
  }
}
