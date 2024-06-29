import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    get,
    ref,
    startAt,
    startAfter,
    orderByKey,
    query,
    orderByChild,
    limitToFirst,
} from "firebase/database";

export const Main = () => {
    const [data, setData] = useState<any[]>([]);
    const initialPage = 1;
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState(10);
    const [lastKeys, setLastKeys] = useState<string[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const fetchTotalCount = async () => {
        try {
            let totalCountQuery;

            if (searchTerm) {
                // If searchTerm is provided, perform a filtered query
                totalCountQuery = query(
                    ref(db, "establishments"),
                    orderByChild("name"), // Replace "name" with your search key
                    startAt(searchTerm)
                );
            } else {
                // Regular query without search term
                totalCountQuery = ref(db, "establishments");
            }

            const snapshot = await get(totalCountQuery);
            if (snapshot.exists()) {
                const totalCount = snapshot.size;
                setTotalItems(totalCount);
                setTotalPages(Math.ceil(totalCount / pageSize));
            } else {
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching total count:", error);
        }
    };

    const fetchData = async () => {
        try {
            let dataQuery;
            if (searchTerm) {
                dataQuery = query(
                    ref(db, "establishments"),
                    orderByChild("name"),
                    startAt(searchTerm),
                    limitToFirst(pageSize)
                );
            } else {
                // Regular query without search term
                if (currentPage === 1) {
                    dataQuery = query(
                        ref(db, "establishments"),
                        orderByKey(),
                        limitToFirst(pageSize)
                    );
                } else {
                    const lastKey = lastKeys[currentPage - 2];
                    dataQuery = query(
                        ref(db, "establishments"),
                        orderByKey(),
                        startAfter(lastKey),
                        limitToFirst(pageSize)
                    );
                }
            }

            const snapshot = await get(dataQuery);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const establishmentsArray = Object.keys(data).map((key) => ({
                    key,
                    name: data[key].name,
                    country: data[key].country,
                    classification: data[key].classification,
                    parent: data[key].parent,
                }));
                setData(establishmentsArray);
                if (establishmentsArray.length > 0) {
                    const lastFetchedKey =
                        establishmentsArray[establishmentsArray.length - 1].key;
                    setLastKeys((prevKeys) => {
                        const updatedKeys = [...prevKeys];
                        updatedKeys[currentPage - 1] = lastFetchedKey;
                        return updatedKeys;
                    });
                }
            } else {
                console.log("No more data available");
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const prev = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const next = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleChangePageWithSelect = (event) => {
        setCurrentPage(Number(event.target.value));
    };

    const handleChangePageSizeWithSelect = (event) => {
        setCurrentPage(1);
        setPageSize(Number(event.target.value));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        fetchTotalCount();
        fetchData();
        setCurrentPage(1); // Reset to first page when performing a new search
    };

    useEffect(() => {
        if(searchTerm === ""){
            fetchTotalCount();
            fetchData();
        }
    }, [currentPage, pageSize, searchTerm]);

    return (
        <>
            <style>
                {`
                    .main{
                        width: 100%;
                    }

                    .content{
                        min-height: 80vh;
                    }

                    .content-logo-container{ 
                        padding: 30px;
                        background-color: #006646; 
                    }

                    .logo-img{
                        height: 50px;
                    }

                    .menu-container{
                        display: flex;
                        background-color: #edecd4;
                        padding: 5px 30px 10px;
                        height: 100%;
                        align-items: center;
                    }

                    .menu-item{
                        background-color: #edecd4;
                        color: #006646;
                        padding: 5px;
                        border-radius: 0 0 5px 5px;
                        height: 100%;

                    }

                    .active {
                        background-color: #006646;
                        color: #FFFFFF;
                    }

                    .content{
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }

                    .content-inner {
                        width: 88%;
                    }

                    .header-text-container{
                        display: flex;
                        justify-content: center;
                        padding: 30px;
                    }

                    .header-text-container span{
                        font-size: 20px;
                        color:#006646;
                    }

                    .searchBar-container{
                        display: flex;
                        gap: 5px;
                        margin-bottom: 30px;
                    }

                    .searchBar{
                        border: 1px solid rgb(205, 205, 205); 
                        border-radius: 5px; 
                        padding: 8px;
                        width: 100%;
                    }

                    .searchBtn{
                        background-color: #33856b;
                        height: 100%;
                        padding: 8px 10px;
                        color: #FFFFFF;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }

                    .searchBtn:hover{
                        background-color: #006646;
                    }

                    .table {
                        width: 100%;
                        margin-bottom: 10px;
                    }

                    .table_inner{
                        border-radius: 5px; 
                        border: 1px solid rgb(205, 205, 205);
                    }

                    .menu {
                        padding: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .nextprevBtn{
                        background-color: #33856b;
                        color: #FFFFFF;
                        border-radius: 100%;
                        height: 35px;
                        width: 35px;
                    }

                    .nextprevBtn:hover {
                        background-color: #006646;
                    }

                    form{
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }

                    table {
                        width: 100%;
                    }

                    thead{
                        background-color: #33856b;
                        color: #FFFFFF;
                    }

                    th, td{
                        padding: 10px;
                    }

                    .alternating-table tbody tr:nth-child(odd) {
                            background-color: #f2f2f2; /* Light gray color for odd rows */
                    }

                    .alternating-table tbody tr:nth-child(even) {
                        background-color: #ffffff; /* White color for even rows */
                    }

                    .createEstab-container{
                        display: flex;
                        justify-content: center;
                        margin-bottom: 50px;
                    }
                `}
            </style>
            <div className="main">
                {/* logo */}
                <div className="content-logo-container">
                    <img
                        className="logo-img"
                        src="../../public/logo.png"
                        alt=""
                    />
                </div>

                {/* <!-- options --> */}
                <div className="menu-container">
                    <div>
                        <a className="menu-item" href="">
                            Admin
                        </a>
                        <a className="menu-item active" href="">
                            Establishment
                        </a>
                        <a className="menu-item" href="">
                            Users
                        </a>
                        <a className="menu-item" href="">
                            Faculty
                        </a>
                    </div>
                </div>

                {/* <!-- content --> */}
                <div className="content">
                    <div className="content-inner">
                        <div className="header-text-container">
                            <span>FIND A ESTABLISHMENT</span>
                        </div>

                        {/* <!-- Search Bar --> */}
                        <div className="searchBar-container">
                            <input
                                className="searchBar"
                                type="text"
                                placeholder="Filter by keyword"
                                onChange={handleSearchChange}
                            />
                            <button
                                className="searchBtn"
                                onClick={handleSearch}
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                                Search
                            </button>
                        </div>

                        {/* <!-- table --> */}
                        <div className="table">
                            <div className="table_inner">
                                <div className="menu">
                                    <button
                                        className="nextprevBtn"
                                        onClick={prev}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>

                                    <div>
                                        <form>
                                            <label htmlFor="page" className="">
                                                Page
                                            </label>
                                            <select
                                                id="page"
                                                className="searchBtn"
                                                value={currentPage}
                                                onChange={
                                                    handleChangePageWithSelect
                                                }
                                            >
                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, index) => index + 1
                                                ).map((num) => (
                                                    <option
                                                        key={num}
                                                        value={num}
                                                    >
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <span>of {totalPages}</span>
                                        </form>
                                    </div>

                                    <div>
                                        <form>
                                            <select
                                                id="countries"
                                                className="searchBtn"
                                                onChange={
                                                    handleChangePageSizeWithSelect
                                                }
                                            >
                                                <option value={10}>
                                                    Show 10 Results per Page
                                                </option>
                                                <option value={20}>
                                                    Show 20 Results per Page
                                                </option>
                                                <option value={30}>
                                                    Show 30 Results per Page
                                                </option>
                                            </select>
                                        </form>
                                    </div>

                                    <button
                                        className="nextprevBtn"
                                        onClick={next}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                                <div className="table-container">
                                    <table className="alternating-table">
                                        <thead className="">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Country</th>
                                                <th scope="col">
                                                    Classification
                                                </th>
                                                <th scope="col">Parent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((estab, index) => (
                                                <tr key={index} className="">
                                                    <td className="">
                                                        {estab.name}
                                                    </td>
                                                    <td className="">
                                                        {estab.country}
                                                    </td>
                                                    <td className="">
                                                        {estab.classification}
                                                    </td>
                                                    <td className="">
                                                        {estab.parent}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Create --> */}
                <div className="createEstab-container">
                    <button className="searchBtn">
                        <i className="fa-solid fa-plus"></i>
                        Create a New Establishment
                    </button>
                </div>
            </div>
        </>
    );
};
