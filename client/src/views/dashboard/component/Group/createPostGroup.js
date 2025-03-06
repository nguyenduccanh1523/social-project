import React, { useEffect, useState, useRef } from "react";
import {
    Dropdown,
    Button,
    Modal,
} from "react-bootstrap";
import { useQuery } from '@tanstack/react-query';
import { Select, notification } from 'antd';
import { Link } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';
import "react-toastify/ReactToastify.css";
import { useGeolocated } from "react-geolocated";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import small1 from "../../../../assets/images/small/07.png";
import small5 from "../../../../assets/images/small/11.png";
import small6 from "../../../../assets/images/small/12.png";
import { apiGetTag } from "../../../../services/tag";
import ButtonPost from "../buttonPost";

const { Option } = Select;

const CreatePostGroup = ({ show, handleClose, group, profile }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [inputText, setInputText] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [visibility, setVisibility] = useState('public');
    const pickerRef = useRef(null);

    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    const onEmojiClick = (emoji) => {
        setInputText(prevInput => prevInput + emoji.emoji);
    };

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowPicker(false);
        }
    };

    const { data: tags } = useQuery({
        queryKey: ['tags', group?.documentId],
        queryFn: () => apiGetTag(group?.documentId),
        enabled: !!group?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const tagData = tags?.data?.data || [];

    const handleFriendSelect = (values) => {
        setSelectedFriends(values);
    };

    const handleTagSelect = (values) => {
        setSelectedTags(values);
    };

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setLocation(latLng);
    };

    const handleImageChange = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setSelectedImages((prevImages) => prevImages.concat(filesArray));
            event.target.value = null; // Reset the input value to allow re-adding the same image
        }
    };

    const handleRemoveImage = (image) => {
        setSelectedImages((prevImages) => prevImages.filter((img) => img !== image));
        // Delay revoking the object URL to ensure it can be re-added
        setTimeout(() => {
            URL.revokeObjectURL(image);
        }, 100);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setInputText("");
        setSelectedFriends([]);
        setSelectedTags([]);
        setAddress("");
        setLocation(null);
        setSelectedImages([]);
        handleClose();
        notification.info({
            message: 'Post Discarded',
            description: 'Your post has been discarded.',
        });
    };

    const handleCloseModal = () => {
        if (inputText || selectedImages.length > 0) {
            setShowConfirm(true);
        } else {
            handleClose();
        }
    };

    const handleVisibilityChange = (value) => {
        setVisibility(value);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const formData = {
    //         inputText,
    //         selectedFriends,
    //         selectedTags,
    //         address,
    //         location,
    //         selectedImages,
    //         visibility,
    //     };
    //     //console.log('Form Data:', formData);
    // };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <Modal
                show={show}
                onHide={handleCloseModal}
                size="lg"
                style={{ marginTop: "50px" }}
            >
                <Modal.Header className="d-flex justify-content-between">
                    <h5 className="modal-title" id="post-modalLabel">
                        Create Post
                    </h5>
                    <button
                        type="button"
                        className="btn btn-secondary lh-1"
                        onClick={handleCloseModal}
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form  >
                        <div className="d-flex align-items-center">
                            <div className="user-img">
                                <img
                                    loading="lazy"
                                    src={profile?.profile_picture}
                                    alt="userimg"
                                    className="avatar-60 rounded-circle img-fluid"
                                />
                            </div>
                            <div className="post-text ms-3 w-100">
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control rounded flex-grow-1"
                                        placeholder="Write something here..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        style={{ border: "none" }}
                                    />
                                    <span
                                        className="material-symbols-outlined ms-2"
                                        onClick={() => setShowPicker(!showPicker)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        emoji_emotions
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hiển thị Emoji khi showPicker là true */}
                        {showPicker && (
                            <div ref={pickerRef} style={{ position: "absolute", bottom: "60px", right: "10px", zIndex: 1000 }}>
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                        <hr />
                        <ul className="d-flex flex-wrap align-items-center list-inline m-0 p-0">
                            <li className="col-md-6 mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="upload-image"
                                        onChange={handleImageChange}
                                        multiple
                                    />
                                    <label htmlFor="upload-image" style={{ cursor: "pointer" }}>
                                        <img
                                            loading="lazy"
                                            src={small1}
                                            alt="icon"
                                            className="img-fluid"
                                        />{" "}
                                        Photo/Video
                                    </label>
                                </div>
                            </li>
                            <li className="col-md-6 mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3" style={{ zIndex: 1050 }}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder={
                                            <span className="d-flex align-items-center">
                                                <span className="material-symbols-outlined ms-2">local_offer</span> Tag Categories
                                            </span>
                                        }
                                        onChange={handleTagSelect}
                                        value={selectedTags}
                                        getPopupContainer={trigger => trigger.parentNode}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {tagData.map((tag) => (
                                            <Option key={tag.documentId} value={tag.documentId}>
                                                {tag.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </li>
                            {/* <li className="col-md-6 mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                    <PlacesAutocomplete
                                        value={address}
                                        onChange={setAddress}
                                        onSelect={handleSelect}
                                    >
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                                <input
                                                    {...getInputProps({
                                                        placeholder: 'Search Places ...',
                                                        className: 'location-search-input',
                                                    })}
                                                    className="form-control"
                                                />
                                                <div className="autocomplete-dropdown-container">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                            ? 'suggestion-item--active'
                                                            : 'suggestion-item';
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                        return (
                                                            <div
                                                                {...getSuggestionItemProps(suggestion, {
                                                                    className,
                                                                    style,
                                                                })}
                                                            >
                                                                <span>{suggestion.description}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </PlacesAutocomplete>
                                </div>
                            </li> */}
                            <li className="col-md-6 mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                    <Link to="#">
                                        <img
                                            loading="lazy"
                                            src={small5}
                                            alt="icon"
                                            className="img-fluid"
                                        />{" "}
                                        Live Video
                                    </Link>
                                </div>
                            </li>
                            <li className="col-md-6 mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                    <Link to="#">
                                        <img
                                            loading="lazy"
                                            src={small6}
                                            alt="icon"
                                            className="img-fluid"
                                        />{" "}
                                        Gif
                                    </Link>
                                </div>
                            </li>
                        </ul>
                        <hr />
                        {selectedImages.length > 0 && (
                            <div className="d-flex flex-wrap justify-content-center mb-3">
                                {selectedImages.map((image, index) => (
                                    <div key={index} className="position-relative m-2">
                                        <img
                                            src={image}
                                            alt={`Selected ${index}`}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "150px" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                            onClick={() => handleRemoveImage(image)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="other-option">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="user-img me-3">
                                        <img
                                            loading="lazy"
                                            src={profile?.profile_picture}
                                            alt="userimg"
                                            className="avatar-60 rounded-circle img-fluid"
                                        />
                                    </div>
                                    <h6>Your Story</h6>
                                </div>
                                <div className="card-post-toolbar">
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            className="dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            role="button"
                                        >
                                            <span className="btn btn-primary">
                                                {visibility === 'public' ? 'Public' : 'Only Me'}
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu m-0 p-0">
                                            <Dropdown.Item
                                                className="dropdown-item p-3"
                                                onClick={() => handleVisibilityChange('public')}
                                            >
                                                <div className="d-flex align-items-top">
                                                    <i className="ri-save-line h4"></i>
                                                    <div className="data ms-2">
                                                        <h6>Public</h6>
                                                        <p className="mb-0">
                                                            Anyone on or off SocialV
                                                        </p>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                className="dropdown-item p-3"
                                                onClick={() => handleVisibilityChange('private')}
                                            >
                                                <div className="d-flex align-items-top">
                                                    <i className="ri-notification-line h4"></i>
                                                    <div className="data ms-2">
                                                        <h6>Only Me</h6>
                                                        <p className="mb-0">Only me</p>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <ButtonPost profile={profile} group={group} formData={{
                            inputText,
                            selectedFriends,
                            selectedTags,
                            address,
                            location,
                            selectedImages,
                            visibility,
                        }} page={''}  />
                    </form>
                </Modal.Body>
            </Modal>
            <Modal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                size="sm"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Discard Post?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to discard this post?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleCloseConfirm}>
                        Discard
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreatePostGroup;
