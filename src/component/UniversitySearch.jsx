// src/components/UniversitySearch.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchTerm,
  setCountry,
  setOffset,
  setUniversities,
  setLoading,
  setError,
} from '../features/university/universitySlice';
import {
  VStack,
  Input,
  Select,
  Button,
  List,
  ListItem,
  Text,
  Link,
  HStack,
  Flex,
  Spinner,
  Alert,
  // AlertIcon,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
} from '@chakra-ui/react';

import { StarIcon } from '@chakra-ui/icons';

import { AlertIcon } from '@chakra-ui/icons'; // Available in latest versions
import { WarningIcon } from '@chakra-ui/icons';

const UniversitySearch = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    country,
    offset,
    limit,
    universities,
    loading,
    error,
  } = useSelector((state) => state.university);

  const countries = [
    'Turkey', 'United States', 'Germany', 'France', 'United Kingdom', 'Canada', 'Japan'
  ];

  useEffect(() => {
    if (searchTerm) {
      fetchUniversities();
    }
  }, [searchTerm, country, offset]);

  const fetchUniversities = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      let url = `http://universities.hipolabs.com/search?name=${searchTerm}`;
      if (country) url += `&country=${country}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Implement pagination on client side since API doesn't support it natively
      const paginatedData = data.slice(offset, offset + limit);
      dispatch(setUniversities(paginatedData));
    } catch (err) {
      dispatch(setError('Failed to fetch universities. Please try again.'));
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setOffset(0)); // Reset to first page on new search
    fetchUniversities();
  };

  const handleNextPage = () => {
    dispatch(setOffset(offset + limit));
  };

  const handlePrevPage = () => {
    dispatch(setOffset(Math.max(0, offset - limit)));
  };

  return (
    <VStack spacing={6} align="stretch">
      <form onSubmit={handleSearch}>
        <HStack spacing={4}>
          <Input
            placeholder="Search universities..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
          <Select
            placeholder="Select country"
            value={country}
            onChange={(e) => dispatch(setCountry(e.target.value))}
            width="200px"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
          <Button type="submit" colorScheme="blue" px={6}>
            Search
          </Button>
        </HStack>
      </form>

      {loading && <Spinner size="xl" alignSelf="center" />}
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {universities.length > 0 && (
        <>
          <List spacing={3}>
            {universities.map((university) => (
              <ListItem
                key={`${university.name}-${university.country}`}
                p={4}
                borderWidth="1px"
                borderRadius="md"
              >
                <VStack align="start">
                  <Link
                    href={university.web_pages?.[0]}
                    isExternal
                    fontWeight="bold"
                    color="blue.500"
                  >
                    {university.name}
                  </Link>
                  <Text>Country: {university.country}</Text>
                </VStack>
              </ListItem>
            ))}
          </List>

          <Flex justify="center" mt={4}>
            <Button
              onClick={handlePrevPage}
              isDisabled={offset === 0}
              mr={4}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              isDisabled={universities.length < limit}
            >
              Next
            </Button>
          </Flex>
        </>
      )}

      {!loading && !error && universities.length === 0 && searchTerm && (
        <Text textAlign="center">No universities found. Try a different search.</Text>
      )}
    </VStack>
  );
};

export default UniversitySearch;