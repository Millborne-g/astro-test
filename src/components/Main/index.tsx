import { useEffect, useState } from "react";

// Firebase
import { db } from "../../firebase";
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

// components
import { Loader } from "../Loader";
import { Header } from "./components/Header";
import { ErrorMessage } from "../ErrorMessage";

// css
import "./style.css";

export const Main = () => {
    const [data, setData] = useState<any[]>([]);
    const initialPage = 1;
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState(10);
    const [lastKeys, setLastKeys] = useState<string[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
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
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);

            setIsLoading(false);
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
        setIsLoading(true);
        fetchTotalCount();
        fetchData();
        setCurrentPage(1); // Reset to first page when performing a new search
    };

    useEffect(() => {
        if (searchTerm === "") {
            setIsLoading(true);
            fetchTotalCount();
            fetchData();
        }
    }, [currentPage, pageSize, searchTerm]);

    return (
        <>
            <main>
                <Header />
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
                                            {data.length > 0 &&
                                                data.map((estab, index) => (
                                                    <tr
                                                        key={index}
                                                        className=""
                                                    >
                                                        <td className="">
                                                            {estab.name}
                                                        </td>
                                                        <td className="">
                                                            {estab.country}
                                                        </td>
                                                        <td className="">
                                                            {
                                                                estab.classification
                                                            }
                                                        </td>
                                                        <td className="">
                                                            {estab.parent}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                    {!(data.length > 0) && <ErrorMessage />}
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
            </main>
            {isLoading && <Loader />}
        </>
    );
};
