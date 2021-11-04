import { useState, useEffect } from 'react'
import useAPI from './useAPI';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './App.css';

function App() {

    const [textFieldVal, setTextFieldVal] = useState<string>("");
    const [searchVal, setSearchVal] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const { gifURLs, pageCount, isDataLoaded } = useAPI(searchVal, page);
    const [lastPageCountUsed, setLastPageCountUsed] = useState<number>(0);

    useEffect(() => {
        if (searchVal) {
            setIsSearching(true);
        }
    }, [searchVal, page])
    useEffect(() => {
        if (isDataLoaded) {
            setIsSearching(false);
            setLastPageCountUsed(pageCount);
        }
    }, [isDataLoaded, pageCount]);

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldVal(event.target.value);
    };
    const handleSearchSubmit = () => {
        setSearchVal(textFieldVal);
    };
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    return (
        <div className="App">
            <Box m={2}>

                {/* Header */}
                <h1 style={{ textAlign: 'center' }}>Giphy Search</h1>

                {/* Search */}
                <Box sx={{ width: '100%', display: 'flex', marginBottom: '1em' }}>
                    <TextField sx={{ marginLeft: 'auto', marginRight: '1em' }}
                        id="search"
                        label="Search Gifs"
                        value={textFieldVal}
                        onChange={handleTextFieldChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearchSubmit();
                            }
                        }}
                    />
                    <LoadingButton sx={{ marginRight: 'auto' }}
                        disabled={!textFieldVal}
                        loading={isSearching}
                        variant="outlined"
                        onClick={handleSearchSubmit}>
                        Search
                    </LoadingButton>
                </Box>

                {/* Gif View */}
                <div style={{ height: 880 }}>
                    {gifURLs && gifURLs.length
                        ?
                        <ImageList sx={{ width: 880, height: 1000, marginLeft: "auto", marginRight: "auto", overflow: "auto" }} cols={3} gap={8} variant="masonry">
                            {gifURLs.map((item) => (
                                <ImageListItem key={item}>
                                    <img
                                        src={`${item}?w=300&h=300&fit=crop&auto=format`}
                                        srcSet={`${item}?w=300&h=300&fit=crop&auto=format&dpr=2 2x`}
                                        alt={searchVal}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                        : isSearching ? <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div> : null
                    }
                </div>

                {/* Pagination */}
                {(gifURLs && gifURLs.length) || isSearching
                    ?
                    <Stack spacing={2} sx={{ alignItems: 'center', marginTop:"1em" }}>
                        <Pagination count={pageCount ? pageCount : lastPageCountUsed ? lastPageCountUsed : 10} page={(gifURLs && gifURLs.length) ? page + 1 : 0} onChange={handlePageChange} disabled={!gifURLs || !gifURLs.length} />
                    </Stack>
                    : null
                }

            </Box>
        </div>
    );
}

export default App;