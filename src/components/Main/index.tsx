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
    push,
    set
} from "firebase/database";

// components
import { Loader } from "../Loader";
import { Header } from "./components/Header";
import { ErrorMessage } from "../ErrorMessage";

// css
import "./style.css";

const newPackages = [
    {
        id: "sneak-peek-dna-test",
        order: 2,
        name: "Sneak Peek DNA Test",
        weeks: "6 - 13 Weeks",
        shortDescription: "Discover your baby's gender as early as 6 weeks with 99.9% accuracy",
        description: "Our Sneak Peek DNA Test package offers the earliest glimpse at your baby's gender with a simple and accurate DNA test. Discover whether you're expecting a boy or girl as early as 8 weeks into your pregnancy. This package includes a blood test and fast results, allowing you to plan and celebrate sooner.",
        packageImg: "/resources/images/packages2/sneakPeakRoyal.webp",
        standardDescription: [
            {
                descriptionTitle: "Early Gender Detection",
                descriptionSubtitle: "Discover your baby's gender as early as 6 weeks into pregnancy."
            },
            {
                descriptionTitle: "Painless Procedure",
                descriptionSubtitle: "A simple, painless blood sample is taken."
            },
            {
                descriptionTitle: "Quick Results",
                descriptionSubtitle: "Results are delivered in 1-3 days."
            },
            {
                descriptionTitle: "Clinical Precision",
                descriptionSubtitle: "Sample is sent to the SneakPeek Lab for accurate analysis"
            },
            {
                descriptionTitle: "Convenient",
                descriptionSubtitle: "A simple, painless blood sample is taken."
            }
        ],
        standardImg: "/resources/images/packages2/sneakPeakStandard.webp",
        standardPrice: "149.99",
        standardDuration: "10 - 15 minutes",
        standardNote: "",
        royalDescription: [
            {
                descriptionTitle: "Same-Day Ultrasound",
                descriptionSubtitle: "DNA gender test + an ultrasound session on the same day"
            },
            {
                descriptionTitle: "Free Fast Track Results",
                descriptionSubtitle: "Receive your results in just 24-48 hours"
            },
            {
                descriptionTitle: "Early Gender Detection",
                descriptionSubtitle: "Determine your baby's gender as early as 6 weeks into pregnancy"
            },
            {
                descriptionTitle: "Painless Procedure",
                descriptionSubtitle: "A simple, painless blood sample is taken"
            },
            {
                descriptionTitle: "Enhanced Experience",
                descriptionSubtitle: "Enjoy the added joy of seeing your baby during the ultrasound session."
            }
        ],
        royalImg: "/resources/images/packages2/sneakPeakRoyal.webp",
        royalPrice: "189.99",
        royalDuration: "30 - 45 minutes",
        royalNote: ""
    },

    {
        id: "heartbeat-session",
        name: "Heartbeat Session",
        order: 5,
        weeks: "8+ Weeks",
        shortDescription: "Capture your baby's heartbeat in a plush animal of your choice",
        description: "Experience the joy of hearing your baby's heartbeat with our Heartbeat Session package. This session is perfect for early pregnancy bonding, providing reassurance and a memorable connection with your little one. Enjoy a cozy and welcoming environment where you can listen to that precious sound and cherish the moment with loved ones.",
        packageImg: "/resources/images/packages2/heartbeat.webp",
        standardDescription: [
            {
                descriptionTitle: "5-Minute Listening Session",
                descriptionSubtitle: "Enjoy a brief but magical session to hear your baby's heartbeat"
            },
            {
                descriptionTitle: "Heartbeat Keepsake",
                descriptionSubtitle: "Receive a plush toy that contains a recording of your baby's heartbeat."
            },
            {
                descriptionTitle: "Quick Results",
                descriptionSubtitle: "Results are delivered in 1-3 days."
            },
            {
                descriptionTitle: "Comfortable Setting",
                descriptionSubtitle: "Experience the session in our cozy and inviting studio"
            },
            {
                descriptionTitle: "Reassurance",
                descriptionSubtitle: "Provides early pregnancy bonding and peace of mind"
            }
        ],
        standardImg: "/resources/images/packages2/heartbeatStandard.webp",
        standardPrice: "69.99",
        standardDuration: "5 minutes",
        standardNote: "",
        royalDescription: [
            {
                descriptionTitle: "10-Minute Listening Session",
                descriptionSubtitle: "Extended time to listen to and enjoy your baby's heartbeat"
            },
            {
                descriptionTitle: "Heartbeat Keepsake",
                descriptionSubtitle: "Receive a plush toy with a recording of your baby's heartbeat"
            },
            {
                descriptionTitle: "Digital Heartbeat Recording",
                descriptionSubtitle: "Get a digital version of your baby's heartbeat to keep and share"
            },
            {
                descriptionTitle: "Enhanced Experience",
                descriptionSubtitle: "Additional time and digital keepsake for a more memorable session"
            },
            {
                descriptionTitle: "Enhanced Experience",
                descriptionSubtitle: "Enjoy the added joy of seeing your baby during the ultrasound session."
            }
        ],
        royalImg: "/resources/images/packages2/heartbeatRoyal.webp",
        royalPrice: "84.99",
        royalDuration: "30 - 45 minutes",
        royalNote: "Note: No coupons or returning discounts allowed for this session."
    },

    {
        id: "early-pregnancy-ultrasound",
        order: 4,
        name: "Early Pregnancy Ultrasound",
        weeks: "8 - 13 Weeks",
        shortDescription: "Confirm your pregnancy, listen to your baby's heartbeat, and get an overview of your baby's position",
        description: "Capture the excitement of your first ultrasound with our First Glimpse package. Designed for early pregnancy, this package offers high-resolution 2D imaging to check on your baby's wellbeing. It's the perfect way to begin documenting your journey and share the joy with family and friends.",
        packageImg: "/resources/images/packages2/earlyPregnancy.webp",
        standardDescription: [
            {
                descriptionTitle: "10-Minute 2D Ultrasound Session",
                descriptionSubtitle: "Quick and efficient session to check on your baby"
            },
            {
                descriptionTitle: "2 B&W Photo Prints",
                descriptionSubtitle: "Receive two black-and-white prints of your baby to cherish and share"
            },
            {
                descriptionTitle: "High-Resolution Imaging",
                descriptionSubtitle: "Clear and detailed images to capture your baby's early development"
            },
            {
                descriptionTitle: "Comfortable Environment",
                descriptionSubtitle: "Experience the session in our warm and welcoming studio"
            },
        ],
        standardImg: "/resources/images/packages2/earlyPregnancyStandard.webp",
        standardPrice: "54.99",
        standardDuration: "10 minutes",
        standardNote: "",
        royalDescription: [
            {
                descriptionTitle: "20-Minute 4D/HDLive Ultrasound Session",
                descriptionSubtitle: "Extended session with high-definition live and 4D imaging for a detailed view"
            },
            {
                descriptionTitle: "1 Color Picture",
                descriptionSubtitle: "Receive a vibrant color picture of your baby"
            },
            {
                descriptionTitle: "Up to 4 B&W Prints",
                descriptionSubtitle: "Get up to four black-and-white prints to share with family and friends"
            },
            {
                descriptionTitle: "Enhanced Experience",
                descriptionSubtitle: "More time and detailed images for a comprehensive first glimpse of your baby"
            },
        ],
        royalImg: "/resources/images/packages2/earlyPregnancyRoyal.webp",
        royalPrice: "59.99",
        royalDuration: "20 minutes",
        royalNote: ""
    },

    {
        id: "gender-determination-ultrasound",
        order: 6,
        name: "Gender Determination Ultrasound",
        weeks: "14 - 17 Weeks",
        shortDescription: "Confirm your baby's gender and view their body features",
        description: "Discover the gender of your baby in a delightful and memorable way with our Gender Determination Ultrasound package. This session offers high-resolution imaging and optional keepsakes, making it an exciting experience for you and your loved ones. Share the news and celebrate the upcoming arrival in a unique and joyful manner.",
        packageImg: "/resources/images/packages2/genderDetermination.webp",
        standardDescription: [
            {
                descriptionTitle: "15-Minute Ultrasound Session",
                descriptionSubtitle: "Enjoy a focused session to determine your baby's gender"
            },
            {
                descriptionTitle: "2D Gender Confirmation Ultrasound",
                descriptionSubtitle: "Clear and accurate 2D imaging for gender confirmation"
            },
            {
                descriptionTitle: "5 B&W Photo Prints",
                descriptionSubtitle: "Receive five black-and-white prints to share with family and friends"
            },
            {
                descriptionTitle: "Precise Gender Reveal",
                descriptionSubtitle: "Get the exciting news of your baby's gender with precise imaging"
            },
        ],
        standardImg: "/resources/images/packages2/genderDeterminationStandard.webp",
        standardPrice: "74.99",
        standardDuration: "15 minutes",
        standardNote: "",
        royalDescription: [
            {
                descriptionTitle: "25-Minute Ultrasound Session",
                descriptionSubtitle: "Extended time to enjoy a detailed ultrasound experience"
            },
            {
                descriptionTitle: "4D/HDLive Gender Determination Ultrasound",
                descriptionSubtitle: "Advanced 4D/HDLive imaging for a vivid and lifelike gender determination"
            },
            {
                descriptionTitle: "1 HD Color Photo + Up to 7 B&W Prints",
                descriptionSubtitle: "Receive an HD color photo of your baby and get up to 7 B&W prints for keepsakes"
            },
            {
                descriptionTitle: "Enhanced Gender Reveal Experience",
                descriptionSubtitle: "More time, advanced imaging, and additional keepsakes for a memorable gender reveal"
            },
        ],
        royalImg: "/resources/images/packages2/genderDeterminationRoyal.webp",
        royalPrice: "89.99",
        royalDuration: "25 minutes",
        royalNote: ""
    },

    {
        id: "anatomy-scan",
        order: 3,
        name: "Anatomy Scan",
        weeks: "20-Week Diagnostic Ultrasound",
        shortDescription: "A comprehensive assessment of your baby's growth, requiring a written order and reports sent to your provider.",
        description: "Our Diagnostic Ultrasound package provides a comprehensive 20-week anatomy scan to ensure your baby's development is on track. This detailed ultrasound session offers peace of mind and valuable insights into your baby's growth. Perfect for expectant parents who want to stay informed and connected throughout their pregnancy.",
        packageImg: "/resources/images/packages2/anatomyScan.webp",
        packageTitle: "20-Week Diagnostic Ultrasound",
        royalTitle: "Anatomy Scan",
        royalDescription: [
            {
                descriptionTitle: "Comprehensive Ultrasound Session",
                descriptionSubtitle: "Enjoy a detailed 20 - 35-minute session. Ideal for a complete and thorough evaluation of your baby’s growth and development"
            },
            {
                descriptionTitle: "Optimal Imaging",
                descriptionSubtitle: "Best performed at a minimum of 20 weeks for clear and accurate imaging"
            },
            {
                descriptionTitle: "Medical Requirement",
                descriptionSubtitle: "A written order from your healthcare provider is needed"
            },
            {
                descriptionTitle: "Expert Analysis",
                descriptionSubtitle: "Conducted by a board-registered radiologist"
            },
            {
                descriptionTitle: "Professional Reports",
                descriptionSubtitle: "Detailed reports sent directly to your healthcare provider"
            },
        ],
        royalImg: "/resources/images/packages2/anatomyScanStandard.webp",
        royalPrice: "159.99",
        royalDuration: "20 - 25 minutes",
        royalNote: "Choose this package for a thorough assessment of your baby's growth!",
    },

    {
        id: "watch-me-grow",
        order: 7,
        name: "Watch Me Grow!",
        weeks: "18 - 26 Weeks",
        shortDescription: "Experience your baby in HDLive/4D and see their body features",
        description: "Document your baby's growth with our Watch Me Grow! package. Watch your little one develop and change over time, creating a beautiful keepsake of their journey from bump to birth. This package offers frequent updates and cherished memories for you and your family.",
        packageImg: "/resources/images/packages2/watchMeGrow.webp",
        standardDescription: [
            {
                descriptionTitle: "15-Minute HDLive/4D Session",
                descriptionSubtitle: "A brief but detailed session to observe your baby's development"
            },
            {
                descriptionTitle: "5 B&W Photo Prints",
                descriptionSubtitle: "Receive five black-and-white prints to capture and share precious moments"
            },
            {
                descriptionTitle: "Digital Pictures",
                descriptionSubtitle: "High-quality digital images sent directly to your email for easy sharing and keepsakes"
            },
            {
                descriptionTitle: "Detailed Imaging",
                descriptionSubtitle: "Enjoy the clarity and detail of HDLive/4D ultrasound technology"
            },
        ],
        standardImg: "/resources/images/packages2/watchMeGrowStandard.webp",
        standardPrice: "84.99",
        standardDuration: "15 minutes",
        standardNote: "",
        royalDescription: [
            {
                descriptionTitle: "20-30 Minutes HDLive/4D Session",
                descriptionSubtitle: "Extended time for a more comprehensive observation of your baby's growth"
            },
            {
                descriptionTitle: "1 HD Color Photo + Up to 10 B&W Prints",
                descriptionSubtitle: "Receive a vibrant, HD color photo of your baby and get up to 10 B&W prints for keepsakes and sharing with loved ones"
            },
            {
                descriptionTitle: "Pictures & Video Sent to Your Email",
                descriptionSubtitle: "High-quality images and videos sent to your email for convenient access and sharing"
            },
            {
                descriptionTitle: "Enhanced Experience",
                descriptionSubtitle: "More time, additional prints, and videos for a more memorable ultrasound experience"
            },
        ],
        royalImg: "/resources/images/packages2/watchMeGrowRoyal.webp",
        royalPrice: "97.99",
        royalDuration: "20 - 30 minutes",
        royalNote: ""
    },

    {
        id: "meet-your-baby",
        order: 8,
        name: "Meet Your Baby!",
        weeks: "27+ Weeks",
        shortDescription: "Best time to see your baby's body features in HDLive 3D/4D",
        description: "Experience the joy of seeing your baby in stunning detail with our Meet Your Baby package. Available in Standard and Royal options, this 2D/3D/4D/HDLive ultrasound session allows you to view and listen to your baby’s heartbeat. If your baby is shy and not showing well, you can return for a free session (valid Mon-Thurs).",
        packageImg: "/resources/images/packages2/meetYourBaby.webp",
        standardDescription: [
            {
                descriptionTitle: "15-25 Minute HDLive/4D Session",
                descriptionSubtitle: "A detailed session to see your baby in stunning clarity."
            },
            {
                descriptionTitle: "1 Color Photo + Up to 5 B&W Prints",
                descriptionSubtitle: "Capture and cherish precious moments with printed photos."
            },
            {
                descriptionTitle: "10 Digital Pictures",
                descriptionSubtitle: "High-quality digital images sent to your email for easy sharing."
            },
            {
                descriptionTitle: "Free Return Session",
                descriptionSubtitle: "If your baby is shy, come back for free (valid Mon-Thurs)."
            },
        ],
        standardImg: "/resources/images/packages2/meetYourBabyStandard.webp",
        standardPrice: "129.99",
        standardDuration: "15 - 25 minutes",
        standardNote: "",
        royalDescription: [
            {
                descriptionTitle: "35-50 Minute HDLive/4D Session",
                descriptionSubtitle: "An extended session for a comprehensive view of your baby."
            },
            {
                descriptionTitle: "Video of Your Session",
                descriptionSubtitle: "Relive the experience with a recorded video of your ultrasound."
            },
            {
                descriptionTitle: "All Digital Pictures + 2 Color Photos",
                descriptionSubtitle: "Receive all digital images, plus two vibrant color photos."
            },
            {
                descriptionTitle: "8-Inch Heartbeat Stuffed Animal",
                descriptionSubtitle: "A keepsake to cherish, capturing your baby's heartbeat."
            },
        ],
        royalImg: "/resources/images/packages2/meetYourBabyRoyal.webp",
        royalPrice: "169.99",
        royalDuration: "35 - 50 minutes",
        royalNote: ""
    },

    {
        id: "18-25-week-peek",
        order: 9,
        name: "18-25 Week Peek",
        weeks: "18-25 Weeks",
        shortDescription: "Quick check-in sessions to see your baby's features",
        description: "Peek into your baby's world with our Week Peek package, designed for 18-25 weeks of pregnancy. Enjoy stunning 3D/4D ultrasound images that capture your baby's features and movements in detail. This session provides an unforgettable glimpse into your baby's development during this magical stage",
        packageImg: "/resources/images/packages2/18-25WeekPeek.webp",
        packageTitle: "18-25 Week Peek Ultrasound",
        royalTitle: "Week Peek",
        royalSubTitle: "18-25",
        royalDescription: [
            {
                descriptionTitle: "15-Minute HDLive/4D Ultrasound Session",
                descriptionSubtitle: "Capture detailed images of your baby in a brief, focused session"
            },
            {
                descriptionTitle: "1 HD Color Picture + Up to 4 B&W Pictures",
                descriptionSubtitle: "Receive one high-definition color photo to cherish and get up to four black-and-white prints for keepsakes and sharing"
            },
            {
                descriptionTitle: "Optional Digital Package",
                descriptionSubtitle: "Digital pictures and videos available for $9.99"
            },
            {
                descriptionTitle: "Note:",
                descriptionSubtitle: "Coupons, redo's, or returning customer discounts not applicable for this package"
            },
        ],
        royalImg: "/resources/images/packages2/18-25WeekPeekStandard.webp",
        royalPrice: "64.99",
        royalDuration: "15 minutes",
        royalNote: "Experience the magic of mid-pregnancy with detailed and lifelike images of your growing baby.",
    },

    {
        id: "26+-week-peek",
        order: 10,
        name: "26+ Week Peek",
        weeks: "26+ Weeks",
        shortDescription: "Quick check-in session for moms who are 26 weeks or more into their pregnancy",
        description: "Take a peek into the beauty of late pregnancy with our 26+ Week Peek package. Ideal for 26+ weeks, this ultrasound session offers lifelike 3D/4D images of your baby. Capture the final stages of your pregnancy and create lasting memories as you prepare to welcome your little one into the world.",
        packageImg: "/resources/images/packages2/26+WeekPeek.webp",
        packageTitle: "26+ Week Peek Ultrasound",
        royalTitle: "Week Peek",
        royalSubTitle: "26+ Weeks",
        royalDescription: [
            {
                descriptionTitle: "15-Minute HDLive/4D Ultrasound Session",
                descriptionSubtitle: "Capture detailed images of your baby in a brief, focused session"
            },
            {
                descriptionTitle: "1 HD Color Picture + Up to 4 B&W Pictures",
                descriptionSubtitle: "Receive one high-definition color photo to cherish and get up to four black-and-white prints for keepsakes and sharing"
            },
            {
                descriptionTitle: "Optional Digital Package",
                descriptionSubtitle: "Digital pictures and videos available for $9.99"
            },
            {
                descriptionTitle: "Note:",
                descriptionSubtitle: "Coupons, redo's, or returning customer discounts not applicable for this package"
            },
        ],
        royalImg: "/resources/images/packages2/26+WeekPeek.webp",
        royalPrice: "74.99",
        royalDuration: "15 minutes",
        royalNote: "",
    },

    {
        id: "queens-throne-royal-ultrasound",
        order: 1,
        name: "Unlimited Baby Views",
        weeks: "8+ Weeks | up to 7 Sessions",
        shortDescription: "Get the best and most comprehensive ultrasound package! Monthly Royal Sessions that gets you all the best for your baby",
        description: "Indulge in the ultimate ultrasound journey with our Royal Ultrasound Experience package. This premium subscription includes monthly 3D/4D ultrasound sessions, priority scheduling, and personalized keepsakes. Designed for those who want the most detailed and comprehensive bonding experience, this package ensures you capture every magical moment of your pregnancy.",
        packageImg: "/resources/images/packages2/unliBabyViews.webp",
        packageTitle: "Royal Ultrasound Experience",
        royalTitle: "Queen's Throne",
        royalDescription: [
            {
                descriptionTitle: "20-25 Minute HDLive/4D Ultrasound Sessions",
                descriptionSubtitle: "Experience detailed imaging of your baby with extended sessions"
            },
            {
                descriptionTitle: "Monthly Royal Ultrasound Session",
                descriptionSubtitle: "Enjoy seven sessions throughout your pregnancy for regular updates"
            },
            {
                descriptionTitle: "1 HD Color Picture + 5 B&W Prints Per Session",
                descriptionSubtitle: "Receive a high-definition color photo and multiple black-and-white prints at each visit"
            },
            {
                descriptionTitle: "Unlimited Digital Images",
                descriptionSubtitle: "Access and share all your baby's images digitally"
            },
            {
                descriptionTitle: "Live Video Streaming",
                descriptionSubtitle: "Share the live ultrasound experience with family and friends"
            },
            {
                descriptionTitle: "Royal Heartbeat Stuffed Animal",
                descriptionSubtitle: "Receive a special keepsake with your baby's recorded heartbeat during your second session"
            },
        ],
        royalImg: "/resources/images/packages2/queensThroneStandard.webp",
        royalPrice: "84.99",
        royalDuration: "20 - 25 minutes",
        royalNote: "Indulge in the ultimate ultrasound journey, capturing every precious moment and milestone of your baby's development.",
    },
]

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

    const pushDB =async (packages: any[]) => {
        try {
            // Loop through the newPackages array and push each package using its `id` as the key
            for (const pkg of newPackages) {
                // Create a reference to the "packages_new" node and append the package ID as the key
                const packageRef = ref(db, `packages_new/${pkg.id}`);
                // Use `set` to write the data to Firebase under the given key
                await set(packageRef, pkg); 
            }
    
            console.log("Packages added successfully!");
        } catch (error) {
            console.error("Error adding packages:", error);
        }
    }   

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

                        <div>
                        <button
                                className="searchBtn"
                                onClick={() => pushDB(newPackages)}
                            >
                                Test push db
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
                                        style={{
                                            backgroundColor:
                                                (currentPage === 1 ||
                                                    totalPages === 0) &&
                                                "#C0C0C0",
                                        }}
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
                                        style={{
                                            backgroundColor:
                                                (currentPage === totalPages ||
                                                    totalPages === 0) &&
                                                "#C0C0C0",
                                        }}
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
