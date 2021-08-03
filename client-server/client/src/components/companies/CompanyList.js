import React, {useState, useEffect} from "react";
import { request } from '../../api/barcodeserver';


/**
 * Company request.
 */
const getCompanies = async (token, callBack) => {
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
const CompanyList = ({token}) => { // Token is destructured from props

    const [companies, setCompanies] = useState([]); // React Hook
    const [name, setName] = useState(""); // React Hook
    
    useEffect(() => { // React Hook
        // Do something here to get the companies
        // e.g
        getCompanies(token, setCompanies);
    },[token])


    const handleClick = () => {
        setCompanies(...companies, {name: name})
        // call a function to update the database.
    }

    return (
        <div>
            Companies:
            <input onChange={e => setName(e.target.value)}> </input>
            <button onClick={() => handleClick}> </button>
            {companies && companies.map(company => <div key="company.id">{company.name}</div>)}
        </div>
    )
}

export default CompanyList;