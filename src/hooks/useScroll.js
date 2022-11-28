import {useEffect, useState} from 'react'



function useScroll(closePopup) {
    window.addEventListener('scroll',()=>closePopup(false))
//   return windowSize
}

export default useScroll
