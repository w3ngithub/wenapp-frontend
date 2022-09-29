const getLocation = (): Promise<[] | [number, number]> =>
  new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          resolve([position.coords.latitude, position.coords.longitude])
        },
        () => {
          resolve([])
        },
        {maximumAge: 60000, timeout: 15000, enableHighAccuracy: true}
      )
    } else {
      return resolve([])
    }
  })

export const checkLocationPermission = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (navigator.permissions) {
      navigator.permissions.query({name: 'geolocation'}).then((result) => {
        if (result.state === 'granted') {
          resolve(true)
        }
        resolve(false)
      })
    } else {
      resolve(false)
    }
  })

export default getLocation
