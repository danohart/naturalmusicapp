import { Container, Offcanvas, Nav, Navbar, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
  const siteTitle = "Natural Music App";
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <Navbar bg='light' expand='lg' className='mb-4'>
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
              <Nav.Link href='/courses/'>Courses</Nav.Link>

              {/* Auth buttons */}
              {isAuthenticated ? (
                <>
                  <Button
                    variant='outline-danger'
                    size='sm'
                    onClick={handleLogout}
                    className='ms-2'
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link href='/login' className='ms-2'>
                    <Button variant='outline-primary' size='sm'>
                      Login
                    </Button>
                  </Nav.Link>
                  {/* <Nav.Link href='/register' className='ms-2'>
                    <Button variant='primary' size='sm'>
                      Sign Up
                    </Button>
                  </Nav.Link> */}
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
