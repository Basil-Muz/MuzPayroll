import React from "react";
import { useState,useEffect } from "react";
import "./designation.css"; 
import Main from '../../components/MainButtons/MainButtons'
import axios from 'axios';
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { FaRegObjectGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import Search from "../../components/search/Search";
import DesignationForm from "./desinationFrom";
import BackToTop from "../../components/ScrollToTop/ScrollToTopButton";
import Loading from "../../components/Loading/Loading";
import Header from "../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
const Designation = () => {

    const [advanceTypes, setAdvanceTypes] = useState([]);
    const [boxView, setBoxView] = useState(true);
    const [listView, setListView] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchData,setSearchdata] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false); // new state for flag from child
    const [headerError, setHeaderError] = useState([]);

    // const isNewRecord = !designationId;  //Is this form creating a new record, or editing an existing one?

    // const hasDeletePermission = user.permissions.includes("DESIGNATION_DELETE");   //Is this user allowed to delete this record?

    // const isViewMode = mode === "VIEW";   //Is the form in view-only mode?

    // const isSubmitted = designationData?.status === "SUBMITTED"; //Has the designation been submitted/finalized?

// useEffect(() => {
//   if (!searchData.trim()) { // Only fetch all if search is empty
//     axios.get("http://localhost:9082/viewAdvanceType")
//       .then(res => setAdvanceTypes(res.data))
//       .catch(console.error);
//   }
// }, []);


  const handleSave = () => {
    console.log("Save clicked");
    // API call / form submit logic
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const handleClear = () => {
    console.log("Clear clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handlePrint = () => {
    console.log("Print clicked");
  };

  const handleNewPage = () => {
    console.log("New page clicked");
  };

    const handleFlagChange = (newFlag) => {
    setFlag(newFlag);  // update parent state
      setTimeout(() => {
        setFlag(false); // reset flag after 2 seconds
      }, 1000);
  };
    const handleSearchChange = (e) => {
        setSearchdata(e.target.value);
       
        }
        useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchData.trim()) {
                // axios.get(`http://localhost:9082/searchAdvanceType?data=${searchData}`)
                // .then((res) => setAdvanceTypes(res.data))
                // .catch(console.error);
            }else {
      // If searchData is empty, get all advance types
        // axios.get("http://localhost:9082/viewAdvanceType")
        // .then((res) => setAdvanceTypes(res.data))
        // .catch(console.error);
    }
        }, 200); // debounce delay
 return () => clearTimeout(delayDebounceFn);
}, [searchData]);

useEffect(() => {
  if (showForm) {
            setLoading(true); // reset loading
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);

            return () => clearTimeout(timer); // clean up on unmount
            }
            else{
        //       axios.get("http://localhost:9082/viewAdvanceType")
        // .then((res) => setAdvanceTypes(res.data))
        // .catch(console.error);
    }
            
          }, [showForm]);
    const toggleForm = () => {setShowForm(prev => !prev);
 if (showForm) {
       setSelectedItem(null);
  }}
    const containerStyle = boxView
  ? { display: 'flex', flexDirection: 'row' }
  : listView
    ? { display: 'flex', flexDirection: 'column' }
    : {};
    const hanbleSearchChange = (item) => {
        setSelectedItem(item);
        toggleForm();
    }

  return (
    <>
    <Header backendError={headerError}/>
    <div className="advance-type-page">
    <div className="header-section">
        <h2>Designation</h2>
        <div className="view-icons">
            <div className="icons">
            <BsGrid3X3GapFill size={24}
            color="#161414e6"
            onClick={() => {setBoxView(!boxView); setListView(false);}}
            title="Tile View"
            style={boxView ? { color: '#188bd8' } : undefined}
            />
            </div>
            <div className="icons">
            <FaListUl size={24}
            color="#161414e6"
            title="List View" 
            onClick={() => {setListView(true); setBoxView(false);}}
             style={listView ?  { color: '#188bd8' }:undefined }
            />
            </div>
            <div className="icons">
            <FaRegObjectGroup title="Grouping" size={24} color="#161414e6" onClick={() => {setShowSearch(!showSearch)}}/>
            </div>
            
        <div className="search-box">
            <input type="text" name="search" onChange={handleSearchChange} value={searchData} placeholder="Search here ..." />
            <div className="search-icon">
                <IoIosSearch size={22} style={{ marginLeft: '21px' }}  /></div>
        </div>
        </div>
    </div>
    <div className={`slide-container ${showSearch ? 'show' : 'hide'}`}>
        
      <Search/>
        
        </div>
      <div className="card-grid"
      style={containerStyle}
      >
        {advanceTypes.map((item) => (
          <div className="advance-card" 
          style={ listView ? { width: '96%', marginRight: '20px'} : undefined}
          key={item.code}>
            <div className="card-header">
              <span className="code" style={{cursor:'pointer'}} onClick={() =>{hanbleSearchChange(item)}}>{item.code}</span>
              <div>
              <span className="check-icon"><TiTick /></span>
              <span className="date">{item.activeDate}</span></div>
            </div>
            <div className="card-title" style={{cursor:'pointer'}} onClick={() =>{hanbleSearchChange(item)}}>{item.name}</div>
            <div className="card-shortname">{item.shortName}</div>
            <div className="card-description">{item.description}</div>
          </div>
        ))}
      </div>
          {/* <Main toggleForm={toggleForm} onFlagChange={handleFlagChange}/> */}
         <FloatingActionBar
  actions={{
    save: {
      onClick: handleSave,

      // disabled: isViewMode || isSubmitted
    },
    search: {
      onClick: handleSearch
    },
    clear: {
      onClick: handleClear
    },
    delete: {
      onClick: handleDelete,
      // disabled: !hasDeletePermission
    },
    print: {
      onClick: handlePrint,
      // disabled: isNewRecord
    },
    new: {
      onClick: handleNewPage
    }
  }}
/>

           {showForm && selectedItem && loading && <Loading />}
      {showForm && !loading && selectedItem && (
        <DesignationForm data={selectedItem} toggleForm={toggleForm} />
      )}
      {showForm && !selectedItem &&  (
        <DesignationForm data={selectedItem} toggleForm={toggleForm} />
      )}
      {flag &&  <Loading />}
           <BackToTop />
    </div>
    </>
  );
};

export default Designation;
