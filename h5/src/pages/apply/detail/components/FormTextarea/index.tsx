import { Form, TextArea } from 'antd-mobile';
import type { FunctionComponent } from 'react';
import type { ApplyForm } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';

/** 多行输入框 */
export const FormTextarea: FunctionComponent<{
  item: ApplyForm;
  formProps?: Record<string, any>;
  formFieldProps?: Record<string, any>;
}> = ({ item, formProps = {}, formFieldProps = {} }) => {
  return (
    <Form.Item label={item.label} name={item.name} {...formProps}>
      <TextArea {...formFieldProps} showCount rows={5} />
    </Form.Item>
  );
};
