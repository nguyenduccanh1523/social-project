import React, { useState, useEffect } from 'react';
import { Drawer, Button, Space, Upload, Input, message } from 'antd'; // Ensure you have antd installed
import ImgCrop from 'antd-img-crop'; // Ensure you have antd-img-crop installed
import { createMedia, uploadToMediaLibrary } from '../../../../services/media';
import { apiEditGroup } from '../../../../services/group';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';


const EditGroup = ({ oldData, open, onClose }) => {
    const [fileList, setFileList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [nameGroup, setNameGroup] = useState('');
    const [descriptionGroup, setDescriptionGroup] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const queryClient = useQueryClient();
    //console.log('oldData', oldData);

    useEffect(() => {
        setNameGroup(oldData?.group_name || '');
        setDescriptionGroup(oldData?.description || '');
        setIsPrivate(oldData?.type?.name === 'private');
    }, [oldData]);

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
        setIsPrivate(e.target.checked);
    };

    const handleOk = async () => {
        const formData = {
            nameGroup,
            descriptionGroup,
            banner: selectedImages.length > 0 ? selectedImages[selectedImages.length - 1].url : oldData?.media?.file_path,
            type: isPrivate ? 'private' : 'public'
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
                        group_name: nameGroup,
                        description: descriptionGroup,
                        media: response.data.data.documentId,
                        type: isPrivate ? 'pkw7l5p5gd4e70uy5bvgpnpv' : 'elx6zlfz9ywp6esoyfi6a1yl'
                    }
                };
                await apiEditGroup({ documentId: oldData?.documentId, payload: payloadPostMedia });
                message.success('Group updated successfully');
                onClose(formData);
            } catch (error) {
                console.error('Error adding image:', error.response || error);
            }
        } else {
            try {
                const payload = {
                    data: {
                        group_name: nameGroup,
                        description: descriptionGroup,
                        type: isPrivate ? 'pkw7l5p5gd4e70uy5bvgpnpv' : 'elx6zlfz9ywp6esoyfi6a1yl'
                    }
                };
                await apiEditGroup({ documentId: oldData?.documentId, payload });
                message.success('Group updated successfully');
                onClose(formData);
            } catch (error) {
                console.error('Error adding group:', error.response || error);
            }
        }
        queryClient.invalidateQueries('groups');
    };

    return (
        <>
            <Drawer
                title="Edit Group"
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
                style={{ marginTop: "74px" }}
            >
                <p>Group Name</p>
                <Input
                    placeholder="Enter Group Name"
                    value={nameGroup}
                    onChange={(e) => setNameGroup(e.target.value)}
                    className="mb-3"
                />
                <p>Group Description</p>
                <Input.TextArea
                    placeholder="Enter Group Description"
                    value={descriptionGroup}
                    onChange={(e) => setDescriptionGroup(e.target.value)}
                    className="mb-3"
                />
                <p>Image banner</p>
                <hr />
                <div className="position-relative m-2">
                    <img
                        src={selectedImages.length > 0 ? selectedImages[selectedImages.length - 1].url : oldData?.media?.file_path}
                        alt={`group-${oldData?.name}`}
                        className="img-fluid rounded"
                        style={{ maxHeight: "350px", objectFit: "cover", width: "100%" }}
                    />
                </div>
                <ImgCrop aspect={16 / 9} rotationSlider >
                    <Upload
                        fileList={fileList}
                        onChange={handleBannerUpload}
                        showUploadList={false}
                    >
                        <Button className="mt-3 ">Upload New Image</Button>
                    </Upload>
                </ImgCrop>
                <StyledWrapper className="mt-3">
                    <div>
                        <label className="switch">
                            <input type="checkbox" checked={isPrivate} onChange={handleCheckboxChange} />
                            <span>
                                <em />
                                <strong />
                            </span>
                        </label>
                    </div>
                </StyledWrapper>
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
    content: "Group Public";
    transition: all 0.3s ease 0.2s;
  }
  .switch input + span strong:after {
    content: "Group Private";
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


export default EditGroup;