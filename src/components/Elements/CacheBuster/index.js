import {useCallback, useEffect} from 'react'
import packageJson from '../../../../package.json'

global.appVersion = packageJson.version

const semverGreaterThan = (versionA, versionB) => {
  const versionsA = versionA.split(/\./g)

  const versionsB = versionB.split(/\./g)
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift())

    const b = Number(versionsB.shift())
    if (a === b) continue
    return a > b || isNaN(b)
  }
  return false
}

function CacheBuster(props) {
  const refreshCacheAndReload = useCallback(() => {
    console.log('Clearing cache and hard reloading...')
    if (caches) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name)
      })
    }
    // delete browser cache and hard reload
    window.location.reload(true)
  }, [])

  useEffect(() => {
    const testVersion = () =>
      fetch('/meta.json')
        .then((response) => response.json())
        .then((meta) => {
          const latestVersion = meta.version
          const currentVersion = global.appVersion

          const shouldForceRefresh = semverGreaterThan(
            latestVersion,
            currentVersion
          )
          if (shouldForceRefresh) {
            console.log(
              `We have a new version - ${latestVersion}. Should force refresh`
            )
            refreshCacheAndReload()
          } else {
            console.log(
              `You already have the latest version - ${latestVersion}. No cache refresh needed.`
            )
          }
        })
    testVersion()

    const handleVisiblityChange = (e) => {
      testVersion()
    }

    document.addEventListener('visibilitychange', handleVisiblityChange)

    return () =>
      document.removeEventListener('visibilitychange', handleVisiblityChange)
  }, [refreshCacheAndReload])

  return null
}

export default CacheBuster
