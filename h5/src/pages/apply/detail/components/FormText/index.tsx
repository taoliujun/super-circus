import { Form, Input } from 'antd-mobile';
import type { FunctionComponent } from 'react';
import type { ApplyForm } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';

/** 输入框 */
export const FormText: FunctionComponent<{
  item: ApplyForm;
  formProps?: Record<string, any>;
  formFieldProps?: Record<string, any>;
}> = ({ item, formProps = {}, formFieldProps = {} }) => {
  return (
    <Form.Item label={item.label} name={item.name} {...formProps}>
      <Input {...formFieldProps} clearable />
    </Form.Item>
  );
};
