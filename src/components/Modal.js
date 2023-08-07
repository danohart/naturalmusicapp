import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import htmlHelper from "../lib/htmlHelper";

function SongModal({ song }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log("song", song);

  return (
    <>
      <Button className='m-2' variant='primary' onClick={handleShow}>
        {htmlHelper(song.title.rendered)}

        {song._embedded ? (
          <Badge bg='secondary' className='ms-2'>
            {song._embedded["wp:term"][0][0].name}
          </Badge>
        ) : null}
      </Button>

      <Modal
        fullscreen
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{htmlHelper(song.title.rendered)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            dangerouslySetInnerHTML={{
              __html: song.content.rendered,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SongModal;
