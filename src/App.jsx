import { 
  ChakraProvider, Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Input, Select, Card, CardBody, Text,
  Stack, useBreakpointValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [favorites, setFavorites] = useState(new Set(JSON.parse(localStorage.getItem('favorites')) || []));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [expandedUniversity, setExpandedUniversity] = useState(null);
  const universitiesPerPage = 10;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerWidth = useBreakpointValue({ base: "100%", md: "container.xl" });

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json')
      .then(response => response.json())
      .then(data => {
        setUniversities(data);
        setFilteredUniversities(data);
      });
  }, []);

  useEffect(() => {
    if (showFavorites) {
      const favoriteList = universities.filter(uni => favorites.has(uni.name));
      setFilteredUniversities(favoriteList);
    } else {
      handleSearch(); // Call handleSearch when switching back to all universities
    }
  }, [showFavorites, favorites, universities]);

  const handleSearch = () => {
    if (!showFavorites) {
      let filteredData = universities;
      if (searchTerm) {
        filteredData = filteredData.filter(uni => uni.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (selectedCountry) {
        filteredData = filteredData.filter(uni => uni.country.toLowerCase() === selectedCountry.toLowerCase());
      }
      setFilteredUniversities(filteredData);
      setCurrentPage(1);
    }
  };

  const toggleFavorite = (name) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
  };

  const toggleDetails = (uni) => {
    setExpandedUniversity(expandedUniversity?.name === uni.name ? null : uni);
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setExpandedUniversity(null); // Reset expanded details when toggling view
  };

  const indexOfLastUni = currentPage * universitiesPerPage;
  const indexOfFirstUni = indexOfLastUni - universitiesPerPage;
  const currentUniversities = filteredUniversities.slice(indexOfFirstUni, indexOfLastUni);
  const totalPages = Math.ceil(filteredUniversities.length / universitiesPerPage);
  const uniqueCountries = [...new Set(universities.map(uni => uni.country))].sort();

  return (
    <ChakraProvider>
      <Box className="container" minH="100vh" p={{ base: 2, md: 6 }} display="flex" justifyContent="center" alignItems="center">
        <Container maxW={containerWidth} p={{ base: 3, md: 6 }} borderRadius="md" boxShadow="md" className="card">
          <Heading as="h1" mb={6} textAlign="center" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" className="heading">
            UNIVERSITY SEARCH
          </Heading>
          
          <div className="filter-controls">
            <Input 
              placeholder="Search by university name" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              bg="white"
              border="1px solid gray"
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 4px rgba(0, 0, 255, 0.2)" }}
              className="input"
            />
            <Select 
              placeholder="Filter by country" 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              bg="white"
              border="1px solid gray"
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 4px rgba(0, 0, 255, 0.2)" }}
              className="select"
            >
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </Select>
            <Button 
              colorScheme="blue" 
              onClick={handleSearch}
              className="button button-primary"
            >
              Search
            </Button>
            <Button 
              colorScheme={showFavorites ? "purple" : "gray"} 
              onClick={toggleShowFavorites}
              className={`button ${showFavorites ? "button-secondary" : "button-primary"}`}
            >
              {showFavorites ? "All" : "Favorites"}
            </Button>
          </div>

          <div className="table-container">
            <Table variant="simple" borderRadius="md" overflow="hidden" boxShadow="sm" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th className="table-header">University</Th>
                  <Th className="table-header" display={{ base: "none", md: "table-cell" }}>Country</Th>
                  <Th className="table-header">Action</Th>
                  <Th className="table-header">Favorites</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentUniversities.map((uni) => (
                  <>
                    <Tr key={uni.name} _hover={{ bg: "gray.50" }}>
                      <Td fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{uni.name}</Td>
                      <Td display={{ base: "none", md: "table-cell" }}>{uni.country}</Td>
                      <Td>
                        <Flex gap={2}>
                          <Button 
                            colorScheme="blue" 
                            size={{ base: "xs", md: "sm" }} 
                            onClick={() => toggleDetails(uni)}
                            className="button button-primary"
                          >
                            {isMobile ? "Details" : "Show Details"}
                          </Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex gap={2} justifyContent="center" className="action-button-container">
                          <Button 
                            colorScheme={favorites.has(uni.name) ? "red" : "green"} 
                            onClick={() => toggleFavorite(uni.name)}
                            size={{ base: "xs", md: "sm" }}
                            className={`button fixed-width-button ${favorites.has(uni.name) ? "button-danger" : "button-success"}`}
                          >
                            {favorites.has(uni.name) ? "Remove" : "Add"}
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                    {expandedUniversity?.name === uni.name && (
                      <Tr className="details-row">
                        <Td colSpan={4} className="details-cell">
                          <div className="details-card">
                            <div className="details-content">
                              <Heading fontSize={{ base: "md", md: "lg" }} mb={2} className="text">{uni.name}</Heading>
                              <Text fontSize={{ base: "sm", md: "md" }} className="text"><strong>Country:</strong> {uni.country}</Text>
                              {uni.web_pages && uni.web_pages.length > 0 && (
                                <Button 
                                  className="button-visit"
                                  as="a"
                                  href={uni.web_pages[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  mt={2}
                                  colorScheme="purple"
                                  variant="solid"
                                  size={{ base: "sm", md: "md" }}
                                >
                                Website
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                  </svg>
                                </Button>
                              )}
                            </div>
                          </div>
                        </Td>
                      </Tr>
                    )}
                  </>
                ))}
              </Tbody>
            </Table>
          </div>

          <div className="pagination">
            <Button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              isDisabled={currentPage === 1}
              colorScheme="gray"
              size={{ base: "sm", md: "md" }}
              className="button button-secondary"
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              isDisabled={currentPage === totalPages}
              colorScheme="gray"
              size={{ base: "sm", md: "md" }}
              className="button button-secondary"
            >
              Next
            </Button>
          </div>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
