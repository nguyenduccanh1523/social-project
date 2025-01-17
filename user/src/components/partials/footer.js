import React from 'react'
import { Link } from 'react-router-dom'

const Footer = (props) => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('dark');
    if (mode !== null) {
        document.body.classList = '';
        switch (mode) {
            case "true":
                document.body.classList = 'dark';
                break;
            case "false":
                document.body.classList = '';
                break;
            default:
                document.body.classList = '';
                break;
        }
    }

    return (
        <footer className="bg-white py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div>
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/privacy-policy" className="text-gray-600 hover:text-indigo-600">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service" className="text-gray-600 hover:text-indigo-600">Terms of Use</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="text-gray-600">
                        <span>Copyright 2020 <Link to="#" className="text-indigo-600 hover:text-indigo-800">SocialV</Link> All Rights Reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;