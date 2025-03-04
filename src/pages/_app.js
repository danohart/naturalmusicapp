import "@/styles/styles.scss";
import { Container, Offcanvas, Nav, Navbar } from "react-bootstrap";

export default function App({ Component, pageProps }) {
  const siteTitle = "Natural Music App";
  return (
    <Container>
      <Navbar bg='light' expand='lg'>
        <Container fluid>
          <Navbar.Brand href='/'>{siteTitle}</Navbar.Brand>
          <Navbar.Toggle aria-controls='offcanvasNavbar' />
          <Navbar.Offcanvas
            id='offcanvasNavbar'
            aria-labelledby='offcanvasNavbarLabel'
            placement='end'
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id='offcanvasNavbarLabel'>
                {siteTitle}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-end flex-grow-1 pe-3'>
                <Nav.Link href='/'>Home</Nav.Link>
                <Nav.Link href='/music/1'>Lyrics & Chords</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Component {...pageProps} />
    </Container>
  );
}
