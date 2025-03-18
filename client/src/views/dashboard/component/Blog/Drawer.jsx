import React, { useState, useCallback, useEffect } from 'react';
import { Button, Drawer, Tag } from 'antd';
import Accordion from 'react-bootstrap/Accordion';
import { fetchReport } from '../../../../actions/actions/report';
import { useDispatch, useSelector } from 'react-redux';
import CreateBlogDrawer from './CreateBlogDrawer';
import {
    CloseCircleOutlined,
  } from '@ant-design/icons';

const AppDrawer = ({ title, width, closable, onClose, open }) => {
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [createBlogDrawer, setCreateBlogDrawer] = useState(false);
    const { reports } = useSelector((state) => state.root.report || {});
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [errors, setErrors] = useState({});
    const [activeKeys, setActiveKeys] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchReport());
    }, [dispatch]);

    const report = reports?.data?.data || [];

    const itemsByQuesNum = Array.from({ length: 8 }, () => []);
    report.forEach(item => {
        if (item.ques_num >= 1 && item.ques_num <= 8) {
            itemsByQuesNum[item.ques_num - 1].push(item);
        }
    });

    // console.log('Items by ques_num:', itemsByQuesNum);

    const showCreateBlogDrawer = useCallback(() => {
        const newErrors = {};
        const newActiveKeys = [];
        for (let i = 1; i <= 8; i++) {
            if (!selectedQuestions[`Item ${i}`]) {
                newErrors[`Item ${i}`] = `Please select an answer for Question ${i}.`;
                newActiveKeys.push((i - 1).toString());
            }
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setActiveKeys(newActiveKeys);
        } else {
            setCreateBlogDrawer(true);
        }
    }, [selectedQuestions]);

    const handleCreateBlogDrawerClose = useCallback(() => {
        setCreateBlogDrawer(false);
        onClose();
    }, [onClose]);

    const onChildrenDrawerClose = useCallback(() => {
        setChildrenDrawer(false);
    }, []);

    const handleSelect = useCallback((item, answer) => {
        setSelectedQuestions(prev => {
            if (prev[item] !== answer) {
                return { ...prev, [item]: answer };
            }
            return prev;
        });
        setErrors(prev => ({ ...prev, [item]: null }));
    }, []);

    return (
        <Drawer title={title} width={width} closable={closable} onClose={onClose} open={open}
            style={{ marginTop: "75px" }}
        >
            <Button type="primary" onClick={showCreateBlogDrawer}>
                Create Blog
            </Button>

            <Tag style={{marginTop: '10px', fontSize: '15px'}} icon={<CloseCircleOutlined />} color="error"> If you violate the rules, you will be banned from posting blogs.</Tag>
            
            <Accordion id="accordionExample" activeKey={activeKeys} onSelect={(key) => setActiveKeys(key)}>
                {itemsByQuesNum.map((items, index) => {
                    if (items.length === 0) return null;
                    const question = items[0].question;
                    const answers = items.slice(0, 3).map((item, i) => item.answer || `Sample answer ${i + 1} for Item ${index + 1}`);
                    return (
                        <Accordion.Item className="mb-3" eventKey={index.toString()} key={index}>
                            <Accordion.Header id={`heading-${index + 1}`}>
                                {question}
                            </Accordion.Header>
                            <Accordion.Body className="d-flex flex-column gap-2">
                                {answers.map((answer, i) => (
                                    <Button
                                        key={i}
                                        onClick={() => handleSelect(`Item ${index + 1}`, answer)}
                                        style={{
                                            backgroundColor: selectedQuestions[`Item ${index + 1}`] === answer ? 'green' : 'initial',
                                            color: selectedQuestions[`Item ${index + 1}`] === answer ? 'white' : 'initial',
                                        }}
                                    >
                                        {answer}
                                    </Button>
                                ))}
                                {selectedQuestions[`Item ${index + 1}`] && <p>{selectedQuestions[`Item ${index + 1}`]}</p>}
                                {errors[`Item ${index + 1}`] && <p style={{ color: 'red' }}>{errors[`Item ${index + 1}`]}</p>}
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
            <CreateBlogDrawer onClose={handleCreateBlogDrawerClose} open={createBlogDrawer} />
        </Drawer>
    );
};


export default AppDrawer;
