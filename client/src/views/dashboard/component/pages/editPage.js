import React, { useState, useEffect } from 'react';
import { Drawer, Button, Space, Upload, Input, message, TimePicker, notification, Select } from 'antd'; // Modify this line
import ImgCrop from 'antd-img-crop'; // Ensure you have antd-img-crop installed
import moment from 'moment'; // Add this line
import { createMedia, uploadToMediaLibrary } from '../../../../services/media';
import { apiEditPage, apiGetPageHour, apiEditPageHour } from '../../../../services/page'; // Ensure these functions are correctly imported
import { useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNation } from '../../../../actions/actions/nation';

const EditPage = ({ pageData, open, onClose }) => {

    const dispatch = useDispatch();
    const { nations } = useSelector((state) => state.root.nation || {});
    const [fileList, setFileList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [namePage, setNamePage] = useState('');
    const [emailPage, setEmailPage] = useState('');
    const [phonePage, setPhonePage] = useState('');
    const [livePage, setLivePage] = useState('');
    const [introPage, setIntroPage] = useState('');
    const [descriptionPage, setDescriptionPage] = useState('');
    const [isVerified, setVerified] = useState(false);
    const [openHour, setOpenHour] = useState(''); // Add this line
    const [closeHour, setCloseHour] = useState(''); // Add this line
    const queryClient = useQueryClient();
    //console.log('nation: ', nations);

    useEffect(() => {
        dispatch(fetchNation());
        setNamePage(pageData?.page_name || '');
        setDescriptionPage(pageData?.about || '');
        setEmailPage(pageData?.email || '');
        setPhonePage(pageData?.phone || '');
        setLivePage(pageData?.nation?.documentId || '');
        setIntroPage(pageData?.intro || '');
        setOpenHour(pageData?.page_open_hour?.open_time || '');
        setCloseHour(pageData?.page_open_hour?.close_time || '');
        setVerified(pageData?.is_verified === false ? false : true);
    }, [pageData]);


    //console.log("pageInfo", pageData);



    const handleOpenHourChange = (time, timeString) => {
        console.log('Open Hour Time:', time); 
        console.log('Open Hour String:', timeString);
        setOpenHour(time ? time.format('HH:mm:ss.SSS') : '');  // Store in HH:mm:ss.SSS format
    };
    
    const handleCloseHourChange = (time, timeString) => {
        console.log('Close Hour Time:', time); 
        console.log('Close Hour String:', timeString);
        setCloseHour(time ? time.format('HH:mm:ss.SSS') : ''); // Store in HH:mm:ss.SSS format
    };

    // useEffect(() => {
    //     console.log('Updated Open Hour:', openHour); // Kiểm tra lại giá trị khi thay đổi
    // }, [openHour]);
    
    // useEffect(() => {
    //     console.log('Updated Close Hour:', closeHour); // Kiểm tra lại giá trị khi thay đổi
    // }, [closeHour]);

    const handleBannerUpload = ({ file, fileList }) => {
        setFileList(fileList);

        if (file.status === 'removed') {
            setSelectedImages((prevImages) => prevImages.filter((img) => img.name !== file.name));
            return;
        }

        if (file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (file.status === 'done' || file.status === 'error') {
            setUploading(false);
        }

        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImages((prevImages) => [...prevImages, { url: reader.result, name: file.name }]);
            };
            reader.readAsDataURL(file.originFileObj);
        }
    };

    const handleCheckboxChange = (e) => {
        
        setVerified(e.target.checked);
        //console.log('Checkbox checked:', isVerified); // Ensure the value is correctly set
    };

    const handleOk = async () => {
        const formData = {
            namePage,
            descriptionPage,
            openHour,
            closeHour,
            livePage,
            banner: selectedImages.length > 0 ? selectedImages[selectedImages.length - 1].url : pageData?.media?.file_path,
            is_verified: isVerified, // Ensure the value is passed into the data
            // type: isPrivate ? 'private' : 'public'
        };
        //console.log('formData', formData);

        if (selectedImages.length > 0) {
            const image = selectedImages[selectedImages.length - 1];
            const binaryImage = await fetch(image.url)
                .then(res => res.blob())
                .then(blob => {
                    const fileType = blob.type;
                    const fileName = image.name || 'image.jpg';
                    return new File([blob], fileName, { type: fileType });
                });

            try {
                const uploadedFile = await uploadToMediaLibrary({ file: binaryImage });
                const payload = {
                    data: {
                        file_path: `http://localhost:1337${uploadedFile.data[0].url}`,
                        file_type: uploadedFile.data[0].mime,
                        file_size: uploadedFile.data[0].size.toString(),
                    }
                };
                const response = await createMedia(payload);
                const payloadPostMedia = {
                    data: {
                        page_name: namePage,
                        about: descriptionPage,
                        profile_picture: response.data.data.documentId,
                        email: emailPage,
                        phone: phonePage,
                        nation: livePage,
                        intro: introPage,
                        ...(pageData?.is_verified !== null && { is_verified: isVerified }), // Conditionally add is_verified
                    }
                };
                await apiEditPage({ documentId: pageData?.documentId, payload: payloadPostMedia });
                try {
                    const hourPayload = {
                        data: {
                            open_time: openHour,
                            close_time: closeHour
                        }
                    };
                    //console.log('Hour Payload:', hourPayload); // Add this line
                    await apiEditPageHour({ documentId: pageData?.page_open_hour?.documentId, payload: hourPayload });
                    notification.success({ message: 'Success', description: 'Page updated successfully' }); // Add this line
                } catch (error) {
                    console.error('Error updating page hours:', error.response || error);
                    notification.error({ message: 'Error', description: 'Failed to update page hours' });
                }
                onClose(formData);
            } catch (error) {
                console.error('Error adding image:', error.response || error);
                notification.error({ message: 'Error', description: 'Failed to add image' });
            }
        } else {
            try {
                const payload = {
                    data: {
                        page_name: namePage,
                        about: descriptionPage,
                        email: emailPage,
                        phone: phonePage,
                        nation: livePage,
                        intro: introPage,
                        ...(pageData?.is_verified !== null && { is_verified: isVerified }), // Conditionally add is_verified
                    }
                };
                await apiEditPage({ documentId: pageData?.documentId, payload });
                try {
                    const hourPayload = {
                        data: {
                            open_time: openHour,
                            close_time: closeHour
                        }
                    };
                    //console.log('Hour Payload:', hourPayload); // Add this line
                    await apiEditPageHour({ documentId: pageData?.page_open_hour?.documentId , payload: hourPayload });
                    notification.success({ message: 'Success', description: 'Page updated successfully' }); // Add this line
                } catch (error) {
                    console.error('Error updating page hours:', error.response || error);
                    notification.error({ message: 'Error', description: 'Failed to update page hours' });
                }
                onClose(formData);
            } catch (error) {
                console.error('Error adding group:', error.response || error);
                notification.error({ message: 'Error', description: 'Failed to add group' });
            }
        }
        queryClient.invalidateQueries('pageDetais');
    };

    return (
        <>
            <Drawer
                title="Edit Page"
                placement="right"
                width={500}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={handleOk}>
                            OK
                        </Button>
                    </Space>
                }
                style={{ marginTop: "74px", height: "875px" }}
            >
                <p>Page Name</p>
                <Input
                    placeholder="Enter Page Name"
                    value={namePage}
                    onChange={(e) => setNamePage(e.target.value)}
                    className="mb-3"
                />
                <p>Page Intro</p>
                <Input
                    placeholder="Enter Page Intro"
                    value={introPage}
                    onChange={(e) => setNamePage(e.target.value)}
                    className="mb-3"
                />
                <p>Page About</p>
                <Input.TextArea
                    placeholder="Enter Page Description"
                    value={descriptionPage}
                    onChange={(e) => setDescriptionPage(e.target.value)}
                    className="mb-3"
                />
                <p>Page Email</p>
                <Input
                    placeholder="Enter Page Email"
                    value={emailPage}
                    onChange={(e) => setEmailPage(e.target.value)}
                    className="mb-3"
                />
                <div className="d-flex justify-content-between">
                    <div>
                        <p>Open Hour</p> {/* Modify this block */}
                        <TimePicker
                            value={openHour ? moment(openHour, 'HH:mm:ss.SSS') : null}
                            onChange={handleOpenHourChange}
                            format="HH:mm"
                            className="mb-3"
                        />
                    </div>
                    <div>
                        <p>Close Hour</p> {/* Modify this block */}
                        <TimePicker
                            value={closeHour ? moment(closeHour, 'HH:mm:ss.SSS') : null}
                            onChange={handleCloseHourChange}
                            format="HH:mm"
                            className="mb-3"
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <div>
                        <p>Page phone</p>
                        <Input
                            placeholder="Enter Page Phone"
                            value={phonePage}
                            onChange={(e) => setPhonePage(e.target.value)}
                            className="mb-3"
                        />
                        
                    </div>
                    <div>
                        <p>Page Live</p>
                        <Select
                            showSearch
                            placeholder="Select a nation"
                            value={livePage || undefined} // Ensure placeholder shows when no value is selected
                            onChange={(value) => setLivePage(value)}
                            className="mb-3"
                            style={{ width: '200px' }}
                            optionFilterProp="children" // Enable search functionality
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {nations.map((nation) => (
                                <Select.Option key={nation.id} value={nation.documentId}>
                                    {nation.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <p>Image banner</p>
                <hr />
                <div className="position-relative m-2">
                    <img
                        src={selectedImages.length > 0 ? selectedImages[selectedImages.length - 1].url : pageData?.profile_picture?.file_path}
                        alt={`group-${pageData?.name}`}
                        className="img-fluid rounded"
                        style={{ maxHeight: "150px", objectFit: "fill", width: "50%" }}
                    />
                    <ImgCrop aspect={4 / 4} rotationSlider >
                        <Upload
                            fileList={fileList}
                            onChange={handleBannerUpload}
                            showUploadList={false}
                        >
                            <Button className="mt-3 ms-3">Upload New Image</Button>
                        </Upload>
                    </ImgCrop>
                </div>
                {pageData?.is_verified !== null && (
                    <StyledWrapper className="mt-3">
                        <div>
                            <label className="switch">
                                <input type="checkbox" checked={isVerified} onChange={handleCheckboxChange} />
                                <span>
                                    <em />
                                    <strong />
                                </span>
                            </label>
                        </div>
                    </StyledWrapper>
                )}

            </Drawer>
        </>
    )
}

const StyledWrapper = styled.div`
  .switch {
    height: 24px;
    display: block;
    position: relative;
    cursor: pointer;
  }
  .switch input {
    display: none;
  }
  .switch input + span {
    padding-left: 50px;
    min-height: 24px;
    line-height: 24px;
    display: block;
    color: #99a3ba;
    position: relative;
    vertical-align: middle;
    white-space: nowrap;
    transition: color 0.3s ease;
  }
  .switch input + span:before,
  .switch input + span:after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 12px;
  }
  .switch input + span:before {
    top: 0;
    left: 0;
    width: 42px;
    height: 24px;
    background: #e4ecfa;
    transition: all 0.3s ease;
  }
  .switch input + span:after {
    width: 18px;
    height: 18px;
    background: #fff;
    top: 3px;
    left: 3px;
    box-shadow: 0 1px 3px rgba(18, 22, 33, 0.1);
    transition: all 0.45s ease;
  }
  .switch input + span em {
    width: 8px;
    height: 7px;
    background: #99a3ba;
    position: absolute;
    left: 8px;
    bottom: 7px;
    border-radius: 2px;
    display: block;
    z-index: 1;
    transition: all 0.45s ease;
  }
  .switch input + span em:before {
    content: "";
    width: 2px;
    height: 2px;
    border-radius: 1px;
    background: #fff;
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
    margin: -1px 0 0 -1px;
  }
  .switch input + span em:after {
    content: "";
    display: block;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid #99a3ba;
    border-bottom: 0;
    width: 6px;
    height: 4px;
    left: 1px;
    bottom: 6px;
    position: absolute;
    z-index: 1;
    transform-origin: 0 100%;
    transition: all 0.45s ease;
    transform: rotate(-35deg) translate(0, 1px);
  }
  .switch input + span strong {
    font-weight: normal;
    position: relative;
    display: block;
    top: 1px;
  }
  .switch input + span strong:before,
  .switch input + span strong:after {
    font-size: 14px;
    font-weight: 500;
    display: block;
    font-family: "Mukta Malar", Arial;
    -webkit-backface-visibility: hidden;
  }
  .switch input + span strong:before {
    content: "Page unverified";
    transition: all 0.3s ease 0.2s;
  }
  .switch input + span strong:after {
    content: "Page verified";
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    color: #02923c;
    transition: all 0.3s ease;
    transform: translate(2px, 0);
  }
  .switch input:checked + span:before {
    background: #eae7e7;
  }
  .switch input:checked + span:after {
    background: #fff;
    transform: translate(18px, 0);
  }
  .switch input:checked + span em {
    transform: translate(18px, 0);
    background: #02923c;
  }
  .switch input:checked + span em:after {
    border-color: #02923c;
    transform: rotate(0deg) translate(0, 0);
  }
  .switch input:checked + span strong:before {
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    transform: translate(-2px, 0);
  }
  .switch input:checked + span strong:after {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
    transition: all 0.3s ease 0.2s;
  }

  .switch :before,
  :after {
    box-sizing: border-box;
  }`;


export default EditPage;