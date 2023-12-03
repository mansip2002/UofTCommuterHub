import React, {useState} from "react";

const MatchingSystem = () => {
	const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/search?search=${searchTerm}`,
			{
				  method: "GET",
				  headers: {
					"Content-Type": "application/json",
				  },
		    });

            const data = await response.json();
            setSearchResults(data);

        } catch (error) {
            // for debugging purposes
            console.error('Logged search error is:', error);
        }
    };

	return (
		<div className="matchingSystem">
			<div className="searchBar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Please enter your query here"
                    className="form-control rounded"
                />
                <button type="button" onClick={handleSearch} className="btn btn-outline-primary">
                    Search
                </button>
            </div>

            <br></br>

            <div class="container">
                <div class="row">
                    <div class="row justify-content-center">
                        <ul>
                            {searchResults.map(result => (

                                <div className="searchCard">
                                    <div className="searchBox" key={result.user_id}>
                                        <br/>
                                        <span style={{ color: 'blue' }}>Name:</span> {result.name},{' '}
                                        <span style={{ color: 'blue' }}>Email:</span> {result.email},{' '}
                                        <span style={{ color: 'blue' }}>Day of the Week:</span> {result.day_of_week},{' '}
                                        <span style={{ color: 'blue' }}>Start Time:</span> {result.start_time},{' '}
                                        <span style={{ color: 'blue' }}>Start Location:</span>{' '}{result.start_location},{' '}
                                        <span style={{ color: 'blue' }}>End Location:</span>{' '}{result.end_location}
                                        <br/>
                                    </div>
                                    <br/>
                                </div>

                            ))}
                        </ul>
                   </div>
                </div>
            </div>

		</div>
	);
};

export default MatchingSystem;