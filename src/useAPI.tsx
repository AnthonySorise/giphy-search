import { useState, useEffect } from 'react'
import APIKey from './APIkey'

function useAPI(searchVal: string, pageNumber: number): { gifURLs: string[] | null; pageCount: number; isDataLoaded: boolean; } {
    const [gifURLs, setGifURLs] = useState<string[] | null>(null)
    const [pageCount, setPageCount] = useState<number>(0)
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false)
    const itemsPerPage = 9;

    useEffect(() => {
        setGifURLs([]);
        setPageCount(0);
        setIsDataLoaded(false);
        if (searchVal) {
            let apiURL = 'http://api.giphy.com/v1/gifs/search?api_key=' + APIKey + '&limit=' + itemsPerPage + '&offset=' + (pageNumber * itemsPerPage) + '&q=' + searchVal;
            fetch(apiURL)
                .then(resp => resp.json())
                .then((d) => {
                    //console.log(d)
                    if (d.data && d.data.length) {
                        let newGifURLs: string[] = [];
                        for (let i = 0; i < d.data.length; i++) {
                            newGifURLs.push('https://i.giphy.com/media/' + d.data[i].id + '/giphy.webp');
                        }
                        setGifURLs(newGifURLs);
                        setPageCount(Math.ceil(d.pagination.total_count / itemsPerPage))
                        setIsDataLoaded(true);
                    }
                })
                // .catch(error => {
                //     console.log('Error:', error);
                // });
        }
    }, [searchVal, pageNumber]);

    return {
        gifURLs,
        pageCount,
        isDataLoaded,
    }
}


export default useAPI;