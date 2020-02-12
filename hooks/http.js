import { useState, useEffect } from 'react';

export const useHttp = (url, goRun, dependencies) => {
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);


    async function getData() {
        setIsLoading(true);
       
        console.log('Fetching Data from... ' + url);
        try {                  
            const response = await fetch(url);           
            const json = await response.json(); 
            
            setFetchedData(json);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        
    }

    useEffect(() => {
        if(goRun) {           
            getData();
        } 
        
    }, dependencies);


    return [isLoading, fetchedData];
}