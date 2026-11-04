import '@fontsource/special-elite'
import '@fontsource/courier-prime/latin-400.css'
import '@fontsource/courier-prime/latin-700.css'
import { render } from 'preact'
import { App } from './ui/App.tsx'
import './styles.css'

render(<App />, document.getElementById('app')!)
