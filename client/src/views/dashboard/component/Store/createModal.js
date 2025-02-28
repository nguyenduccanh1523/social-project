import { Modal, Upload, Button, Input, Radio, ColorPicker, message, Popconfirm } from "antd";
import { FaImage, FaFont, FaTrash, FaPalette } from "react-icons/fa";
import { useState, useRef } from "react";
import Draggable from "react-draggable";

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
  const [fileList, setFileList] = useState([]);
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [previewImage, setPreviewImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#1677ff');
  const [backgroundType, setBackgroundType] = useState('color');
  const [loading, setLoading] = useState(false);
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
          //onClick={handleSubmit}
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
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateStoryModal; 