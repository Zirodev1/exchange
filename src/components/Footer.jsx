import './Footer.css';


const Footer = () => { 
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className='copyright'>&copy;{new Date().getFullYear()} CurrencySwap</p>
        <div className='social-links'>
          <a href='https://github.com/Zirodev1' target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href='https://x.com/_leeacevedo' target="_blank" rel="noopener noreferrer">X</a>

        </div>
        <p className='deployment-info'>Deployed on Netlify</p>
      </div>
    </footer>
  );
}


export default Footer;