import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CodingArea from './pages/CodingArea.jsx'
import 'react-circular-progressbar/dist/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Appp /> */}
    <CodingArea />
  </StrictMode>,
)
