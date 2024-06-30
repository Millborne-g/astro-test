export const Header = () => {
    return (
        <>
            {/* logo */}
            <div className="content-logo-container">
                <img className="logo-img" src="../../public/logo.png" alt="" />
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
        </>
    );
};