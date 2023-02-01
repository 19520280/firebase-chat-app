import React, { useContext, useState } from 'react';
import { Avatar, Form, Modal, Select, Spin } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';

function DebounceSelect({ fetchOptions, debounceTimeout = 100, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            })
        }

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);

    return (
        <Select
            labelInValue
            onSearch={debounceFetcher}
            notFoundContent={ fetching ? <Spin size="small"/> : null }
            {...props}
        >
            {
                options.map(opt => (
                    <Select.Option>
                        <Avatar size="small" src={opt.photoUrl}>
                            {opt.photoUrl ? '' : opt.label?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {`${opt.label}`}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

async function fetchUserList(search) {
    return db
    .collection('users')
    .where('keywords', 'array-contains', search)
    .orderBy('displayName')
    .limit(20)
    .get()
    .then(snapshot => {
        return snapshot.docs.map(doc => ({
            label: doc.data().displayname,
            value: doc.data().uid,
            photoUrl: doc.data().photoUrl,
        }))
    });
}

export default function InviteMemberModal() {
    const { isInviteMemberVisible, setIsInviteMemberVisible } = useContext(AppContext);
    const { 
        user: { uid },
    } = useContext(AppContext);
    const [value, setValue] = useState();
    const [form] = Form.useForm();

    const handleOk = () => {
        form.resetFields();

        setIsInviteMemberVisible(false);
    };

    const handleCancle = () => {
        form.resetFields();

        setIsInviteMemberVisible(false);
    };

    return (
        <div>
            <Modal
                title='Mời thêm thành viên'
                visible={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancle}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode="multiple"
                        label="Tên các thành viên"
                        value={value}
                        placeholder="Nhập tên thành viên"
                        fetchOptions={fetchUserList}
                        onChange={newValue => setValue(newValue)}
                        style={{ width: '100%' }}
                    />
                </Form>
            </Modal>
        </div>
    );
}