import React, { useState, useEffect } from 'react';
import { Drawer, Button, Space, Upload, Input, message, Select } from 'antd'; // Ensure you have antd installed
import ImgCrop from 'antd-img-crop'; // Ensure you have antd-img-crop installed
import { createMedia, uploadToMediaLibrary } from '../../../../services/media';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { apiCreatePostTag, apiDeletePostTag, apiGetDocumentTag, apiGetTag } from '../../../../services/tag';
import { useSelector } from 'react-redux';
import { apiUpdateBlog } from '../../../../services/blog';

const { Option } = Select;

const DrawerEdit = ({ blog, visible, onClose }) => {
    const { user } = useSelector((state) => state.root.auth || {});
    const { token } = useSelector((state) => state.root.auth || {});
    const [fileList, setFileList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [titleBlog, setTitleBlog] = useState('');
    const [descriptionBlog, setDescriptionBlog] = useState('');
    const [contentBlog, setContentBlog] = useState('');
    const [linkBlog, setLinkBlog] = useState('');
    const [isGLobal, setIsGlobal] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const queryClient = useQueryClient();

    const { data: tags } = useQuery({
        queryKey: ['tags', token],
        queryFn: () => apiGetTag({ token }),
        enabled: !!token,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const { data: documentTags } = useQuery({
        queryKey: ['documentTags', blog?.documentId, token],
        queryFn: () => apiGetDocumentTag({ documentId: blog?.documentId, token }),
        enabled: !!blog?.documentId && !token,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const tagData = tags?.data?.data || [];
    console.log(tagData)

    const handleTagSelect = (values) => {
        setSelectedTags(values);
    };

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
        setIsGlobal(e.target.checked);
    };

    const handleOk = async () => {
        const formData = {
            titleBlog,
            descriptionBlog,
            contentBlog,
            banner: selectedImages.length > 0 ? selectedImages[selectedImages.length - 1].url : blog?.media?.file_path,
            type: isGLobal ? true : false,
            tags: selectedTags,
        };
        console.log('formData', formData);

        // Lấy danh sách tag cũ từ blog (nếu có)
        const oldBlogTags = blog?.tags || [];
        const oldTagIds = oldBlogTags.map(tag => tag.tag?.documentId);
        const oldBlogTagDocumentIds = oldBlogTags.map(tag => tag.documentId);

        if (selectedImages.length > 0) {
            console.log('selectedImages', selectedImages);
            const image = selectedImages[selectedImages.length - 1];

            const uploadToCloudinary = async (file, folder = "default") => {
                const cloudName = process.env.REACT_APP_CLOUDINARY_NAME;
                const uploadPreset = process.env.REACT_APP_REACT_UPLOAD;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset);
                formData.append('folder', folder);
                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (data.secure_url) {
                        return {
                            url: data.secure_url,
                            public_id: data.public_id,
                            mime: data.resource_type + "/" + data.format,
                            size: data.bytes
                        };
                    } else {
                        throw new Error(data.error?.message || "Upload failed");
                    }
                } catch (error) {
                    console.error("Error uploading file to Cloudinary:", error);
                }
            };

            const binaryImage = await fetch(image.url)
                .then(res => res.blob())
                .then(blob => {
                    const fileType = blob.type;
                    const fileName = image.name || 'image.jpg';
                    return new File([blob], fileName, { type: fileType });
                });

            try {
                const uploadedFile = await uploadToCloudinary(binaryImage, 'default');
                const payload = {
                    file_path: uploadedFile.url,
                    file_type: uploadedFile.mime,
                    file_size: uploadedFile.size.toString(),
                    type_id: 'pkw7l5p5gd4e70uy5bvgpnpv',
                };
                const response = await createMedia(payload, token);
                const payloadBlogMedia = {
                    title: titleBlog,
                    description: descriptionBlog,
                    content: contentBlog,
                    link_document: linkBlog,
                    media_id: response.data.data.documentId,
                    is_global: isGLobal ? true : false,
                    type_id: isGLobal ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
                    author: user.documentId
                };
                await apiUpdateBlog({ documentId: blog?.documentId, payload: payloadBlogMedia });
                if (selectedTags?.length) {
                    const existingTags = documentTags?.data?.data || [];
                    const selectedTagIds = selectedTags || [];
                    // Lấy tất cả tagId đã có trong post-tag (bao gồm cả documentTags và blog?.tags)
                    const allExistingTagIds = [
                        ...existingTags.map(item => item?.tag?.documentId),
                        ...(blog?.tags || []).map(tag => tag.tag?.documentId)
                    ];
                    // Tạo tag mới nếu chưa có trong cả hai nguồn
                    for (const tagId of selectedTagIds) {
                        if (!allExistingTagIds.includes(tagId)) {
                            const payload = {
                                document_share_id: blog?.documentId,
                                tag_id: tagId,
                            };
                            try {
                                await apiCreatePostTag(payload);
                            } catch (error) {
                                console.error('Error adding tag:', error);
                            }
                        }
                    }

                    // Xóa tag cũ nếu không còn trong selectedTagIds
                    // So sánh với blog?.tags để lấy đúng documentId của blogTag
                    for (const blogTag of oldBlogTags) {
                        if (!selectedTagIds.includes(blogTag?.tag?.documentId)) {
                            try {
                                await apiDeletePostTag({ documentId: blogTag?.documentId, token });
                            } catch (error) {
                                console.error('Error deleting tag:', error);
                            }
                        }
                    }
                }
                message.success('Blog Update successfully');
                onClose(formData);
            } catch (error) {
                console.error('Error adding image:', error.response || error);
            }
        } else {
            try {
                const payload = {
                    title: titleBlog,
                    description: descriptionBlog,
                    content: contentBlog,
                    link_document: linkBlog,
                    is_global: isGLobal ? true : false,
                    type_id: isGLobal ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
                    author: user.documentId
                };
                await apiUpdateBlog({ documentId: blog?.documentId, payload: payload });
                if (selectedTags?.length) {
                    const existingTags = documentTags?.data?.data || [];
                    const selectedTagIds = selectedTags || [];
                    // Lấy tất cả tagId đã có trong post-tag (bao gồm cả documentTags và blog?.tags)
                    const allExistingTagIds = [
                        ...existingTags.map(item => item?.tag?.documentId),
                        ...(blog?.tags || []).map(tag => tag.tag?.documentId)
                    ];
                    // Tạo tag mới nếu chưa có trong cả hai nguồn
                    for (const tagId of selectedTagIds) {
                        if (!allExistingTagIds.includes(tagId)) {
                            const payload = {
                                document_share_id: blog?.documentId,
                                tag_id: tagId,
                            };
                            try {
                                await apiCreatePostTag(payload);
                            } catch (error) {
                                console.error('Error adding tag:', error);
                            }
                        }
                    }

                    // Xóa tag cũ nếu không còn trong selectedTagIds
                    for (const blogTag of oldBlogTags) {
                        if (!selectedTagIds.includes(blogTag?.tag?.documentId)) {
                            try {
                                await apiDeletePostTag({ documentId: blogTag?.documentId, token });
                            } catch (error) {
                                console.error('Error deleting tag:', error);
                            }
                        }
                    }
                }
                message.success('Blog Update successfully');
                onClose(formData);
            } catch (error) {
                console.error('Error adding blog:', error.response || error);
            }
        }
        queryClient.invalidateQueries('myBlogs');
        onClose();
    };

    useEffect(() => {
        setTitleBlog(blog?.title || '');
        setDescriptionBlog(blog?.description || '');
        setContentBlog(blog?.content || '');
        setLinkBlog(blog?.link_document || '');
        setIsGlobal(blog?.is_global);
        // Lấy tất cả tagId từ blog, không lọc theo tagData
        const allTagIds = (blog?.tags || []).map(tag => tag.tag?.documentId);
        setSelectedTags(allTagIds);
    }, [blog]);

    return (
        <Drawer
            title="Edit Blog"
            width={520}
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
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
            <p>Image blog</p>
            <hr />
            <div className="position-relative m-2">
                <img
                    src={selectedImages.length > 0 ? selectedImages[selectedImages.length - 1].url : blog?.media?.file_path}
                    alt={`Image Banner`}
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
            <p>Title</p>
            <Input
                placeholder="Enter Blog Title"
                value={titleBlog}
                onChange={(e) => setTitleBlog(e.target.value)}
                className="mb-3"
            />
            <p>Description</p>
            <Input.TextArea
                placeholder="Enter Blog Description"
                value={descriptionBlog}
                onChange={(e) => setDescriptionBlog(e.target.value)}
                className="mb-3"
            />
            <p>Content</p>
            <Input.TextArea
                placeholder="Enter Blog Content"
                value={contentBlog}
                onChange={(e) => setContentBlog(e.target.value)}
                className="mb-3"
            />
            <p>Link Document</p>
            <Input.TextArea
                placeholder="Enter Blog Link Document"
                value={linkBlog}
                onChange={(e) => setLinkBlog(e.target.value)}
                className="mb-3"
            />
            <p>Blog tag</p>
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
                tagRender={(props) => {
                    const { value, closable, onClose } = props;
                    const tagObj = tagData.find(tag => tag.documentId === value);
                    return (
                        <span style={{ marginRight: 3, background: '#f0f0f0', padding: '2px 8px', borderRadius: 4, display: 'inline-block' }}>
                            {tagObj ? tagObj.name : 'Tag đã bị xóa'}
                            {closable && (
                                <span style={{ marginLeft: 4, cursor: 'pointer' }} onClick={onClose}>×</span>
                            )}
                        </span>
                    );
                }}
            >
                {tagData.map((tag) => (
                    <Option key={tag.documentId} value={tag.documentId}>
                        {tag.name}
                    </Option>
                ))}
            </Select>


            <StyledWrapper className="mt-3">
                <div>
                    <label className="switch">
                        <input type="checkbox" checked={isGLobal} onChange={handleCheckboxChange} />
                        <span>
                            <em />
                            <strong />
                        </span>
                    </label>
                </div>
            </StyledWrapper>
        </Drawer>
    );
};

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
    content: "Private";
    transition: all 0.3s ease 0.2s;
  }
  .switch input + span strong:after {
    content: "Public";
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


export default DrawerEdit;
