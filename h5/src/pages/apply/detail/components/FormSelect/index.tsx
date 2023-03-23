import { Form, Input, Picker } from 'antd-mobile';
import type { PickerColumnItem } from 'antd-mobile/es/components/picker-view';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import type { ApplyForm } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';

const Select: FunctionComponent<{
  value?: string;
  onChange?: (input: string) => void;
  item: ApplyForm;
  formFieldProps?: Record<string, any>;
}> = ({ value, onChange, item, formFieldProps = {} }) => {
  const options = useMemo(() => {
    const ret: PickerColumnItem[] = item?.options?.map((v) => {
      return {
        label: v,
        value: v,
      };
    });
    return ret;
  }, [item?.options]);

  const selectName = useMemo(() => {
    const find = options?.find((v) => {
      return v.value === value;
    });

    return (find?.label as string) || '';
  }, [options, value]);

  return (
    <Picker
      columns={[options]}
      onConfirm={(values) => {
        onChange?.(values[0] || '');
      }}
    >
      {(_, actions) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Input value={selectName} placeholder={formFieldProps.placeholder} readOnly />
          <a style={{ whiteSpace: 'nowrap' }} onClick={actions.open}>
            选择
          </a>
        </div>
      )}
    </Picker>
  );
};

/** 下拉单选 */
export const FormSelect: FunctionComponent<{
  item: ApplyForm;
  formProps?: Record<string, any>;
  formFieldProps?: Record<string, any>;
}> = ({ item, formProps = {}, formFieldProps = {} }) => {
  return (
    <Form.Item label={item.label} name={item.name} {...formProps}>
      <Select item={item} formFieldProps={formFieldProps} />
    </Form.Item>
  );
};
