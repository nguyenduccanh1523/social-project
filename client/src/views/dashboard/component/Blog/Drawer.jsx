import React, { useState, useCallback } from 'react';
import { Button, Drawer } from 'antd';
import Accordion from 'react-bootstrap/Accordion';

const AppDrawer = ({ title, width, closable, onClose, open }) => {
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [errors, setErrors] = useState({});

    const showChildrenDrawer = useCallback(() => {
        const newErrors = {};
        if (!selectedQuestions['Item 1']) {
            newErrors['Item 1'] = 'Please select an answer for Item 1.';
        }
        if (!selectedQuestions['Item 2']) {
            newErrors['Item 2'] = 'Please select an answer for Item 2.';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setChildrenDrawer(true);
        }
    }, [selectedQuestions]);

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
            <Accordion id="accordionExample" defaultActiveKey="0">
                <Accordion.Item className="mb-3" eventKey="0">
                    <Accordion.Header id="heading-1">
                        Sample Question for Item 1
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            Sample answer for the question related to Item 1.
                        </p>
                        <Button onClick={() => handleSelect('Item 1', 'Sample answer for Item 1')}>Select</Button>
                    </Accordion.Body>
                </Accordion.Item>
                {selectedQuestions['Item 1'] && <p>{selectedQuestions['Item 1']}</p>}
                {errors['Item 1'] && <p style={{ color: 'red' }}>{errors['Item 1']}</p>}

                <Accordion.Item className="mb-3" eventKey="1">
                    <Accordion.Header id="heading-2">
                        Sample Question for Item 2
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            Sample answer for the question related to Item 2.
                        </p>
                        <Button onClick={() => handleSelect('Item 2', 'Sample answer for Item 2')}>Select</Button>
                        {selectedQuestions['Item 2'] && <p>{selectedQuestions['Item 2']}</p>}
                        {errors['Item 2'] && <p style={{ color: 'red' }}>{errors['Item 2']}</p>}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Button type="primary" onClick={showChildrenDrawer}>
                Two-level drawer
            </Button>
            <Drawer
                title="Two-level Drawer"
                width={520}
                closable={false}
                onClose={onChildrenDrawerClose}
                open={childrenDrawer}
            >
                This is two-level drawer
            </Drawer>
        </Drawer>
    );
};

export default AppDrawer;
