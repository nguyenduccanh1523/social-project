/* eslint-disable no-undef */
import React, { useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./post.scss";
import CustomToggle from "../../../../components/dropdowns";

//image
import icon4 from "../../../../assets/images/icon/04.png";
import icon6 from "../../../../assets/images/icon/06.png";
import icon1 from "../../../../assets/images/icon/01.png"; // Example icon for like
import icon2 from "../../../../assets/images/icon/02.png"; // Example icon for love

const ActionLike = ({ post, onSelect }) => {
    const [selectedReaction, setSelectedReaction] = useState(null);

    const handleReactionClick = (icon) => {
        if (selectedReaction === icon) {
            setSelectedReaction(null);
            onSelect(null); // Call the onSelect prop with null to deselect
        } else {
            setSelectedReaction(icon);
            onSelect(icon); // Call the onSelect prop with the selected icon
        }
    };

    const handleButtonClick = () => {
        setSelectedReaction(null);
    };

    return (
        <>
            <div className="d-flex align-items-center ">
                <div className="like-data">
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle}>
                            <button className="btn btn-white d-flex align-items-center post-button" onClick={handleButtonClick}>
                                {selectedReaction ? (
                                    <img src={selectedReaction} className="img-fluid me-2" alt="reaction" />
                                ) : (
                                    <span className="material-symbols-outlined">thumb_up</span>
                                )}
                                <h6>Reaction</h6>
                            </button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="py-2 w-100 " style={{ textAlign: "center" }}>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Like</Tooltip>}
                                className="ms-2 me-2"
                            >
                                <img
                                    src={icon1}
                                    className="img-fluid me-2"
                                    alt=""
                                    onClick={() => handleReactionClick(icon1)}
                                />
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Love</Tooltip>}
                                className="me-2"
                            >
                                <img
                                    src={icon2}
                                    className="img-fluid me-2"
                                    alt=""
                                    onClick={() => handleReactionClick(icon2)}
                                />
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>HaHa</Tooltip>}
                                className="me-2"
                            >
                                <img
                                    src={icon4}
                                    className="img-fluid me-2"
                                    alt=""
                                    onClick={() => handleReactionClick(icon4)}
                                />
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Sade</Tooltip>}
                                className="me-2"
                            >
                                <img
                                    src={icon6}
                                    className="img-fluid me-2"
                                    alt=""
                                    onClick={() => handleReactionClick(icon6)}
                                />
                            </OverlayTrigger>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </>
    );
}

export default ActionLike;