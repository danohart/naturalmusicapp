import React, { useState, useEffect } from "react";
import { Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import { Check, Plus, Search, X } from "lucide-react";
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
        <Row
          className='search-results border rounded'
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <Col className='mb-2'>
            Found {searchResults.length} song
            {searchResults.length !== 1 ? "s" : ""} matching &quot;{searchTerm}
            &quot;
          </Col>
          {searchResults.map((song, index) => (
            <Row
              key={song.id}
              className={`align-items-center ${
                index % 2 === 0 ? "bg-light" : ""
              }`}
            >
              <Col xs={10} className='d-flex align-items-center py-2'>
                <Link
                  href={`/song/${song.id}`}
                  className='text-decoration-none'
                >
                  {htmlHelper(song.title.rendered)}
                </Link>
              </Col>
              <Col xs={2} className='d-flex justify-content-end'>
                <Button
                  variant={
                    selectedSongs.includes(song.id) ? "primary" : "light"
                  }
                  size='sm'
                  className='me-2 rounded-circle'
                  onClick={() => onSongSelect(song.id)}
                  aria-label={
                    selectedSongs.includes(song.id)
                      ? "Remove from selection"
                      : "Add to selection"
                  }
                >
                  {selectedSongs.includes(song.id) ? (
                    <div className='d-flex align-items-center justify-content-center'>
                      <Check size={16} />
                    </div>
                  ) : (
                    <div className='d-flex align-items-center justify-content-center'>
                      <Plus size={16} />
                    </div>
                  )}
                </Button>
              </Col>
            </Row>
          ))}
        </Row>
      ) : searchTerm ? (
        <p className='text-muted'>No songs found matching your search.</p>
      ) : null}
    </div>
  );
};

export default SearchComponent;
