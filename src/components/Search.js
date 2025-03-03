import React, { useState, useEffect } from "react";
import { Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import { Search, X } from "lucide-react";
import Link from "next/link";
import htmlHelper from "@/lib/htmlHelper";

const SearchComponent = ({ songs, onSongSelect, selectedSongs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Update search results when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Create a simple search function with a small delay to feel responsive
    const searchTimeout = setTimeout(() => {
      const results = songs.filter((song) =>
        htmlHelper(song.title.rendered)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, songs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className='mb-4'>
      <InputGroup className='mb-3'>
        <InputGroup.Text>
          <Search size={16} />
        </InputGroup.Text>
        <Form.Control
          placeholder='Search all songs by title...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <Button variant='outline-secondary' onClick={clearSearch}>
            <X size={16} />
          </Button>
        )}
      </InputGroup>

      {isSearching ? (
        <p className='text-muted'>Searching...</p>
      ) : searchResults.length > 0 ? (
        <div
          className='search-results border rounded p-2'
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <p className='mb-2'>
            Found {searchResults.length} song
            {searchResults.length !== 1 ? "s" : ""} matching "{searchTerm}"
          </p>
          {searchResults.map((song, index) => (
            <Row
              key={song.id}
              className={`align-items-center p-2 ${
                index % 2 === 0 ? "bg-light" : ""
              }`}
            >
              <Col className='d-flex align-items-center'>
                <Button
                  variant={
                    selectedSongs.includes(song.id) ? "primary" : "light"
                  }
                  size='sm'
                  className='me-2 rounded-circle p-1'
                  onClick={() => onSongSelect(song.id)}
                  aria-label={
                    selectedSongs.includes(song.id)
                      ? "Remove from selection"
                      : "Add to selection"
                  }
                >
                  {selectedSongs.includes(song.id) ? (
                    <div className='d-flex align-items-center justify-content-center'>
                      ✓
                    </div>
                  ) : (
                    <div className='d-flex align-items-center justify-content-center'>
                      +
                    </div>
                  )}
                </Button>
                <Link
                  href={`/song/${song.id}`}
                  className='text-decoration-none'
                >
                  {htmlHelper(song.title.rendered)}
                </Link>
              </Col>
            </Row>
          ))}
        </div>
      ) : searchTerm ? (
        <p className='text-muted'>No songs found matching your search.</p>
      ) : null}
    </div>
  );
};

export default SearchComponent;
