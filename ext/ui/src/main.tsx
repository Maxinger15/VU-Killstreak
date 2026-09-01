import './index.css';   // add this line
import './App.css';     // add this line
import { createRoot } from 'react-dom/client';
import App from './App';

// Dynamically scale rem to adapt to different resolutions (optional)
const onResize = () => {
    const designHeight = 1080;
    const actualHeight = window.innerHeight;
    const scaleFactor = actualHeight / designHeight;
    document.documentElement.style.fontSize = `${scaleFactor}px`;
};
onResize();
window.addEventListener('resize', onResize);

try {
    createRoot(document.getElementById('root')!).render(<App />);
} catch (err) {
    console.error(err);
}