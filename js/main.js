import { FavoritesView } from './favorites.js'

new FavoritesView('#app')

const svgPath = document.querySelector('#pathSvg')
const btn = document.querySelector('.btn-hd')

function toggleStar() {
  svgPath.classList.toggle('svgPath')
}

btn.addEventListener('mouseover', toggleStar)
btn.addEventListener('mouseout', toggleStar)
