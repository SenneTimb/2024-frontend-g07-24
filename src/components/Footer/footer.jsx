import "./footer.css";

const Footer = () => {
  return (
    <div className="footer mt-auto">
        <div className="container">
          <div className="row text-center">
            <div className="col-12 text-center newsletter-signup">
              <h2>delaware</h2>
            </div>
            <div className="col-12 text-center footer-links">
              {/* <Link to="/privacybeleid">Privacybeleid</Link>
              <Link to="/algemenevoorwaarden">Algemene voorwaarden</Link> */}
            </div>
            <div className="col-12 text-center">
              <div className="copyright">
                <p>&copy; {new Date().getFullYear()} delaware</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Footer;
