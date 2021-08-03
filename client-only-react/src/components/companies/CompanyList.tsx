import React, { useState, useEffect } from "react";
import { request } from '../../api/barcodeserver';

interface Company {
    id: number,
    name: string
}

/**
 * Company request. Async function, skip over it o
 */
const getCompanies = async (token: string, callBack: React.Dispatch<React.SetStateAction<Company[] | null>>) =>{
    const response = await request(
        `/companies`,
        'GET',
        token
    );
    if (response.error){
        // show an error on the page
        console.log(response.error);
    }
    console.log(response);
    
    callBack(response);
}

/**
 * Company Component
 */
const CompanyList = ({token} : {token: string}) => {
    const [companies, setCompanies] = useState<Company[] | null>(null); // React Hook

    useEffect(()=>{ // React Hook
        // Do something here to get the companies
        // e.g
        getCompanies(token, setCompanies);
    },[token])

    return (
        <div>
            Companies:
            {companies && companies.map(company => <div key="company.id">{company.name}</div>)}
        </div>
    )
}

export default CompanyList;