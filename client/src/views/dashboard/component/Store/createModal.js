import { Modal, Upload, Button, Input, Radio, ColorPicker, message, Popconfirm } from "antd";
import { FaImage, FaFont, FaTrash, FaPalette } from "react-icons/fa";
import { useState, useRef } from "react";
import Draggable from "react-draggable";
import { createMedia, uploadToMediaLibrary } from "../../../../services/media";
import { apiCreateStory, apiUpdateStory } from "../../../../services/stories";
import { useSelector } from "react-redux";
import styled from "styled-components";

const DraggableText = ({ text, onRemove, onDrag, onEdit, textColor }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={text.position}
      onDrag={(e, data) => onDrag(text.id, data)}
      bounds={false}
    >
      <div ref={nodeRef} className="absolute cursor-move group" style={{ zIndex: 10 }}>
        <div
          className="text-2xl font-bold drop-shadow-lg break-words max-w-[200px]"
          style={{
            color: textColor,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          <Input
            value={text.content}
            onChange={(e) => onEdit(text.id, e.target.value)}
            style={{ color: 'inherit', background: 'transparent', border: 'none' }}
          />
        </div>
        <button
          onClick={() => onRemove(text.id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </Draggable>
  );
};

const CreateStoryModal = ({ open, onClose }) => {
  const { profile } = useSelector((state) => state.root.user || {});
  const [fileList, setFileList] = useState([]);
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [previewImage, setPreviewImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#1677ff');
  const [backgroundType, setBackgroundType] = useState('color');
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const canvasRef = useRef(null);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setPreviewImage(null);
    }
  };

  const addText = () => {
    if (newText.trim()) {
      const newTextObject = { id: Date.now(), content: newText, position: { x: 0, y: 0 } };
      setTexts([...texts, newTextObject]);
      console.log("Text array:", [...texts, newTextObject]);
      setNewText("");
    }
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const handleDrag = (id, data) => {
    setTexts(texts.map(text =>
      text.id === id ? { ...text, position: { x: data.x, y: data.y } } : text
    ));
  };

  const handleEdit = (id, newContent) => {
    setTexts(texts.map(text =>
      text.id === id ? { ...text, content: newContent } : text
    ));
  };

  const handleCheckboxChange = (e) => {
    setIsPrivate(e.target.checked);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Are you sure you want to cancel?',
      content: 'All data will be deleted.',
      onOk: () => {
        // Xóa dữ liệu
        setFileList([]);
        setTexts([]);
        setNewText("");
        setPreviewImage(null);
        setBackgroundColor('#1677ff');
        setBackgroundType('color');
        onClose(); // Đóng modal
      },
      onCancel: () => {
        // Không làm gì cả
      },
    });
  };


  const handleSubmit = async () => {
    const storyData = {
      type: backgroundType,
      background: backgroundType === 'color' ? backgroundColor : previewImage,
      nameImage: fileList.length > 0 ? fileList[0].name : '',
      isPrivate: isPrivate,
      texts: texts.map(t => ({
        content: t.content,
        position: t.position,
        color: textColor
      }))
    };
    console.log('🚀 Story data ready to post:', storyData);

    const createStory = async (payload) => {
      try {
        const response = await apiCreateStory(payload);
        return response?.data?.data;
      } catch (error) {
        console.error('Error creating post:', error);
        return null;
      }
    };

    let story = null;

    if (storyData) {
      const payload = {
        data: {
          user_id: profile?.documentId,
          story_type: storyData?.type,
          background: storyData?.type === 'color' ? storyData?.background : '',
          status_story: 'active',
          type: storyData?.isPrivate ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
          text: storyData?.texts
        }
      };
      story = await createStory(payload);
    }

    if (story) {
      if (storyData?.type === 'image') {
        const binaryImage = await fetch(storyData?.background)
          .then(res => res.blob())
          .then(blob => {
            const fileType = blob.type;
            const fileName = storyData?.nameImage || 'image.jpg';
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
          const payloadStoryMedia = {
            data: {
              media: response.data.data.documentId,
            }
          };
          console.log('story', story)
          await apiUpdateStory({documentId: story?.documentId, payload: payloadStoryMedia});
        } catch (error) {
          console.error('Error adding image:', error.response || error);
        }
      }
    }

    message.success('Story created successfully!');
    //onClose(); // đóng modal
  };



  return (
    <Modal
      title="Create Story"
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          disabled={(backgroundType === 'image' && fileList.length === 0)}
          onClick={handleSubmit}
        >
          Post
        </Button>,
      ]}
    >
      <div className="flex gap-4">
        <div
          className="w-2/3 relative"
          style={{
            height: '500px',
            background: backgroundType === 'color' ? backgroundColor : '#f0f2f5',
            transition: 'background-color 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          ref={canvasRef}
        >
          {backgroundType === 'image' && previewImage && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%'
            }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
            {texts.map((text) => (
              <DraggableText
                key={text.id}
                text={text}
                onRemove={removeText}
                onDrag={handleDrag}
                onEdit={handleEdit}
                textColor={textColor}
              />
            ))}
          </div>
        </div>
        <div className="w-1/3 space-y-4">
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold mb-2">Select Background</h3>
            <Radio.Group
              value={backgroundType}
              onChange={(e) => setBackgroundType(e.target.value)}
              className="mb-4 w-full"
            >
              <Radio.Button value="color" className="w-1/2 text-center">
                <FaPalette className="inline-block mr-1" /> Color
              </Radio.Button>
              <Radio.Button value="image" className="w-1/2 text-center">
                <FaImage className="inline-block mr-1" /> Image
              </Radio.Button>
            </Radio.Group>

            {backgroundType === 'color' ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Select Color:</span>
                <ColorPicker
                  value={backgroundColor}
                  onChange={(color) => setBackgroundColor(color.toHexString())}
                  className="flex-grow"
                />
              </div>
            ) : (
              <Upload.Dragger
                accept="image/*"
                listType="picture"
                fileList={fileList}
                onChange={handleChange}
                maxCount={1}
                beforeUpload={() => false}
                className="bg-gray-50"
              >
                <p className="text-gray-500">Drag and drop or click to upload image</p>
              </Upload.Dragger>
            )}
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaFont /> Add Text
            </h3>
            <div className="space-y-2">
              <Input.TextArea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter text content..."
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
              <span>Select Text Color:</span>
              <ColorPicker
                value={textColor}
                onChange={(color) => setTextColor(color.toHexString())}
                className="flex-grow"
              />
              <Button
                type="primary"
                block
                onClick={addText}
              >
                Add Text
              </Button>
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
            </div>
          </div>
        </div>
      </div>
    </Modal>
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

export default CreateStoryModal;