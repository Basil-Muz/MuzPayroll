// import React, { useState } from 'react';
import './search.css'; // optional: external CSS

function Search() {

  return (
    <div className="search-container show">
            <div className="sub-container">
                <div className="heading">Grouping</div>
                <div className="search-form">
                    <div  className='search-items'>
                <label>Active-Inactive</label> 
                <input type="checkbox" name="activeInactive" id="activeInactive" /> </div>
                <button className='search-button' type='submit'>Submit</button>
                </div>
    </div>
    </div>
  );
}

export default Search;
